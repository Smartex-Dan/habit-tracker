import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import type { Habit } from "../types/habit";
import { useToggleCheckIn } from "../hooks/useToggleCheckIn";

interface TodaysHabitsProps {
  habits: Habit[];
}

function formatReminderTime(time: string | null): string | null {
  if (!time) return null;
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

function HabitRow({ habit }: { habit: Habit }) {
  const toggle = useToggleCheckIn();
  const reminder = formatReminderTime(habit.reminder_time);

  return (
    <div
      className="flex items-center gap-4 rounded-xl p-4 transition-colors"
      style={{
        backgroundColor: "var(--color-surface)",
        opacity: toggle.isPending ? 0.6 : 1,
      }}
    >
      <button
        onClick={() => toggle.mutate(habit)}
        disabled={toggle.isPending}
        aria-label={habit.checked_in_today ? "Mark as not done" : "Mark as done"}
        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
        style={{
          border: `2px solid ${habit.checked_in_today ? "var(--color-success)" : "var(--color-text-secondary)"}`,
          backgroundColor: habit.checked_in_today ? "var(--color-success)" : "transparent",
        }}
      >
        {habit.checked_in_today && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: habit.color }}
      />

      <div className="flex-1 min-w-0">
        <p
          className="font-medium truncate"
          style={{
            color: "var(--color-text)",
            textDecoration: habit.checked_in_today ? "line-through" : "none",
            opacity: habit.checked_in_today ? 0.6 : 1,
          }}
        >
          {habit.title}
        </p>
      </div>

      {habit.current_streak > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <LocalFireDepartmentRoundedIcon sx={{ fontSize: 16, color: "var(--color-warning)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            {habit.current_streak}
          </span>
        </div>
      )}

      {reminder && (
        <div className="flex items-center gap-1 flex-shrink-0" title={`Reminder at ${reminder}`}>
          <NotificationsRoundedIcon sx={{ fontSize: 16, color: "var(--color-primary)" }} />
          <span className="text-xs hidden sm:inline" style={{ color: "var(--color-text-secondary)" }}>
            {reminder}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TodaysHabits({ habits }: TodaysHabitsProps) {
  if (habits.length === 0) return null;

  return (
    <div className="mb-6">
      <h2
        className="text-lg font-semibold mb-3"
        style={{ fontFamily: "var(--font-headline, 'Fraunces', serif)", color: "var(--color-text)" }}
      >
        Today's Habits
      </h2>
      <div className="flex flex-col gap-2">
        {habits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}