import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="text-sm text-dark-400 mt-0.5">Last updated: November 2026</p>
          </div>
        </div>

        <div className="prose-dark space-y-10 text-dark-300 leading-relaxed">
          <p>
            Please read these Terms of Service carefully before using CredWise. By accessing or
            using the service you agree to be bound by these terms.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using any part of CredWise, you confirm that you are at
              least 18 years old and agree to these Terms and our{' '}
              <a href="/privacy" className="text-primary-400 hover:text-primary-300 underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">2. Educational Purpose Only</h2>
            <p>
              CredWise provides <strong className="text-white">estimated</strong> credit scores
              based on the inputs you provide. These estimates are for educational and informational
              purposes only. They are{' '}
              <strong className="text-white">not official credit scores</strong> as reported by
              Equifax, Experian, TransUnion, or any other credit bureau.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">3. No Financial Advice</h2>
            <p>
              Nothing on CredWise constitutes financial, legal, or professional advice. The
              &ldquo;Next Best Steps&rdquo; and improvement tips are general guidance only. Always
              consult a qualified financial adviser before making credit-related decisions.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">4. Account Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-dark-300">
              <li>You are responsible for maintaining the confidentiality of your password.</li>
              <li>You must not share your account with others.</li>
              <li>
                You must not use CredWise to submit false or misleading information with the intent
                to deceive.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All content, design, code, and branding on CredWise are owned by or licensed to
              CredWise. You may not reproduce, distribute, or create derivative works without
              explicit written permission.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, CredWise shall not be liable for any indirect,
              incidental, consequential, or punitive damages arising from your use of the service or
              reliance on any score estimate, tip, or simulation result.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of CredWise after changes are
              posted constitutes acceptance of the revised Terms.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>
              Questions about these Terms? Email us at{' '}
              <a
                href="mailto:legal@credwise.example.com"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                legal@credwise.example.com
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-white/5 flex gap-6">
          <a href="/privacy" className="text-sm text-dark-400 hover:text-white transition-colors">
            Privacy Policy →
          </a>
          <a href="/" className="text-sm text-dark-400 hover:text-white transition-colors">
            Back to Home →
          </a>
        </div>
      </div>
    </section>
  );
}
