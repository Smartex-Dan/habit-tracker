import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Github, X as XIcon, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { withMinDelay } from "../lib/withMinDelay";
import { getPasswordRules, isPasswordValid } from "../lib/passwordRules";
import { LoadingScreen } from "../components/LoadingScreen";

// NOTE: lucide-react doesn't ship real brand logos (Google's "G", etc. are
// trademarked, not generic icons). `Globe` is a placeholder for Google here
// — swap it for a real Google icon from your own icon library when you do
// the visual pass. `Github` and `Apple` are close enough as-is.

export function LoginPage() {
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [passwordChecklistUnlocked, setPasswordChecklistUnlocked] = useState(false);
  const [passwordFieldFocused, setPasswordFieldFocused] = useState(false);

  const passwordRules = getPasswordRules(signUpPassword);
  const passwordAllValid = passwordRules.every((r) => r.passed);

  function friendlyAuthError(message: string): string {
    if (message.toLowerCase().includes("invalid login credentials")) {
      return "Incorrect email or password. Please try again.";
    }
    return message;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await withMinDelay(signIn(loginEmail, loginPassword), 3000);

    setSubmitting(false);
    if (error) {
      setError(friendlyAuthError(error.message));
      return;
    }
    navigate("/");
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(signUpPassword)) {
      setPasswordChecklistUnlocked(true);
      setError("Your password doesn't meet the requirements above.");
      return;
    }

    setSubmitting(true);
    const { error } = await withMinDelay(signUp(signUpEmail, signUpPassword), 3000);

    setSubmitting(false);
    if (error) {
      setError(friendlyAuthError(error.message));
      return;
    }
    navigate("/");
  }

  async function handleOAuth(provider: "google" | "github" | "x") {
    setOauthError(null);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setOauthError(error.message);
    }
  }

  return (
    <>
      {submitting && (
        <LoadingScreen message={isSignUp ? "Creating your account..." : "Signing you in..."} />
      )}

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: "var(--color-background)",
          fontFamily: "var(--font-body)",
          color: "var(--color-text)",
        }}
      >
        <div className="relative w-full max-w-3xl min-h-[480px] rounded-2xl overflow-hidden shadow-xl">
          {/* ---------------- Sign Up form (left side) ---------------- */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 transition-opacity duration-500 ${
              isSignUp ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"
            }`}
            style={{ background: "var(--color-surface)" }}
          >
            <form onSubmit={handleSignUp} className="w-full max-w-xs space-y-4">
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Create Account
              </h2>

              <div className="flex gap-3">
                <IconButton icon={<Globe size={18} />} onClick={() => handleOAuth("google")} label="Continue with Google" />
                <IconButton icon={<Github size={18} />} onClick={() => handleOAuth("github")} label="Continue with GitHub" />
                <IconButton icon={<XIcon size={18} />} onClick={() => handleOAuth("x")} label="Continue with X" />
              </div>
              <p className="text-xs opacity-60">or use your email for registration</p>
              {oauthError && <FormError message={oauthError} />}

              <input
                type="email"
                required
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full rounded-md px-3 py-2 bg-white/60 border border-black/10 focus:outline-none"
              />

              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  onFocus={() => setPasswordFieldFocused(true)}
                  onBlur={() => setPasswordFieldFocused(false)}
                  className="w-full rounded-md px-3 py-2 bg-white/60 focus:outline-none transition-colors"
                  style={{
                    border: passwordChecklistUnlocked
                      ? `2px solid ${passwordAllValid ? "#22c55e" : "#ef4444"}`
                      : "1px solid rgba(0,0,0,0.1)",
                  }}
                />

                {passwordChecklistUnlocked && passwordFieldFocused && (
                  <ul
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute left-0 top-full mt-1 w-full rounded-md p-3 text-xs space-y-1 z-40 shadow-md bg-white"
                  >
                    {passwordRules.map((rule) => (
                      <li
                        key={rule.label}
                        style={{ color: rule.passed ? "#16a34a" : "#dc2626" }}
                      >
                        {rule.passed ? "✓" : "✗"} {rule.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {isSignUp && error && <FormError message={error} />}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md py-2 font-medium disabled:opacity-50"
                style={{ background: "var(--color-primary)", color: "var(--color-surface)" }}
              >
                {submitting ? "Please wait..." : "Sign Up"}
              </button>
            </form>
          </div>

          {/* ---------------- Login form (right side) ---------------- */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center px-10 transition-opacity duration-500 ${
              !isSignUp ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"
            }`}
            style={{ background: "var(--color-surface)" }}
          >
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Sign In
              </h2>

              <div className="flex gap-3">
                <IconButton icon={<Globe size={18} />} onClick={() => handleOAuth("google")} label="Continue with Google" />
                <IconButton icon={<Github size={18} />} onClick={() => handleOAuth("github")} label="Continue with GitHub" />
                <IconButton icon={<XIcon size={18} />} onClick={() => handleOAuth("x")} label="Continue with X" />
              </div>
              <p className="text-xs opacity-60">or use your email for login</p>

              <input
                type="email"
                required
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-md px-3 py-2 bg-white/60 border border-black/10 focus:outline-none"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-md px-3 py-2 bg-white/60 border border-black/10 focus:outline-none"
              />

              {!isSignUp && error && <FormError message={error} />}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md py-2 font-medium disabled:opacity-50"
                style={{ background: "var(--color-primary)", color: "var(--color-surface)" }}
              >
                {submitting ? "Please wait..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* ---------------- Sliding overlay panel ---------------- */}
          <div
            className={`absolute top-0 w-1/2 h-full z-30 flex items-center justify-center transition-transform duration-700 ease-in-out ${
              isSignUp ? "translate-x-full" : "translate-x-0"
            }`}
            style={{ background: "var(--color-primary)", color: "var(--color-surface)" }}
          >
            <div className="text-center px-8 max-w-xs">
              <Mail className="mx-auto mb-4 opacity-80" size={28} />
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                {isSignUp ? "Welcome Back!" : "Hello There!"}
              </h2>
              <p className="text-sm opacity-80 mb-6">
                {isSignUp
                  ? "Already have an account? Sign in to keep your streaks going."
                  : "New here? Create an account and start building better habits."}
              </p>
              <button
                onClick={() => {
                  setError(null);
                  setIsSignUp(!isSignUp);
                }}
                className="rounded-md px-6 py-2 border font-medium"
                style={{ borderColor: "var(--color-surface)" }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function IconButton({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-9 h-9 rounded-full flex items-center justify-center border border-black/10 hover:bg-black/5 transition-colors"
      aria-label={label}
    >
      {icon}
    </button>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
      {message}
    </p>
  );
}