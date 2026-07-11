import { useEffect, useState } from "react";
import type { ConsistencyResult } from "../types/consistency";

const tokens = {
  background: "#0F172A",
  surface: "#1E293B",
  primary: "#2563EB",
  accent: "#14B8A6",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// Color the score ring/label based on tier — reuses your semantic tokens
function getScoreColor(score: number): string {
  if (score >= 90) return tokens.success;
  if (score >= 75) return tokens.accent;
  if (score >= 55) return tokens.warning;
  return tokens.danger;
}

interface ConsistencyScoreCardProps {
  result: ConsistencyResult;
}

export default function ConsistencyScoreCard({ result }: ConsistencyScoreCardProps) {
  const { score, label, summary } = result;
  const color = getScoreColor(score);

  // Animate the ring fill on mount
  const [animatedScore, setAnimatedScore] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
      style={{ backgroundColor: tokens.surface, border: `1px solid ${color}30` }}
    >
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={tokens.background}
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ fontFamily: "'Fraunces', serif", color: tokens.text }}
          >
            {score}
          </span>
          <span
            className="text-xs"
            style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif" }}
          >
            / 100
          </span>
        </div>
      </div>

      <div className="text-center md:text-left">
        <h3
          className="text-lg font-semibold mb-1"
          style={{ fontFamily: "'Sora', sans-serif", color: tokens.textSecondary }}
        >
          Consistency Score
        </h3>
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-2"
          style={{ backgroundColor: `${color}20`, color, fontFamily: "'Sora', sans-serif" }}
        >
          {label}
        </span>
        <p
          className="text-sm"
          style={{ color: tokens.textSecondary, fontFamily: "'Sora', sans-serif", lineHeight: 1.6 }}
        >
          {summary}
        </p>
      </div>
    </div>
  );
}