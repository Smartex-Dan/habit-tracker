import { Link } from "react-router-dom";
import type { Habit } from "../types/habit";

interface HabitCardProps {
  habit: Habit;
}

/**
 * Clicking anywhere on the card goes to /habits/:id for the full history
 * + heatmap. The color bar on the left uses the habit's own chosen color
 * (stored in the DB) rather than the global accent, so habits stay
 * visually distinct from each other.
 */
export function HabitCard({ habit }: HabitCardProps) {
  return (
    <Link
      to={`/habits/${habit.id}`}
      className="flex items-stretch rounded-lg overflow-hidden border transition-transform hover:-translate-y-0.5"
      style={{ borderColor: "var(--color-surface)", background: "var(--color-background)" }}
    >
      <div className="w-1.5" style={{ background: habit.color }} />
      <div className="flex-1 flex items-center justify-between px-4 py-4">
        <div>
          <p className="font-medium" style={{ color: "var(--color-text)" }}>
            {habit.title}
          </p>
          {habit.description && (
            <p className="text-sm opacity-60 mt-0.5" style={{ color: "var(--color-text)" }}>
              {habit.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <span
            className="text-sm font-semibold flex items-center gap-1"
            style={{ color: "var(--color-primary)" }}
          >
            🔥 {habit.current_streak}
          </span>
          <span className="text-xs opacity-50" style={{ color: "var(--color-text)" }}>
            best {habit.longest_streak}
          </span>
        </div>
      </div>
    </Link>
  );
}
