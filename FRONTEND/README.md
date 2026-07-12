# Habit Tracker

A modern full-stack habit tracking application built with React, TypeScript, Tailwind CSS, Supabase, and Django REST Framework. Habit Tracker helps users build consistency through daily habits, streak tracking, progress visualization, and insightful analytics.

---

## Features

- Secure authentication with Supabase Auth
- Custom display names and account settings
- Daily habit tracking and check-ins
- Current and longest streak tracking
- Weekly progress charts
- GitHub-style activity heatmap
- Consistency score
- Dashboard with real-time statistics
- Responsive interface for desktop and mobile
- Fast client-side caching with React Query

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4
- TanStack Query

### Backend

- Django
- Django REST Framework
- Supabase PostgreSQL
- Supabase Authentication

---

## Architecture

```text
React Frontend
       │
       ├── Authentication ─────► Supabase Auth
       │
       └── JWT Access Token ───► Django REST API
                                     │
                                     ▼
                            Supabase PostgreSQL
```

---

## Project Structure

```text
src/
├── components/
├── hooks/
├── lib/
├── pages/
├── types/
└── utils/
```

### Key Files

- **lib/supabase.ts** — Initializes the Supabase client and manages authentication sessions.
- **lib/api.ts** — Typed API wrapper that automatically attaches the authenticated user's JWT to every request.
- **hooks/useAuth.ts** — Handles authentication, session management, display name updates, email changes, password updates, and OAuth providers.
- **hooks/useHabits.ts** — Retrieves and manages habit data with React Query.
- **hooks/useHabitHistory.ts** — Manages habit check-in history.
- **hooks/useDashboardCharts.ts** — Supplies analytics data for dashboard charts and heatmaps.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file.

```bash
cp .env.example .env
```

Then configure:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
```

---

### 3. Start the backend

Run the Django backend in a separate terminal.

```bash
python manage.py runserver
```

---

### 4. Start the frontend

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Authentication Flow

1. The user signs in using Supabase Authentication.
2. Supabase returns a JWT access token.
3. Every API request automatically includes the JWT in the Authorization header.
4. Django validates the token before processing the request.
5. PostgreSQL Row Level Security ensures users can only access their own data.

---


## Roadmap

- Habit reminders
- Push notifications
- Mobile application
- Calendar view
- Data export
- Progressive Web App (PWA)
- Habit sharing and accountability features

---

## License

This project is licensed under the MIT License.