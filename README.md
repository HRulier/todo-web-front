# Todo App — Frontend

A full-featured task management web application built with React 19 and TypeScript.
Tasks are organized in a **weekly calendar view**, filterable by tags, with complete
authentication including OAuth (Google & Slack).

> **Backend repository:** _link to your backend repo here_

## Features

- Weekly dashboard — navigate week by week, tasks displayed by day
- Create, edit, and delete tasks with due dates and tags
- Custom tag system for task categorization
- Full authentication flow: sign up, sign in, email verification
- Password management: forgot / reset / change password
- OAuth login via Google and Slack
- JWT authentication with automatic token refresh
- User profile management and account deletion
- Responsive UI with animations (Motion)

## Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Framework        | React 19, TypeScript        |
| Build tool       | Vite 6                      |
| Routing          | React Router 7              |
| Data fetching    | TanStack Query v5           |
| HTTP client      | Axios                       |
| Forms            | React Hook Form             |
| Styling          | SCSS Modules                |
| Animations       | Motion                      |
| Notifications    | React Toastify              |
| Date utilities   | date-fns                    |
| Containerization | Docker (multi-stage), Nginx |
| CI/CD            | GitHub Actions              |

## Getting Started

### Prerequisites

- Node.js >= 20
- A running instance of the backend API

### Environment variables

Copy `.env.example` and fill in the required values:

```bash
cp .env.example .env
```

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

## Run with npm

```bash
npm install
npm run dev        # development server → http://localhost:5173
npm run build      # production build (output: /dist)
```

## Docker

### Development

```bash
docker build -t todo-client --target development .

docker run --name todo-client -p 5173:5173 \
  --env-file .env.local \
  -v .:/app \
  -v /app/node_modules \
  todo-client
```

### Production

```bash
docker build -t todo-client --target production .

docker run --name todo-client -p 5173:5173 \
  --env-file .env.production \
  todo-client

```

The app is available at http://localhost:5173.
