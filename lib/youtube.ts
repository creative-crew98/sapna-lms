/**
 * Extracts an 11-character YouTube video ID from common URL formats:
 *   https://www.youtube.com/watch?v=VIDEOID
 *   https://youtu.be/VIDEOID
 *   https://www.youtube.com/embed/VIDEOID
 *   https://www.youtube.com/shorts/VIDEOID
 * Returns null for anything that doesn't match — callers must not render an
 * iframe/link when this returns null, so unsanitized admin input can never
 * end up as an arbitrary iframe src (XSS / clickjacking vector).
 */
export function extractYouTubeId(input: string | undefined | null): string | null {
  if (!input) return null
  const trimmed = input.trim()

  // Bare 11-char ID pasted directly.
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

/** Builds a privacy-friendlier (youtube-nocookie.com), safe embed URL, or null if invalid. */
export function getYouTubeEmbedUrl(input: string | undefined | null): string | null {
  const id = extractYouTubeId(input)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}`
}

export interface YouTubeOEmbedResult {
  title: string
  thumbnailUrl: string
}

/**
 * Fetches title + thumbnail for a YouTube video via the public oEmbed
 * endpoint — no API key needed. Unlike the Data API's playlist/channel
 * listing, oEmbed works for *unlisted* videos too, since it only needs the
 * direct video URL (which is exactly what our recorded-course links are:
 * unlisted, shared only with enrolled students).
 *
 * Returns null if the URL isn't a recognizable YouTube link, or if the
 * video is private/deleted/otherwise unreachable.
 */
export async function fetchYouTubeOEmbed(
  input: string | undefined | null,
): Promise<YouTubeOEmbedResult | null> {
  const id = extractYouTubeId(input)
  if (!id) return null

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${id}`,
      )}&format=json`,
    )
    if (!res.ok) return null
    const data = await res.json()
    if (typeof data.title !== 'string') return null
    return {
      title: data.title,
      thumbnailUrl:
        typeof data.thumbnail_url === 'string'
          ? data.thumbnail_url
          : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }
  } catch {
    // Network error, blocked request, private/removed video, etc.
    return null
  }
}
