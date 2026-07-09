import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Top nav for every authenticated page (Dashboard, Habit detail, Profile).
 * Wrapped around page content via <ProtectedLayout> in App.tsx rather than
 * repeated inside each page component.
 */
export function Navbar() {
  const { signOut } = useAuth();
  const location = useLocation();

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? "opacity-100" : "opacity-60 hover:opacity-100"
    }`;

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{ borderColor: "var(--color-surface)", background: "var(--color-background)" }}
    >
      <Link
        to="/dashboard"
        className="text-lg font-semibold"
        style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
      >
        Habit Tracker
      </Link>

      <div className="flex items-center gap-6" style={{ color: "var(--color-text)" }}>
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Habits
        </Link>
        <Link to="/daily-goals" className={linkClass("/daily-goals")}>
          Daily Goals
        </Link>
        <Link to="/todos" className={linkClass("/todos")}>
          To-Dos
        </Link>
        <Link to="/long-term-goals" className={linkClass("/long-term-goals")}>
          Long Term
        </Link>
        <Link to="/profile" className={linkClass("/profile")}>
          Profile
        </Link>
        <button
          onClick={() => signOut()}
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
