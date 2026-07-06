# Habit Tracker — Frontend

Vite + React + TypeScript + Tailwind v4. Talks to the Django backend for
habit/check-in data, and to Supabase directly for auth.

## Architecture

```
React (this project) --auth--> Supabase Auth (JWT)
        |
        +--JWT attached--> Django REST API --> Supabase Postgres (RLS)
```

- `lib/supabase.ts` - Supabase client, used ONLY for sign up / log in / session.
- `lib/api.ts` - typed fetch wrapper that talks to the Django backend,
  automatically attaching the current Supabase session's access token as
  `Authorization: Bearer <token>` on every request.
- `hooks/useAuth.ts` - wraps Supabase session state (login/signup/logout).
- `hooks/useHabits.ts`, `hooks/useHabitHistory.ts` - React Query hooks that
  own all server state (list habits, create habit, check in, undo check-in).
  No manual `useState` + `useEffect` fetching anywhere - React Query handles
  caching, refetching, and loading/error states.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` - same Supabase project
     as the backend (Project Settings -> API)
   - `VITE_API_BASE_URL` - defaults to `http://127.0.0.1:8000/api`, matching
     the Django dev server

3. **Make sure the Django backend is running** (separate terminal, separate
   repo) - this frontend does nothing useful without it:
   ```bash
   python manage.py runserver
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`.

## What's built so far

- [x] Project scaffold (Vite + TS + Tailwind v4)
- [x] Typed API client + Supabase auth client
- [x] Login / signup page
- [x] Protected routing (redirects to `/login` if not authenticated)
- [x] Dashboard page - lists habits, shows current streak, confirms the
      full chain works end-to-end (React -> Supabase Auth -> Django -> Supabase
      Postgres RLS)

## What's next

- [ ] "Create habit" form on the dashboard
- [ ] Habit detail page with check-in button
- [ ] Custom SVG heatmap component (GitHub-style contribution grid)
- [ ] Empty states, loading skeletons, polish pass

## A note on CORS

If you see CORS errors in the browser console, check the Django backend's
`.env` - `CORS_ALLOWED_ORIGINS` needs to include whatever port Vite is
actually running on (default `http://localhost:5173`).
