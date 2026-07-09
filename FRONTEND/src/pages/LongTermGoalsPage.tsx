import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  useLongTermGoals,
  useCreateLongTermGoal,
  useUpdateLongTermGoal,
  useDeleteLongTermGoal,
} from "../hooks/useLongTermGoals";

export function LongTermGoalsPage() {
  const { data: goals, isLoading, error } = useLongTermGoals();
  const { mutate: createGoal, isPending: creating } = useCreateLongTermGoal();
  const { mutate: updateGoal } = useUpdateLongTermGoal();
  const { mutate: deleteGoal } = useDeleteLongTermGoal();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [stopDate, setStopDate] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createGoal(
      {
        title: title.trim(),
        start_date: startDate || undefined,
        target_date: stopDate || undefined,
      },
      { onSuccess: () => { setTitle(""); setStartDate(""); setStopDate(""); } }
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
        >
          Long Term Goals
        </h1>

        <form onSubmit={handleAdd} className="rounded-lg border p-4 space-y-3 mb-6" style={{ borderColor: "var(--color-surface)" }}>
          <input
            type="text"
            placeholder="e.g. Learn Spanish"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md px-3 py-2 border bg-transparent"
            style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs opacity-60 block mb-1" style={{ color: "var(--color-text)" }}>
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md px-3 py-2 border bg-transparent"
                style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs opacity-60 block mb-1" style={{ color: "var(--color-text)" }}>
                Stop date
              </label>
              <input
                type="date"
                value={stopDate}
                onChange={(e) => setStopDate(e.target.value)}
                className="w-full rounded-md px-3 py-2 border bg-transparent"
                style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
            style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
          >
            Add Goal
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
            No long term goals yet.
          </p>
        )}

        <div className="space-y-4">
          {goals?.map((goal) => (
            <div
              key={goal.id}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--color-surface)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium" style={{ color: "var(--color-text)" }}>{goal.title}</p>
                  <p className="text-xs opacity-60" style={{ color: "var(--color-text)" }}>
                    {goal.start_date && `Start: ${new Date(goal.start_date).toLocaleDateString()}`}
                    {goal.start_date && goal.target_date && "  •  "}
                    {goal.target_date && `Stop: ${new Date(goal.target_date).toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-xs opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-text)" }}
                >
                  Delete
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--color-surface)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${goal.progress_percent}%`, background: "var(--color-primary)" }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress_percent}
                  onChange={(e) =>
                    updateGoal({ goalId: goal.id, input: { progress_percent: Number(e.target.value) } })
                  }
                  className="w-24"
                />
                <span className="text-sm w-10 text-right" style={{ color: "var(--color-text)" }}>
                  {goal.progress_percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
