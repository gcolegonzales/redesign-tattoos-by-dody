# Tattoos By Dody — Website Redesign Concept

An unsolicited redesign concept for **Tattoos By Dody**, a tattoo studio in Gonzales, LA,
established 1990 and one of the oldest and busiest shops in south Louisiana. The shop currently
has **no website** — only a Facebook page.

## The opportunity

- **No website today.** Customers can't find hours, styles, artists, or a way to inquire
  without digging through Facebook. This concept gives them a real home on the web.
- **Reputation isn't being showcased.** ~317 Facebook reviews, ~96% recommend, 35+ years in
  business — huge trust signals that a proper site can lead with.
- **No booking path.** This concept adds a real "Request a Consultation" inquiry form plus
  click-to-call, so the shop captures leads instead of losing them.

## What this is

A fully static, self-contained single-page site: `index.html` + `styles.css` + `script.js`.
No build step, no frameworks, one Google Fonts link. Open `index.html` directly in a browser,
or serve the folder.

Design direction: bold old-school American-traditional tattoo parlor — dark ink base,
deep crimson + aged gold + bone white, heavy vintage display type, Americana touches, and a
gritty texture. Leads with the "Est. 1990" heritage and the artwork.

## Real data used

- Business name, address (13075 Airline Hwy, Gonzales, LA 70737), phone (225) 644-2856
- Hours: Tue–Sat 12pm–8pm, closed Sun & Mon
- Established 1990; owner John "Dody" Breaux Jr.
- Artists referenced from public reviews (Dody, Froggy, Conan, Jennifer)
- Review quotes paraphrased from public Facebook reviews
- Services: traditional, black & gray, color, custom, cover-ups, piercing

## Images to add

Real tattoo photos live on the shop's Facebook. Spots that need real photos are marked in
`index.html` with `<!-- IMG-NEEDED: ... -->` comments (hero, portfolio gallery, artist portraits,
storefront). Until then, tasteful inline-SVG tattoo-flash panels stand in as intentional design.

## SEO

On-page SEO is wired in without altering the visible design or content:

- **JSON-LD** structured data (`@type: TattooParlor`) with name, telephone, address,
  `openingHoursSpecification`, image, url, `sameAs` (Facebook), founded 1990.
- **Canonical**, complete **Open Graph** + **Twitter card** tags.
- `robots.txt` (allow all + `Sitemap:` line) and `sitemap.xml` at the repo root.
- Single `<h1>`.

**Base URL placeholder:** canonical, `og:url`, sitemap, robots `Sitemap:`, and all schema
`url`/`image` values use the literal placeholder `https://tattoosbydody.com/`. At deploy,
do a one-line find-and-replace of `https://tattoosbydody.com/` across `index.html`,
`sitemap.xml`, and `robots.txt` with the real domain.

## View it

Open `index.html` in any modern browser. This is a private concept pitch — not affiliated with
the business.
