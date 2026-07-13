import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import XIcon from "@mui/icons-material/X";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../hooks/useAuth";
import { withMinDelay } from "../lib/withMinDelay";
import { getPasswordRules, isPasswordValid } from "../lib/passwordRules";
import { LoadingScreen } from "../components/LoadingScreen";

/**
 * Split-panel auth screen. Above the md breakpoint: Sign Up (left) / Sign
 * In (right) with the sliding overlay panel. Below md: the overlay panel
 * is hidden and only the active form renders full-width, with a plain
 * text toggle link instead — the absolute-positioned split layout doesn't
 * translate to narrow viewports, so this is a genuinely different layout
 * below the breakpoint, not just a scaled-down version of the same one.
 */
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

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [passwordChecklistUnlocked, setPasswordChecklistUnlocked] = useState(false);
  const [passwordFieldFocused, setPasswordFieldFocused] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordRules = getPasswordRules(signUpPassword);
  const passwordAllValid = passwordRules.every((r) => r.passed);

  function friendlyAuthError(message: string): string {
    if (message.toLowerCase().includes("invalid login credentials")) {
      return "Incorrect email or password. Please try again.";
    }
    if (message.toLowerCase().includes("email rate limit exceeded")) {
      return "Too many attempts right now — please wait a bit and try again.";
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
    navigate("/check-email");
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(signUpPassword)) {
      setPasswordChecklistUnlocked(true);
      setError("Your password doesn't meet the requirements above.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    setSubmitting(true);
    const { error } = await withMinDelay(signUp(signUpEmail, signUpPassword), 3000);

    setSubmitting(false);
    if (error) {
      setError(friendlyAuthError(error.message));
      return;
    }
    navigate("/check-email");
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
        className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{
          background: "var(--color-background)",
          color: "var(--color-text)",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* ============== DESKTOP / TABLET: split sliding panel ============== */}
        <div className="hidden md:block relative w-full max-w-3xl min-h-[520px] rounded-2xl overflow-hidden shadow-xl">
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 transition-opacity duration-500 ${
              isSignUp ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"
            }`}
            style={{ background: "var(--color-surface)" }}
          >
            <SignUpForm
              email={signUpEmail} setEmail={setSignUpEmail}
              password={signUpPassword} setPassword={setSignUpPassword}
              showPassword={showSignUpPassword} setShowPassword={setShowSignUpPassword}
              passwordRules={passwordRules} passwordAllValid={passwordAllValid}
              checklistUnlocked={passwordChecklistUnlocked} fieldFocused={passwordFieldFocused}
              setFieldFocused={setPasswordFieldFocused}
              agreedToTerms={agreedToTerms} setAgreedToTerms={setAgreedToTerms}
              onSubmit={handleSignUp} onOAuth={handleOAuth}
              submitting={submitting} error={isSignUp ? error : null} oauthError={oauthError}
            />
          </div>

          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center px-10 transition-opacity duration-500 ${
              !isSignUp ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"
            }`}
            style={{ background: "var(--color-surface)" }}
          >
            <SignInForm
              email={loginEmail} setEmail={setLoginEmail}
              password={loginPassword} setPassword={setLoginPassword}
              showPassword={showLoginPassword} setShowPassword={setShowLoginPassword}
              onSubmit={handleLogin} onOAuth={handleOAuth}
              submitting={submitting} error={!isSignUp ? error : null}
            />
          </div>

          <div
            className={`absolute top-0 w-1/2 h-full z-30 flex items-center justify-center transition-transform duration-700 ease-in-out ${
              isSignUp ? "translate-x-full" : "translate-x-0"
            }`}
            style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
          >
            <div className="text-center px-8 max-w-xs">
              <EmailIcon className="mx-auto mb-4 opacity-80" style={{ fontSize: 28 }} />
              <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                {isSignUp ? "Welcome Back!" : "Hello There!"}
              </h2>
              <p className="text-sm opacity-80 mb-6">
                {isSignUp
                  ? "Already have an account? Sign in to keep your streaks going."
                  : "New here? Create an account and start building better habits."}
              </p>
              <button
                onClick={() => { setError(null); setIsSignUp(!isSignUp); }}
                className="rounded-md px-6 py-2 border font-medium transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                style={{ borderColor: "var(--color-background)" }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>

        {/* ============== MOBILE: single stacked form ============== */}
        <div
          className="md:hidden w-full max-w-sm rounded-2xl p-6"
          style={{ background: "var(--color-surface)" }}
        >
          {isSignUp ? (
            <SignUpForm
              email={signUpEmail} setEmail={setSignUpEmail}
              password={signUpPassword} setPassword={setSignUpPassword}
              showPassword={showSignUpPassword} setShowPassword={setShowSignUpPassword}
              passwordRules={passwordRules} passwordAllValid={passwordAllValid}
              checklistUnlocked={passwordChecklistUnlocked} fieldFocused={passwordFieldFocused}
              setFieldFocused={setPasswordFieldFocused}
              agreedToTerms={agreedToTerms} setAgreedToTerms={setAgreedToTerms}
              onSubmit={handleSignUp} onOAuth={handleOAuth}
              submitting={submitting} error={isSignUp ? error : null} oauthError={oauthError}
            />
          ) : (
            <SignInForm
              email={loginEmail} setEmail={setLoginEmail}
              password={loginPassword} setPassword={setLoginPassword}
              showPassword={showLoginPassword} setShowPassword={setShowLoginPassword}
              onSubmit={handleLogin} onOAuth={handleOAuth}
              submitting={submitting} error={!isSignUp ? error : null}
            />
          )}

          <button
            onClick={() => { setError(null); setIsSignUp(!isSignUp); }}
            className="w-full text-center text-sm opacity-70 hover:opacity-100 transition-opacity mt-4"
          >
            {isSignUp ? "Already have an account? Sign In" : "New here? Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
}

interface SignInFormProps {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOAuth: (p: "google" | "github" | "x") => void;
  submitting: boolean; error: string | null;
}

function SignInForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, onSubmit, onOAuth, submitting, error }: SignInFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-xs mx-auto space-y-4">
      <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-headline)" }}>Sign In</h2>

      <div className="flex gap-3">
        <IconButton icon={<GoogleIcon fontSize="small" />} onClick={() => onOAuth("google")} label="Continue with Google" />
        <IconButton icon={<GitHubIcon fontSize="small" />} onClick={() => onOAuth("github")} label="Continue with GitHub" />
        <IconButton icon={<XIcon fontSize="small" />} onClick={() => onOAuth("x")} label="Continue with X" />
      </div>
      <p className="text-xs opacity-60">or use your email for login</p>

      <input
        type="email" required placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md px-3 py-2 border border-black/10 bg-white/60 focus:outline-none"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"} required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md pl-3 pr-10 py-2 border border-black/10 bg-white/60 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </button>
      </div>

      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-xs underline opacity-70 hover:opacity-100">
          Forgot password?
        </Link>
      </div>

      {error && <FormError message={error} />}

      <button
        type="submit" disabled={submitting}
        className="w-full rounded-md py-2 font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
        style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
      >
        {submitting ? "Please wait..." : "Sign In"}
      </button>
    </form>
  );
}

interface SignUpFormProps {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  passwordRules: { label: string; passed: boolean }[]; passwordAllValid: boolean;
  checklistUnlocked: boolean; fieldFocused: boolean; setFieldFocused: (v: boolean) => void;
  agreedToTerms: boolean; setAgreedToTerms: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOAuth: (p: "google" | "github" | "x") => void;
  submitting: boolean; error: string | null; oauthError: string | null;
}

function SignUpForm({
  email, setEmail, password, setPassword, showPassword, setShowPassword,
  passwordRules, passwordAllValid, checklistUnlocked, fieldFocused, setFieldFocused,
  agreedToTerms, setAgreedToTerms, onSubmit, onOAuth, submitting, error, oauthError,
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-xs mx-auto space-y-4">
      <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-headline)" }}>Create Account</h2>

      <div className="flex gap-3">
        <IconButton icon={<GoogleIcon fontSize="small" />} onClick={() => onOAuth("google")} label="Continue with Google" />
        <IconButton icon={<GitHubIcon fontSize="small" />} onClick={() => onOAuth("github")} label="Continue with GitHub" />
        <IconButton icon={<XIcon fontSize="small" />} onClick={() => onOAuth("x")} label="Continue with X" />
      </div>
      <p className="text-xs opacity-60">or use your email for registration</p>
      {oauthError && <FormError message={oauthError} />}

      <input
        type="email" required placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md px-3 py-2 border border-black/10 bg-white/60 focus:outline-none"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"} required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFieldFocused(true)}
          onBlur={() => setFieldFocused(false)}
          className="w-full rounded-md pl-3 pr-10 py-2 bg-white/60 focus:outline-none transition-colors"
          style={{
            border: checklistUnlocked
              ? `2px solid ${passwordAllValid ? "#22c55e" : "#ef4444"}`
              : "1px solid rgba(0,0,0,0.1)",
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </button>

        {checklistUnlocked && fieldFocused && (
          <ul
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-0 top-full mt-1 w-full rounded-md p-3 text-xs space-y-1 z-40 shadow-md bg-white"
          >
            {passwordRules.map((rule) => (
              <li key={rule.label} style={{ color: rule.passed ? "#16a34a" : "#dc2626" }}>
                {rule.passed ? "✓" : "✗"} {rule.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <FormError message={error} />}

      <label className="flex items-start gap-2 text-xs">
        <input
          type="checkbox" checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms & Conditions</a>{" "}
          and{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>
        </span>
      </label>

      <button
        type="submit" disabled={submitting || !agreedToTerms}
        className="w-full rounded-md py-2 font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
        style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
      >
        {submitting ? "Please wait..." : "Sign Up"}
      </button>
    </form>
  );
}

function IconButton({ icon, onClick, label }: { icon: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button" onClick={onClick}
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
