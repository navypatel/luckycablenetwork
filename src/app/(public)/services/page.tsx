import type { Metadata } from "next";
import { ServiceCarousel } from "@/components/public/service-carousel";
export const metadata: Metadata = { title: "Services" };
export default function ServicesPage() {
  return <><section className="page-intro"><h1>Different ways<br />to feel connected.</h1><p>Explore cable TV and broadband information. Specific plans, channels, equipment, installation terms, and availability must be confirmed before ordering.</p></section><ServiceCarousel /></>;
}