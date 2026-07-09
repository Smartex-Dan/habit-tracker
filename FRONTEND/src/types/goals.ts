// Mirrors goals/serializers.py on the backend — keep in sync manually.

export interface DailyGoal {
  id: string;
  title: string;
  created_at: string;
  completed_today: boolean;
}

export interface DailyGoalCreateInput {
  title: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface TodoCreateInput {
  title: string;
  description?: string;
}

export interface TodoUpdateInput {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

export interface LongTermGoal {
  id: string;
  title: string;
  start_date: string | null; // "YYYY-MM-DD"
  target_date: string | null; // "YYYY-MM-DD" — displayed as "stop date" in the UI
  progress_percent: number;
  created_at: string;
}

export interface LongTermGoalCreateInput {
  title: string;
  start_date?: string;
  target_date?: string;
  progress_percent?: number;
}

export interface LongTermGoalUpdateInput {
  title?: string;
  start_date?: string;
  target_date?: string;
  progress_percent?: number;
}
