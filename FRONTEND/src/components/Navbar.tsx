import { Link, useLocation } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../hooks/useAuth";
import MobileBottomNav from "./MobileBottomNav";

/**
 * Top nav for every authenticated page (Dashboard, Habit detail, Profile).
 * Desktop: full link row + logo + "Log out" text, as before.
 * Mobile (<768px): just logo + icon-only logout up top — real navigation
 * moves to the fixed MobileBottomNav rendered here alongside it.
 */
export function Navbar() {
  const { signOut } = useAuth();
  const location = useLocation();

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? "opacity-100" : "opacity-60 hover:opacity-100"
    }`;

  return (
    <>
      <nav
        className="flex items-center justify-between px-4 md:px-6 py-4 border-b"
        style={{ borderColor: "var(--color-surface)", background: "var(--color-background)" }}
      >
        <Link
          to="/dashboard"
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
        >
          Habit Tracker
        </Link>

        {/* Desktop-only link row */}
        <div className="hidden md:flex items-center gap-6" style={{ color: "var(--color-text)" }}>
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

        {/* Mobile-only icon logout — real nav lives in the bottom bar */}
        <button
          onClick={() => signOut()}
          className="flex md:hidden items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Log out"
        >
          <LogoutRoundedIcon sx={{ fontSize: 22, color: "var(--color-text)" }} />
        </button>
      </nav>

      <MobileBottomNav />
    </>
  );
}