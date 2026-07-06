import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { HabitCreateInput } from "../types/habit";

const HABITS_KEY = ["habits"] as const;

export function useHabits() {
  return useQuery({
    queryKey: HABITS_KEY,
    queryFn: api.habits.list,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HabitCreateInput) => api.habits.create(input),
    onSuccess: () => {
      // Refetch the habit list so the new habit (and its 0-streak state)
      // shows up immediately without a manual page reload.
      queryClient.invalidateQueries({ queryKey: HABITS_KEY });
    },
  });
}
