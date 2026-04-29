# KISU landing — static build (no admin panel)

Лендинг KISU без админ‑панели и базы данных. Контент — захардкожен в исходниках, форма заявки партнёра отправляется на e-mail через одиночный PHP‑скрипт.

## Где править настройки

Перед сборкой и/или деплоем заполни два файла:

### 1. Email для заявок партнёров

[app/api/config.php](app/api/config.php)

```php
const PARTNER_FORM_RECIPIENTS = 'sales@example.com,manager@example.com';
const PARTNER_FORM_FROM       = 'no-reply@example.com';
```

* `PARTNER_FORM_RECIPIENTS` — список через запятую, кому слать заявки.
* `PARTNER_FORM_FROM` — адрес в `From:` заголовке. На большинстве хостингов должен быть на твоём домене (иначе письмо уйдёт в спам). Если оставить пустым, в качестве отправителя будет использован первый адрес из списка получателей.

### 2. Яндекс.Метрика и верификация

[app/src/config/site.ts](app/src/config/site.ts)

```ts
export const SITE_CONFIG = {
  yandexMetrikaId:    '12345678',  // номер счётчика — без https://, без <script>
  yandexVerifyCode:   '',          // код Яндекс.Вебмастера (по желанию)
  siteTitle:          '',          // переопределить <title>; '' — оставить как в index.html
};
```

После правки — пересобрать (см. ниже).

## Сборка

```bash
cd app
npm install        # один раз
npm run build      # сборка в app/dist
```

Содержимое `app/dist/` плюс папка `app/api/` — это всё, что нужно загрузить на хостинг (с поддержкой PHP).

## Структура деплоя на хостинге

```
/                    ← корень сайта на хостинге
├── index.html       ← из app/dist/index.html
├── assets/          ← из app/dist/assets/
├── images/          ← из app/dist/images/
├── api/             ← из app/api/  (PHP-эндпоинт partner-form.php + config.php)
├── robots.txt
└── sitemap.xml
```

## Что осталось от оригинала

* React + Vite + TypeScript + Tailwind, все секции лендинга
* Карта в секции «Контакты» через виджет‑конструктор Яндекс.Карт (без API‑ключа)
* Форма заявки партнёра (POST `/api/partner-form.php` → `mail()`)
* Страницы: `/sizes`, `/care`, `/certificates`, `/privacy`, `/personal-data`

## Что убрано

* Админ‑панель на `/admin`
* Все эндпоинты `/api/auth/`, `/api/content/`, `/api/upload.php`, `/api/partner-requests.php`, `/api/yandex-verify.php`
* Зависимость от MySQL — БД не нужна
