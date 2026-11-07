import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDatabase } from "./database";
import { StaffSession, StaffUser, AdminAudit, LoginAttempt, type StaffRole } from "./models";
import { can, type AdminAction, type AdminResource } from "./permissions";

export const SESSION_COOKIE = "lucky_staff_session";
const lifetime = 60 * 60 * 8;
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function authenticate(email: string, password: string, address: string) {
  await connectDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const key = tokenHash(`${address}:${normalizedEmail}`);
  const attempt = await LoginAttempt.findOne({ key });
  if (attempt?.blockedUntil && attempt.blockedUntil > new Date()) return null;
  const user = await StaffUser.findOne({ email: normalizedEmail, active: true }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const failures = (attempt?.failures ?? 0) + 1;
    await LoginAttempt.updateOne({ key }, { $set: { failures, updatedAt: new Date(), blockedUntil: failures >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null } }, { upsert: true });
    return null;
  }
  await LoginAttempt.deleteOne({ key });
  const token = randomBytes(32).toString("base64url");
  await StaffSession.create({ tokenHash: tokenHash(token), userId: user._id, sessionVersion: user.sessionVersion, expiresAt: new Date(Date.now() + lifetime * 1000) });
  await AdminAudit.create({ actorId: user._id, action: "login", target: "staff-session" });
  return token;
}

export async function currentStaff() {
  await connectDatabase();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await StaffSession.findOne({ tokenHash: tokenHash(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await StaffUser.findById(session.userId);
  if (!user?.active || user.sessionVersion !== session.sessionVersion) return null;
  return { id: String(user._id), name: user.displayName as string, role: user.role as StaffRole };
}

export async function authorize(resource: AdminResource, action: AdminAction) {
  const staff = await currentStaff();
  if (!staff) return null;
  return can(staff.role, resource, action) ? staff : null;
}

export async function revokeCurrentSession() {
  await connectDatabase();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await StaffSession.deleteOne({ tokenHash: tokenHash(token) });
}

export const sessionCookieOptions = {
  httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: lifetime
};