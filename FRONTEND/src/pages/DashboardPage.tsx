import { useAuth } from "../hooks/useAuth";
import { useHabits } from "../hooks/useHabits";

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { data: habits, isLoading, error } = useHabits();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Your Habits</h1>
          <p className="text-neutral-500 text-sm">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-neutral-500 hover:text-neutral-300"
        >
          Log out
        </button>
      </div>

      {isLoading && <p className="text-neutral-500">Loading habits...</p>}

      {error && (
        <p className="text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
          {(error as Error).message}
        </p>
      )}

      {habits && habits.length === 0 && (
        <p className="text-neutral-500">
          No habits yet — this confirms the full chain works: React → Supabase
          Auth → Django → Supabase Postgres (RLS). Next step is building the
          "create habit" form.
        </p>
      )}

      {habits && habits.length > 0 && (
        <ul className="space-y-2">
          {habits.map((h) => (
            <li
              key={h.id}
              className="rounded-md border border-neutral-800 px-4 py-3 flex items-center justify-between"
            >
              <span>{h.title}</span>
              <span className="text-sm text-neutral-500">
                🔥 {h.current_streak}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
