# Public content sources

## User-provided references (text transcribed; screenshots NOT published)

- `directors.png`: Mrs. Preeti Patel and Mrs. Neeta Patel, Non-Executive Directors; more than 20 years of cable TV distribution experience; people management, administration and business networking. No headshots were supplied or fabricated. Initials are decorative typography, not portraits.
- `partners.png`: CAS/headend — SUMAVISION (Sumavision Technologies Co. Ltd.), NSTV (Novel Super TV), NAGRA, CHANNEL MASTER (Channel Master Pvt. Ltd.), DIGITAL HEADEND IP SOLUTION, OPTILINK (Optilink Network). Set-top box — SKYWORTH (Hong Kong Skyworth Digital Holdings Co., Ltd.), PANODIC, MYBOX, KINGVON, OVT. SMS — CableGuy CATV. Category structure preserved; no external contract status or performance guarantees invented.
- `contact us.png`: cable 9512340080; broadband 9512340930; nodal officer Ashik C Patel, 9512340145; luckycablenetwork1@gmail.com; www.luckycablenetwork.com; SURVEY NO 234/2, KUND FALIA BHIMPORE, NANI DAMAN, Daman, Daman and Diu, 396210; GST 26AAGFL0825L1Z9.
- Contact screenshot takes precedence over the earlier Vapi flyer when presenting the Daman office. No business hours or WhatsApp support assumed.
- `price.jpeg`: five plan totals already transcribed in `src/lib/packages.ts`. Remains reference-only.
- `lc.jpg`: user-confirmed company logo. `damanews.png` and `sankalpnews.png`: user-confirmed local partner channel logos. These three permitted logos are the only reference images copied to public assets.

## Broadcaster discovery sources, checked during this implementation

This research records which Indian and international broadcasters were explored before provider images were supplied. Those text-only entries are no longer displayed. The current gallery uses user-supplied image artwork instead; it is NOT a verified Lucky Cable channel lineup, contract/partner list, or proof of subscription rights. No availability, channel numbers, or live stream are implied.

- ZEE: https://www.zee5.com/ — official service footer identifies Zee Entertainment Enterprises Ltd. and Zee TV HD/regional channels. Corporate zee.com returned 403; no access bypass attempted.
- Star / JioStar: https://www.jiostar.com/ and https://www.jiostar.com/portfolio/ — official portfolio describes entertainment, sports, regional and international categories. /entertainment/ returned 404; use working portfolio URL.
- Sony: https://www.sonyliv.com/ — official entertainment and sports platform. sonypicturesnetworks.com and Sony corporate pages returned 403; no unsupported detailed channel catalogue copied.
- BBC: https://www.bbc.com/mediacentre/ — official BBC information and news-service navigation; card links to https://www.bbc.com/news.
- DW: https://www.dw.com/en/about-dw/profile/s-30688 — official description of Germany’s international broadcaster and multilingual output; card links to https://www.dw.com/.
- France 24: https://www.france24.com/en/ — official international news/current-affairs service.

## Supplied provider-image gallery (2026-11-05)

The user added image assets `z.png`, `Sony_TV_new.png`, `Star_Television_logo.svg`, `disney.jpg`, `sun.jpg`, `cn.jpg`, `hungama.png`, and `Discovery-Channel-Logo.png`. Optimized display derivatives are served under `public/providers/`; originals remain at the project root. The gallery also includes the previously confirmed Daman News and Sankalp News Gujarati partner logos. It contains only these ten image-backed entries; unsupported text-only broadcaster entries were removed. The carousel is now scroll-scrubbed, with keyboard/buttons and paginated selection as alternatives. Provider and partner artwork is for identification only and makes no carriage, package or subscription-rights claim. The reference video is not copied to public assets.

## Motion reference interpretation

Grida: layered exploration, draggable/keyboard-operated discovery, explicit motion controls. Lusion: authored spatial storytelling and continuity. Existing Lucky Cable look preserved; implementation is original native CSS/WAAPI/IntersectionObserver, not copied source. Impeccable animate guidance used; context CLI exceeded the runtime timeout, so PRODUCT.md, DESIGN.md and the craft-floor / animate guidance were read directly. No new framework dependency or unverified installer used.

Motion thesis: “tuning into a different perspective” — scroll through a pinned sequence of supplied provider images; the featured image and identifying text advance as the visitor scrolls. Native vertical scrolling remains in control. On reduced motion the pinned sequence becomes a normal-flow manually browsable gallery. No autoplay or fake channel listing. Keyboard arrows, Home/End, buttons and direct pagination provide alternatives. No admin animation added.