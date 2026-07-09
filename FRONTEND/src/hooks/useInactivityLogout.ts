import { useEffect } from "react";
import { useAuth } from "./useAuth";

const INACTIVITY_LIMIT_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const LAST_ACTIVITY_KEY = "habit-tracker:last-activity";
const CHECK_INTERVAL_MS = 60 * 1000; // check once a minute

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

/**
 * Tracks user activity in localStorage and force-signs-out anyone who's
 * been inactive for 3+ days — including across tabs/sessions, since it's
 * checked against a stored timestamp rather than in-memory state that
 * would reset on refresh.
 *
 * Mount this once, high in the tree (App.tsx), for authenticated users.
 */
export function useInactivityLogout() {
  const { isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    function recordActivity() {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }

    // Stamp activity on mount, then on any of the listed events.
    recordActivity();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, recordActivity));

    const intervalId = window.setInterval(() => {
      const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) ?? Date.now());
      if (Date.now() - last > INACTIVITY_LIMIT_MS) {
        signOut();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, recordActivity));
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, signOut]);
}
