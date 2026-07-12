import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Habit, CheckIn } from "../types/habit";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Toggles a habit's check-in for today. Checks in if not already done,
 * un-checks (deletes today's check-in) if it is — a single mutation
 * that mirrors what a checkbox click actually means to the user.
 *
 * Explicitly typed <CheckIn | void, Error, Habit> because the two
 * branches return different types (delete -> void, create -> CheckIn) —
 * without this, TS infers the mutation's type from the first branch only
 * and rejects the second.
 */
export function useToggleCheckIn() {
  const queryClient = useQueryClient();

  return useMutation<CheckIn | void, Error, Habit>({
    mutationFn: (habit: Habit) => {
      if (habit.checked_in_today && habit.today_check_in_id) {
        return api.checkIns.delete(habit.today_check_in_id);
      }
      return api.checkIns.create({ habit_id: habit.id, date: todayIso() });
    },
    onSuccess: () => {
      // Streaks, today's completion, and the consistency score all
      // depend on check-in state, so refetch everything downstream.
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["consistency-score"] });
    },
  });
}