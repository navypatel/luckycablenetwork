import bcrypt from "bcryptjs";
import { connectDatabase } from "../src/lib/admin/database";
import { StaffUser } from "../src/lib/admin/models";

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !password || password.length < 16) throw new Error("Set a valid BOOTSTRAP_ADMIN_EMAIL and a unique BOOTSTRAP_ADMIN_PASSWORD of at least 16 characters.");
  await connectDatabase();
  const existing = await StaffUser.countDocuments();
  if (existing !== 0) throw new Error("Bootstrap is only permitted for an empty staff database; use the protected staff-management workflow for subsequent accounts.");
  await StaffUser.create({ email, passwordHash: await bcrypt.hash(password, 12), displayName: "Administrator", role: "Super Admin", active: true });
  console.log("Initial staff administrator created. Clear the bootstrap environment variables now.");
}
main().then(() => process.exit(0)).catch(() => { console.error("Bootstrap failed. Confirm database configuration, credentials and that no staff account exists. No secrets were logged."); process.exit(1); });
