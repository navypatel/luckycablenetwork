import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/config";
import { validMutationOrigin } from "@/lib/admin/origin";
import { loginAddress } from "@/lib/admin/login-address";
import { submitEnquiry } from "@/lib/enquiries/service";
import { readJsonWithinLimit } from "@/lib/enquiries/request";

export const runtime = "nodejs";

const response = (body: unknown, status: number) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff" } });

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) return response({ error: "Enquiries are temporarily unavailable. Please call or email us directly." }, 503);
  if (!validMutationOrigin(request)) return response({ error: "Origin not allowed." }, 403);
  const address = loginAddress(request.headers);
  const sourceHash = createHash("sha256").update(`${process.env.SESSION_SECRET}:${address}`).digest("hex");
  try {
    let input: unknown;
    try { input = await readJsonWithinLimit(request, 12_000); }
    catch (error) { return response({ error: error instanceof SyntaxError ? "Provide a valid enquiry." : "Enquiry is too large." }, error instanceof SyntaxError ? 400 : 413); }
    const result = await submitEnquiry(input, sourceHash);
    if (!result.ok) return response({ error: result.error }, result.status);
    return response({ ok: true, reference: result.accepted ? result.reference : undefined }, 201);
  } catch { return response({ error: "We could not save your enquiry. Please call or email us directly." }, 503); }
}