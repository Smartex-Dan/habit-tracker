import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import type { SvgIconComponent } from "@mui/icons-material";

interface QuickStatsProps {
  bestCurrentStreak: number;
  longestStreakEver: number;
  todayCompleted: number;
  todayTotal: number;
  consistencyScore?: number;
}

function StatCard({
  label,
  value,
  Icon,
  iconColor,
}: {
  label: string;
  value: string;
  Icon: SvgIconComponent;
  iconColor: string;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-surface)" }}
    >
      <Icon sx={{ fontSize: 22, color: iconColor }} />
      <span
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-headline, 'Fraunces', serif)", color: "var(--color-text)" }}
      >
        {value}
      </span>
      <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </span>
    </div>
  );
}

export default function QuickStats({
  bestCurrentStreak,
  longestStreakEver,
  todayCompleted,
  todayTotal,
  consistencyScore,
}: QuickStatsProps) {
  const todayPct = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <StatCard
        Icon={LocalFireDepartmentRoundedIcon}
        iconColor="var(--color-warning)"
        label="Current streak"
        value={`${bestCurrentStreak}d`}
      />
      <StatCard
        Icon={EmojiEventsRoundedIcon}
        iconColor="var(--color-accent)"
        label="Longest streak"
        value={`${longestStreakEver}d`}
      />
      <StatCard
        Icon={CheckCircleRoundedIcon}
        iconColor="var(--color-success)"
        label="Today's completion"
        value={`${todayPct}%`}
      />
      <StatCard
        Icon={InsightsRoundedIcon}
        iconColor="var(--color-primary)"
        label="Consistency score"
        value={consistencyScore != null ? `${consistencyScore}` : "—"}
      />
    </div>
  );
}