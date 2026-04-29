<?php
// Partner Form API - /api/partner-form.php
// Public endpoint — no auth, no database. Sends an email and returns JSON.

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getRequestBody();

if (empty($data['phone']) && empty($data['email'])) {
    sendError('Необходимо указать телефон или email');
}

$recipients = array_values(array_filter(
    array_map('trim', explode(',', PARTNER_FORM_RECIPIENTS)),
    fn($e) => filter_var($e, FILTER_VALIDATE_EMAIL) !== false
));

if (empty($recipients)) {
    error_log('[KISU partner-form] No PARTNER_FORM_RECIPIENTS configured in api/config.php');
    sendError('Сервер не настроен: не задан получатель писем. Свяжитесь с администратором.', 500);
}

mb_internal_encoding('UTF-8');

$companyName = trim((string)($data['companyName'] ?? ''));
$shopName    = trim((string)($data['shopName']    ?? ''));
$innKpp      = trim((string)($data['innKpp']      ?? ''));
$phone       = trim((string)($data['phone']       ?? ''));
$clientEmail = trim((string)($data['email']       ?? ''));
$date        = date('d.m.Y H:i');

$fromEmail = trim(PARTNER_FORM_FROM);
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

$envelopeSender = '-f ' . $fromEmail;

$allOk = true;
foreach ($recipients as $recipient) {
    $sent = mail($recipient, $subject, $body, $headers, $envelopeSender);
    if (!$sent) {
        $allOk = false;
        error_log('[KISU partner-form] mail() failed for recipient: ' . $recipient);
    }
}

if (!$allOk) {
    sendError('Не удалось отправить письмо. Попробуйте позже или свяжитесь с нами по телефону.', 500);
}

sendJson(['success' => true, 'mail_sent' => true], 201);
