import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { TodoCreateInput, TodoUpdateInput } from "../types/goals";

const TODOS_KEY = ["todos"] as const;

export function useTodos() {
  return useQuery({
    queryKey: TODOS_KEY,
    queryFn: api.todos.list,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TodoCreateInput) => api.todos.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ todoId, input }: { todoId: string; input: TodoUpdateInput }) =>
      api.todos.update(todoId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todoId: string) => api.todos.delete(todoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
  });
}
