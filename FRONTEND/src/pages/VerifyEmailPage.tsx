import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AnimatedCheckmark } from "../components/AnimatedCheckmark";

/**
 * Lands here after the user clicks the confirmation link in their email.
 * By this point Supabase has ALREADY verified the email and established a
 * session server-side (that's what processed before this redirect happened) —
 * so this page isn't doing the actual verification. It's an extra identity
 * check: asking the user to re-enter their password proves it's genuinely
 * the account owner clicking the link, not just anyone with inbox access.
 */
export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (error) {
      setError("That password doesn't match. Try again.");
      return;
    }

    setVerified(true);

    // Tell any other open tab (e.g. the "Check your email" waiting screen)
    // that verification is complete, so it can move on too.
    const channel = new BroadcastChannel("email-verification");
    channel.postMessage("verified");
    channel.close();

    setTimeout(() => navigate("/dashboard"), 1800);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--color-background)" }}
    >
      {verified ? (
        <>
          <AnimatedCheckmark size={72} />
          <h1
            className="text-2xl font-bold mt-6 mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
          >
            USER VERIFIED
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>Taking you to your dashboard…</p>
        </>
      ) : (
        <>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
          >
            Confirm it's you
          </h1>
          <p className="max-w-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Your email is verified — enter your password once more to finish
            securing your account.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
            <input
              type="password"
              required
              autoFocus
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!email}
              className="w-full rounded-md px-3 py-2 border bg-transparent"
              style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {!email && (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Loading your session…
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
              style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
            >
              {submitting ? "Confirming…" : "Confirm"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}