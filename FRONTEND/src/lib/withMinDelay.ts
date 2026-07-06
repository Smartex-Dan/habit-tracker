/**
 * Ensures a promise takes at least `ms` milliseconds to resolve, even if
 * the real work finishes faster. This exists purely for UX consistency —
 * your "3 second loading screen" default style — so the loading state
 * doesn't flash instantly when the backend responds fast, and stays
 * consistent regardless of network speed.
 *
 * Usage:
 *   const { error } = await withMinDelay(signIn(email, password), 3000);
 */
export async function withMinDelay<T>(promise: Promise<T>, ms: number): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
  return result;
}