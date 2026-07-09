import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { LongTermGoalCreateInput, LongTermGoalUpdateInput } from "../types/goals";

const LONG_TERM_GOALS_KEY = ["long-term-goals"] as const;

export function useLongTermGoals() {
  return useQuery({
    queryKey: LONG_TERM_GOALS_KEY,
    queryFn: api.longTermGoals.list,
  });
}

export function useCreateLongTermGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LongTermGoalCreateInput) => api.longTermGoals.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LONG_TERM_GOALS_KEY }),
  });
}

export function useUpdateLongTermGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, input }: { goalId: string; input: LongTermGoalUpdateInput }) =>
      api.longTermGoals.update(goalId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LONG_TERM_GOALS_KEY }),
  });
}

export function useDeleteLongTermGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => api.longTermGoals.delete(goalId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LONG_TERM_GOALS_KEY }),
  });
}
