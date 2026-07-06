import { createClient } from "@supabase/supabase-js";

// Supabase is used here ONLY for authentication (sign up, log in, session
// management). All habit/check-in data goes through the Django API
// (see lib/api.ts), which is what actually talks to the Supabase database.
// This split matches the architecture diagram: React -> Django -> Supabase,
// with Supabase Auth issuing the JWT that Django verifies on every request.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
