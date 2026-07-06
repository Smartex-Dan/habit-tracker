interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen loading overlay. This is a bare-bones placeholder (a simple
 * spinner) — swap the contents of the marked div below for whatever
 * animation asset you grab. Everything else (positioning, background,
 * message text) can stay as-is or be restyled along with the rest of your
 * visual pass.
 */
export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-background)" }}
    >
      {/* ---- PLACEHOLDER: replace this block with your loading animation ---- */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{
            borderColor: "var(--color-accent)",
            borderTopColor: "transparent",
          }}
        />
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
          {message}
        </p>
      </div>
      {/* ---- end placeholder ---- */}
    </div>
  );
}