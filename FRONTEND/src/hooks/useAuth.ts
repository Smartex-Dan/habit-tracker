import { useEffect, useState } from "react";
import type { Session, Provider } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthState {
  session: Session | null;
  loading: boolean;
}

/**
 * Tracks the current Supabase auth session, and stays in sync as the user
 * logs in, logs out, or their token refreshes in the background.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({ session: null, loading: true });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ session, loading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  /**
   * Updates the user's display name, stored in Supabase Auth's
   * user_metadata (not a separate app table — this is identity data,
   * so it lives with Auth, same reasoning as the auth/data split
   * everywhere else in this app).
   */
  const updateDisplayName = (displayName: string) =>
    supabase.auth.updateUser({ data: { display_name: displayName } });

  /**
   * Changes the account email. Supabase sends confirmation emails (to the
   * new address, and depending on project settings possibly the old one
   * too) before the change actually takes effect — it's not instant.
   */
  const updateEmail = (newEmail: string) =>
    supabase.auth.updateUser({ email: newEmail });

  /**
   * Changes the password. Re-verifies the CURRENT password first (via a
   * real sign-in attempt) before setting the new one — this is a
   * deliberate extra confirmation step, not something Supabase requires
   * on its own for an already-authenticated session.
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    const email = state.session?.user.email;
    if (!email) {
      return { error: { message: "No active session." } as { message: string } };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (verifyError) {
      return { error: { message: "Current password is incorrect." } };
    }

    return supabase.auth.updateUser({ password: newPassword });
  };

  /**
   * Kicks off a Supabase Auth OAuth flow (Google, GitHub, X, etc).
   * This redirects the browser away to the provider's login page, then back
   * to `redirectTo` (defaults to this app's root) once the user approves —
   * it does NOT return a session directly, since the redirect happens
   * immediately. `onAuthStateChange` (already wired up above) picks up the
   * resulting session automatically when the user lands back on the app.
   *
   * Requires the provider to be enabled in Supabase Dashboard -> Authentication
   * -> Providers, with a Client ID/Secret from that provider's developer
   * console. Without that, this will redirect to an error page instead of
   * the provider's login screen.
   */
  const signInWithOAuth = (provider: Provider) =>
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

  return {
    session: state.session,
    user: state.session?.user ?? null,
    isAuthenticated: !!state.session,
    loading: state.loading,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    updateDisplayName,
    updateEmail,
    changePassword,
  };
}