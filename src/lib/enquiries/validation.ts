import { z } from "zod";

export const enquiryDestination = "luckycablenetwork1@gmail.com";
const interests = ["Cable TV", "Broadband", "Package information", "Something else"] as const;
const enquiryInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254).transform(value => value.trim().toLowerCase()),
  interest: z.enum(interests),
  message: z.string().trim().min(10).max(2000),
  planLabel: z.string().trim().max(160).optional().default(""),
  website: z.string().max(500).optional().default("")
}).strict();

export function parseEnquiry(input: unknown) {
  const parsed = enquiryInput.safeParse(input);
  if (!parsed.success) return { success: false as const, spam: false, issues: parsed.error.issues };
  if (parsed.data.website) return { success: false as const, spam: true, issues: [] };
  const { website: _website, ...data } = parsed.data;
  return { success: true as const, data: { ...data, destination: enquiryDestination, deliveryStatus: "pending-email-configuration" as const } };
}