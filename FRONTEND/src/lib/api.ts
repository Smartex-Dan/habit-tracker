import { supabase } from "./supabase";
import type {
  Habit,
  HabitCreateInput,
  HabitHistory,
  CheckIn,
  CheckInCreateInput,
} from "../types/habit";
import type {
  DailyGoal,
  DailyGoalCreateInput,
  Todo,
  TodoCreateInput,
  TodoUpdateInput,
  LongTermGoal,
  LongTermGoalCreateInput,
  LongTermGoalUpdateInput,
} from "../types/goals";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

/**
 * Core request helper: grabs the current Supabase session token and
 * attaches it as `Authorization: Bearer <token>` on every call to the
 * Django API. Throws a readable error if the API responds with a
 * non-2xx status, since React Query surfaces thrown errors directly.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated. Please log in.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(detail);
  }

  // DELETE returns 204 No Content — nothing to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  habits: {
    list: () => request<Habit[]>("/habits"),
    create: (input: HabitCreateInput) =>
      request<Habit>("/habits", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    history: (habitId: string) =>
      request<HabitHistory>(`/habits/${habitId}/history`),
  },
  checkIns: {
    create: (input: CheckInCreateInput) =>
      request<CheckIn>("/check-ins", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    delete: (checkInId: string) =>
      request<void>(`/check-ins/${checkInId}`, { method: "DELETE" }),
  },
  profile: {
    deleteAccount: (password: string) =>
      request<void>("/profile/account", {
        method: "DELETE",
        body: JSON.stringify({ password }),
      }),
  },
  dailyGoals: {
    list: () => request<DailyGoal[]>("/daily-goals"),
    create: (input: DailyGoalCreateInput) =>
      request<DailyGoal>("/daily-goals", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    complete: (goalId: string) =>
      request<{ id: string }>(`/daily-goals/${goalId}/complete`, { method: "POST" }),
    uncomplete: (goalId: string) =>
      request<void>(`/daily-goals/${goalId}/complete`, { method: "DELETE" }),
    delete: (goalId: string) =>
      request<void>(`/daily-goals/${goalId}`, { method: "DELETE" }),
  },
  todos: {
    list: () => request<Todo[]>("/todos"),
    create: (input: TodoCreateInput) =>
      request<Todo>("/todos", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (todoId: string, input: TodoUpdateInput) =>
      request<Todo>(`/todos/${todoId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    delete: (todoId: string) =>
      request<void>(`/todos/${todoId}`, { method: "DELETE" }),
  },
  longTermGoals: {
    list: () => request<LongTermGoal[]>("/long-term-goals"),
    create: (input: LongTermGoalCreateInput) =>
      request<LongTermGoal>("/long-term-goals", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    update: (goalId: string, input: LongTermGoalUpdateInput) =>
      request<LongTermGoal>(`/long-term-goals/${goalId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    delete: (goalId: string) =>
      request<void>(`/long-term-goals/${goalId}`, { method: "DELETE" }),
  },
};
