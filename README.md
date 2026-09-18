# www.i80cardshow.com

The website for the **I-80 Card Show** — a Sacramento-area Pokémon & TCG card show right off
Interstate 80.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework. Edit a file,
push it, and it's live.

---

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole homepage: hero, next show, show info, schedule, dates, venue, table pricing, FAQ |
| `vendors.html` | Vendor sign-up page: table rate, the sign-up form, and vendor rules |
| `thanks.html` | Confirmation page, for form endpoints that redirect instead of posting in the background |
| `404.html` | Page-not-found page |
| `assets/css/styles.css` | All styling. Colors live in the `:root` block at the top |
| `assets/js/main.js` | Mobile menu, countdown clock, form validation |
| `assets/img/` | Logo, favicons, social share image |
| `_headers` | Cloudflare Pages: caching and security headers |
| `_redirects` | Cloudflare Pages: the `/ig` short link to Instagram |
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
      1. The `<time datetime="2026-11-14T09:00-08:00">` in the next-show strip (this drives
         the countdown). Keep the Pacific offset: `-08:00` in winter, `-07:00` during
         daylight saving, so the clock is right for out-of-town visitors.
      2. The list in the "Upcoming show dates" section
      3. The dropdown options in the vendor form (`vendors.html`)
      Also update the date mentioned in the closing "See you at the next show" band.
- [ ] **Confirm the numbers** — currently $10 admission (kids 10 and under free),
      50+ tables, $200 per 8' table. They appear in the fact bar, FAQ and rate card on
      `index.html`, and in the rate card, page intro and table dropdown on `vendors.html`.
      The dropdown lists multiples of $200 — change it if you offer a multi-table discount.
- [ ] **Email** — set up Cloudflare Email Routing so `info@i80cardshow.com` forwards to
      `bingebank@gmail.com` (see "Email at i80cardshow.com" below). The site already uses
      that address everywhere, so nothing on the site changes.
- [ ] **Phone number** — there isn't one on the site. The placeholder was removed rather
      than shipped; contact runs through email and Instagram DMs. Send me a number if you
      want one in the footer.
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

Fields marked * are required — including the CA seller's permit number, since California
requires special-event operators to keep one on file for every seller (CDTFA). If you'd
rather collect it later, drop `required` from that input in `vendors.html`.

To add a question, copy any `.field` block in the form and give it a new `id`/`name`. If it
should be required, add `required` to the input and a matching message in the `MESSAGES`
object in `assets/js/main.js`.

It validates itself in the browser but needs somewhere to send submissions:

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint.
2. In `vendors.html`, paste it into the form's action:
   ```html
   <form class="form" id="vendor-form" method="POST"
         action="https://formspree.io/f/YOUR_FORM_ID" novalidate>
   ```

That's it. Sign-ups land in whatever inbox you registered with Formspree — point it at
`info@i80cardshow.com` once Email Routing is live. `main.js` posts the form in the
background, so the visitor stays on the page and gets a confirmation message instead of
being bounced to another screen.

The free tier covers 50 submissions a month, which is plenty for a vendor list; their paid
tier is cheap if a show blows past it.

The hidden `_gotcha` field is a spam trap — leave it alone. Real visitors never see it, and
Formspree drops any submission that fills it in.

---

## Email at i80cardshow.com

**info@i80cardshow.com** forwards to **bingebank@gmail.com** using Cloudflare Email Routing.
It's free, and the site already uses that address everywhere (footer, FAQ, vendor page, and
the form's fallback message), so nothing on the site needs to change.

This requires your DNS to be on Cloudflare — see step 1 of Publishing below.

### Setting it up

1. Cloudflare dashboard → your domain → **Email → Email Routing → Get started**.
2. Cloudflare offers to add the MX and TXT records for you. Accept — it replaces GoDaddy's
   default `secureserver.net` MX records, which is what you want.
3. Add a destination address: `bingebank@gmail.com`. Cloudflare emails it a verification
   link — click it.
4. Create the route: custom address `info@i80cardshow.com` → send to `bingebank@gmail.com`.
5. Optionally add a **catch-all** so anything sent to `@i80cardshow.com` reaches you too —
   worth it for the inevitable `vendors@`, `hello@` and typos. It also means you can print
   any address you like without setting it up first.

Test it by emailing `info@i80cardshow.com` from an outside account. Delivery is usually
instant once DNS is active.

### The catch, and how to fix it later

Email Routing **forwards only**. Mail arrives in your Gmail, but when you hit reply it goes
out as `bingebank@gmail.com`, not `info@i80cardshow.com`. For vendors sending $200 that's a
small credibility hit.

If that starts to matter, Gmail can send *as* your domain address — Gmail → Settings → Accounts →
"Send mail as" — but it needs an SMTP server, which Email Routing doesn't provide. Options:

- A free SMTP relay (Resend, SMTP2GO, Brevo all have free tiers) wired into Gmail's "Send mail as".
- A real mailbox instead: **Zoho Mail** free plan, or **Google Workspace** at roughly $7–8 per
  user per month. Either replaces the forwarding rule; the MX records change, nothing else does.

Start with forwarding. It takes five minutes and costs nothing — upgrade when the show is
running and the reply address starts to bug you.

---

## Publishing — Cloudflare Pages

The site is a plain static folder: no build step, no dependencies. Cloudflare Pages serves it
straight from the repo.

### 1. Point the domain at Cloudflare

Cloudflare needs to run your DNS before Pages custom domains or Email Routing will work.
You do **not** have to move the registration away from GoDaddy to do this.

1. Create a free account at [cloudflare.com](https://cloudflare.com) → **Add a site** →
   `i80cardshow.com` → Free plan.
2. Cloudflare scans your existing DNS records. Check the list it imports, then continue.
3. It gives you two nameservers (something like `xxx.ns.cloudflare.com`).
4. In GoDaddy: My Products → Domains → i80cardshow.com → **Nameservers → Change** →
   "I'll use my own nameservers" → paste both Cloudflare nameservers.
5. Wait for Cloudflare to confirm the zone is active — usually minutes, occasionally a few hours.

Optional, later: **transfer the registration** to Cloudflare Registrar (Domains → Transfer).
It sells at wholesale cost with no markup, but a domain can't be transferred within 60 days
of registration or of a recent registrant change. Moving nameservers now and transferring
later is perfectly normal.

### 2. Deploy the site

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick this repository and the branch you want to publish (`main`).
3. Build settings:
   - Framework preset: **None**
   - Build command: **leave empty**
   - Build output directory: **`/`**
4. Save and deploy. Every push to that branch redeploys automatically, and pull requests get
   their own preview URL.

### 3. Add the custom domain

1. In your Pages project → **Custom domains → Set up a custom domain** → `www.i80cardshow.com`.
   Cloudflare adds the DNS record for you.
2. Add `i80cardshow.com` (the bare domain) the same way.
3. The site's canonical URLs are the `www` ones, so send the bare domain to `www` instead of
   serving both: dashboard → your domain → **Rules → Redirect Rules → Create rule**
   - If: Hostname equals `i80cardshow.com`
   - Then: Dynamic redirect, status **301**, expression
     `concat("https://www.i80cardshow.com", http.request.uri.path)`
   - Preserve query string: on

`_headers` and `_redirects` in the repo root are read by Pages automatically — they set
caching and security headers, and the `/ig` short link that forwards to Instagram (handy on
a flyer or a table sign).

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
