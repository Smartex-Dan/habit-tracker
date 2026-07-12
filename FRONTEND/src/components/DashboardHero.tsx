import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";

interface DashboardHeroProps {
  name?: string;
  bestCurrentStreak: number;
  todayCompleted: number;
  todayTotal: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHero({
  name,
  bestCurrentStreak,
  todayCompleted,
  todayTotal,
}: DashboardHeroProps) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 mb-6"
      style={{
        background: "linear-gradient(135deg, var(--color-surface), var(--color-background))",
        border: "1px solid var(--color-surface)",
      }}
    >
      <h1
        className="text-2xl md:text-3xl font-bold mb-1"
        style={{ fontFamily: "var(--font-headline, 'Fraunces', serif)", color: "var(--color-text)" }}
      >
        {getGreeting()}{name ? `, ${name}` : ""}
      </h1>
      <p
        className="text-sm mb-5"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Today's progress
      </p>

      <div className="flex flex-wrap gap-4 md:gap-8">
        <div className="flex items-center gap-2">
          <LocalFireDepartmentRoundedIcon sx={{ fontSize: 26, color: "var(--color-warning)" }} />
          <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
            {bestCurrentStreak}-day streak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrackChangesRoundedIcon sx={{ fontSize: 26, color: "var(--color-accent)" }} />
          <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
            {todayCompleted}/{todayTotal} habits completed
          </span>
        </div>
      </div>
    </div>
  );
}