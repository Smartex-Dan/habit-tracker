// Matches the response shape of GET /api/consistency-score
// (see BACKEND/habits/consistency.py for the calculation).

export interface ConsistencyResult {
  score: number; // 0-100
  label: "Excellent" | "Good" | "Fair" | "Needs Work" | "Just Getting Started";
  completion_rate: number; // 0-100
  eligible_habit_count: number;
  summary: string;
}