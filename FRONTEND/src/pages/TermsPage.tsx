export function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-sm opacity-60">Last updated: July 2026</p>
        </div>

        <p>
          These Terms & Conditions ("Terms") govern your use of Habit
          Tracker ("the app," "we," "us"). By creating an account or using
          the app, you agree to these Terms.
        </p>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">1. Description of Service</h2>
          <p>
            Habit Tracker is a personal habit and goal-tracking
            application that lets users create habits, log daily
            check-ins, and view streaks and progress over time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">2. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of
            your account credentials and for all activity that occurs
            under your account. If you sign in via a third-party provider
            (Google, GitHub, or X), you are also subject to that
            provider's own terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Use the app for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to other users' accounts or data</li>
            <li>Upload content (including profile pictures) that is illegal, abusive, or infringes on others' rights</li>
            <li>Interfere with or disrupt the app's infrastructure or servers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">4. Intellectual Property</h2>
          <p>
            The app's design, code, and branding are the property of its
            developer. Your own habit and check-in data remains yours —
            we don't claim ownership over the content you create within
            the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">5. Disclaimer of Warranties</h2>
          <p>
            The app is provided "as is," without warranties of any kind,
            express or implied. As a personal project, we do not guarantee
            uninterrupted availability, error-free operation, or that data
            will never be lost.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we are not liable for
            any indirect, incidental, or consequential damages arising
            from your use of the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">7. Termination</h2>
          <p>
            You may stop using the app and request account deletion at
            any time. We reserve the right to suspend or terminate
            accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">8. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of
            the app after changes are posted constitutes acceptance of
            the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mt-6 mb-2">9. Contact</h2>
          <p>
            Questions about these Terms can be directed to:{" "}
            <a href="mailto:adeoyedan100@gmail.com" className="underline">
              adeoyedan100@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}