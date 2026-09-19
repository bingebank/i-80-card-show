# Putting the website on the internet

The plain-English version. Do the jobs in order. Each one has a "you'll know it worked
when" so you're never guessing.

---

## Status: LIVE

**https://www.i80cardshow.com** — deployed and serving.

- ✅ Domain on Cloudflare
- ✅ Site deployed as a **Cloudflare Worker** (static assets) from the `main` branch
- ✅ `www.i80cardshow.com` attached via a **Worker Route** (`www.i80cardshow.com/*`)
- ⬜ Email — `info@i80cardshow.com` still has no MX records, so mail bounces
- ⬜ The two forms — need Formspree endpoints
- ⬜ `i80cardshow.com` without the `www` — route wouldn't save, cosmetic only

### How it actually got deployed

Cloudflare's dashboard now pushes new projects through the **Workers** flow rather than
Pages, so the site runs as an assets-only Worker configured by `wrangler.jsonc`. Workers
static assets honours `_headers` and `_redirects` just like Pages does, so caching,
security headers and the `/ig` short link all work as designed.

**Pushing to `main` redeploys automatically.**

### Two traps worth remembering

**"Add Domain" vs "Add Route".** Add Domain insists on creating its own DNS record and
fails with *"Hostname already has externally managed DNS records"* when anything already
exists on that name. **Add Route** uses the existing proxied record instead — that's what
finally worked. Route pattern: `www.i80cardshow.com/*` (domain, slash, star).

**The subdomain box is not the full domain.** Cloudflare appends the zone for you. Typing
`www.i80cardshow.com` produces `www.i80cardshow.com.i80cardshow.com`. Type only `www`, or
leave it empty for the root.

**Browser cache after going live.** A redirect served during setup gets cached hard by
browsers, which then show the old page without asking the network. Check in a private
window before believing anything is broken.

---

# Job 1 — Make the email work ⬜ STILL TO DO

**Do this one first.**

Here's why. All over the website it says "email us at **info@i80cardshow.com**." That
address doesn't exist yet. If you switch the site on before you do this, every single
person who tries to contact you gets a bounce-back. You'd never even know they tried.

Five minutes fixes it, for free.

### The steps

1. Go to **dash.cloudflare.com** and sign in
2. **Click on i80cardshow.com in your list of websites.** This bit matters — see the
   warning below.
3. Down the left side there's a menu. Click **Email**
   (it might be a collapsed heading — click it to open it)
4. Click **Email Routing**
5. Click the big **Get started** button
6. Cloudflare says it needs to add some settings. Say **yes** / **Add records**.
   (It's just telling the internet where your mail should go.)
7. It asks where you want your mail delivered. Type **bingebank@gmail.com**
8. **Go check that Gmail inbox.** Cloudflare sent it a link. Click the link.
   Nothing works until you do.
9. Back in Cloudflare, make the rule:
   - Address: **info@i80cardshow.com**
   - Send it to: **bingebank@gmail.com**
   - Save
10. Look for a switch called **Catch-all address** and turn it **on**.
    This means anything@i80cardshow.com reaches you — `vendors@`, `hello@`, typos, all of it.

✅ **You'll know it worked when:** you send an email from your phone to
`info@i80cardshow.com` and it shows up in your Gmail.

### ⚠️ "I don't see Email in the menu, only Security"

You're one level too high. Cloudflare has two different left-hand menus:

- **Account level** — where you land after logging in. Shows Workers & Pages, R2,
  Zero Trust, and **Email Security**. That's a different, paid product. Not what you want.
- **Domain level** — after you click on `i80cardshow.com`. This is where **Email Routing**
  lives.

Check your browser's address bar. It should have your domain in it, like
`dash.cloudflare.com/<numbers>/i80cardshow.com`. No domain in the address bar means you're
still at account level.

**Shortcut that skips the hunting:** paste this into your address bar —

```
https://dash.cloudflare.com/?to=/:account/i80cardshow.com/email/routing
```

Cloudflare fills in the account part itself and takes you straight there.

> **Heads up:** this catches mail, it doesn't send it. When you hit reply, it goes out from
> your Gmail address. That's fine for now. We can upgrade it later.

---

# Job 2 — Switch the website on ✅ DONE

Cloudflare is going to look at your GitHub, take the website files, and put them on the
internet. You don't have to upload anything.

### The steps

1. Still in **dash.cloudflare.com**
2. Down the left side, click **Workers & Pages**
3. Click **Create**
4. Along the top there are tabs. Click the **Pages** tab
5. Click **Connect to Git**
6. It asks to connect to GitHub. Say yes. A GitHub window pops up — approve it.
7. A list of your projects appears. Click **i-80-card-show**
8. Click **Begin setup**
9. Now a settings page. **Only four things matter:**

   | It asks for | You put |
   | --- | --- |
   | Production branch | **main** ← pick it from the dropdown |
   | Framework preset | **None** |
   | Build command | **leave it empty** |
   | Build output directory | **/** ← just a forward slash |

   Ignore everything else on that page.

10. Click **Save and Deploy**
11. Wait about a minute. You'll see text scrolling — that's normal, let it finish.

✅ **You'll know it worked when:** it gives you a link ending in **.pages.dev**.
Click it. **Your website appears.**

**Go look at it properly.** Click the buttons. Scroll to the bottom. Open it on your phone.
This is the real site — it's just wearing a temporary address.

---

# Job 3 — Put your own name on it ✅ DONE (www)

Right now the site lives at that ugly `.pages.dev` address. Let's move it to
`www.i80cardshow.com`.

### The steps

1. You should still be looking at your new Pages project. If not:
   **Workers & Pages** → click **i-80-card-show**
2. Along the top, click the **Custom domains** tab
3. Click **Set up a custom domain**
4. Type: **www.i80cardshow.com**
5. Click **Continue**, then **Activate domain**
6. Cloudflare sorts out the technical bit by itself. Wait for it to say **Active**.
7. **Do steps 3 to 5 again**, but this time type **i80cardshow.com** (no `www.`)

✅ **You'll know it worked when:** you type **www.i80cardshow.com** into your phone and
your website loads.

> The little padlock (https) turns itself on. If your browser complains about security for
> the first ten or fifteen minutes, that's normal — it sorts itself out. Get a coffee.

**At this point you are live.** People can find you. You can put the link in your Instagram
bio right now.

---

# Job 4 — The fiddly one (do it after coffee)

This one's optional-ish, and it's the only genuinely annoying step. It makes
`i80cardshow.com` send people to `www.i80cardshow.com`, so you don't end up with two copies
of your website competing against each other on Google.

**If this bit makes your eyes cross, stop and send me a screenshot — I'll talk you through
it.** The site works fine without it.

1. Go back to the main Cloudflare dashboard and click **i80cardshow.com**
2. Left menu → **Rules** → **Redirect Rules**
3. Click **Create rule**
4. Fill it in:
   - **Rule name:** `send bare domain to www`
   - **When incoming requests match:** choose **Custom filter expression**
   - Field: **Hostname** · Operator: **equals** · Value: `i80cardshow.com`
   - **Then... Type:** choose **Dynamic**
   - **Expression** — copy this exactly:
     ```
     concat("https://www.i80cardshow.com", http.request.uri.path)
     ```
   - **Status code:** `301`
   - **Preserve query string:** turn it **on**
5. Click **Deploy**

✅ **You'll know it worked when:** you type `i80cardshow.com` (no www) and it jumps to
`www.i80cardshow.com` by itself.

---

# Job 5 — The forms ⬜ STILL TO DO

The two forms on the site (vendor sign-up, and "email me the date") aren't collecting yet.
Anyone who uses them is told to email you instead — and now that email works, nothing gets
lost. So this isn't urgent. But don't leave it a month.

1. Go to **formspree.io** and sign up with **bingebank@gmail.com**
2. Make a form called **I-80 Vendor Sign-Up**
3. Make another one called **I-80 Date Announcements**
4. Each one gives you a web address like `https://formspree.io/f/abcdwxyz`.
   The last bit — `abcdwxyz` — is what I need.
5. **Send me both of those codes** and I'll plug them in.

---

# If something goes wrong

**The list of GitHub projects is empty.**
Cloudflare probably didn't get permission to see it. There's usually a link saying
**Add account** or **Configure GitHub** — click it and tick the `i-80-card-show` project.

**The website loads but looks broken — no colours, no pictures.**
The "Build output directory" setting is wrong. It must be exactly **/** — one forward
slash, nothing else. You can fix it in **Settings → Builds & deployments** and redeploy.

**You can't find a button I mentioned.**
Cloudflare moves things around. Take a screenshot of what you're looking at and send it to
me — I'll tell you where it went.

**Something looks scary or you think you broke it.**
You almost certainly didn't, and nothing here is permanent. Stop, screenshot it, send it
over. Don't click things at random trying to fix it — that's how small problems become big
ones.

---

# When you're done

Send me the **.pages.dev** link and the real one. I can check both from outside your
account — whether the pages load, whether the pictures arrive, whether the forms behave,
whether it looks right on a phone. Better than us both guessing.
