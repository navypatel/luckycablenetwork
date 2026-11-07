# Two surfaces, one Lucky Cable identity

The user confirmed `lc.jpg` as the company logo on 2026-11-04. The full image now replaces the provisional mark in public and admin branding, with original colours/aspect ratio preserved. `public/brand/lucky-cable-logo.jpg` is a byte-identical copy. Other illustrations are original CSS/SVG. No reference-site assets copied.

## Shared

- Ink `#172a2b`, muted text `#586967`, paper `#f8faf6`, connection green `#116a5b`, light mint `#c6efb5`.
- Locally served Manrope Variable for display; DM Sans Variable for body/UI. Fontsource packages contain the font licenses. No runtime font requests to third-party hosts.
- Lucide stroke icons with accessible action names. Brand uses the supplied full company logo; no reconstructed mark.
- Focus-visible outline 3px; native semantic buttons/links/labels; skip links; reduced-motion override; no motion-based information dependency.

## Public: signal in motion

Light, editorial composition; large but controlled display typography; generous spacing; an original orbital Wi-Fi sculpture expresses connectivity. Layered CSS transforms respond subtly to pointer movement, with a pause control and reduced-motion fallback. Services form a horizontal rail rather than a dashboard grid. Colour changes between paper, soft sage, and mint create chapters. Layout breaks at 760px and 1050px, with additional large-screen composition at 1500px.

Spacing: 5–6% horizontal page margins; 96px desktop sections, 58px mobile. Public headings 34–96px depending on role/viewport. Buttons 44px minimum target in major navigation, visual hover/focus states, restrained corners. Abstract illustrations are design material, not representations of provider equipment or capabilities.

## Admin: operations, in order

White sidebar, cool `#f5f7f8` workspace, fine `#e1e7e8` dividers, operational teal accents. 250px sidebar with compact mode; separate mobile navigation below 760px. Content 36px desktop / 20px mobile horizontal padding. Headings 17–30px, tabular labels 10–12px. Setup/readiness and module search substitute for unavailable operational data; no invented KPI charts. No ambient animation in the workspace.

## Deliberate implementation choices

Native CSS was sufficient: no WebGL, GSAP, Motion, or carousel dependency needed for this scoped slice. No data-table library until real data, sorting/pagination contracts and server query boundaries exist. No shell-only database or auth dependencies. Website remains noindex until verified business content and production workflows are approved.

## Public motion enhancement

Provider gallery uses the provider images supplied by the user (ZEE, Sony, Star, Disney, Sun TV, Cartoon Network, Discovery and Hungama) plus the two confirmed local partner channels. Only image-backed items appear. Both the scroll animation and carousel remain: page scroll changes the centered/active provider while the neighboring image cards stay visible, with depth and movement between selections. Keyboard arrows/Home/End, prev/next controls, and direct pagination remain available. Reduced motion switches to normal document flow and retains a small manually browsable image carousel. The collection identifies supplied providers/partners; it is explicitly not a channel-availability, package, or subscription-rights claim.

Hero text/underline choreography, viewport-triggered section entrances, scroll-linked home/ideas depth, reading-progress line, service-art hover depth, and the combined scroll-scrubbed provider carousel create a stronger motion language. Native CSS, Web Animations API and IntersectionObserver; requestAnimationFrame coalesces scroll updates. Default server content stays visible if JavaScript fails. Reduced motion cancels spatial depth and changes the provider section into a non-pinned, manually browsable image carousel. Admin remains unchanged.

About now uses typographic director profiles (no invented portraits) and grouped technology partner lists. Contact details are rendered from supplied text, with direct phone/email/map links. The reference screenshots are never public images.