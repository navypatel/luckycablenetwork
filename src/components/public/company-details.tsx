import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { company, phoneHref } from "@/lib/company";

export function ContactDetails() {
  return <div className="company-contact">
    <h2>A real person.<br />A direct connection.</h2>
    <div className="contact-method"><Phone size={21} aria-hidden="true" /><div><h3>Cable television</h3><a href={phoneHref(company.cablePhone)}>{company.cablePhone} <ArrowUpRight size={16} aria-hidden="true" /></a></div></div>
    <div className="contact-method"><Phone size={21} aria-hidden="true" /><div><h3>Broadband enquiries</h3><a href={phoneHref(company.broadbandPhone)}>{company.broadbandPhone} <ArrowUpRight size={16} aria-hidden="true" /></a></div></div>
    <div className="contact-method"><Mail size={21} aria-hidden="true" /><div><h3>Email us</h3><a href={`mailto:${company.email}`}>{company.email}</a></div></div>
    <div className="contact-method"><MapPin size={21} aria-hidden="true" /><div><h3>Find us in Daman</h3><address>{company.address}</address><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`} target="_blank" rel="noopener noreferrer">Open map <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (new tab)</span></a></div></div>
    <div className="nodal-contact"><ShieldCheck size={21} aria-hidden="true" /><div><h3>Nodal officer</h3><p>{company.nodalOfficer}</p><a href={phoneHref(company.nodalPhone)}>{company.nodalPhone}</a></div></div>
    <dl className="company-registration"><div><dt>Website</dt><dd><a href={company.website}>www.luckycablenetwork.com</a></dd></div><div><dt>GST number</dt><dd>{company.gst}</dd></div></dl>
  </div>;
}