import type { NextRequest } from "next/server";

/** Reject cross-origin browser writes; forwarded headers are only trusted behind a configured canonical URL. */
export function validMutationOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const canonical = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    const expected = canonical ? new URL(canonical).origin : request.nextUrl.origin;
    return new URL(origin).origin === expected;
  } catch { return false; }
}
