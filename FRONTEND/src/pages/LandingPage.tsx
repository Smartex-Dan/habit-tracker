import { Link } from "react-router-dom";

/**
 * Public landing page at "/". Down to two CTAs (both go to /login, which
 * handles sign-in and sign-up via its own toggle) — the header button is
 * secondary/small, the hero button is the primary call to action.
 *
 * Buttons use a left-to-right "sweep" hover effect (Render-style): a
 * colored layer slides in from the left on hover instead of the whole
 * button just changing color instantly.
 */
export function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--color-background)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Habit Tracker
        </span>
        <SweepButton to="/login" variant="outline">
          Sign In
        </SweepButton>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-semibold mb-4"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Build habits that actually stick.
        </h1>
        <p className="text-base md:text-lg opacity-70 mb-8 max-w-lg">
          Track daily habits, watch your streaks grow, and see your
          progress laid out on a heatmap — all in one place, built to keep
          you motivated instead of guilty about missed days.
        </p>

        <SweepButton to="/login" variant="solid" size="lg">
          Get Started
        </SweepButton>
      </main>

      <footer className="text-center text-xs opacity-50 py-6 space-x-4">
        <Link to="/privacy-policy" className="underline">Privacy Policy</Link>
        <Link to="/terms" className="underline">Terms & Conditions</Link>
      </footer>
    </div>
  );
}

/**
 * Button with a left-to-right sweep fill on hover — the fill color slides
 * in from the left edge (transform: scaleX, transform-origin: left)
 * rather than the background just snapping to a new color. Text sits on
 * a layer above the sweep so it stays readable throughout.
 */
function SweepButton({
  to,
  children,
  variant = "solid",
  size = "md",
}: {
  to: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
}) {
  const sizeClasses = size === "lg" ? "px-8 py-3 text-base" : "px-5 py-2 text-sm";

  const baseClasses =
    variant === "solid"
      ? "text-[var(--color-surface)]"
      : "border";

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-md font-medium inline-block ${sizeClasses} ${baseClasses}`}
      style={{
        background: variant === "solid" ? "var(--color-primary)" : "transparent",
        borderColor: variant === "outline" ? "var(--color-primary)" : undefined,
        color: variant === "outline" ? "var(--color-text)" : undefined,
      }}
    >
      {/* Sweep layer — scales from 0 to 1 width, left-anchored */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{ background: "var(--color-accent)" }}
      />
      {/* Text sits above the sweep layer */}
      <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--color-background)]">
        {children}
      </span>
    </Link>
  );
}
