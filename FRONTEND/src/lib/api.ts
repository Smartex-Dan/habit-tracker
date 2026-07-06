import { supabase } from "./supabase";
import type {
  Habit,
  HabitCreateInput,
  HabitHistory,
  CheckIn,
  CheckInCreateInput,
} from "../types/habit";

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
};
