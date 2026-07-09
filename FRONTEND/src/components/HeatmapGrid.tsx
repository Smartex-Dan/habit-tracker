import type { HeatmapEntry } from "../types/habit";

interface HeatmapGridProps {
  entries: HeatmapEntry[];
  weeksToShow?: number;
  color?: string;
}

/**
 * GitHub-style contribution grid — one column per week, one cell per day,
 * going back `weeksToShow` weeks from today. Cell opacity reflects
 * whether that day had a check-in (count > 0) — since a habit can only be
 * checked in once per day (unique constraint on the backend), count is
 * always 0 or 1 here, so this is a binary fill rather than a heat scale.
 */
export function HeatmapGrid({ entries, weeksToShow = 18, color = "var(--color-primary)" }: HeatmapGridProps) {
  const countByDate = new Map(entries.map((e) => [e.date, e.count]));

  const today = new Date();
  const days: { date: string; filled: boolean }[] = [];

  const totalDays = weeksToShow * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, filled: (countByDate.get(iso) ?? 0) > 0 });
  }

  // Group into weeks (columns) of 7 days each, Sunday-first.
  const weeks: { date: string; filled: boolean }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto py-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={day.date}
              className="w-3 h-3 rounded-sm"
              style={{
                background: day.filled ? color : "var(--color-surface)",
                opacity: day.filled ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
