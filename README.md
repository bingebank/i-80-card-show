# www.i80cardshow.com

The website for the **I-80 Card Show** — a Pokémon & TCG card show right off Interstate 80.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework. Edit a file,
push it, and it's live.

---

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole homepage: hero, next show, show info, schedule, dates, venue, table pricing, FAQ |
| `vendors.html` | Vendor sign-up page: table rate, the sign-up form, and vendor rules |
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

- [ ] **Venue** — the site currently says "details coming soon" everywhere. When the hall is
      booked, replace the `.soon` panel in the "Venue & directions" section of `index.html`
      with the name, address, parking notes and a Google Maps embed (Maps → Share →
      Embed a map → copy the `src`). Also fill in the `location` block in the
      structured data at the bottom of the file, and put the venue back into the
      next-show strip and the show-date rows.
- [ ] **Show dates** — three places, and they need to agree:
      1. The `<time datetime="2026-11-14T09:00">` in the next-show strip (this drives the countdown)
      2. The list in the "Upcoming show dates" section
      3. The dropdown options in the vendor form (`vendors.html`)
      Also update the date mentioned in the closing "See you at the next show" band.
- [ ] **Confirm the numbers** — currently $10 admission (kids 10 and under free),
      50+ tables, $200 per 8' table. They appear in the fact bar, FAQ and rate card on
      `index.html`, and in the rate card, page intro and table dropdown on `vendors.html`.
      The dropdown lists multiples of $200 — change it if you offer a multi-table discount.
- [ ] **Email address** — currently `info@i80cardshow.com`, used in the footer, the FAQ,
      the vendor page and the form's fallback message (`assets/js/main.js`).
- [ ] **Phone number** — currently `(555) 000-0000` in the footer and on the vendor page.
- [ ] **More social links** — Instagram (`@i80card_show`) is wired up across the site.
      The Facebook and TikTok placeholders were removed rather than left pointing at dead
      links; send me the URLs (or copy the Instagram `<a>` block in the footer) to add them.
- [ ] **Connect the vendor sign-up form** — see below. Until you do, the form tells
      visitors to email instead, so nothing gets lost.

---

## The vendor sign-up form

`vendors.html` is the vendor sign-up page. The form is grouped into three sections:

**Your details** — name*, business/table name, email*, phone*, city & state*, shop website
or social.

**Your table** — how many tables*, which show*, what they sell*, whether they're buying at
their table, whether they're running live breaks or streaming, extra dealer badges needed,
sales tax ID / seller's permit, table placement request, power needed, door-prize donation.

**Last couple of things** — returning dealer, how they heard about the show, free-text
notes, vendor mailing list opt-in, and agreement to the rules*.

Fields marked * are required. The sales tax ID is optional — if your state wants a permit on
file before setup, add `required` to that input and a `taxid` message in `assets/js/main.js`.

To add a question, copy any `.field` block in the form and give it a new `id`/`name`. If it
should be required, add `required` to the input and a matching message in the `MESSAGES`
object in `assets/js/main.js`.

It validates itself in the browser but needs somewhere to send submissions. Pick one:

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
- **"Coming soon" panels** — the dashed `.soon` block is reusable anywhere details aren't
  locked in yet. Swap it out for real content when you have it.
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
