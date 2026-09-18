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
| `tools/set-form-endpoints.mjs` | Wires the Formspree endpoints into both forms |
| `docs/MOVING-TO-CLOUDFLARE.md` | Click-by-click guide to the GoDaddy → Cloudflare switch |
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
- [ ] **Show dates** — currently TBD by design: the site runs a "dates announcing soon"
      strip and an email capture instead of a countdown. See "Adding the dates back" below
      when the venue is signed. When you do, three places need to agree:
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
- [ ] **Email** — set up `info@i80cardshow.com` on Zoho Mail's free plan (see
      "Email at i80cardshow.com" below). The site already uses that address everywhere,
      so nothing on the site changes.
- [ ] **Phone number** — there isn't one on the site. The placeholder was removed rather
      than shipped; contact runs through email and Instagram DMs. Send me a number if you
      want one in the footer.
- [ ] **More social links** — Instagram (`@i80card_show`) is wired up across the site.
      The Facebook and TikTok placeholders were removed rather than left pointing at dead
      links; send me the URLs (or copy the Instagram `<a>` block in the footer) to add them.
- [ ] **Connect both forms to Formspree** — the vendor sign-up and the date-announcement
      capture. See "The vendor sign-up form" below; it's two IDs and one command. Until
      then both forms tell visitors to email instead, so nothing gets lost.

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

Both forms validate in the browser already. What they need is somewhere to send
submissions — that's Formspree, and it's two IDs.

### Create the two forms

1. Sign up at [formspree.io](https://formspree.io) with `bingebank@gmail.com` (switch it to
   `info@i80cardshow.com` once that mailbox exists — Formspree emails submissions to
   whatever address is on the account).
2. **New Form** → name it `I-80 Vendor Sign-Up` → create.
3. **New Form** again → name it `I-80 Date Announcements` → create.
4. Each form's page shows an endpoint like `https://formspree.io/f/xdkolqwz`. The part
   after `/f/` is the form ID. Copy both.
5. Confirm the address Formspree emails you — it won't deliver until you click that link.

### Wire them in

From the repo, one command:

```bash
node tools/set-form-endpoints.mjs --vendor <vendor-id> --notify <announcement-id>
```

It takes the bare ID or the whole URL, patches both files, and prints what it changed. Run
it again any time to swap IDs, or pass `none` to clear one back to the "email us instead"
fallback.

Prefer doing it by hand? Set the `action` attribute on `<form id="vendor-form">` in
`vendors.html` and `<form id="notify-form">` in `index.html`:

```html
<form class="form" id="vendor-form" method="POST"
      action="https://formspree.io/f/YOUR_FORM_ID" ...>
```

Then commit and push — Cloudflare Pages redeploys on its own.

### Test it before you advertise it

Submit each form once on the live site and confirm the email arrives. The first submission
to a new Formspree form triggers a confirmation email — click it, or nothing else gets
through.

### Worth knowing

- **The free tier is 50 submissions a month, account-wide** — both forms share that pool.
  Fine for a vendor list; if an announcement goes viral you'll hit it. Formspree emails you
  at the cap, and their paid tier is cheap if that day comes.
- `main.js` posts the form in the background, so the visitor stays on the page and gets a
  confirmation message instead of being bounced to another screen.
- The hidden `_gotcha` field is a spam trap — leave it alone. Real visitors never see it,
  and Formspree drops any submission that fills it in.
- The hidden `source` field tags each submission (`homepage-dates`, `vendor-page`) so you
  can tell which part of the funnel produced it.
- Until an endpoint is set, each form tells the visitor to email instead — nothing silently
  disappears.

---

## Email at i80cardshow.com

The site uses **info@i80cardshow.com** everywhere (footer, FAQ, vendor page, and the form's
fallback message), so once the mailbox exists nothing on the site changes.

**Current plan: Zoho Mail's free tier** — a real mailbox that sends *and* receives as
`info@i80cardshow.com`, at no cost. Zoho works fine with Cloudflare DNS; you just add its
records in the Cloudflare dashboard.

> Only one mail provider can own your MX records. If you ever switch on Cloudflare Email
> Routing, turn it off before pointing MX at Zoho, or mail will bounce.

### Setting up Zoho Mail (free)

1. Go to [zoho.com/mail](https://www.zoho.com/mail/) → pricing → scroll to the bottom for
   the **Forever Free Plan** (it's below the paid tiers, easy to miss). Sign up with
   `i80cardshow.com` as your domain.
2. **Verify the domain.** Zoho gives you a TXT (or CNAME) record. In Cloudflare →
   your domain → **DNS → Records → Add record**, paste exactly what Zoho shows.
   If Zoho hands you a CNAME, set the proxy toggle to **DNS only** (grey cloud) or
   verification fails.
3. **Create the mailbox** `info@i80cardshow.com` when Zoho prompts for the first user.
4. **Add the MX records** (US data centre values — use whatever Zoho shows you, they differ
   by region):

   | Type | Name | Mail server | Priority |
   | --- | --- | --- | --- |
   | MX | `@` | `mx.zoho.com` | 10 |
   | MX | `@` | `mx2.zoho.com` | 20 |
   | MX | `@` | `mx3.zoho.com` | 50 |

   Delete any other MX records first — GoDaddy's `secureserver.net` ones, and Cloudflare's
   Email Routing ones if you turned that on.

5. **Add SPF:**

   | Type | Name | Content |
   | --- | --- | --- |
   | TXT | `@` | `v=spf1 include:zoho.com ~all` |

   One SPF record per domain — merge, don't add a second.

6. **Add DKIM.** In Zoho Mail Admin → Domains → your domain → Email Configuration → DKIM →
   Add selector. Zoho gives you a selector (usually `zmail`) and a long key:

   | Type | Name | Content |
   | --- | --- | --- |
   | TXT | `zmail._domainkey` | the `v=DKIM1; k=rsa; p=...` string from Zoho |

7. **Add DMARC:**

   | Type | Name | Content |
   | --- | --- | --- |
   | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:info@i80cardshow.com` |

8. **Add aliases, not users.** In Zoho Admin → Users → your user → Mail Aliases, add
   `vendors@`, `hello@`, whatever you want. Aliases are free and land in the same inbox;
   extra *users* eat into your five.

Test by emailing the address from an outside account, then send one to
[mail-tester.com](https://www.mail-tester.com) to confirm SPF, DKIM and DMARC pass.

### What "free" costs you

Zoho's free plan is genuinely free, but check the current terms when you sign up — they've
tightened it over the years. As it stands:

- **Webmail and Zoho's own mobile app only.** No IMAP, POP or SMTP on the free tier, which
  means it will *not* plug into the Gmail app, Apple Mail or Outlook. You check it at
  mail.zoho.com or in the Zoho Mail app — one more app on your phone.
- Up to 5 users, 5 GB each, one domain, 25 MB attachment cap.

If the separate-app thing wears thin, **Zoho Mail Lite is about $1 per user per month** and
adds IMAP/POP/SMTP — at which point you can run it through Gmail properly, or use Gmail's
"Send mail as" to send from `info@i80cardshow.com` inside your normal inbox. That's the
cheapest real upgrade and worth remembering before anyone talks you into Google Workspace
at $7.

### The other free option (for reference)

**Cloudflare Email Routing** forwards `info@i80cardshow.com` to `bingebank@gmail.com` for
free, in about five minutes, with no extra app — everything lands in the Gmail you already
check. The catch is that it only *receives*: hit reply and it goes out as
`bingebank@gmail.com`. Fine for a personal project, less good when a vendor is deciding
whether to send you $200.

Zoho free trades convenience for looking legitimate. Routing trades looking legitimate for
convenience. Nothing stops you switching later — it's a DNS change, and the site doesn't
care either way.

---

## Publishing — Cloudflare Pages

The site is a plain static folder: no build step, no dependencies. Cloudflare Pages serves it
straight from the repo.

### 1. Point the domain at Cloudflare

> Want this bit spelled out click by click? See
> [docs/MOVING-TO-CLOUDFLARE.md](docs/MOVING-TO-CLOUDFLARE.md).

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

---

## How the funnel works

The site has two jobs: get collectors onto the announcement list, and get dealers to sign up
for tables. Everything else is in service of one of those two.

### The path

1. **Hero** — who we are, what's in the room, one line of proof.
2. **Announcement strip** — the state of play ("dates announcing soon") plus both actions.
3. **The fork** (`.fork`) — the split, high on the page so nobody reads the wrong half:
   *Coming to shop* → the email capture. *Setting up a table* → the vendor page.
4. **Fact bar** — the four numbers that qualify or disqualify someone instantly:
   admission, kids, tables, table price.
5. **What you'll find / how the day runs** — desire, for people who need convincing.
6. **Mid-page CTA band** — the catch, right after the pitch lands.
7. **Dates section** — the email capture itself.
8. **Venue, vendor rate, FAQ** — detail and objection handling.
9. **Closing CTA + footer** — last chance, plus Instagram as the low-commitment option.

On phones a **sticky bar** (`.cta-bar`) pins both actions to the bottom of the screen, so the
next step is one tap away no matter how far down someone has scrolled. It's hidden above
900px, where the header button is always visible anyway.

### The two conversions

| | Collectors | Dealers |
| --- | --- | --- |
| Ask | One email address | The full sign-up form |
| Where | `#dates` on the homepage | `vendors.html#reserve` |
| Friction | Deliberately near zero | Deliberately higher — it qualifies |
| You get | A list to announce the date to | A vendor with a permit number and a table count |

The vendor form is long on purpose. Someone who won't answer twelve questions probably
wasn't going to pay $200 and show up at 7am. The email capture is one field on purpose —
that's a maybe, not a commitment, and you convert it later by email.

### Knowing what's working

- **Each form posts a hidden `source` field** (`homepage-dates`, `vendor-page`), so every
  submission tells you which part of the funnel it came from. Add more entry points by
  copying a form and changing that value.
- **The vendor form asks "how did you hear about the show?"** — that's your channel data,
  straight from the dealer.
- **Turn on Cloudflare Web Analytics**: Cloudflare dashboard → your Pages project →
  Analytics. One toggle, no code, no cookie banner, free. It gives you page views and
  referrers without Google Analytics' bloat or privacy baggage.
- **The `/ig` short link** in `_redirects` forwards to Instagram. Print it on flyers and
  table signs; the redirect shows up in analytics, so you can see whether print is working.

### If you want more from it later

- A discount code or free-entry offer for the email list gives people a reason to sign up now.
- A "dealers attending" section converts browsers — collectors come to see specific dealers.
- Photos from the first show, once it happens. Nothing sells show two like a full room at
  show one.

## Adding the dates back

Dates are TBD, so the site currently runs an announcement strip and an email capture
instead of a countdown and a season calendar. The CSS and JavaScript for both are still in
place — nothing to rebuild, just markup to paste back.

### 1. The countdown

In `index.html`, replace the contents of `.showstrip__inner` with:

```html
<div class="showstrip__when">
  <span class="showstrip__label">Next show</span>
  <p class="showstrip__date">
    <time id="next-show-date" datetime="2027-03-13T09:00-08:00">Sat, March 13, 2027</time>
  </p>
  <p class="showstrip__meta">9:00 AM – 3:00 PM · Venue name · Sacramento</p>
</div>

<div class="countdown" id="countdown" aria-live="polite">
  <div class="countdown__unit"><span class="countdown__num" data-unit="days">--</span><span class="countdown__label">Days</span></div>
  <div class="countdown__unit"><span class="countdown__num" data-unit="hours">--</span><span class="countdown__label">Hours</span></div>
  <div class="countdown__unit"><span class="countdown__num" data-unit="minutes">--</span><span class="countdown__label">Min</span></div>
  <div class="countdown__unit"><span class="countdown__num" data-unit="seconds">--</span><span class="countdown__label">Sec</span></div>
</div>

<a class="btn btn--red showstrip__cta" href="#venue">Get directions</a>
```

`main.js` wires the clock up on its own — it reads that `datetime` attribute and nothing
else. **Keep the Pacific offset on the end:** `-08:00` in winter, `-07:00` during daylight
saving, so the countdown is right for out-of-town visitors too.

### 2. The season calendar

In the `#dates` section, swap the sign-up form for rows like these (styles already written):

```html
<div class="dates">
  <div class="date-row date-row--next">
    <div class="date-row__date">Sat, Mar 13, 2027</div>
    <div class="date-row__meta">9:00 AM – 3:00 PM · Venue name · Spring show</div>
    <span class="tag">Next show</span>
  </div>
  <div class="date-row">
    <div class="date-row__date">Sat, Jun 12, 2027</div>
    <div class="date-row__meta">9:00 AM – 3:00 PM · Venue name · Summer show</div>
    <span class="tag tag--muted">Tables open</span>
  </div>
</div>
```

Move `date-row--next` and the "Next show" tag along as each show passes.

### 3. The Event structured data

The page currently publishes an `Organization` block, not an `Event` — an Event carrying a
placeholder date can put a wrong date straight into Google's results. Once a real date
exists, add this **alongside** the existing block at the bottom of `index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "I-80 Card Show",
  "description": "Sacramento-area Pokemon and TCG card show with 50+ dealer tables.",
  "startDate": "2027-03-13T09:00-08:00",
  "endDate": "2027-03-13T15:00-08:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "url": "https://www.i80cardshow.com/",
  "image": "https://www.i80cardshow.com/assets/img/og-image.jpg",
  "location": {
    "@type": "Place",
    "name": "Venue name",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Example Ave",
      "addressLocality": "Sacramento",
      "addressRegion": "CA",
      "postalCode": "95814",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "I-80 Card Show",
    "url": "https://www.i80cardshow.com/"
  },
  "offers": {
    "@type": "Offer",
    "name": "General admission",
    "price": "10",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://www.i80cardshow.com/",
    "validFrom": "2026-01-01T00:00-08:00"
  }
}
</script>
```

Check it afterwards with Google's [Rich Results Test](https://search.google.com/test/rich-results).

### 4. The rest

- Vendor form: replace the generic "which show" options in `vendors.html` with real dates.
- Venue section: swap the `.soon` panel for the address, parking notes and a Maps embed.
- Day-of schedule: confirm the times and drop the "exact times get confirmed" line.
- Announcement email: everyone who signed up through the `#dates` form is waiting on it.

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
