<?php
// Partner Form API - /api/partner-form.php
// Public endpoint — no auth, no database. Sends an email and returns JSON.
//
// Robust mode: any error (parse, runtime, mail) is caught and returned as
// JSON instead of a blank 500 page, so the front-end never sees a stray
// "Unexpected end of JSON input".

@ini_set('display_errors', '0');
@ini_set('log_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Catch fatal/parse errors and return JSON
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

try {
    require_once __DIR__ . '/config.php';

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Health-check: GET /api/partner-form.php returns config status
        $cfg = defined('PARTNER_FORM_RECIPIENTS') ? PARTNER_FORM_RECIPIENTS : '';
        echo json_encode([
            'ok'                 => true,
            'php_version'        => PHP_VERSION,
            'mail_function'      => function_exists('mail'),
            'recipients_set'     => $cfg !== '',
            'recipients_count'   => count(array_filter(array_map('trim', explode(',', $cfg)))),
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

    // Parse recipients (no arrow functions — PHP 7.0+ compatible)
    $recipients = array();
    $list = explode(',', PARTNER_FORM_RECIPIENTS);
    foreach ($list as $item) {
        $item = trim($item);
        if (filter_var($item, FILTER_VALIDATE_EMAIL)) {
            $recipients[] = $item;
        }
    }

    if (empty($recipients)) {
        error_log('[KISU partner-form] No PARTNER_FORM_RECIPIENTS configured in api/config.php');
        http_response_code(500);
        echo json_encode(
            ['error' => 'Сервер не настроен: не задан получатель писем. Откройте api/config.php и заполните PARTNER_FORM_RECIPIENTS.'],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    if (function_exists('mb_internal_encoding')) {
        mb_internal_encoding('UTF-8');
    }

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

    $from    = 'KISU =?UTF-8?B?' . base64_encode('Сайт') . '?= <' . $fromEmail . '>';
    $subject = '=?UTF-8?B?' . base64_encode('Новая заявка на партнёрство — KISU') . '?=';

    $body  = "Новая заявка на партнёрство с сайта KISU\r\n";
    $body .= "==========================================\r\n\r\n";
    $body .= 'Дата:              ' . $date        . "\r\n";
    $body .= 'Компания:          ' . $companyName . "\r\n";
    $body .= 'Магазин:           ' . $shopName    . "\r\n";
    $body .= 'ИНН/КПП:           ' . $innKpp      . "\r\n";
    $body .= 'Телефон:           ' . $phone       . "\r\n";
    $body .= 'Email:             ' . $clientEmail . "\r\n";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $headers .= 'From: ' . $from . "\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

    if (filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $headers .= 'Reply-To: ' . $clientEmail . "\r\n";
    }

    // 5th-arg envelope sender breaks on some shared hosts.
    // Try with -f first; if it fails, retry without it.
    $allOk = true;
    foreach ($recipients as $recipient) {
        $sent = @mail($recipient, $subject, $body, $headers, '-f ' . $fromEmail);
        if (!$sent) {
            $sent = @mail($recipient, $subject, $body, $headers);
        }
        if (!$sent) {
            $allOk = false;
            error_log('[KISU partner-form] mail() failed for recipient: ' . $recipient);
        }
    }

    if (!$allOk) {
        http_response_code(500);
        echo json_encode(
            ['error' => 'Не удалось отправить письмо. Проверьте, что в api/config.php в PARTNER_FORM_FROM указан адрес на этом домене.'],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }

    http_response_code(201);
    echo json_encode(['success' => true, 'mail_sent' => true], JSON_UNESCAPED_UNICODE);
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
