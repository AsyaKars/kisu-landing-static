<?php
/**
 * Site configuration for the static landing page.
 *
 * This file replaces the database-backed admin panel of the original project.
 * Edit values here and re-upload to the server to apply.
 */

// Comma-separated list of email addresses that will receive partnership form
// submissions. Example: 'sales@example.com,manager@example.com'
const PARTNER_FORM_RECIPIENTS = '';

// Sender address used in the From: header. Most shared hosts require this to
// be on your domain (e.g. 'no-reply@example.com'). If left empty, the first
// recipient address is used as the sender.
const PARTNER_FORM_FROM = '';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers used by partner-form.php — do not edit unless you know what you do
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
