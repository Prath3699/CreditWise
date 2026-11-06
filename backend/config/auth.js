export const AUTH_COOKIE = 'credwise_token';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function sameSite() {
  if (process.env.COOKIE_SAMESITE) return process.env.COOKIE_SAMESITE;
  return process.env.NODE_ENV === 'production' ? 'none' : 'lax';
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: sameSite(),
    maxAge: SEVEN_DAYS_MS,
    path: '/',
  };
}

export function clearCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: sameSite(),
    path: '/',
  };
}
