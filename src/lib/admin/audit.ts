import { AdminAudit } from "./models";

export async function audit(actorId: string, action: string, target: string, before?: unknown, after?: unknown) {
  await AdminAudit.create({ actorId, action, target, before: before ?? null, after: after ?? null });
}
