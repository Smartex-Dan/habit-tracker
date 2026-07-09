import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "../hooks/useTodos";

export function TodosPage() {
  const { data: todos, isLoading, error } = useTodos();
  const { mutate: createTodo, isPending: creating } = useCreateTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const [newTitle, setNewTitle] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createTodo({ title: newTitle.trim() }, { onSuccess: () => setNewTitle("") });
  }

  const pending = todos?.filter((t) => !t.is_completed) ?? [];
  const completed = todos?.filter((t) => t.is_completed) ?? [];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
        >
          To-Do List
        </h1>
        <p className="text-sm opacity-60 mb-6" style={{ color: "var(--color-text)" }}>
          {pending.length} pending
        </p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 rounded-md px-3 py-2 border bg-transparent"
            style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
          />
          <button
            type="submit"
            disabled={creating || !newTitle.trim()}
            className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
            style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
          >
            Add
          </button>
        </form>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={48} className="text-[var(--color-primary)]" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {(error as Error).message}
          </p>
        )}

        {todos && todos.length === 0 && (
          <p className="text-center opacity-60 py-12" style={{ color: "var(--color-text)" }}>
            Nothing on your list yet.
          </p>
        )}

        <div className="space-y-2">
          {pending.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
              style={{ borderColor: "var(--color-surface)" }}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={(e) =>
                    updateTodo({ todoId: todo.id, input: { is_completed: e.target.checked } })
                  }
                  className="w-5 h-5"
                />
                <span style={{ color: "var(--color-text)" }}>{todo.title}</span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-xs opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: "var(--color-text)" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {completed.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-medium opacity-50 mb-2" style={{ color: "var(--color-text)" }}>
              COMPLETED
            </p>
            <div className="space-y-2">
              {completed.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 opacity-50"
                  style={{ borderColor: "var(--color-surface)" }}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={(e) =>
                        updateTodo({ todoId: todo.id, input: { is_completed: e.target.checked } })
                      }
                      className="w-5 h-5"
                    />
                    <span style={{ color: "var(--color-text)", textDecoration: "line-through" }}>
                      {todo.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: "var(--color-text)" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
