// CredWise smoke test: verifies frontend serves, buttons clickable, API healthy.
const BASE = process.env.SMOKE_URL || 'http://localhost:3000';
import { chromium } from 'playwright';

let failed = 0;
const check = (name, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`); if (!ok) failed++; };

const res = await fetch(`${BASE}/`);
check('homepage returns 200', res.status === 200);
const html = await res.text();
check('page title is CredWise', /CredWise/.test(html));

const health = await fetch(`${BASE}/api/health`).then(r => r.json()).catch(() => null);
check('backend /api/health ok', health?.status === 'ok');

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE, { waitUntil: 'networkidle' });

const primary = page.locator('button:has-text("Get Started Free"), a:has-text("Get Started Free")').first();
if (await primary.count()) {
  await primary.click({ timeout: 5000 });
  const modalVisible = await page.locator('div[role="dialog"]').isVisible().catch(() => false);
  check('hero primary button clickable (opens sign-in modal)', modalVisible);
} else {
  const alt = page.locator('text=/Check My Score/i').first();
  await alt.click({ timeout: 5000 });
  check('hero primary button clickable', true);
}

// Close the sign-in modal first so it doesn't block clicks
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
const learn = page.locator('a:has-text("Learn More")').first();
await learn.scrollIntoViewIfNeeded();
await learn.click({ timeout: 5000 });
await page.waitForTimeout(600);
const scrolled = await page.evaluate(() => window.scrollY > 100);
check('Learn More button scrolls to features', scrolled);

await browser.close();
console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed ✅');
process.exit(failed ? 1 : 0);
