# Moving i80cardshow.com from GoDaddy to Cloudflare

The plain-English version. Follow it top to bottom. It takes about ten minutes of
clicking and then some waiting.

---

## What we're actually doing

You bought the name `i80cardshow.com` from GoDaddy. You still own it. That doesn't change.

Right now GoDaddy is the one telling the internet where that name points. We're handing
that job to Cloudflare instead, because Cloudflare will host the website and the email
forwarding for free.

**Nothing gets cancelled. Nothing gets transferred. You're just changing who gives
directions.**

---

## Before you start

Answer one question: **is anything using this domain right now?**

- A website GoDaddy is hosting for you?
- An email address at `@i80cardshow.com` that already works?

If the answer is no to both, you're clear — go ahead. If either is yes, stop and say so,
because those will break the moment you switch and we'd want a plan first.

---

## Part 1 — Make a Cloudflare account

1. Go to **dash.cloudflare.com/sign-up**
2. Type your email and make a password. Click **Sign up**.
3. Cloudflare sends you an email. Open it and click the link inside.

✅ **You'll know it worked when** you're looking at a mostly empty Cloudflare dashboard.

---

## Part 2 — Tell Cloudflare about your domain

1. Click the **+ Add** button near the top, then **Connect a domain**.
   (Depending on the day, the button might say **Add a site**. Same thing.)
2. Type `i80cardshow.com` — just that, no `www`, no `https://`.
3. Click **Continue**.
4. It asks which plan. Scroll down and pick **Free**. It's genuinely free forever.
5. Cloudflare looks up your current settings and shows you a list. Click **Continue**.

✅ **You'll know it worked when** Cloudflare shows you a page saying something like
"Complete your nameserver setup."

---

## Part 3 — Copy the two names Cloudflare gives you

On that page, Cloudflare shows **two nameservers**. They look like this:

```
dana.ns.cloudflare.com
rick.ns.cloudflare.com
```

Yours will have different first names — everyone gets random ones.

**Copy both of them somewhere you can get at them.** A note on your phone, a text to
yourself, whatever. You're about to paste them into GoDaddy.

Leave this Cloudflare tab open. You're coming back to it.

---

## Part 4 — Paste them into GoDaddy

1. Open a new tab and go to **godaddy.com**. Sign in.
2. Top right, click your name → **My Products**.
3. Find `i80cardshow.com` in the list. Click it.
4. Look for the word **Nameservers**. It's usually partway down the page.
   Next to it, click **Change** (sometimes **Manage** or **Change Nameservers**).
5. GoDaddy asks what kind you want. Pick the option that says
   **"I'll use my own nameservers"** or **"Enter my own nameservers (advanced)"**.
6. You'll get two empty boxes. Paste one Cloudflare nameserver into each.
   - Delete anything already in those boxes first.
   - No extra spaces. No `https://`. Just `dana.ns.cloudflare.com`.
7. Click **Save**.
8. GoDaddy will probably warn you that things might stop working, and may try to sell you
   something. Click through it. You checked already — nothing's using the domain.

✅ **You'll know it worked when** GoDaddy's nameserver section shows the two Cloudflare
names instead of its own.

---

## Part 5 — Wait

That's the whole job. Now the internet has to catch up.

- Usually it's done in **5 to 30 minutes**
- Sometimes a few hours
- Very occasionally up to two days

**Cloudflare emails you** with the subject line telling you the domain is active. You don't
have to sit and watch. Go do something else.

If you want to peek: go back to the Cloudflare tab and refresh. When it says **Active**
next to your domain, you're done.

---

## How you know the whole thing worked

In Cloudflare, your domain says **Active**. That's it. That's the finish line for this part.

---

## What happens after

Once it says Active, three things become possible, in this order:

1. **The website goes live** — Cloudflare Pages, connected to this repo
2. **Email starts working** — `info@i80cardshow.com` on Zoho
3. **The forms start collecting** — Formspree

All three are written up in the main [README](../README.md). None of them work until this
nameserver change is done, which is why it's first.

---

## If something looks wrong

**GoDaddy says it can't save the nameservers.**
The domain might be locked. In GoDaddy, look for **Domain Lock** on the same page and turn
it off, then try again.

**Cloudflare still says "Pending" after a day.**
Go back to GoDaddy and check the nameservers are typed exactly right. A single typo or a
stray space stops the whole thing.

**You accidentally deleted something.**
Don't panic, and don't start fixing it by guessing. Nothing here is permanent. Say what
happened and it can be put back.

**Anything else.**
Take a screenshot of what you're looking at. That's usually enough to sort it out in one go.
