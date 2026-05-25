# List of Questions

Веб-приложение для подготовки к техническим собеседованиям: каталог вопросов, коллекции и тренажёр с режимом «Знаю / Не знаю».

**Demo:** https://list-of-questions-tan.vercel.app

## Возможности

- Каталог публичных вопросов с фильтрацией и пагинацией
- Детальная страница вопроса (Markdown, подсветка кода)
- Навигация между вопросами в рамках текущего фильтра
- Коллекции вопросов и страница коллекции
- Тренажёр: настройка параметров, прохождение квиза, экран результатов
- Синхронизация фильтров и страницы со строкой URL
- Отметка «изученных» вопросов (localStorage)

## Стек

- React 19, Vite 7
- React Router 7
- Redux Toolkit, RTK Query
- React Hook Form
- TypeScript, SCSS Modules
- API: [api.yeatwork.ru](https://api.yeatwork.ru) (через прокси `/api`)

## Быстрый старт

```bash
git clone <repository-url>
cd list-of-questions
npm install
npm run dev
```

Приложение: http://localhost:3000

> Dev-сервер на порту **3000**; запросы к API идут на `/api` (прокси в `vite.config.js`).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (порт 3000) |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр production-сборки |
| `npm run lint` | ESLint |

## Маршруты

| Путь | Описание |
|------|----------|
| `/questions` | Список вопросов |
| `/questions/:id` | Страница вопроса |
| `/collections` | Список коллекций |
| `/collections/:id` | Коллекция |
| `/quiz` | Настройка тренажёра |
| `/quiz/play` | Прохождение квиза |
| `/quiz/result` | Результаты |
| `/materials` | Раздел в разработке |

## Query-параметры (список вопросов)

| Параметр | Пример | Описание |
|----------|--------|----------|
| `query` | `useState` | Поиск |
| `rating` | `4` | Рейтинг |
| `difficulty` | `4–6` | Сложность |
| `specializations` | `1,2` | ID специализаций |
| `skills` | `3,5` | ID навыков |
| `status` | `learned` / `unlearned` / `all` | Статус |
| `page` | `2` | Страница |

## Архитектура

```
src/
├── pages/              # Страницы маршрутов
├── components/         # UI и feature-компоненты
├── store/
│   ├── api/            # RTK Query (injectEndpoints)
│   └── slices/         # Клиентское состояние (квиз)
├── hooks/
├── utils/
└── types/
```

- **RTK Query** — данные с API (вопросы, коллекции, справочники, mock-квиз)
- **Redux slice** — сессия тренажёра (прогресс, ответы, статус)
- **URL search params** — фильтры и пагинация списков

## API

Клиент ходит на **`/api`** (тот же origin, без CORS в браузере):

- **локально** — Vite dev proxy → `https://api.yeatwork.ru`
- **Vercel** — rewrite в `vercel.json`

Бэкенд: [api.yeatwork.ru](https://api.yeatwork.ru)

Основные эндпоинты (после прокси путь тот же):

- `GET /questions/public-questions`
- `GET /questions/public-questions/:id`
- `GET /interview-preparation/quizzes/mock/new` — генерация квиза

## Деплой (Vercel)

Проект — SPA. В `vercel.json` настроены rewrites:

1. Прокси `/api/*` → `https://api.yeatwork.ru`
2. Fallback `/(.*)` → `/index.html` для клиентского роутинга

После изменения конфига выполните redeploy.

## Известные ограничения

- Режим тренажёра в UI не передаётся в mock API
- Для части специализаций mock-квиз может вернуть 404
- Авторизация — заглушка

## Лицензия

Private / All rights reserved.
