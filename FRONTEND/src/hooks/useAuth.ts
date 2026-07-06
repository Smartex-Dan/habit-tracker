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
   * Kicks off a Supabase Auth OAuth flow (Google, GitHub, LinkedIn, etc).
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
        redirectTo: window.location.origin,
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
  };
}