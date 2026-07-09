import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen loading overlay — for page loads / navigation / refresh.
 * Uses the loading.io spinner. For anything with real, trackable progress
 * (file uploads), use ProgressBar instead — this one's just an
 * indeterminate "something is happening" indicator.
 */
export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-background)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={80} className="text-[var(--color-accent)]" />
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
