import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-dark-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CredWise
        </a>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-sm text-dark-400 mt-0.5">Last updated: November 2026</p>
          </div>
        </div>

        <div className="prose-dark space-y-10 text-dark-300 leading-relaxed">
          <p>
            CredWise (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to
            protecting your privacy. This policy explains what data we collect, how we use it, and
            your rights.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">1. Data We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-dark-300">
              <li>
                <strong className="text-white">Account data</strong> — email address and hashed
                password when you register.
              </li>
              <li>
                <strong className="text-white">Score inputs</strong> — the financial figures you
                enter (payment history, utilisation, etc.) to calculate your estimate.
              </li>
              <li>
                <strong className="text-white">Score history</strong> — saved estimates stored in
                your account so you can track changes over time.
              </li>
              <li>
                <strong className="text-white">Usage data</strong> — anonymised page-view and
                interaction events collected via Plausible Analytics (cookieless; no personal
                identifiers).
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 text-dark-300">
              <li>To create and authenticate your account.</li>
              <li>To calculate and store your credit-score estimates.</li>
              <li>To improve the CredWise product based on aggregate usage patterns.</li>
              <li>We do not sell, rent, or share your personal data with third parties.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">3. Cookies &amp; Tracking</h2>
            <p>
              CredWise uses a single <strong className="text-white">httpOnly session cookie</strong>{' '}
              to keep you logged in. No advertising or cross-site tracking cookies are used.
              Plausible Analytics is cookieless and GDPR-compliant by design.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
            <p>
              Account data is retained while your account is active. You may delete your account at
              any time, after which all personal data is removed within 30 days.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">5. Security</h2>
            <p>
              Passwords are hashed with bcrypt. All traffic is served over HTTPS with HSTS headers.
              JWTs are stored in httpOnly cookies to prevent XSS access.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. To exercise these
              rights, contact us at the address below.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
            <p>
              Questions about this policy? Email us at{' '}
              <a
                href="mailto:privacy@credwise.example.com"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                privacy@credwise.example.com
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-white/5 flex gap-6">
          <a href="/terms" className="text-sm text-dark-400 hover:text-white transition-colors">
            Terms of Service →
          </a>
          <a href="/" className="text-sm text-dark-400 hover:text-white transition-colors">
            Back to Home →
          </a>
        </div>
      </div>
    </section>
  );
}
