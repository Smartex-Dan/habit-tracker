import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const TABS = [
  { label: "Home", path: "/dashboard", icon: HomeRoundedIcon },
  { label: "Daily", path: "/daily-goals", icon: CheckCircleRoundedIcon },
  { label: "To-Dos", path: "/todos", icon: ChecklistRoundedIcon },
  { label: "Long Term", path: "/long-term-goals", icon: FlagRoundedIcon },
  { label: "Profile", path: "/profile", icon: PersonRoundedIcon },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const nav = (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-[9999]
        flex md:hidden
        justify-around items-center
        h-16
        border-t
        px-1
        pb-[env(safe-area-inset-bottom)]
      "
      style={{ backgroundColor: "var(--color-background)", borderColor: "var(--color-surface)" }}
    >
      {TABS.map(({ label, path, icon: Icon }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors"
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              sx={{
                fontSize: 22,
                color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
                transition: "color 0.2s ease",
              }}
            />
            <span
              className="text-[10px] font-medium transition-colors"
              style={{ color: active ? "var(--color-primary)" : "var(--color-text-secondary)" }}
            >
              {label}
            </span>
            {active && (
              <span
                className="absolute top-0 h-0.5 w-8 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );

  // Portal straight to document.body — sidesteps any ancestor with a CSS
  // transform (Framer Motion, etc.) that would otherwise turn this into
  // an "absolute relative to that ancestor" instead of true viewport-fixed.
  return createPortal(nav, document.body);
}