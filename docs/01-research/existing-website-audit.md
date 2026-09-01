# Existing Website Audit — vedanjay-power.com

**Audited:** 2026-08-31
**Method:** full crawl of all 11 published pages; raw HTML inspection; asset weight measurement via
HTTP range requests; live DOM/console inspection in Chromium at 1280×800 and 375×812; response
header inspection; external link liveness checks.
**Verdict:** the site is a 2017 licensed Bootstrap 3 theme with the company's content pasted in.
It is not repairable by redesign — it should be replaced. Its value to this project is entirely as a
**content archive**, and in that role it is genuinely valuable.

---

## 1. Page inventory

All 11 pages return HTTP 200. Flat `.html` files, no routing, no CMS.

### Home — `/index.html`
- **Purpose:** brand landing.
- **Primary audience:** undifferentiated.
- **Main content:** revolution-slider hero; one-paragraph about; "Connecting to a more Sustainable Future" band; 6 service tiles; client-segment tiles (Industry / Commercial / Utilities / RE); client logo carousel; awards marquee.
- **Primary CTA:** "Contact us" — a small, low-contrast pill floating inside the slider.
- **Secondary CTA:** none.
- **Important information:** the only place on the site stating **"registered QCA in Maharashtra, Telangana and Madhya Pradesh"** — the company's single most valuable credential, in body text, below the fold, unstyled.
- **Problems:** hero says "Harvest the wind for your energy needs and we will help you" — generic, no proof, no CTA; three `<h1>` elements; award marquee is a scrolling ticker clipped mid-word at both edges; 57 images, zero alt attributes; hero headline clipped mid-word on mobile; broken-image placeholders render inside the hero.
- **Disposition:** **Remove.** Rebuild from scratch; keep the QCA sentence and the six service names.

### About us — `/about-us.html`
- **Purpose:** company narrative.
- **Primary audience:** prospective client doing diligence.
- **Main content:** About, Dedicated Team, Vision, Mission, Our Promise; stat block (50+ clients / 110 MW open access / 2000 MW forecasting / +30 MW O&M).
- **Primary CTA:** none. **Secondary CTA:** none.
- **Important information:** the best-written prose on the site; "Based in Pune and Indore"; team composition; market focus (Maharashtra, MP).
- **Problems:** no CTA anywhere; stats conflict with figures elsewhere (see fact register §4); "more than 10 years" is stale copy; five near-identical prose blocks with no visual hierarchy; no leadership faces.
- **Disposition:** **Keep content / Improve heavily.** Split into About, Leadership and Why Vedanjay.

### Meet Our Team — `/team.html`
- **Purpose:** leadership credibility.
- **Main content:** 3 people — Gajanan Yadav (Director), B.N.S. Yadav (VP), Atish Malviya (LTOA & Open Access Billing).
- **CTAs:** none.
- **Problems:** no photographs, no biographies, no qualifications, no LinkedIn — for a firm whose entire pitch is "backed by technocrats", this is the most damaging omission on the site. Publishes three personal mobile numbers and emails openly (spam-harvesting liability). Registry-listed director Anjali Gajanan Yadav is absent.
- **Disposition:** **Keep names / Rebuild.** Requires client-supplied photos and bios.

### Awards — `/awards.html`
- **Main content:** 7 awards, 2016–2019.
- **Problems:** nothing after 2019; a stale awards wall reads worse than none. No award images or certificates.
- **Disposition:** **Improve.** Reframe as a dated "Recognition" timeline, folded into About.

### Downloads — `/downloads.html`
- **Main content:** 22 links — 15 external to `mahadiscom.in`, 7 self-hosted (including `VPPL_PROFILE.PDF`, 1.49 MB).
- **Problems:** **all 15 external links are dead** — every `mahadiscom.in` URL tested returns **HTTP 503**, and all are `http://` (insecure). One is a `.rar` archive. This is a regulatory-resource library that has silently rotted; it currently damages credibility more than it helps.
- **Disposition:** **Remove as built.** Either curate a genuinely maintained Knowledge/Resources hub, or drop it. A broken resource library is worse than no resource library.

### Services — `/services.html`
- **Purpose:** the commercial core of the site.
- **Main content:** all six service lines, in substantial and genuinely expert detail.
- **Primary CTA:** none.
- **Problems:** **all six services live on one URL**, revealed by a jQuery `showHideDiv()` show/hide with an animated scroll. Consequences: no deep links, no per-service SEO, no analytics per service, hidden content is still in the DOM for screen readers with no ARIA, and the browser back button does nothing. The single highest-value page on the site is architecturally crippled.
- **Important information:** "more than 700 MW Wind and Solar grid connect projects" commissioned; "'A' class Electrical License"; REC issuance in MP; enercast cooperation; CAPEX vs RESCO/OPEX models; full solar and wind O&M scope.
- **Disposition:** **Keep all content / Rebuild architecture.** Six separate indexable pages.

### Projects — `/projects.html`
- **Main content:** a 52-row, 5-column HTML table of executed works.
- **Problems:** presented as a raw table with a hover colour change and nothing else — no filtering, no sorting, no search, no dates, no values, no photography, no case studies. On mobile it is unusable. Client names repeat (MPPTCL ×7, Suzlon ×7, ReNew ×5, Regen Powertech ×4, Vikram Solar ×4) but the repeat business is invisible because rows are unsorted and ungrouped.
- **Important information:** **this is the single strongest credibility asset the company owns** — 52 named works for named utilities and named IPPs at 220/132/33 kV.
- **Disposition:** **Keep all data / Rebuild presentation.** Becomes a filterable project register plus 4–6 written case studies.

### Image Gallery — `/image-gallery.html`
- **Problems:** fancybox lightbox gallery, unlabelled, uncaptioned, no context.
- **Disposition:** **Remove as a page.** Redistribute real site photography into project and service pages where it carries meaning.

### Cooperation Partner — `/partners.html`
- **Main content:** one partner — enercast GmbH (Kassel, Germany); Wind Forecast, Solar Forecast, enercast SKY.
- **Problems:** an entire top-level navigation slot spent on a single, undated partner logo. Menu label "Cooperation Partner" is unidiomatic.
- **Disposition:** **Keep content / Demote.** Becomes a section within Forecasting & Scheduling and a block on About.

### Clients — `/clients.html`
- **Main content:** 41 client logos in four segments (RE generators, industrial, commercial, utilities).
- **Problems:** logo wall only — no testimonial, no outcome, no case study, no engagement description. Logos are inconsistent PNG/JPG at mixed resolutions with visible white boxes on some; filenames contain spaces and parentheses (`Renew_Wind_Energy_( MP Two)_Pvt._Ltd.New_Delhi.png`), which is fragile. Logo usage permission is unverified.
- **Important information:** the client list includes **Tata Steel, Tata International, Siemens Gamesa, Suzlon, Vikram Solar, Waaree, Tata Power Solar, ReNew, Mahindra, Kirloskar, MPPTCL** — a roster most Indian energy consultancies could not assemble.
- **Disposition:** **Keep names / Rebuild.** Normalised monochrome logo treatment plus 3 written client stories.

### Contact us — `/contact.html`
- **Main content:** address, two phone numbers, two email addresses.
- **Problems:** **no contact form** — despite the theme shipping `bootstrapValidator.min.js`. No map, no business hours, no enquiry routing, no separation between sales / careers / vendor enquiries. Every lead must be typed into an email client manually. For a B2B consultancy this is the most commercially costly single defect on the site.
- **Disposition:** **Rebuild entirely.**

---

## 2. Navigation audit

Current structure:

```
Home │ About us ▾ │ Services │ Projects ▾ │ Cooperation Partner │ Clients │ Contact us
        ├ Meet Our Team                  └ Image Gallary
        ├ Awards
        └ Downloads
```

| Question | Finding |
|---|---|
| Intuitive? | Partly. But "Cooperation Partner" (one partner) and "Clients" (one logo wall) each occupy a top-level slot while **six distinct service lines share one**. Navigation weight is inverted against commercial value. |
| Hierarchy clear? | No. Awards and Downloads are buried under About us, where nobody looks for them. |
| Important pages findable? | No. Every service beyond the first is reachable only by clicking an in-page tile — invisible to navigation, search engines and deep links. |
| CTA prominent? | No. "Contact us" is styled identically to every other nav item. There is no visually distinct primary action anywhere in the header. |
| Scalable? | No. Seven top-level items with no room for Careers, Insights, Sustainability or a second service tier. |
| Errors | Menu label reads **"Image Gallary"** (sic) — a spelling error in the primary navigation. |
| Active state | Only "Home" is highlighted; no active indication on inner pages. |
| Mobile | Collapses to a "Menu" text toggle with a `close ×` — functional but styled as an afterthought. |

---

## 3. Visual design audit

| Dimension | Finding |
|---|---|
| **Typography** | The only webfont declared is **Arimo** — loaded over `http://fonts.googleapis.com`, which the browser **blocks as mixed content on an HTTPS page**. The intended typeface never loads; the site renders in the browser's fallback (Arial/Liberation Sans). There is effectively **no typographic design in production at all.** Overridden `h1` at a fixed `28px !important` — headings do not scale. |
| **Colour** | Single flat green, applied inconsistently across three values — `#389743` (h1), `#47A859` (bands), `#248427` (icons). No neutral scale, no semantic tokens. This mid-green is the sector default; it is also, at these values, closer to a municipal-services green than a premium-energy green. |
| **Spacing** | Bootstrap 3 defaults plus ad-hoc `!important` patches injected inline per page (`.bottom-padding{margin-bottom:20px}`, `#customIconRadius{border-radius:50px;height:100px}`). No spacing system. |
| **Grid** | Bootstrap 3 12-column, 1170px max. Sound in principle; undermined by per-page inline overrides. |
| **Cards** | Theme-default panels with drop shadows and 50px-radius circular icon wells — reads as 2015 flat-design. |
| **Buttons** | One small green pill. No hierarchy — no primary/secondary/tertiary distinction anywhere on the site. |
| **Imagery** | 100% generic stock (wind turbines against blue sky, solar panels). **Not one photograph of Vedanjay's own work** — despite 52 executed projects at real substations. This is the largest missed opportunity on the site. |
| **Icons** | `livicons-1.4.min.js` — **609 KB of JavaScript to draw icons**, animated on hover. |
| **Hierarchy** | Weak. Long centre-aligned paragraphs at full container width, no lead-in/kicker system, no editorial rhythm. Everything is the same visual weight, so nothing is emphasised. |

---

## 4. UX audit

- **Content hierarchy** — inverted. The 2000 MW forecasting claim, the 700 MW commissioned claim and the QCA registration are all buried in body copy, while a stock wind-turbine photograph occupies the entire first screen.
- **CTA placement** — there is **no CTA on About, Services, Projects, Clients, Team, Awards, Partners or Downloads.** Nine of eleven pages are commercial dead ends. A visitor convinced on the Services page has nothing to click.
- **User journey** — undefined. All audiences receive identical content in identical order. An investor, a factory energy manager and a job candidate get the same page.
- **Information density** — simultaneously thin (About) and overwhelming (a 52-row raw table).
- **Readability** — centred multi-line paragraphs at full width; measure far exceeds a comfortable ~65–75 characters.
- **Discoverability** — five of six services have no URL. This is the defining UX failure.
- **Trust signals** — the raw materials are excellent (named utility clients, 220 kV work, QCA status, German technology partner) and **almost all of them are presented in the weakest possible form**: a logo wall with no context, an unsorted table, and a sentence in a paragraph.

---

## 5. Responsive audit

**Mobile (375 × 812), measured:**

- Hero headline renders as "**We are the Profes…**" — clipped mid-word. The slider's caption wrapper is **800 px wide inside a 375 px viewport** (`.tp-mask-wrap` measured at 800 px). Bootstrap's overflow clipping hides the horizontal scrollbar, so the text is simply cut off with no way to read it.
- Company name in the slider renders as "**edanjay Power Pvt. Ltd.**" — clipped on the left.
- **Broken-image placeholders render inside the hero** (three `404` responses confirmed in console).
- The "Contact us" CTA renders at roughly 10 px, mid-slider, overlapping the headline — effectively untappable and far below the 44 px minimum touch target.
- Body copy is centre-aligned across the full width — poor readability on a narrow column.
- A grey empty band sits above the hero.
- The logo's tagline ("CONNECTING TO A MORE SUSTAINABLE FUTURE") is rendered at an illegible size.

**Tablet (768–1023):** Bootstrap 3 `col-sm` behaviour applies; the same slider caption overflow persists at reduced severity.

**Desktop (1280):** the award marquee below the navbar is a **scrolling ticker whose text is clipped mid-word at both edges** ("…rom Wind & Solar in overall MP&MH ★ VPPL bagg"). The hero headline is ~20 px against a 1280 px viewport — no editorial scale.

**Root cause:** the responsive failures are not CSS oversights. They come from **Slider Revolution**, which positions caption layers with absolute pixel coordinates computed for a fixed design width. This class of bug cannot be fixed without removing the slider — which is a further argument for replacement over redesign.

---

## 6. Performance audit — measured, not assumed

Compression *is* configured (`content-encoding: br` on HTML and CSS), and `strict-transport-security` is set. The problems are in what the page loads, not how it is transported.

| Measurement | Value | Assessment |
|---|---|---|
| `<script>` tags on homepage | **56** (55 executing) | Extreme |
| Stylesheet links | **18** | Extreme |
| `content/img/slider/home-slider-2.jpg` | **1,472,587 B (1.47 MB)** | Unoptimised; JPEG, not served responsively |
| `content/img/slider/home-slider-1.jpg` | **1,044,085 B (1.04 MB)** | Unoptimised |
| `js/livicons-1.4.min.js` | **609,216 B** | 609 KB of JS for decorative icons |
| `css/style.css` | 254,946 B raw | Theme CSS, near-entirely unused |
| `css/bootstrap.css` | 152,767 B raw | Unminified Bootstrap 3 |
| `js/main.js` | 59,350 B | Theme glue |
| Images on homepage | 57 | Zero use of `loading="lazy"`, `srcset`, or modern formats |
| `cache-control` | `max-age=3600` (1 hour) | Far too short for immutable static assets |

**Confirmed defects:**

1. **Two jQuery versions are declared.** `jquery-3.0.0.min.js` loads, then `jquery-1.9.1.min.js` is requested and **returns HTTP 404**. The theme's plugin suite was written for jQuery 1.9; running it on jQuery 3.0 removes `$.browser`, `.size()`, `.andSelf()` and the `.load()` event shorthand. This is a latent breakage across carouFredSel, elevateZoom and jslider.
2. **Three 404 responses on the homepage**, whose broken-image placeholders are visible in the hero on mobile.
3. **Mixed-content block:** the Google Fonts stylesheet is requested over `http://` and blocked. The site's only webfont never loads.
4. **Dead weight from the theme, never used by this business:** `morris.min.js` + `raphael.min.js` (charting), `jquery.jplayer` + `jplayer.playlist` (audio player), the entire `js/price-regulator/` bundle (6 files — a pricing slider), `jquery.easypiechart`, `jquery.knob`, `jquery.sparkline`, `isotope`, `masonry`, `pixastic`, `elevateZoom`, `video.js`, `bootstrap-datepicker`, `country.js`, `ladda` + `spin.js`, `layerslider` + `greensock`, **and** `royalslider` **and** Slider Revolution's 11 files. Three separate slider libraries ship on every page.
5. **Render-blocking chain:** 18 stylesheets and a large synchronous script block in `<head>`, none deferred.
6. **Layout shift:** no `width`/`height` on images; the slider reflows the hero after JS initialisation.
7. **Malformed HTML:** the `jquery.scrollbar.css` `<link>` tag in `<head>` is never closed (`<link rel="stylesheet" href="css/jquery.scrollbar.css"` followed by comments), so subsequent head markup is absorbed into the tag.

> **Reasoning, not blind optimisation:** the fix is not to compress these assets. Roughly 95% of this payload implements features the business does not have — audio playlists, pricing sliders, chart widgets, image zoom. Replacement removes the cost entirely rather than reducing it.

---

## 7. SEO & accessibility audit

| Item | Status |
|---|---|
| `<title>` | Identical on Home ("Vedanjay Power Pvt. Ltd.") — no page-level differentiation on several pages |
| `<meta name="description">` | Set to the literal string **"Vedanjay Power Pvt. Ltd."** — no descriptive content |
| `<meta name="keywords">` | Present (obsolete signal), set to the company name |
| Open Graph / Twitter cards | **Absent.** Any share to LinkedIn or WhatsApp renders with no image, no title, no description |
| `<link rel="canonical">` | **Absent** |
| Structured data (JSON-LD) | **Absent.** No `Organization`, no `LocalBusiness`, no `Service` |
| `robots.txt` | Present (200) |
| `sitemap.xml` | Present (200) |
| `<html lang>` | **Absent** — screen readers cannot select a pronunciation or language |
| `alt` attributes | **0 of 57 images have alt text** on the homepage |
| Heading order | **Three `<h1>`** on the homepage; `h4`/`h5`/`h6` used decoratively |
| Keyboard access | Service tabs are `onclick` handlers on non-interactive elements — not reachable or operable by keyboard |
| Focus states | Bootstrap 3 defaults, largely suppressed by theme CSS |
| Hidden content | Five service panels are `display:none` but present in the DOM with no `aria-hidden`/`aria-expanded` |
| Contrast | White text over unoverlaid photography in the slider — fails WCAG AA in several frames |
| Touch targets | Hero CTA measured far below the 44 px minimum |

Search visibility consequence: **five of six service lines have no indexable URL.** Vedanjay cannot rank for "open access consultant Madhya Pradesh", "QCA Maharashtra", "CEIG approval consultant" or "forecasting and scheduling India" because no page exists to rank. For a firm selling regulatory expertise, these are the exact queries its buyers type.

---

## 8. What the legacy site does well

Stated deliberately, because the rebuild must not lose it:

1. **The services copy is written by someone who knows the domain.** SLDC synchronisation, ABT/AMR compliance, CEIG approvals, telemetry and RTU, REC issuance, BOOT/BOT, CAPEX vs RESCO — this is credible practitioner language. It should be edited, not rewritten by a generalist copywriter.
2. **The 52-row project register is real, specific and checkable.** Named authorities, named voltages, named scopes.
3. **The client roster is genuinely impressive** and includes tier-one industrials and utilities.
4. **The QCA-in-three-states claim is a licence-grade differentiator.**
5. **The enercast GmbH cooperation** is an unusual and defensible technical asset.
6. **The segmentation instinct is correct** — Industry / Commercial / Utilities / RE Generators is the right way to cut this market. It is simply not carried through the rest of the site.

---

## 9. Disposition summary

| Page | Keep / Improve / Remove |
|---|---|
| Home | **Remove** — rebuild; retain QCA sentence and service names |
| About us | **Improve** — best prose on the site; split into three pages |
| Meet Our Team | **Improve** — needs photos, bios, credentials |
| Awards | **Improve** — reframe as dated Recognition, fold into About |
| Downloads | **Remove as built** — 15 of 22 links are dead (HTTP 503) |
| Services | **Improve** — keep every word; six indexable URLs |
| Projects | **Improve** — keep all 52 rows; filterable register + case studies |
| Image Gallery | **Remove** — redistribute real photography into context |
| Cooperation Partner | **Improve / demote** — into Forecasting page and About |
| Clients | **Improve** — normalise logos, add client stories |
| Contact us | **Remove as built** — rebuild with routed forms |

---

## 10. Top ten defects, ranked by commercial cost

1. **No contact form anywhere on the site.** Every enquiry requires the visitor to manually compose an email. Highest direct revenue cost of any single defect.
2. **Five of six services have no URL.** Invisible to search, unlinkable in a proposal or email, unmeasurable in analytics.
3. **No CTA on nine of eleven pages.** Persuasion happens, then leads nowhere.
4. **Mobile hero is broken** — headline clipped mid-word, broken-image placeholders, untappable CTA.
5. **Contradictory statistics** (100 vs 110 MW; 700 MW vs 30 MW) undermine every number on the site.
6. **The 52-project register is unusable** as presented — the best asset, worst presented.
7. **QCA registration in three states is buried in a paragraph.**
8. **No leadership faces, bios or credentials** on a firm selling technocrat expertise.
9. **15 dead download links** (HTTP 503) actively signal neglect.
10. **Zero alt text, no `lang`, no OG tags, no structured data** — inaccessible and unshareable.

---

## Related

- [Company fact register](../06-content/company-facts.md)
- [Competitor analysis](competitor-analysis.md)
- [Gap analysis](gap-analysis.md)
