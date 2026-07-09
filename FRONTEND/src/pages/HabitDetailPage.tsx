import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { HeatmapGrid } from "../components/HeatmapGrid";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useHabits } from "../hooks/useHabits";
import { useHabitHistory, useCreateCheckIn } from "../hooks/useHabitHistory";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: habits } = useHabits();
  const { data: history, isLoading, error } = useHabitHistory(id);
  const { mutate: checkIn, isPending: checkingIn, error: checkInError } = useCreateCheckIn(id ?? "");

  const habit = habits?.find((h) => h.id === id);
  const alreadyCheckedInToday = history?.check_ins.some((c) => c.completed_at === todayIso());

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link
          to="/dashboard"
          className="text-sm opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "var(--color-text)" }}
        >
          ← Back to Dashboard
        </Link>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={48} className="text-[var(--color-primary)]" />
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {(error as Error).message}
          </p>
        )}

        {habit && history && (
          <>
            <div className="flex items-center gap-3 mt-4 mb-6">
              <div className="w-3 h-8 rounded-full" style={{ background: habit.color }} />
              <div>
                <h1
                  className="text-2xl font-semibold"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
                >
                  {habit.title}
                </h1>
                {habit.description && (
                  <p className="text-sm opacity-60" style={{ color: "var(--color-text)" }}>
                    {habit.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-6 mb-6">
              <StatBlock label="Current streak" value={`🔥 ${history.current_streak}`} />
              <StatBlock label="Longest streak" value={`${history.longest_streak}`} />
              <StatBlock
                label="Last check-in"
                value={history.last_completed_at ?? "—"}
              />
            </div>

            <button
              onClick={() => checkIn({ habit_id: habit.id, date: todayIso() })}
              disabled={checkingIn || alreadyCheckedInToday}
              className="rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-50 mb-2 transition hover:brightness-110 active:brightness-95"
              style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
            >
              {alreadyCheckedInToday
                ? "✓ Checked in today"
                : checkingIn
                ? "Checking in..."
                : "Check in today"}
            </button>

            {checkInError && (
              <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 mb-4">
                {(checkInError as Error).message}
              </p>
            )}

            <div className="mt-8">
              <p className="text-sm font-medium mb-2" style={{ color: "var(--color-text)" }}>
                Activity
              </p>
              <HeatmapGrid entries={history.heatmap} color={habit.color} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
        {value}
      </p>
      <p className="text-xs opacity-60" style={{ color: "var(--color-text)" }}>
        {label}
      </p>
    </div>
  );
}
