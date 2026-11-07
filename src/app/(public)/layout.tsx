import { PublicHeader, PublicFooter } from "@/components/public/navigation";
import { ScrollMotion } from "@/components/public/scroll-motion";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="public-site"><ScrollMotion /><a className="skip-link" href="#main">Skip to content</a><PublicHeader /><main id="main">{children}</main><PublicFooter /></div>;
}