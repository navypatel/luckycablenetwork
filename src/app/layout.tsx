import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import "@/styles/public-enhancements.css";
import "@/styles/reference-vfx.css";

export const metadata: Metadata = {
  title: { default: "Lucky Cable Daman — Stay connected to what matters", template: "%s | Lucky Cable Daman" },
  description: "Explore Lucky Cable Network’s cable television, advertised broadband plans, local partner channels, and contact information for Daman.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/lucky-cable-logo.jpg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}