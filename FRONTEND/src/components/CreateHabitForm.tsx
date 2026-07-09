import { useState } from "react";
import { useCreateHabit } from "../hooks/useHabits";

const PRESET_COLORS = ["#375534", "#6B9071", "#AEC3B0", "#0F2A1D", "#8B6F4E", "#4A5D8A"];

interface CreateHabitFormProps {
  onDone: () => void;
}

/**
 * Small inline form (not a modal library — just conditionally rendered)
 * for adding a new habit. Calls useCreateHabit, which already invalidates
 * the habits list query on success, so the dashboard updates automatically.
 */
export function CreateHabitForm({ onDone }: CreateHabitFormProps) {
  const { mutate: createHabit, isPending, error } = useCreateHabit();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    createHabit(
      { title: title.trim(), description: description.trim() || undefined, color },
      { onSuccess: onDone }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border p-4 space-y-3"
      style={{ borderColor: "var(--color-surface)", background: "var(--color-background)" }}
    >
      <input
        type="text"
        required
        placeholder="Habit name (e.g. Drink water)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-md px-3 py-2 border bg-transparent"
        style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-md px-3 py-2 border bg-transparent"
        style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
      />

      <div className="flex items-center gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className="w-7 h-7 rounded-full border-2"
            style={{
              background: c,
              borderColor: color === c ? "var(--color-text)" : "transparent",
            }}
            aria-label={`Choose color ${c}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
          {(error as Error).message}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
          style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
        >
          {isPending ? "Adding..." : "Add Habit"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-md px-4 py-2 text-sm font-medium border transition hover:bg-[var(--color-surface)]"
          style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
