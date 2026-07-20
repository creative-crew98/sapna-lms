/**
 * Escapes HTML-significant characters so user-supplied text can be safely
 * interpolated into HTML email templates without allowing markup/script
 * injection (e.g. a "name" field containing `<img src=x onerror=...>` or a
 * fake footer/link designed to phish whoever reads the email).
 */
export function escapeHtml(input: unknown): string {
  const str = String(input ?? '')
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Very small in-memory fixed-window rate limiter, good enough to blunt
 * casual abuse/spam of public endpoints (OTP email, contact form) on a
 * single server instance.
 *
 * NOTE: this resets on cold start and does NOT share state across multiple
 * serverless instances/regions. For real production traffic on a platform
 * that scales horizontally (Vercel, etc.), replace this with a shared store
 * such as Upstash Redis / Vercel KV rate limiting.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  bucket.count += 1
  return bucket.count > limit
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}
