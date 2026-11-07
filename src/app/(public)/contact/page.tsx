import type { Metadata } from "next";
import { EnquiryForm } from "@/components/public/enquiry-form";
import { broadbandPackages, formatInr } from "@/lib/packages";
import { ContactDetails } from "@/components/public/company-details";

export const metadata: Metadata = { title: "Contact" };
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan: planId } = await searchParams;
  const plan = broadbandPackages.find(item => `${item.speedMbps}-${item.months}` === planId);
  const planLabel = plan ? `${plan.speedMbps} Mbps · ${plan.months} months · ${formatInr(plan.priceInr)}` : undefined;
  return <><section className="page-intro"><h1>Every connection starts<br />with a conversation.</h1><p>Talk to the team about cable TV, broadband, or your next connection. Call, email, or send the details of your enquiry below.</p></section><div className="contact-layout"><aside className="contact-aside"><ContactDetails /></aside><div><div className="notice contact-draft-notice"><strong>Send an enquiry to Lucky Cable.</strong><br />Your details are stored privately for authorized staff to review. Email forwarding to luckycablenetwork1@gmail.com is pending mail configuration. Please do not include passwords or payment details.</div><EnquiryForm planLabel={planLabel} /></div></div></>;
}