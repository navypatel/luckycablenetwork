import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, currentStaff, revokeCurrentSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/auth";
import { isAdminConfigured } from "@/lib/admin/config";
import { validMutationOrigin } from "@/lib/admin/origin";
import { privateJson } from "@/lib/admin/response";
import { loginAddress } from "@/lib/admin/login-address";

export const runtime = "nodejs";
const loginInput = z.object({ email: z.email().max(254), password: z.string().min(1).max(1024) });

export async function GET() {
  if (!isAdminConfigured()) return privateJson({ error: "Management storage is not configured." }, 503);
  try {
    const staff = await currentStaff();
    return staff ? privateJson({ staff }, 200) : privateJson({ error: "Authentication required." }, 401);
  } catch { return privateJson({ error: "Management service is temporarily unavailable." }, 503); }
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) return privateJson({ error: "Management storage is not configured." }, 503);
  if (!validMutationOrigin(request)) return privateJson({ error: "Origin not allowed." }, 403);
  const input = loginInput.safeParse(await request.json().catch(() => null));
  if (!input.success) return privateJson({ error: "Enter a valid email and password." }, 400);
  try {
    // On Vercel, use its normalized client header; never trust a generic user-provided X-Forwarded-For.
    const token = await authenticate(input.data.email, input.data.password, loginAddress(request.headers));
    if (!token) return privateJson({ error: "Invalid credentials or access temporarily blocked." }, 401);
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch { return privateJson({ error: "Management service is temporarily unavailable." }, 503); }
}

export async function DELETE(request: NextRequest) {
  if (!validMutationOrigin(request)) return privateJson({ error: "Origin not allowed." }, 403);
  if (!isAdminConfigured()) return privateJson({ error: "Management storage is not configured." }, 503);
  try {
    await revokeCurrentSession();
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch { return privateJson({ error: "Management service is temporarily unavailable." }, 503); }
}
