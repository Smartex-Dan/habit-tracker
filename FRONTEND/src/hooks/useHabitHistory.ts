import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CheckInCreateInput } from "../types/habit";

export function useHabitHistory(habitId: string | undefined) {
  return useQuery({
    queryKey: ["habit-history", habitId],
    queryFn: () => api.habits.history(habitId as string),
    enabled: !!habitId, // don't fire until we actually have an id
  });
}

export function useCreateCheckIn(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CheckInCreateInput) => api.checkIns.create(input),
    onSuccess: () => {
      // Both the detail view (streak/heatmap) and the dashboard list
      // (streak badge on the card) need to reflect the new check-in.
      queryClient.invalidateQueries({ queryKey: ["habit-history", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteCheckIn(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checkInId: string) => api.checkIns.delete(checkInId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-history", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
