import type { Habit } from "../types/habit";

export interface DashboardStats {
  bestCurrentStreak: number;
  longestStreakEver: number;
  todayCompleted: number;
  todayTotal: number;
}

/**
 * Aggregates per-habit data into the single-number stats the dashboard
 * hero/quick-stats need. "Best current streak" and "longest ever" both
 * take the max across habits — averaging or summing streaks across habits
 * of different ages would produce a number that doesn't mean anything.
 */
export function getDashboardStats(habits: Habit[]): DashboardStats {
  if (habits.length === 0) {
    return { bestCurrentStreak: 0, longestStreakEver: 0, todayCompleted: 0, todayTotal: 0 };
  }

  const bestCurrentStreak = Math.max(...habits.map((h) => h.current_streak));
  const longestStreakEver = Math.max(...habits.map((h) => h.longest_streak));
  const todayCompleted = habits.filter((h) => h.checked_in_today).length;

  return {
    bestCurrentStreak,
    longestStreakEver,
    todayCompleted,
    todayTotal: habits.length,
  };
}