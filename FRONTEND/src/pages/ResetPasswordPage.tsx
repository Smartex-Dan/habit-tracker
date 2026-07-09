import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { isPasswordValid, getPasswordRules } from "../lib/passwordRules";

/**
 * Landed on after clicking the reset-password link in the email. Supabase
 * automatically establishes a temporary recovery session when the user
 * arrives here via that link, so we just need to collect + set the new
 * password via updateUser — no token handling needed on our end.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checklistUnlocked, setChecklistUnlocked] = useState(false);
  const [focused, setFocused] = useState(false);

  const rules = getPasswordRules(password);
  const allValid = rules.every((r) => r.passed);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(password)) {
      setChecklistUnlocked(true);
      setError("Your password doesn't meet the requirements above.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--color-background)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="w-full max-w-sm">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Set a new password
        </h1>
        <p className="text-sm opacity-60 mb-6">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="New password"
              className="w-full rounded-md px-3 py-2 bg-transparent transition-colors"
              style={{
                border: checklistUnlocked
                  ? `2px solid ${allValid ? "#22c55e" : "#ef4444"}`
                  : "1px solid var(--color-surface)",
              }}
            />
            {checklistUnlocked && focused && (
              <ul
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 top-full mt-1 w-full rounded-md p-3 text-xs space-y-1 z-40 shadow-md bg-white"
              >
                {rules.map((rule) => (
                  <li key={rule.label} style={{ color: rule.passed ? "#16a34a" : "#dc2626" }}>
                    {rule.passed ? "✓" : "✗"} {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md py-2 font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
            style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
          >
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
