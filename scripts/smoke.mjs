// CredWise smoke test: verifies the frontend serves, key buttons work, and the API is healthy.
const BASE = process.env.SMOKE_URL || 'http://localhost:3000';
import { chromium } from 'playwright';

let failed = 0;
const check = (name, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
  if (!ok) failed++;
};

const res = await fetch(`${BASE}/`);
check('homepage returns 200', res.status === 200);
const html = await res.text();
check('page title is CredWise', /CredWise/.test(html));

const health = await fetch(`${BASE}/api/health`)
  .then((response) => response.json())
  .catch(() => null);
check('backend /api/health ok', health?.status === 'ok');

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE, { waitUntil: 'networkidle' });

const primary = page
  .locator('button:has-text("Get Started Free"), a:has-text("Get Started Free")')
  .first();
check('hero primary button exists', (await primary.count()) > 0);
if (await primary.count()) {
  await primary.click({ timeout: 5000 });
  await page.waitForTimeout(900);
  const scrolledToChecker = await page.evaluate(() => {
    const checker = document.getElementById('checker');
    if (!checker) return false;
    const rect = checker.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  });
  check('hero primary button scrolls to the score checker', scrolledToChecker);
}

const learn = page.locator('a:has-text("Learn More")').first();
await learn.scrollIntoViewIfNeeded();
await learn.click({ timeout: 5000 });
await page.waitForTimeout(900);
const scrolled = await page.evaluate(() => window.scrollY > 100);
check('Learn More button scrolls to features', scrolled);

await browser.close();
console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed ✅');
process.exit(failed ? 1 : 0);
