import { useState } from 'react';

const COOKIE_CONSENT_KEY = 'credwise-cookie-consent';

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // ignore storage errors
    }
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl border border-white/10 bg-dark-900/95 backdrop-blur-xl p-4 shadow-2xl"
    >
      <p className="text-xs text-dark-300 leading-relaxed">
        CredWise uses essential <code className="text-primary-300">httpOnly</code> cookies only when
        you sign in to save your score history. No third-party tracking cookies are used.
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleAccept}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
