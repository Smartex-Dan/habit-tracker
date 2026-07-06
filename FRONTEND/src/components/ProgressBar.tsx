interface ProgressBarProps {
  percent: number; // 0–100, driven by real upload progress
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--color-text)" }}>
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-surface)" }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{ width: `${clamped}%`, background: "var(--color-accent)" }}
        />
      </div>
    </div>
  );
}