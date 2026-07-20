# Changes in this round

## 1. Razorpay
- **Fixed a real bug**: `receipt` sent to `orders.create()` combined
  `receipt_` + Firebase UID (28 chars) + programId + timestamp — comfortably
  over Razorpay's 40-char limit, so **every order creation call was failing**.
  Replaced with a short hashed receipt.
- Added `/api/payment/webhook` as a reliability net: if the browser closes
  right after payment but before the client-side `/api/payment/verify` call
  finishes, the student would have paid with no enrollment created. The
  webhook listens for Razorpay's `payment.captured` event and completes
  enrollment idempotently either way.
  - In Razorpay Dashboard → Settings → Webhooks, add
    `https://yourdomain.com/api/payment/webhook`, subscribe to
    `payment.captured`, and put the generated secret in
    `RAZORPAY_WEBHOOK_SECRET`.
- Added basic input-type validation on `create-order`.

## 2. Course video on dashboard
- `Program` now has an optional `introVideoUrl` field (YouTube URL).
- Admin → Programs → edit/create form has a new "Course video (YouTube URL)"
  field.
- `/dashboard/programs` embeds that course's video (safe `youtube-nocookie.com`
  iframe) right under each enrolled program's header. Invalid/empty URLs
  never render an iframe (URL is validated with a strict regex before being
  used as an iframe `src`, which also blocks it being used for injection).

## 3. Removed unused things
- npm packages never imported anywhere: `react-firebase-hooks`,
  `react-hook-form`, `@hookform/resolvers`, `zod`, `framer-motion`, `clsx`,
  `lucide-react` (the app uses its own `components/icons.tsx`). Fewer
  dependencies = smaller install, faster builds, smaller supply-chain
  surface.
- Unused default Next.js template assets: `public/{next,vercel,window,globe,file}.svg`.
- Dead leftover homepage `app/landing/page.tsx` (superseded by the real
  modular homepage at `app/(public)/page.tsx`, not linked from anywhere).
- Stray scratch notes `folder-structure.txt`, `nextjs-structure.txt`.

## 4. Security hardening
- **Added `firestore.rules` + `firebase.json` — these did not exist in the
  project at all.** Without them, Firestore access is governed entirely by
  whatever was manually set in the Firebase console (often left wide open in
  "test mode"), meaning in the worst case any visitor could read/write any
  document — including making themselves admin or granting themselves free
  enrollments. The new rules:
  - Users can only read/edit their own profile, and can never change their
    own `role` or `enrolledPrograms` (only an admin or the server can).
  - `enrollments`/`sessions` are readable only by their owner or an admin,
    and writable only by an admin — students can't grant themselves a
    program.
  - `resources` (course content/videos) require sign-in to read, so the
    paywalled content can't be scraped anonymously.
  - `payments`/`otps` are fully denied to clients — those are only ever
    touched server-side via the Admin SDK.
  - **You must deploy this**: `firebase deploy --only firestore:rules`
    (or paste `firestore.rules` into Firebase Console → Firestore →
    Rules). It does nothing sitting in the repo unpublished.
- Fixed **HTML/email injection**: contact form and OTP emails interpolated
  the visitor's name/message directly into HTML email templates
  unescaped — someone could submit a "name" containing markup/links to
  tamper with the email Sapna receives. All user-supplied fields are now
  HTML-escaped before being placed in email templates.
- Added **rate limiting** to `/api/send-otp`, `/api/verify-otp`, and
  `/api/contact` (in-memory, per IP and per email) to blunt spam and,
  importantly, **OTP brute-forcing** — a 6-digit code has only 1M
  combinations and previously had zero attempt limit.
- Added input length/format validation on the contact form.
- Moved `firebase-admin` from `devDependencies` to `dependencies` (previous
  round) — some hosts skip devDependencies in production installs, which
  would have silently broken every payment/OTP/admin API route after
  deploy.
- Real secrets (`.env.local`, `serviceAccountKey.json`) were removed from
  the repo in the previous round — reminder to rotate them if you haven't
  already, since they were exposed in the uploaded zip.

## Still worth doing (not changed here, bigger scope)
- The in-memory rate limiter resets on server restart and doesn't share
  state across multiple server instances. Fine for a small site; for real
  scale, swap in Upstash Redis / Vercel KV rate limiting.
- `middleware.ts`'s `firebase-token` cookie is just a presence flag, not a
  verified session — real enforcement now correctly lives in Firestore
  rules + the real Firebase Auth SDK, but if you want defense-in-depth here
  too, it can be upgraded to a signed Firebase session cookie
  (`adminAuth.createSessionCookie`) verified server-side.

## Round 3 — design-system alignment (admin + student dashboard) + TypeScript cleanup

**Colors.** The dashboard and admin panel were mixing generic Tailwind
colors (`rose`, `amber`, `green`, `red`, `blue`, `gray`, and a nonexistent
`burgundy`/`gold` scale that silently rendered as no style at all) instead
of the site's actual pink/magenta brand palette defined in `globals.css`.
- Added proper `success` / `warning` / `error` / `info` color scales to
  `globals.css` (both as `--color-*` theme tokens for Tailwind utilities,
  and as plain `--x` vars for inline `style={{ }}` use where still needed).
- Replaced every off-brand color class across `app/(admin)`, `app/(dashboard)`,
  `components/admin`, `components/dashboard` with the matching brand/state
  token (`rose→pink`, `burgundy→magenta`, `gold→pink`, `green→success`,
  `red→error`, `amber→warning`, `blue→info`, `gray→ink`).
- Fixed a chart color hex (`#c4878a`) that was a typo'd near-miss of the
  actual brand pink (`#c4388a`) — chart legend now matches the real palette.
- (The public marketing pages — `app/(public)/courses/[slug]/page.tsx` —
  still have a few `rose-*` classes; out of scope for this round since only
  the dashboard/admin panel was requested, flagging in case you want it
  matched too.)

**Inline CSS.** Went from **108 inline `style={{...}}` usages down to 14**
across the dashboard/admin. What's left is only genuinely dynamic values
that can't be static Tailwind classes (progress-bar widths driven by real
percentages, a toggle switch's on/off position, chart segment colors from
data). Concretely:
- `ProgramForm`, `ResourceForm`, `SessionForm` each hand-rolled their own
  `inputStyle`/`cardStyle` objects and `focusInput`/`blurInput` JS handlers
  that exactly duplicated the existing `.input`/`.card` CSS classes
  (including focus states) — removed all of it in favor of the classes.
- Replaced hand-rolled buttons (inline style + `onMouseEnter`/`onMouseLeave`
  JS toggling colors) with the existing `.btn-primary`/`.btn-ghost`/`.btn-soft`
  classes, which already define the exact same hover states in CSS.
- Replaced several other JS-driven hover effects (sidebar links, topbar
  toggle buttons, sign-out buttons, resource dropzone) with Tailwind
  `hover:` classes — removes JS state-mutation from render paths entirely.
- **Found and fixed a real bug this introduced a script run of mine
  accidentally caused**: a duplicate `className` attribute on the mobile
  sidebar overlay (two `className=` props on one element — the second
  silently wins in JSX, so the first was being dropped). Scanned the whole
  app afterward to confirm it was the only instance.
- Converted a couple of dynamic-looking but actually-static cases too:
  `aspectRatio: '16 / 9'` → Tailwind's built-in `aspect-video`; icon-padding
  `paddingLeft: '44px'` → `pl-11` (exact match in Tailwind's spacing scale).
- Removed a stray `borderRadius: '6px'` inline override that was fighting
  the `.card` class's own 16px radius on several admin pages (looked like
  leftover/accidental styling, now consistent with every other card).

**TypeScript.**
- `types/index.ts`: `createdAt`/`date`/`startDate` fields were typed `any`.
  Added a proper `FirestoreDate = Timestamp | Date | null` union and used
  it everywhere, then fixed the couple of call sites that needed real
  narrowing (`instanceof Timestamp`) instead of just assuming `.toDate()`
  exists.
- `Resource.type` was `'pdf' | 'audio' | 'video'` but the app uses a 4th
  type, `'link'`, throughout `ResourceForm` and the dashboard resources
  page — TypeScript couldn't have caught a typo there. Added `'link'`.
- `ResourceForm`/`SessionForm` props were typed `initial?: any`; changed to
  `Partial<Resource>`/`Partial<Session>` to match how `ProgramForm` already
  did it.
- `ensureUserDoc(user: any, ...)` in `lib/firebase/auth.ts` → now takes
  Firebase's real `User` type.

## Round 4 — skeleton loading states + performance/smooth scroll

**Skeletons.** Most pages already had proper skeleton loaders (`.skeleton`
class with shimmer animation, already defined in `globals.css`) — good sign
the app was mostly built this way. Two spots still showed a plain spinner
instead:
- `app/(admin)/layout.tsx` and `app/(dashboard)/layout.tsx` — the outer
  auth-check screen (shown while Firebase resolves who's logged in, before
  we even know if it's a student or admin). Replaced the spinner with a
  **shell skeleton** that mirrors the real sidebar + topbar + content grid,
  so there's no layout jump when the real UI mounts a moment later — this
  is the main perceived-performance win skeletons are for.

**Smooth scroll.**
- `html { scroll-behavior: smooth }` was already global, but it only
  affects the page itself — it does *not* apply to the app's actual
  scrolling containers, since the dashboard/admin layouts scroll an inner
  `overflow-y-auto` `<main>` (sidebar stays fixed) rather than the whole
  page. Added `scroll-smooth` to every one of those inner scroll containers
  (both sidebars' nav, both main content areas, the students-page activity
  list) so in-page scrolling (e.g. jumping to an anchor) is smooth there
  too.

**Performance.**
- `app/(admin)/admin/page.tsx` (the analytics dashboard — the heaviest
  page, with 6+ chart datasets built from `.filter()`/`.map()` over the
  full students/enrollments/sessions arrays) was recomputing all of that
  on **every render**, including re-renders from unrelated state changes.
  Wrapped the whole derived-analytics block in `useMemo`, keyed on the
  three source arrays, so it only recalculates when the underlying data
  actually changes.
- Fixed two variables (`now`, `thisMonthEnroll`) that were still
  referenced in JSX after being moved inside that `useMemo` — re-exposed
  them correctly so nothing broke.

Full project re-scanned for balanced braces/parens and duplicate JSX
attributes afterward — clean.

