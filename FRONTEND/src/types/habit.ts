// These types mirror the DRF serializers in the backend
// (habits/serializers.py) — keep them in sync manually since the two
// projects aren't sharing a schema generator yet.

export interface Habit {
  id: string;
  title: string;
  description: string | null;
  color: string; // hex code, e.g. "#8B6F4E"
  created_at: string; // ISO timestamp
  current_streak: number;
  longest_streak: number;
}

export interface HabitCreateInput {
  title: string;
  description?: string;
  color: string;
}

export interface CheckIn {
  id: string;
  habit_id: string;
  completed_at: string; // "YYYY-MM-DD"
}

export interface CheckInCreateInput {
  habit_id: string;
  date: string; // "YYYY-MM-DD"
}

export interface HeatmapEntry {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export interface HabitHistory {
  habit_id: string;
  check_ins: CheckIn[];
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
  heatmap: HeatmapEntry[];
}
