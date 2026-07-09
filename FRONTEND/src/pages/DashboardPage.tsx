import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHabits } from "../hooks/useHabits";
import { Navbar } from "../components/Navbar";
import { HabitCard } from "../components/HabitCard";
import { CreateHabitForm } from "../components/CreateHabitForm";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: habits, isLoading, error } = useHabits();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const firstName = user?.email?.split("@")[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
            >
              Welcome back{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-sm opacity-60" style={{ color: "var(--color-text)" }}>
              {habits?.length ?? 0} habit{habits?.length === 1 ? "" : "s"} tracked
            </p>
          </div>

          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-md px-4 py-2 text-sm font-medium transition hover:brightness-110 active:brightness-95"
              style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
            >
              + Add Habit
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="mb-6">
            <CreateHabitForm onDone={() => setShowCreateForm(false)} />
          </div>
        )}

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

        {habits && habits.length === 0 && !showCreateForm && (
          <div
            className="text-center rounded-lg border border-dashed py-16"
            style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
          >
            <p className="opacity-70 mb-4">You haven't added any habits yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-md px-4 py-2 text-sm font-medium transition hover:brightness-110 active:brightness-95"
              style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
            >
              Add your first habit
            </button>
          </div>
        )}

        {habits && habits.length > 0 && (
          <div className="space-y-3">
            {habits.map((h) => (
              <HabitCard key={h.id} habit={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
