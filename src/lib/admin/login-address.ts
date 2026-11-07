export function loginAddress(headers: Headers, environment: { VERCEL?: string } = { VERCEL: process.env.VERCEL }) {
  if (environment.VERCEL !== "1") return "local";
  const forwarded = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return forwarded && /^[0-9a-f:.]{3,64}$/i.test(forwarded) ? forwarded : "vercel-unknown";
}
