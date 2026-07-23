# law-firm-website-dynamic

#Tech Stack — HTML/CSS/vanilla JS, JSON content, Netlify Forms, Netlify Functions, hosting

A dynamic, multi-page website for a local law firm. Content is driven by JSON data files instead of being hardcoded, the consultation form submits to a real destination, and a hidden password-protected admin page lets staff review incoming requests — all without a database or traditional backend server.

Live site: https://calloway-reyes-law.netlify.app (replace with your actual URL once deployed)

Features
🏛️ Multi-page site — Home, Practice Areas, Attorneys, Consultation, and a hidden Admin page.
📄 JSON-driven content — all copy (practice areas, attorney bios, firm info) lives in data/*.json, fetched at runtime — nothing hardcoded in the HTML.
🔁 One place to update everything — change the phone number or an attorney's bio in one JSON file and it updates across every page automatically.
✅ Validated enquiry form — checks name, email format, phone format, practice area selection, and message length before allowing submission.
🛡️ Spam protection — a hidden honeypot field that silently blocks bots.
📬 Real form submissions — powered by Netlify Forms; submissions land in an actual dashboard/inbox, not a simulation.
🎉 Success confirmation screen — shown after a valid submission.
🔒 Hidden admin dashboard (/admin.html) — not linked in navigation, excluded from search engines, and password-protected.
📊 Submission viewer — logged-in admins see a table of every enquiry (name, contact info, practice area, message, timestamp) with a refresh button.
📱 Fully responsive — mobile hamburger menu, stacked layouts on small screens, tested down to ~360px width.
🔍 SEO-ready — meta descriptions, canonical URLs, Open Graph tags, robots.txt, sitemap.xml, and JSON-LD structured data.
♿ Accessible basics — semantic HTML, skip-to-content link, visible keyboard focus states, alt text/aria labels.
⚡ No framework, no build step — plain HTML/CSS/vanilla JS, deploys straight to Netlify as-is.
🧩 Built for change requests — new attorney, updated hours, new practice area — all one-file edits, no code changes.
