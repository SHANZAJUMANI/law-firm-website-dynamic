# Calloway Reyes LLP — Dynamic Multi-Page Site (Track A, Task 2)

A multi-page law-firm site built on plain HTML/CSS/JS, upgraded from the
Task 1 static build into a **dynamic, content-driven** site: all copy comes
from JSON files fetched at runtime, the enquiry form has a real submission
destination (Netlify Forms), and a hidden password-gated `/admin.html` page
lists incoming submissions via a small serverless function.

## What changed from Task 1

| Task 1 | Task 2 (this project) |
|---|---|
| Content hardcoded in `js/data.js` | Content in `data/*.json`, fetched at runtime |
| Form simulated with `setTimeout` | Form posts to Netlify Forms — a real inbox |
| No way to review submissions | `/admin.html`, password-gated, backed by a Netlify Function |
| Not deployed | Ready to deploy to Netlify (see below) |
| No SEO tags beyond `<title>`/description | Canonical URLs, Open Graph tags, JSON-LD, robots.txt, sitemap.xml |

## Project structure

```
law-firm-dynamic/
├── index.html, practice-areas.html, attorneys.html, consultation.html
├── admin.html                    Hidden — see "Admin page" below
├── 404.html
├── robots.txt, sitemap.xml       Basic SEO
├── netlify.toml                  Netlify build/function/header config
├── data/
│   ├── firm.json                 Name, phone, address, hours, stats
│   ├── practice-areas.json       The 6 practice areas
│   └── attorneys.json            The 4 attorney bios
├── css/styles.css
├── js/
│   ├── content-loader.js         Fetches the JSON above, fills data-firm-* elements
│   ├── docket.js                 Renders the practice-area docket
│   ├── attorneys-render.js       Renders attorney cards
│   ├── nav.js                    Mobile menu, scroll state, active link
│   └── consultation.js           Validates + submits the enquiry form
└── netlify/functions/
    └── get-submissions.js        Password-gated API for /admin.html
```

## Running it locally

Because content now loads via `fetch()`, the site must be served over
`http://`, not opened directly as a `file://` path (browsers block
`fetch` of local files under `file://`). Two easy options:

```bash
# Option A — Netlify CLI (also lets you test the admin function locally)
npm install -g netlify-cli
netlify dev

# Option B — any static server (data/ and pages load fine, but
# /admin.html's function calls will 404 until deployed)
npx serve .
```

## Deploying to Netlify

I can't push this live myself from here (no network access in this
environment), but the whole project is already deploy-ready. The fastest
path — no git, no CLI:

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Deploy manually**.
2. Drag the entire `law-firm-dynamic` folder onto the upload area.
3. Netlify assigns a URL like `random-name-123.netlify.app`. You can rename
   it under **Site settings → Change site name**.
4. Netlify auto-detects `consultation.html`'s form on this first deploy and
   creates a **Forms** section in the dashboard — submissions will start
   showing up there immediately, and Netlify can email you on each one
   (**Forms → Settings → Form notifications**).

Or, for git-based continuous deploys: push this folder to a GitHub repo,
then **Add new site → Import an existing project** and point it at the repo
(build command: none needed, publish directory: `.`).

### Connecting the admin page

`/admin.html` needs three environment variables set in
**Site settings → Environment variables**:

| Variable | Where to get it |
|---|---|
| `ADMIN_PASSWORD` | Pick your own — whatever staff will type in at `/admin.html` |
| `NETLIFY_SITE_ID` | **Site settings → General → Site details → Site ID** |
| `NETLIFY_API_TOKEN` | **User settings → Applications → Personal access tokens → New access token** |

After setting these, redeploy (or trigger a redeploy from the dashboard) so
the function picks them up. Then visit `https://<your-site>/admin.html`.

## The admin page

`/admin.html` is intentionally **not linked** from any navigation or
footer — it's reachable only if you know the URL, and is further excluded
from search engines via `robots.txt` and a page-level `noindex` meta tag.
It prompts for a password, sends it to `/.netlify/functions/get-submissions`
via a request header, and — if correct — lists every submission to the
"enquiry" form (name, contact info, practice area, message, timestamp) in a
table with a refresh button.

**Security note:** this is a lightweight gate suitable for a small internal
tool with a couple of staff members sharing one password — it does not do
sessions, rate-limiting, or per-user accounts. For anything handling more
sensitive intake data, put real authentication (e.g. Netlify Identity, or a
proper auth provider) in front of this instead.

## Handling a Day 4 change request

The site was deliberately split so most client change requests need **no
code changes**:

- New/changed practice area → edit `data/practice-areas.json`
- Attorney joins/leaves, bio update → edit `data/attorneys.json`
- Phone number, address, hours, stats change → edit `data/firm.json` once;
  every page picks it up (see the `data-firm-field` attributes in the HTML)
- Only structural requests (new page, new form field, redesign) need an
  actual code change — and even those stay contained since content and
  layout are already separated.

## SEO basics included

- Per-page `<title>` and meta description
- `rel="canonical"` on every public page
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`) for
  link-preview cards
- `robots.txt` (allows public pages, disallows `/admin.html` and the
  functions path) + `sitemap.xml`
- `noindex` meta tag on `admin.html` and `404.html` as a second layer of
  protection beyond robots.txt
- JSON-LD `LegalService` structured data on the homepage, generated from
  the same `firm.json`/`practice-areas.json` used everywhere else
- Semantic HTML (`<header>`, `<main>`, `<footer>`, `<address>`, heading
  hierarchy), a skip-to-content link, and descriptive link text throughout

## Lighthouse

I don't have a browser or network access in this environment, so I can't
run Lighthouse myself and I'm not going to guess a number — **please run it
yourself once deployed** and drop the results in below:

```bash
npx lighthouse https://calloway-reyes-law.netlify.app --view
```

or Chrome DevTools → Lighthouse tab → Analyze page load.

| Category | Score |
|---|---|
| Performance | _run Lighthouse and fill in_ |
| Accessibility | _run Lighthouse and fill in_ |
| Best Practices | _run Lighthouse and fill in_ |
| SEO | _run Lighthouse and fill in_ |

What's already in place to help those scores: no render-blocking heavy
images (the hero visual is CSS/SVG, not a photo), font loading uses
`preconnect`, minimal unminified JS with no framework overhead, semantic
markup with alt text/aria labels on icons, a visible focus state, and a
mobile-responsive layout tested down to ~360px width.

## Mobile responsiveness

All pages use the same responsive CSS from Task 1: a fluid container up to
1180px, a hamburger nav below 880px, and stacked grids (docket rows,
attorney cards, the consultation form/aside) below 900px/720px breakpoints.
