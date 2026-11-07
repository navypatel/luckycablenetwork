import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Wifi } from "lucide-react";
import { broadbandPackages, formatInr } from "@/lib/packages";
export const metadata: Metadata = { title: "Broadband packages" };
export default function PackagesPage() {
  return <>
    <section className="page-intro"><h1>Your world.<br />Your kind of connection.</h1><p>Explore Lucky Cable Network’s advertised broadband plans. Choose a speed and term, then confirm availability and current terms before subscribing.</p></section>
    <section className="broadband-plans" aria-label="Broadband plans">{broadbandPackages.map(plan => <article className="broadband-plan" key={`${plan.speedMbps}-${plan.months}`}>
      <Wifi size={28} strokeWidth={1.5} aria-hidden="true" /><h2>{plan.speedMbps} <span>Mbps</span></h2><p className="plan-term">{plan.months} months</p><p className="plan-price">{formatInr(plan.priceInr)}<span>Total advertised price for {plan.months} months</span></p><ul><li>Unlimited data, as advertised</li><li>Free installation for this term, as advertised</li></ul><Link className="button button-dark" href={`/contact?plan=${plan.speedMbps}-${plan.months}`}>Enquire about this plan <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </article>)}</section>
    <section className="plan-terms section-pad"><h2>A few details to confirm.</h2><p>These offers are transcribed from the company flyer supplied for this website. The flyer advertises unlimited data and free installation for 6–12 month plans, with terms and conditions applying.</p><p>Tax inclusion, equipment charges, fair-use policy, speed conditions, offer validity, and address-specific availability are not specified. Confirm these before payment. Prices above are for the entire stated term—not per month. Online purchasing is not available.</p><Link href="/services/cable-tv" className="text-link">Looking for cable TV? <ArrowUpRight size={17} aria-hidden="true" /></Link></section>
  </>;
}