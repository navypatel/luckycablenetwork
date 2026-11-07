import { connectDatabase } from "../admin/database";
import mongoose from "mongoose";
import { EnquiryQuota, PublicEnquiry } from "../admin/models";
import { parseEnquiry } from "./validation";

const windowMs = 15 * 60 * 1000;
const maximumPerWindow = 3;

async function reserveQuota(sourceHash: string) {
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${sourceHash}:${bucket}`;
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) } };
  try {
    return await EnquiryQuota.findOneAndUpdate({ key }, update, { upsert: true, returnDocument: "after" });
  } catch (error) {
    if (!(error instanceof mongoose.mongo.MongoServerError) || error.code !== 11000) throw error;
    return EnquiryQuota.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { returnDocument: "after" });
  }
}

export async function submitEnquiry(input: unknown, sourceHash: string) {
  const parsed = parseEnquiry(input);
  if (!parsed.success) return parsed.spam ? { ok: true as const, accepted: false as const } : { ok: false as const, status: 400, error: "Check your enquiry details and try again." };
  await connectDatabase();
  const quota = await reserveQuota(sourceHash);
  if (!quota || quota.count > maximumPerWindow) return { ok: false as const, status: 429, error: "Too many enquiries were submitted recently. Please try again later or call us." };
  const record = await PublicEnquiry.create({ ...parsed.data, sourceHash });
  return { ok: true as const, accepted: true as const, reference: `LC-${String(record._id).slice(-8).toUpperCase()}` };
}