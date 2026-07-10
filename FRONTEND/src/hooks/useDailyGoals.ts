import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { DailyGoalCreateInput } from "../types/goals";

const DAILY_GOALS_KEY = ["daily-goals"] as const;

export function useDailyGoals() {
  return useQuery({
    queryKey: DAILY_GOALS_KEY,
    queryFn: api.dailyGoals.list,
  });
}

export function useCreateDailyGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DailyGoalCreateInput) => api.dailyGoals.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DAILY_GOALS_KEY }),
  });
}

export function useToggleDailyGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goalId,
      completed,
    }: {
      goalId: string;
      completed: boolean;
    }) => {
      if (completed) {
        await api.dailyGoals.uncomplete(goalId);
      } else {
        await api.dailyGoals.complete(goalId);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DAILY_GOALS_KEY }),
  });
}

export function useDeleteDailyGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => api.dailyGoals.delete(goalId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DAILY_GOALS_KEY }),
  });
}
