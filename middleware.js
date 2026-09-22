import { next } from '@vercel/functions';

// ---------------------------------------------------------------------------
// AppLovin / Axon first-party cookie mirror
//
// The Axon pixel sets `_axwrt` from JavaScript. Browsers cap script-set cookies
// aggressively (Safari ITP trims them to ~7 days), which degrades match rates and
// costs attributed conversions — this is what the Pixel Helper reports as
// "The axwrt cookie is unset".
//
// AppLovin's fix: whenever a request carries `_axwrt`, the server echoes a
// server-set twin named `axwrt` (no underscore) with a one-year lifetime, scoped
// to the site domain prefixed with a period. Server-set cookies are not subject
// to the same trimming, so identification survives.
//
// Docs: https://support.applovin.com/en/growth/promoting-your-websites/api/axon-conversion-api
// ---------------------------------------------------------------------------

const COOKIE_NAME = 'axwrt';
const SOURCE_COOKIE = '_axwrt';
const ONE_YEAR_SECONDS = 31536000;

// The incoming value is attacker-influenceable (anyone who can set a cookie on the
// visitor's browser picks it) and we copy it straight into a Set-Cookie header, so
// only echo values that look like the identifier Axon actually issues — a UUID.
// Anything containing quotes, semicolons, spaces or control characters is dropped
// rather than sanitised, so a malformed id never reaches AppLovin either.
const VALID_VALUE = /^[A-Za-z0-9._~-]{1,128}$/;

// Cookies are only shared across subdomains for hosts we own. Anything else
// (vercel.app previews, localhost) gets a host-only cookie so testing still works.
const APEX_DOMAIN = 'peak-footwear.com';

/**
 * Reads a single cookie value out of a Cookie header.
 * Done by hand rather than splitting on ';' alone, since cookie values may
 * legitimately contain '=' and surrounding whitespace varies by client.
 */
function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(';')) {
    const segment = part.trim();
    if (!segment) continue;

    const eq = segment.indexOf('=');
    if (eq === -1) continue;

    if (segment.slice(0, eq).trim() === name) {
      return segment.slice(eq + 1).trim();
    }
  }
  return null;
}

/**
 * Only scope the cookie to the apex domain when the request is actually for
 * that domain (or a subdomain of it). Setting a Domain attribute the browser
 * does not consider a match makes it drop the cookie entirely.
 */
function cookieDomainFor(hostname) {
  if (hostname === APEX_DOMAIN || hostname.endsWith(`.${APEX_DOMAIN}`)) {
    return `.${APEX_DOMAIN}`;
  }
  return null;
}

export default function middleware(request) {
  const axwrt = readCookie(request.headers.get('cookie'), SOURCE_COOKIE);

  // No pixel cookie yet (first hit, or the pixel is blocked) — nothing to mirror.
  if (!axwrt) return next();

  // Malformed or hostile value — serve the page normally, just don't mirror it.
  if (!VALID_VALUE.test(axwrt)) return next();

  // Already mirrored with the same value; re-sending Set-Cookie on every request
  // would only add bytes.
  const existing = readCookie(request.headers.get('cookie'), COOKIE_NAME);
  if (existing === axwrt) return next();

  const { hostname, protocol } = new URL(request.url);
  const domain = cookieDomainFor(hostname);

  const attributes = [
    `${COOKIE_NAME}=${axwrt}`,
    'Path=/',
    `Max-Age=${ONE_YEAR_SECONDS}`,
    'SameSite=Lax',
  ];

  if (domain) attributes.push(`Domain=${domain}`);

  // Secure would make the cookie unusable over plain-HTTP local testing.
  if (protocol === 'https:') attributes.push('Secure');

  // Deliberately NOT HttpOnly: the Axon pixel reads this cookie from
  // document.cookie to stitch the identifier onto its events.
  return next({
    headers: { 'set-cookie': attributes.join('; ') },
  });
}

export const config = {
  // Page requests only. Static assets don't need the cookie and would just
  // burn middleware invocations.
  matcher: ['/((?!.*\\.(?:css|js|mjs|json|map|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|eot|mp4|webm|txt|xml)$).*)'],
};
