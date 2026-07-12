import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHabits } from "../hooks/useHabits";
import { useConsistencyScore } from "../hooks/useConsistencyScore";
import { Navbar } from "../components/Navbar";
import { CreateHabitForm } from "../components/CreateHabitForm";
import { LoadingSpinner } from "../components/LoadingSpinner";
import ConsistencyScoreCard from "../components/ConsistencyScoreCard";
import DashboardHero from "../components/DashboardHero";
import QuickStats from "../components/QuickStats";
import TodaysHabits from "../components/TodaysHabits";
import WeeklyProgressChart from "../components/WeeklyProgressChart";
import DashboardHeatmap from "../components/DashboardHeatmap";
import { useDashboardCharts } from "../hooks/useDashboardCharts";
import { getDashboardStats } from "../lib/dashboardStats";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: habits, isLoading, error } = useHabits();
  const { data: score } = useConsistencyScore();
  const { data: charts } = useDashboardCharts();
  const [showCreateForm, setShowCreateForm] = useState(false);

 const firstName =
  user?.user_metadata?.display_name?.trim() ||
  user?.email?.split("@")[0];

  const stats = getDashboardStats(habits ?? []);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <DashboardHero
          name={firstName}
          bestCurrentStreak={stats.bestCurrentStreak}
          todayCompleted={stats.todayCompleted}
          todayTotal={stats.todayTotal}
        />

        <QuickStats
          bestCurrentStreak={stats.bestCurrentStreak}
          longestStreakEver={stats.longestStreakEver}
          todayCompleted={stats.todayCompleted}
          todayTotal={stats.todayTotal}
          consistencyScore={score?.score}
        />

        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-headline, 'Fraunces', serif)", color: "var(--color-text)" }}
          >
            Your Habits
          </h2>

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

        {score && (
          <div className="mb-6">
            <ConsistencyScoreCard result={score} />
          </div>
        )}

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

        {habits && habits.length > 0 && <TodaysHabits habits={habits} />}

        {charts && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <WeeklyProgressChart data={charts.weekly} />
            <DashboardHeatmap entries={charts.heatmap} />
          </div>
        )}
      </div>
    </div>
  );
}