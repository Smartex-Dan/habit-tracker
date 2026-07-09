import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useHabits } from "../hooks/useHabits";
import { useFileUpload } from "../hooks/useFileUpload";
import { ProgressBar } from "../components/ProgressBar";
import { FileDropZone } from "../components/FileDropZone";
import { Navbar } from "../components/Navbar";
import { api } from "../lib/api";
import { getPasswordRules, isPasswordValid } from "../lib/passwordRules";

interface AvatarUploadResponse {
  avatar_url: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateDisplayName, updateEmail, changePassword, signOut } = useAuth();
  const { data: habits } = useHabits();
  const { upload, progress, uploading, error: uploadError } = useFileUpload({
    path: "/profile/avatar",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFileSelected(file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const result = (await upload(file)) as AvatarUploadResponse;
      setAvatarUrl(result.avatar_url);
    } catch {
      // error captured by useFileUpload's `error`
    }
  }

  const displayedImage = avatarUrl || previewUrl;
  const displayName = user?.user_metadata?.display_name as string | undefined;

  const totalHabits = habits?.length ?? 0;
  const bestStreak = habits && habits.length > 0
    ? Math.max(...habits.map((h) => h.longest_streak))
    : 0;
  const activeStreaks = habits?.filter((h) => h.current_streak > 0).length ?? 0;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">
        {/* ---------- Avatar + identity summary ---------- */}
        <div className="flex flex-col items-center text-center">
          <div
            className="w-28 h-28 rounded-full overflow-hidden mb-4 flex items-center justify-center"
            style={{ background: "var(--color-surface)" }}
          >
            {displayedImage ? (
              <img src={displayedImage} alt="Profile avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
                {(displayName || user?.email || "?")[0].toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-headline)", color: "var(--color-text)" }}>
            {displayName || user?.email}
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--color-text)" }}>
            {user?.email}
          </p>
          {memberSince && (
            <p className="text-xs opacity-50 mt-1" style={{ color: "var(--color-text)" }}>
              Member since {memberSince}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 rounded-lg border p-4" style={{ borderColor: "var(--color-surface)" }}>
          <StatCard label="Habits" value={totalHabits} />
          <StatCard label="Best streak" value={bestStreak} />
          <StatCard label="Active streaks" value={activeStreaks} />
        </div>

        {/* ---------- Avatar upload ---------- */}
        <Section title="Profile photo">
          <AnimatePresence mode="wait">
            {!uploading ? (
              <motion.div key="dropzone" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <FileDropZone
                  onFileSelected={handleFileSelected}
                  label={displayedImage ? "Drag & drop a new photo, or click to browse" : "Drag & drop your profile photo, or click to browse"}
                />
              </motion.div>
            ) : (
              <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="py-6">
                <ProgressBar percent={progress} label="Uploading avatar" />
              </motion.div>
            )}
          </AnimatePresence>
          {uploadError && <ErrorText>{uploadError}</ErrorText>}
        </Section>

        {/* ---------- Display name ---------- */}
        <DisplayNameSection currentName={displayName} onSave={updateDisplayName} />

        {/* ---------- Change email ---------- */}
        <ChangeEmailSection currentEmail={user?.email} onSave={updateEmail} />

        {/* ---------- Change password ---------- */}
        <ChangePasswordSection onSave={changePassword} />

        {/* ---------- Danger zone: delete account ---------- */}
        <DeleteAccountSection onDeleted={() => { signOut(); navigate("/"); }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>{title}</p>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-xl font-semibold" style={{ color: "var(--color-primary)" }}>{value}</p>
      <p className="text-xs opacity-60" style={{ color: "var(--color-text)" }}>{label}</p>
    </div>
  );
}

function ErrorText({ children }: { children: string }) {
  return (
    <p className="text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 mt-2">
      {children}
    </p>
  );
}

function SuccessText({ children }: { children: string }) {
  return (
    <p className="text-sm text-green-700 bg-green-500/10 border border-green-500/30 rounded-md px-3 py-2 mt-2">
      {children}
    </p>
  );
}

function inputClass() {
  return "w-full rounded-md px-3 py-2 border bg-transparent";
}

// ---------------------------------------------------------------------------

function DisplayNameSection({ currentName, onSave }: { currentName?: string; onSave: (name: string) => Promise<{ error: unknown }> }) {
  const [name, setName] = useState(currentName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await onSave(name.trim());
    setSaving(false);
    if (error) {
      setError((error as { message: string }).message);
      return;
    }
    setSuccess(true);
  }

  return (
    <Section title="Display name">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass()} style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
        />
        <button
          type="submit" disabled={saving || !name.trim()}
          className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
          style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>Display name updated.</SuccessText>}
    </Section>
  );
}

function ChangeEmailSection({ currentEmail, onSave }: { currentEmail?: string; onSave: (email: string) => Promise<{ error: unknown }> }) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!email.trim()) return;
    setSaving(true);
    const { error } = await onSave(email.trim());
    setSaving(false);
    if (error) {
      setError((error as { message: string }).message);
      return;
    }
    setSuccess(true);
    setEmail("");
  }

  return (
    <Section title="Email address">
      <p className="text-xs opacity-60 mb-2" style={{ color: "var(--color-text)" }}>
        Current: {currentEmail}. Changing this sends a confirmation link to the new address — the change won't take effect until you click it.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="new-email@example.com"
          className={inputClass()} style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
        />
        <button
          type="submit" disabled={saving || !email.trim()}
          className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
          style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
        >
          {saving ? "Sending..." : "Update"}
        </button>
      </form>
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>Confirmation email sent — check your inbox.</SuccessText>}
    </Section>
  );
}

function ChangePasswordSection({ onSave }: { onSave: (current: string, next: string) => Promise<{ error: unknown }> }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checklistUnlocked, setChecklistUnlocked] = useState(false);
  const [focused, setFocused] = useState(false);

  const rules = getPasswordRules(newPassword);
  const allValid = rules.every((r) => r.passed);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isPasswordValid(newPassword)) {
      setChecklistUnlocked(true);
      setError("Your new password doesn't meet the requirements above.");
      return;
    }

    setSaving(true);
    const { error } = await onSave(currentPassword, newPassword);
    setSaving(false);

    if (error) {
      setError((error as { message: string }).message);
      return;
    }
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setChecklistUnlocked(false);
  }

  return (
    <Section title="Change password">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className={inputClass()} style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
        />

        <div className="relative">
          <input
            type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="New password"
            className="w-full rounded-md px-3 py-2 bg-transparent transition-colors"
            style={{
              border: checklistUnlocked
                ? `2px solid ${allValid ? "#22c55e" : "#ef4444"}`
                : "1px solid var(--color-surface)",
              color: "var(--color-text)",
            }}
          />
          {checklistUnlocked && focused && (
            <ul onMouseDown={(e) => e.preventDefault()} className="absolute left-0 top-full mt-1 w-full rounded-md p-3 text-xs space-y-1 z-40 shadow-md bg-white">
              {rules.map((rule) => (
                <li key={rule.label} style={{ color: rule.passed ? "#16a34a" : "#dc2626" }}>
                  {rule.passed ? "✓" : "✗"} {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <ErrorText>{error}</ErrorText>}
        {success && <SuccessText>Password updated.</SuccessText>}

        <button
          type="submit" disabled={saving || !currentPassword || !newPassword}
          className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition hover:brightness-110 active:brightness-95"
          style={{ background: "var(--color-primary)", color: "var(--color-background)" }}
        >
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </Section>
  );
}

function DeleteAccountSection({ onDeleted }: { onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDeleting(true);
    try {
      await api.profile.deleteAccount(password);
      onDeleted();
    } catch (err) {
      setDeleting(false);
      setError(err instanceof Error ? err.message : "Failed to delete account.");
    }
  }

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "#ef4444" }}>
      <p className="text-sm font-medium mb-1" style={{ color: "#ef4444" }}>Danger zone</p>
      <p className="text-xs opacity-70 mb-3" style={{ color: "var(--color-text)" }}>
        Deleting your account permanently removes your habits, goals, to-dos, and profile. This cannot be undone.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-md px-4 py-2 text-sm font-medium border transition hover:bg-red-50"
          style={{ borderColor: "#ef4444", color: "#ef4444" }}
        >
          Delete my account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="space-y-3">
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to confirm"
            className={inputClass()} style={{ borderColor: "#ef4444", color: "var(--color-text)" }}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <div className="flex gap-2">
            <button
              type="submit" disabled={deleting || !password}
              className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: "#ef4444", color: "white" }}
            >
              {deleting ? "Deleting..." : "Permanently delete"}
            </button>
            <button
              type="button" onClick={() => { setConfirming(false); setPassword(""); setError(null); }}
              className="rounded-md px-4 py-2 text-sm font-medium border"
              style={{ borderColor: "var(--color-surface)", color: "var(--color-text)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
