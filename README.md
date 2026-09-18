# www.i80cardshow.com

The website for the **I-80 Card Show** — a Pokémon & TCG card show right off Interstate 80.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework. Edit a file,
push it, and it's live.

---

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole homepage: hero, next show, show info, schedule, dates, venue, table pricing, FAQ |
| `vendors.html` | Table pricing, vendor rules, and the table reservation form |
| `thanks.html` | Confirmation page after a form submission (used by Netlify Forms) |
| `404.html` | Page-not-found page |
| `assets/css/styles.css` | All styling. Colors live in the `:root` block at the top |
| `assets/js/main.js` | Mobile menu, countdown clock, form validation |
| `assets/img/` | Logo, favicons, social share image |
| `CNAME` | Tells GitHub Pages to serve the site at `www.i80cardshow.com` |
| `sitemap.xml`, `robots.txt` | Search engine basics |

---

## Before launch — the checklist

Everything below is placeholder content. Search the HTML files for `TODO(` to find each spot
in context.

- [ ] **Venue name and address** — `index.html`, the "Venue & directions" section and the
      structured-data block at the bottom of the file. Currently "I-80 Event Center,
      1234 Interstate Drive, Your City, NE 68000".
- [ ] **Google Map** — replace the `<iframe src="...">` in the venue section. In Google Maps:
      find the venue → Share → Embed a map → copy the `src` value. Also update the
      "Open in Google Maps" button link just above it.
- [ ] **Show dates** — three places, and they need to agree:
      1. The `<time datetime="2026-11-14T09:00">` in the next-show strip (this drives the countdown)
      2. The list in the "Upcoming show dates" section
      3. The dropdown options in the vendor form (`vendors.html`)
      Also update the date mentioned in the closing "See you at the next show" band.
- [ ] **Admission and table prices** — the fact bar and pricing cards on `index.html`,
      and the pricing cards plus form dropdown on `vendors.html`.
- [ ] **Email address** — currently `info@i80cardshow.com`, used in the footer, the FAQ,
      the vendor page and the form's fallback message (`assets/js/main.js`).
- [ ] **Phone number** — currently `(555) 000-0000` in the footer and on the vendor page.
- [ ] **Social links** — Facebook, Instagram and TikTok in the footer of every page.
      Delete any you don't use.
- [ ] **Connect the reservation form** — see below. Until you do, the form tells visitors
      to email instead, so nothing gets lost.

---

## Connecting the vendor reservation form

The form at `vendors.html#reserve` validates itself in the browser but needs somewhere to
send submissions. Pick one:

### Option A — Formspree (works on any host)

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint.
2. In `vendors.html`, set the form's action:
   ```html
   <form class="form" id="vendor-form" method="POST"
         action="https://formspree.io/f/YOUR_FORM_ID" novalidate>
   ```
3. Delete the `data-netlify="true"` and `netlify-honeypot="company-website"` attributes.

Submissions land in your email and the visitor stays on the page — `main.js` posts it in the
background and shows a confirmation message.

### Option B — Netlify Forms (only if you host on Netlify)

1. Leave `data-netlify="true"` in place.
2. Set `action="/thanks.html"`.
3. Deploy to Netlify. Submissions show up under Forms in the Netlify dashboard.

Either way, the hidden `company-website` field is a spam trap — leave it alone. Real visitors
never see it; bots that fill it in get filtered.

---

## Publishing

### GitHub Pages (free, already configured)

1. Push to the `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   The workflow in `.github/workflows/pages.yml` handles the rest.
3. Under **Settings → Pages → Custom domain**, enter `www.i80cardshow.com`.
   The `CNAME` file in this repo already sets it.
4. At your domain registrar, point DNS at GitHub:
   - `www` → CNAME → `<your-github-username>.github.io`
   - root domain (`i80cardshow.com`) → A records → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
5. Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

### Netlify / Cloudflare Pages / any web host

Drag the folder in, or connect the repo. There's nothing to build — publish directory is the
repository root. If you use Netlify, delete `CNAME` and set the domain in the Netlify dashboard.

---

## Editing tips

- **Colors** — every color is a variable at the top of `assets/css/styles.css`. The palette
  comes from the logo: interstate red `#c8242a`, shield blue `#1b3fae`, gold `#f7c52b`,
  deep space `#070b1c`.
- **Adding an FAQ** — copy any `<details>` block in the FAQ section and edit the text.
- **Adding a show date** — copy a `.date-row` block. Move the `date-row--next` class and the
  "Next show" tag to whichever show is coming up next.
- **The countdown** — reads the `datetime` attribute on `#next-show-date` and nothing else.
  Update that one attribute and the clock follows.
- **The logo** — `assets/img/logo-original.png` is the untouched file. The `logo*.png` /
  `logo*.webp` files are circle-cropped and resized for the web. If you change the logo,
  re-crop the corners so it sits cleanly on the dark background.

## Local preview

Any static file server works:

```bash
npx http-server -p 8080 .
# then open http://localhost:8080
```
