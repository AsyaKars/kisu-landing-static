<?php
/**
 * Site configuration for the static landing page.
 *
 * This file replaces the database-backed admin panel of the original project.
 * Edit values here and re-upload to the server to apply.
 */

// Куда слать заявки. Несколько адресов — через запятую внутри одних кавычек.
const PARTNER_FORM_RECIPIENTS = '';

// От кого слать (адрес на твоём домене). Если пусто — берём первого получателя.
const PARTNER_FORM_FROM = '';

// ─────────────────────────────────────────────────────────────────────────────
// SMTP (рекомендуется на shared-хостингах вроде TimeWeb, где mail() блокирована)
// Заполни SMTP_HOST + SMTP_USER + SMTP_PASS — и письма пойдут через SMTP.
// Если SMTP_HOST пустой — будет использоваться функция mail().
// ─────────────────────────────────────────────────────────────────────────────

// SMTP-сервер. Для TimeWeb обычно 'smtp.timeweb.ru'.
const SMTP_HOST   = '';

// 465 = SSL, 587 = STARTTLS.
const SMTP_PORT   = 465;

// 'ssl' (для 465) или 'tls' (для 587).
const SMTP_SECURE = 'ssl';

// Логин ящика — обычно полный email, например 'support@kisu.ru'.
const SMTP_USER   = '';

// Пароль ящика (тот, что ты задавала при создании в панели «Почта»).
const SMTP_PASS   = '';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers used by partner-form.php — do not edit
// ─────────────────────────────────────────────────────────────────────────────

function sendJson(array $payload, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function sendError(string $message, int $code = 400): void {
    sendJson(['error' => $message], $code);
}

function getRequestBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
