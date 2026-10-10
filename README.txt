Greater Than Us — IIT Kanpur Campaign website (V3, built from Figma "Greater than us - Website V3")

HOW TO USE
- Open index.html in a browser, or upload the whole folder to any web host. No build step, no server needed.
- Fonts are self-hosted (fonts/), so it works offline.

STRUCTURE
  index.html                    Home
  campaign.html                 The Campaign (Figma "About" frames – all 4 states merged; Circle of Leadership is tabbed)
  giving.html                   Begin Your Giving Journey
  priorities/foundation.html, talent.html, frontier.html          Priority hubs
  priorities/<sub-priority>.html                                  10 sub-priority pages
  stories/index.html, foundation.html, talent.html, frontier.html Story listings (index has Load More)
  stories/<story-slug>.html                                       17 story pages
  css/style.css      shared design system (colours, header, footer, buttons, chips, hero…)
  css/*.css          page-group styles     js/main.js   nav, lightbox, tabs, load-more, progress ring
  assets/            images. Your original folders (Logo, About, Priorities, Stories) keep their filenames
                     (opaque PNG photos converted to .jpg for web size). assets/layers = Figma layer exports,
                     assets/home|campaign|giving|priorities|stories|ui = photos/icons cropped from the Figma frames.

  contact.html                  Contact form (Figma "Contact Form") – all "Talk to us" buttons link here
  vendor/            GSAP 3.12 + ScrollTrigger, AOS 2.3 (self-hosted)
  css/motion.css + js/motion.js   animation & hover layer (hero entrance + parallax, AOS scroll reveals,
                     GSAP staggers, button sheen/magnetic, card lift + image zoom, nav underline, header hide/show).
                     Delete these two files (and the vendor/ script tags in the HTML) to get a static, no-motion site.
                     Scroll-reveal tags (data-aos) are added automatically by build.py; respects prefers-reduced-motion.

RESPONSIVE
- css/responsive.css = device layer: iPhone 17 / Pro (402px), Pro Max (440px), phones in landscape, iPad mini/Air/11" portrait
  (744–834px: two-column grids, horizontal footer), iPad landscape & iPad Pro 13" portrait (1024–1240px compact desktop),
  safe-area insets for Dynamic Island / home indicator, 44px touch targets. Tested at 360/402/440/820/834/1024/1194/1366px.

IMAGES
- All photos are HD (2x, up to 2400px wide), taken from the PDF export's embedded source images /
  2x render. Icons are 2x transparent PNGs.

TO-DO / PLACEHOLDERS (search the HTML for these)
- YouTube video IDs: every play button uses data-video="dQw4w9WgXcQ" – replace with real IDs.
- contact.html form: currently opens a pre-filled email (mailto) – wire to Zoho/Formspree/backend in the inline script.
- giving.html: bank/cheque details in the accordions are placeholders; form posts to "#".
- Social links point to IIT Kanpur's official YouTube/X/LinkedIn; "Talk to us" = mailto:marketing.ops@iitkdf.org.
- Goal figures ($1 Billion / $300M = 30%) are in index.html and giving.html (data-progress / data-count).

ROTATING CONTENT SECTIONS (priority pages)
- Any <section data-pr-slider> auto-advances every 4s (pause on hover, arrow/click to jump). Two kinds:
  * Lists: <ul class="pr-slider__list"><li class="is-active">…</li><li>…</li></ul> – the highlight moves item to item.
  * Slides: several <div class="pr-slide"> blocks inside the panel (each with .pr-slider__title + .pr-slider__text);
    only one is shown at a time. Add more slides by copying a .pr-slide block (e.g. 02., 03. … for CRF's six centres).
    Optional per-slide photo: add <img data-slide="1" …> inside .pr-slider__media (index matches the slide).
  * Change the speed with data-interval="6000" on the section.
- contact.html now embeds the Zoho "Talk to Us" form.
