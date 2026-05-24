# YeaHub — список вопросов

Учебное React-приложение для практик YeaHub: список вопросов, коллекции, тренажёр (квиз).

## Стек

- Vite, React 19, React Router 7
- Redux Toolkit, RTK Query
- React Hook Form
- TypeScript (частично) + SCSS Modules
- API: [https://api.yeatwork.ru](https://api.yeatwork.ru)

## Запуск

```bash
npm install
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000) (порт **3000** обязателен из‑за CORS).

```bash
npm run lint
npm run build
```

## Маршруты

| Путь | Описание |
|------|----------|
| `/questions` | Список вопросов с фильтрами и пагинацией |
| `/questions/:id` | Страница вопроса |
| `/collections` | Список коллекций |
| `/collections/:id` | Деталка коллекции |
| `/quiz` | Настройка тренажёра (React Hook Form + API) |
| `/quiz/play` | Прохождение квиза |
| `/quiz/result` | Результат квиза |
| `/materials` | Заглушка |

## Тренажёр (практика 36)

1. Откройте `/quiz`
2. Выберите **одну** специализацию, навыки, сложность, режим и количество вопросов
3. Нажмите **Начать** — загрузка квиза через `GET /interview-preparation/quizzes/mock/new`
4. На `/quiz/play` отмечайте «Знаю» / «Не знаю», переходите между вопросами
5. **Завершить** → `/quiz/result` со статистикой и списком ответов из Redux (`quizSlice`)

Прямой заход на `/quiz/play` или `/quiz/result` без активного квиза перенаправляет на `/quiz`.

## Реализовано

- Публичные вопросы и коллекции через RTK Query
- Фильтры списка вопросов с синхронизацией в URL
- Debounce поиска (400 ms)
- «Изученные» вопросы (`localStorage`)
- Тренажёр: RHF, `getNewMockQuiz`, `quizSlice`, play → result

## Query-параметры (список вопросов)

| Параметр | Пример | Описание |
|----------|--------|----------|
| `query` | `useState` | Поиск |
| `rating` | `4` | Рейтинг |
| `difficulty` | `4–6` | Сложность |
| `specializations` | `1,2` | ID специализаций |
| `skills` | `3,5` | ID навыков |
| `status` | `learned` / `unlearned` / `all` | Статус |
| `page` | `2` | Страница списка |

## Ограничения

- Режим тренажёра («Повторение», «Только новые», «Случайные») сохраняется в настройках, но mock API его не принимает
- Для части специализаций API может вернуть 404 — выберите другую специализацию (например React Frontend Developer)
