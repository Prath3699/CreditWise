export const AUTH_COOKIE = 'credwise_token';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const isProduction = () => process.env.NODE_ENV === 'production';

// One place decides the cookie security policy.
// SameSite=None is only valid with Secure, so reject the combination early.
function resolveSameSite() {
  const sameSite = process.env.COOKIE_SAMESITE || (isProduction() ? 'none' : 'lax');
  const secure = isProduction();

  if (sameSite.toLowerCase() === 'none' && !secure) {
    throw new Error('COOKIE_SAMESITE=none requires NODE_ENV=production (Secure cookies)');
  }

  return sameSite;
}

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: resolveSameSite(),
  path: '/',
});

export function cookieOptions() {
  return { ...baseCookieOptions(), maxAge: SEVEN_DAYS_MS };
}

export function clearCookieOptions() {
  return baseCookieOptions();
}
