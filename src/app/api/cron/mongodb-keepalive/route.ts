import { NextRequest } from "next/server";
import { connectDatabase } from "@/lib/admin/database";
import { validCronAuthorization } from "@/lib/admin/cron-auth";
import { privateJson } from "@/lib/admin/response";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  if (!validCronAuthorization(request.headers.get("authorization"), process.env.CRON_SECRET)) return privateJson({ error: "Not found." }, 404);
  try { const connection = await connectDatabase(); await connection.connection.db?.admin().ping(); return privateJson({ ok: true }, 200); }
  catch { return privateJson({ error: "Database unavailable." }, 503); }
}
