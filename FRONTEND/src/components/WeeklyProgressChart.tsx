import type { WeeklyProgressEntry } from "../types/dashboardCharts";

interface WeeklyProgressChartProps {
  data: WeeklyProgressEntry[];
}

export default function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-surface)" }}
    >
      <h2
        className="text-lg font-semibold mb-5"
        style={{ fontFamily: "var(--font-headline, 'Fraunces', serif)", color: "var(--color-text)" }}
      >
        Weekly Progress
      </h2>

      <div className="flex items-end justify-between gap-3 h-36">
        {data.map((day) => {
          const heightPct = (day.completed / maxTotal) * 100;
          const isToday = day.date === new Date().toISOString().slice(0, 10);

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-out"
                  style={{
                    height: `${Math.max(heightPct, day.completed > 0 ? 6 : 2)}%`,
                    backgroundColor: isToday ? "var(--color-primary)" : "var(--color-accent)",
                    opacity: day.completed === 0 ? 0.25 : 1,
                  }}
                  title={`${day.completed}/${day.total} completed`}
                />
              </div>
              <span
                className="text-xs"
                style={{
                  color: isToday ? "var(--color-text)" : "var(--color-text-secondary)",
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day.day_label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}