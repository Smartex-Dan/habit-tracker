import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
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
          Reset your password
        </h1>

        {sent ? (
          <p className="text-sm opacity-70 mt-4">
            If an account exists for <strong>{email}</strong>, a password
            reset link has been sent. Check your inbox.
          </p>
        ) : (
          <>
            <p className="text-sm opacity-60 mb-6">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md px-3 py-2 border bg-transparent"
                style={{ borderColor: "var(--color-surface)" }}
              />

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
                {submitting ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="block text-center text-sm opacity-60 hover:opacity-100 transition-opacity mt-6"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
