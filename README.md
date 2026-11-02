# Adzinox Private Limited: website

Single-file, no-build website. HTML + CSS + vanilla JS, with GSAP + ScrollTrigger, Lenis and Three.js loaded from public CDNs.

## File structure

```
adzinox/
├── index.html      ← the whole site (upload this)
├── 404.html        ← same site, opens on the 404 view (hosts use it for missing pages)
├── sitemap.xml     ← replace the domain, upload to the site root
├── robots.txt      ← replace the domain, upload to the site root
├── README.md
├── src/            ← editable sources (head.html, style.css, body.html, data.js, app.js)
└── build.py        ← python3 build.py  → rebuilds dist/index.html and dist/404.html from src/
```

Most people only need to edit `index.html` directly. Use `src/` + `build.py` if you prefer small files.

## 1. Fill in your details (2 minutes)

Open `index.html` and search for **`✎ REPLACE`**. The important block is `CONFIG` at the top of the script:

| Key | What to put |
| --- | --- |
| `tagline` | Your tagline (default: "Where Ideas Go Viral") |
| `phone`, `email`, `address`, `hours` | Shown in Contact and Footer |
| `whatsapp` | Country code + number, digits only, e.g. `919876543210` |
| `mapQuery` | Address text used by the Google Map embed |
| `social` | Instagram, LinkedIn, Facebook, YouTube, X URLs |
| `formEndpoint` | URL that receives form posts (see below) |
| `showPlaceholderTags` | `false` removes the yellow SAMPLE tags before launch |

Also replace, further down: `PROJECTS`, `STATS`, `CLIENTS`, `TESTIMONIALS`, `TEAM`, `PLANS`, `AWARDS`, `POSTS`, `JOBS`, `FAQS` (all clearly marked as samples), and in `<head>` the canonical URL, Open Graph image and the JSON-LD schema block.

**Images.** Photos are loaded from Unsplash placeholders (`data-src`). Each image shows a gradient "PLACEHOLDER IMAGE" tile first and swaps to the photo once it loads. Replace the `img:` IDs in the data arrays with your own files (e.g. `/images/team-1.jpg`, adjusting the `img()` helper to use a local path) before launch. Check Unsplash licence terms for commercial use.

## 2. Make the forms deliver

The quote, contact, careers and newsletter forms validate in the browser and show a success animation. **Until you set `CONFIG.formEndpoint` they are in demo mode and send nothing** (a small note under each form says so).

Easiest options: [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) or your own API. Paste the endpoint URL into `formEndpoint`. Forms are posted as `multipart/form-data` (the careers form includes the resume file).

## 3. Run locally

Just open `index.html` in a browser. For a proper local server:

```bash
cd adzinox
python3 -m http.server 8080      # then visit http://localhost:8080
```

## 4. Deploy

Any static host works. No build step.

- **Netlify / Vercel / Cloudflare Pages:** drag the folder (or connect the repo). Publish directory = the folder with `index.html`.
- **GitHub Pages:** push the files to a repo, Settings → Pages → deploy from branch. `404.html` is picked up automatically.
- **cPanel / shared hosting:** upload `index.html`, `404.html`, `sitemap.xml`, `robots.txt` to `public_html/`. In `.htaccess` add `ErrorDocument 404 /404.html`.

After deploying: replace `www.yourdomain.com` in `index.html`, `sitemap.xml` and `robots.txt`, then submit the sitemap in Google Search Console.

## Features checklist

Preloader logo reveal · Three.js particle hero + kinetic headline · magnetic cursor with glow trail · GSAP scroll reveals, parallax, pinned horizontal portfolio · animated counters · tilt cards, image distortion on hover · Lenis smooth scroll + page-transition wipe · light/dark toggle · 21 sections · service/project/article detail views · filterable portfolio · blog listing page · 3D testimonial carousel · FAQ accordion · validated forms with success animation · WhatsApp + back-to-top buttons · "Ask Adzinox" chat widget (canned replies, UI only) · cookie banner · loading skeletons · 404 page · SEO meta, Open Graph, schema.org (Organization, WebSite, FAQPage) · `prefers-reduced-motion` respected · keyboard + ARIA support.

## Performance notes

The page is one HTML file (~150 KB) plus four CDN scripts. Images lazy-load, the 3D scene pauses when the hero is off-screen, and animation is skipped for reduced-motion users. For a 90+ Lighthouse score on mobile: serve your own compressed images (WebP/AVIF, correct sizes), self-host the four libraries if you want to avoid third-party requests, and enable gzip/brotli on your host. Run Lighthouse on your deployed URL to confirm; scores depend on hosting and images.

## Notes

- The Google Map embed and Unsplash photos load only when the page is hosted normally (they are blocked inside some preview sandboxes).
- Legal pages (Privacy, Terms) are starter templates. Have them reviewed for your business.
- Client names, testimonials, team, stats, awards and prices are invented samples. Replace them with real, verifiable information before launch.
