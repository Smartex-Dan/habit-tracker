export function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{
        background: "var(--color-background)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1
            className="text-3xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm opacity-60">Last updated: July 2026</p>
        </div>

        <p>
          This Privacy Policy explains how Habit Tracker ("the app," "we,"
          "us") collects, uses, and protects information when you use the
          app. Habit Tracker is a personal habit and goal-tracking
          application built as a software development portfolio project.
        </p>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <p>We collect the following information to provide the app's core functionality:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Account information:</strong> your email address, provided directly or via a third-party sign-in provider (Google, GitHub, or X).</li>
            <li><strong>Third-party sign-in data:</strong> if you sign in with Google, GitHub, or X, we receive basic profile information (such as your email address) needed to create and identify your account. We do not access your posts, contacts, files, or any other data from these providers, and we do not post or act on your behalf on any of them.</li>
            <li><strong>Habit and check-in data:</strong> the habits you create and the check-ins you log, used solely to power the app's streak-tracking and heatmap features.</li>
            <li><strong>Profile picture:</strong> if you choose to upload one, it's stored and displayed as part of your profile.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">2. How We Use Information</h2>
          <p>We use the information above only to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Authenticate you and maintain your account session</li>
            <li>Store and display your habits, check-ins, streaks, and profile</li>
            <li>Maintain and improve the app's functionality</li>
          </ul>
          <p className="mt-2">We do not sell, rent, or share your personal data with third parties for advertising or marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">3. Data Storage</h2>
          <p>
            Your data is stored using Supabase (authentication, database,
            and file storage infrastructure). Data is transmitted over
            encrypted connections (HTTPS).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">4. Third-Party Sign-In Providers</h2>
          <p>
            If you choose to sign in using Google, GitHub, or X, those
            providers handle the authentication process directly. We only
            receive the minimum information needed to identify your
            account (typically your email address). Please refer to each
            provider's own privacy policy for details on how they handle
            your data during sign-in.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">5. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting us using the details
            below. Deleting your account removes your habits, check-ins,
            and profile information from our systems.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">6. Children's Privacy</h2>
          <p>
            This app is not directed at children under 13, and we do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued
            use of the app after changes are posted constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">8. Contact</h2>
          <p>
            Questions about this Privacy Policy can be directed to:{" "}
            <a href="mailto:adeoyedan100@gmail.com" className="underline">
              adeoyedan100@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}