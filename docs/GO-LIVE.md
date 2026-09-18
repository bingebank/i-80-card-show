# Going live

DNS is on Cloudflare already. This is the rest, in the order that matters.

Steps 1–3 get the site up and working. Step 4 can happen after launch.

---

## Step 1 — Turn on email first (5 minutes)

**Do this before the site is public.**

Every contact path on the site says `info@i80cardshow.com`: the footer, the FAQ, the
"Email the show" button, and the message both forms show while they're not wired up. Right
now that address doesn't exist. Launch without it and every person who tries to reach you
bounces.

Cloudflare Email Routing fixes it in five minutes, free:

1. Cloudflare dashboard → click `i80cardshow.com` → **Email** in the left menu →
   **Email Routing** → **Get started**
2. It offers to add the records it needs. **Accept.**
3. Destination address: `bingebank@gmail.com`. Cloudflare emails you a verification link —
   click it.
4. Create the route: `info@i80cardshow.com` → `bingebank@gmail.com`
5. Turn on **catch-all** too, so `vendors@`, `hello@` and every typo reach you.

✅ Test it: email `info@i80cardshow.com` from your phone. It should land in Gmail.

> This forwards mail but doesn't send it — replies go out from your Gmail address. That's
> fine for launch. Zoho (a real mailbox that sends from your domain) can replace it later;
> it's a DNS change, and the website doesn't care either way. **Don't run both** — they
> both want the MX records.

---

## Step 2 — Put the site up

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**
2. Authorize GitHub if it asks, then pick the **i-80-card-show** repository
3. Settings:
   - **Production branch:** `claude/i80cardshow-website-ydrhh9`
     *(the only branch that exists — pick it from the dropdown)*
   - **Framework preset:** None
   - **Build command:** leave empty
   - **Build output directory:** `/`
4. **Save and Deploy**

It takes about a minute. You get a URL like `i-80-card-show.pages.dev`.

✅ **Open that URL.** The site should look exactly like the screenshots. Click around,
try the forms, check it on your phone.

Every push to that branch redeploys automatically from here on.

---

## Step 3 — Put your domain on it

1. In the Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `www.i80cardshow.com` → Cloudflare adds the DNS record itself → **Activate**
3. Do it again for `i80cardshow.com` (no www)
4. Now send the bare domain to the www one, so you don't have two copies of the site
   competing in Google:
   - Left menu → **Rules** → **Redirect Rules** → **Create rule**
   - Name: `apex to www`
   - If: **Hostname** **equals** `i80cardshow.com`
   - Then: **Dynamic redirect**, status **301**
   - Expression: `concat("https://www.i80cardshow.com", http.request.uri.path)`
   - **Preserve query string:** on
   - Deploy

✅ **Open www.i80cardshow.com.** HTTPS should work on its own — Cloudflare issues the
certificate. If it complains about the certificate for the first few minutes, that's
normal; give it up to fifteen.

**You are live.**

---

## Step 4 — Wire up the forms

The site works without this — both forms tell people to email instead, and that email now
works. But you're leaving sign-ups on the table, so don't wait long.

1. Sign up at [formspree.io](https://formspree.io) using `bingebank@gmail.com`
2. **New Form** → `I-80 Vendor Sign-Up` → copy the ID from its endpoint
   (`https://formspree.io/f/`**`xdkolqwz`**)
3. **New Form** → `I-80 Date Announcements` → copy that ID too
4. Click the confirmation email Formspree sends, or nothing gets delivered
5. Either send both IDs over to be committed, or run it yourself:

   ```bash
   node tools/set-form-endpoints.mjs --vendor <vendor-id> --notify <announcement-id>
   ```

6. Commit and push. Cloudflare redeploys on its own.

✅ Test it: submit each form on the live site and confirm the email arrives.

---

## Step 5 — Two minutes of housekeeping

- **Turn on analytics.** Pages project → **Analytics** → enable Web Analytics. One toggle,
  free, no cookie banner. Now you can see whether anyone's showing up.
- **Post the link.** Put `www.i80cardshow.com` in the Instagram bio. That's your traffic
  source until the show has a date.
- **Tell Google it exists.** [Google Search Console](https://search.google.com/search-console)
  → add `www.i80cardshow.com` → verify (Cloudflare makes this a couple of clicks) → submit
  `https://www.i80cardshow.com/sitemap.xml`. Indexing takes days, so start it now.

---

## What to do the moment the venue is signed

The site is built to absorb this in one pass — see
[Adding the dates back](../README.md#adding-the-dates-back) in the README. The countdown,
the season calendar and the Google event listing are all written and waiting on a date.

And email everyone who signed up through the announcement form. That's the whole reason
it's there.
