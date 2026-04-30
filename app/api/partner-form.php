<?php
// Partner Form API - /api/partner-form.php
// Public endpoint — no auth, no database. Sends an email and returns JSON.
//
// Two delivery paths:
//   1. SMTP (if SMTP_HOST is filled in api/config.php) — recommended.
//   2. PHP mail() — fallback when SMTP_HOST is empty.

@ini_set('display_errors', '0');
@ini_set('log_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode(
            ['error' => 'PHP fatal: ' . $err['message'] . ' at ' . basename($err['file']) . ':' . $err['line']],
            JSON_UNESCAPED_UNICODE
        );
    }
});

set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) return false;
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// ─────────────────────────────────────────────────────────────────────────────
// Tiny SMTP client — no external deps
// ─────────────────────────────────────────────────────────────────────────────

function smtpSend(string $host, int $port, string $secure, string $user, string $pass,
                  string $from, string $to, string $rfc822Message): array {
    $log = [];
    $errno = 0; $errstr = '';

    $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $ctx = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
    $sock = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$sock) {
        return ['ok' => false, 'error' => "connect failed: $errstr ($errno)", 'log' => $log];
    }
    stream_set_timeout($sock, 15);

    $read = function () use ($sock, &$log) {
        $resp = '';
        while (($line = fgets($sock, 1024)) !== false) {
            $resp .= $line;
            if (strlen($line) >= 4 && $line[3] === ' ') break;
        }
        $log[] = '< ' . trim($resp);
        return $resp;
    };
    $send = function (string $cmd, bool $hide = false) use ($sock, &$log) {
        $log[] = '> ' . ($hide ? '[hidden]' : $cmd);
        fwrite($sock, $cmd . "\r\n");
    };
    $expect = function (string $codes) use ($read) {
        $resp = $read();
        $code = substr($resp, 0, 3);
        $allowed = explode('|', $codes);
        if (!in_array($code, $allowed, true)) {
            throw new RuntimeException("SMTP expected $codes, got: " . trim($resp));
        }
        return $resp;
    };

    try {
        $expect('220');

        $ehloHost = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $send('EHLO ' . $ehloHost);
        $expect('250');

        if ($secure === 'tls') {
            $send('STARTTLS');
            $expect('220');
            if (!stream_socket_enable_crypto($sock, true,
                STREAM_CRYPTO_METHOD_TLS_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT)) {
                throw new RuntimeException('STARTTLS handshake failed');
            }
            $send('EHLO ' . $ehloHost);
            $expect('250');
        }

        $send('AUTH LOGIN');
        $expect('334');
        $send(base64_encode($user), true);
        $expect('334');
        $send(base64_encode($pass), true);
        $expect('235');

        $send('MAIL FROM:<' . $from . '>');
        $expect('250');
        $send('RCPT TO:<' . $to . '>');
        $expect('250|251');
        $send('DATA');
        $expect('354');

        // Dot-stuff: lines starting with . need doubling per RFC 5321 §4.5.2
        $msg = preg_replace('/^\./m', '..', $rfc822Message);
        fwrite($sock, $msg . "\r\n.\r\n");
        $expect('250');

        $send('QUIT');
        @fclose($sock);
        return ['ok' => true, 'log' => $log];
    } catch (Throwable $e) {
        @fclose($sock);
        return ['ok' => false, 'error' => $e->getMessage(), 'log' => $log];
    }
}

// ─────────────────────────────────────────────────────────────────────────────

try {
    require_once __DIR__ . '/config.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $smtpConfigured = defined('SMTP_HOST') && SMTP_HOST !== ''
                       && defined('SMTP_USER') && SMTP_USER !== ''
                       && defined('SMTP_PASS') && SMTP_PASS !== '';
        echo json_encode([
            'ok'                => true,
            'php_version'       => PHP_VERSION,
            'mail_function'     => function_exists('mail'),
            'recipients_set'    => (defined('PARTNER_FORM_RECIPIENTS') && PARTNER_FORM_RECIPIENTS !== ''),
            'smtp_configured'   => $smtpConfigured,
            'smtp_host'         => defined('SMTP_HOST') ? SMTP_HOST : '',
            'smtp_port'         => defined('SMTP_PORT') ? SMTP_PORT : '',
            'smtp_secure'       => defined('SMTP_SECURE') ? SMTP_SECURE : '',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $raw = file_get_contents('php://input');
    $data = $raw ? json_decode($raw, true) : [];
    if (!is_array($data)) $data = [];

    if (empty($data['phone']) && empty($data['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Необходимо указать телефон или email'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $recipients = array();
    foreach (explode(',', PARTNER_FORM_RECIPIENTS) as $item) {
        $item = trim($item);
        if (filter_var($item, FILTER_VALIDATE_EMAIL)) $recipients[] = $item;
    }
    if (empty($recipients)) {
        http_response_code(500);
        echo json_encode(['error' => 'Сервер не настроен: PARTNER_FORM_RECIPIENTS пустой в api/config.php.'],
            JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (function_exists('mb_internal_encoding')) mb_internal_encoding('UTF-8');

    $companyName = isset($data['companyName']) ? trim((string)$data['companyName']) : '';
    $shopName    = isset($data['shopName'])    ? trim((string)$data['shopName'])    : '';
    $innKpp      = isset($data['innKpp'])      ? trim((string)$data['innKpp'])      : '';
    $phone       = isset($data['phone'])       ? trim((string)$data['phone'])       : '';
    $clientEmail = isset($data['email'])       ? trim((string)$data['email'])       : '';
    $date        = date('d.m.Y H:i');

    $fromEmail = defined('PARTNER_FORM_FROM') ? trim(PARTNER_FORM_FROM) : '';
    if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
        $fromEmail = $recipients[0];
    }

    $subject = '=?UTF-8?B?' . base64_encode('Новая заявка на партнёрство — KISU') . '?=';
    $body  = "Новая заявка на партнёрство с сайта KISU\r\n";
    $body .= "==========================================\r\n\r\n";
    $body .= 'Дата:              ' . $date        . "\r\n";
    $body .= 'Компания:          ' . $companyName . "\r\n";
    $body .= 'Магазин:           ' . $shopName    . "\r\n";
    $body .= 'ИНН/КПП:           ' . $innKpp      . "\r\n";
    $body .= 'Телефон:           ' . $phone       . "\r\n";
    $body .= 'Email:             ' . $clientEmail . "\r\n";

    // Decide path: SMTP or mail()
    $useSmtp = defined('SMTP_HOST') && SMTP_HOST !== ''
            && defined('SMTP_USER') && SMTP_USER !== ''
            && defined('SMTP_PASS') && SMTP_PASS !== '';

    if ($useSmtp) {
        $allOk = true;
        $lastErr = '';
        $lastLog = [];
        foreach ($recipients as $recipient) {
            // Build full RFC822 message
            $msg  = 'Date: ' . date('r') . "\r\n";
            $msg .= 'From: ' . $fromEmail . "\r\n";
            $msg .= 'To: ' . $recipient . "\r\n";
            $msg .= 'Subject: ' . $subject . "\r\n";
            if (filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
                $msg .= 'Reply-To: ' . $clientEmail . "\r\n";
            }
            $msg .= "MIME-Version: 1.0\r\n";
            $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $msg .= "Content-Transfer-Encoding: 8bit\r\n";
            $msg .= "X-Mailer: KISU-static/1.0\r\n";
            $msg .= "\r\n" . $body;

            $res = smtpSend(
                SMTP_HOST,
                (int)SMTP_PORT,
                strtolower((string)SMTP_SECURE),
                SMTP_USER,
                SMTP_PASS,
                $fromEmail,
                $recipient,
                $msg
            );
            if (!$res['ok']) {
                $allOk = false;
                $lastErr = $res['error'];
                $lastLog = $res['log'];
                error_log('[KISU smtp] failed for ' . $recipient . ': ' . $lastErr);
            }
        }
        if (!$allOk) {
            http_response_code(500);
            echo json_encode(
                [
                    'error'  => 'SMTP не смог отправить письмо.',
                    'detail' => $lastErr,
                    // Hide hidden lines (AUTH passwords were already masked)
                    'log'    => array_slice($lastLog, -12),
                    'hint'   => 'Проверь SMTP_HOST/PORT/SECURE/USER/PASS в api/config.php. Для TimeWeb: smtp.timeweb.ru, port 465, ssl, login = full email.',
                ],
                JSON_UNESCAPED_UNICODE
            );
            exit;
        }
        http_response_code(201);
        echo json_encode(['success' => true, 'mail_sent' => true, 'via' => 'smtp'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Fallback: native mail()
    $headers  = "From: " . $fromEmail . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    if (filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $headers .= 'Reply-To: ' . $clientEmail . "\r\n";
    }

    $allOk = true;
    $lastErr = '';
    foreach ($recipients as $recipient) {
        error_clear_last();
        $sent = @mail($recipient, $subject, $body, $headers);
        if (!$sent) {
            $allOk = false;
            $e = error_get_last();
            if ($e && !empty($e['message'])) $lastErr = $e['message'];
        }
    }
    if (!$allOk) {
        http_response_code(500);
        echo json_encode(
            [
                'error'  => 'Не удалось отправить письмо через mail(). Заполни SMTP-настройки в api/config.php.',
                'detail' => $lastErr ?: 'mail() returned false',
            ],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }
    http_response_code(201);
    echo json_encode(['success' => true, 'mail_sent' => true, 'via' => 'mail()'], JSON_UNESCAPED_UNICODE);
    exit;
} catch (Throwable $e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    error_log('[KISU partner-form] exception: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
    echo json_encode(
        ['error' => 'Внутренняя ошибка PHP: ' . $e->getMessage()],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}
