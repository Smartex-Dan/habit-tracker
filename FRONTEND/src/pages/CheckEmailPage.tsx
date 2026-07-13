import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Shown immediately after signup, while the user goes to their inbox to
 * click the confirmation link. That link opens in a NEW tab (VerifyEmailPage),
 * so this tab needs a way to find out when verification actually completes —
 * BroadcastChannel is the mechanism: any tab on the same origin can post a
 * message that every other open tab receives instantly, no polling needed.
 */
export function CheckEmailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const channel = new BroadcastChannel("email-verification");

    channel.onmessage = (event) => {
      if (event.data === "verified") {
        navigate("/dashboard");
      }
    };

    return () => channel.close();
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v16H4z" />
          <path d="M4 6l8 7 8-7" />
        </svg>
      </div>
      <h1
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}
      >
        Check your email
      </h1>
      <p className="max-w-sm" style={{ color: "var(--color-text-secondary)" }}>
        We've sent a confirmation link to your inbox. Click it to verify your
        account — this page will automatically continue once you do.
      </p>
    </div>
  );
}