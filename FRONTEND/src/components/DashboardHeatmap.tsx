import type { HeatmapEntry } from "../types/habit";

interface DashboardHeatmapProps {
  entries: HeatmapEntry[];
  weeksToShow?: number;
}

/**
 * Same grid layout as HeatmapGrid (habit detail page), but with intensity
 * levels instead of binary fill — since this aggregates check-ins across
 * ALL habits, a day can have 0, 1, 2, 3+ completions, not just 0 or 1.
 * Level is scaled relative to the busiest day in the visible range, same
 * way GitHub's own contribution graph scales per-user rather than using
 * fixed thresholds.
 */
export default function DashboardHeatmap({ entries, weeksToShow = 18 }: DashboardHeatmapProps) {
  const countByDate = new Map(entries.map((e) => [e.date, e.count]));
  const maxCount = Math.max(...entries.map((e) => e.count), 1);

  const today = new Date();
  const days: { date: string; count: number }[] = [];

  const totalDays = weeksToShow * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, count: countByDate.get(iso) ?? 0 });
  }

  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  function levelOpacity(count: number): number {
    if (count === 0) return 0.12;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 0.4;
    if (ratio <= 0.5) return 0.6;
    if (ratio <= 0.75) return 0.8;
    return 1;
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-surface)" }}
    >
      <h2
        className="text-lg font-semibold mb-5"
        style={{ fontFamily: "var(--font-headline, 'Fraunces', serif)", color: "var(--color-text)" }}
      >
        Consistency Calendar
      </h2>

      <div className="flex gap-1 overflow-x-auto py-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} habit${day.count === 1 ? "" : "s"} completed`}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: "var(--color-accent)",
                  opacity: levelOpacity(day.count),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-4 justify-end">
        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Less</span>
        {[0.12, 0.4, 0.6, 0.8, 1].map((op) => (
          <div
            key={op}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: "var(--color-accent)", opacity: op }}
          />
        ))}
        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>More</span>
      </div>
    </div>
  );
}