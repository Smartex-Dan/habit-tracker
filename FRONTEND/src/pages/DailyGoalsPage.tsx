import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  useDailyGoals,
  useCreateDailyGoal,
  useToggleDailyGoal,
  useDeleteDailyGoal,
} from "../hooks/useDailyGoals";

export function DailyGoalsPage() {
  const { data: goals, isLoading, error } = useDailyGoals();
  const { mutate: createGoal, isPending: creating } = useCreateDailyGoal();
  const { mutate: toggleGoal } = useToggleDailyGoal();
  const { mutate: deleteGoal } = useDeleteDailyGoal();

  const [newTitle, setNewTitle] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createGoal({ title: newTitle.trim() }, { onSuccess: () => setNewTitle("") });
  }

  const completedCount = goals?.filter((g) => g.completed_today).length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
        >
          Today's Goals
        </h1>
        <p className="text-sm opacity-60 mb-6" style={{ color: "var(--color-text)" }}>
          {completedCount} of {goals?.length ?? 0} done today
        </p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="e.g. Gym, Read Bible, Pray"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 rounded-md px-3 py-2 border bg-transparent"
            style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
          />
          <button
            type="submit"
            disabled={creating || !newTitle.trim()}
            className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
            style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
          >
            Add
          </button>
        </form>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={48} className="text-[var(--color-primary)]" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {(error as Error).message}
          </p>
        )}

        {goals && goals.length === 0 && (
          <p className="text-center opacity-60 py-12" style={{ color: "var(--color-text)" }}>
            No daily goals yet — add something you want to do every day.
          </p>
        )}

        <div className="space-y-2">
          {goals?.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
              style={{ borderColor: "var(--color-surface)" }}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={goal.completed_today}
                  onChange={(e) =>
                    toggleGoal({ goalId: goal.id, completed: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span
                  style={{
                    color: "var(--color-text)",
                    textDecoration: goal.completed_today ? "line-through" : "none",
                    opacity: goal.completed_today ? 0.5 : 1,
                  }}
                >
                  {goal.title}
                </span>
              </label>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-xs opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: "var(--color-text)" }}
                aria-label={`Remove ${goal.title}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
