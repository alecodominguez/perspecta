# Perspecta — Human Insight

Static website for **Perspecta Human Insight**, a founding-stage nonprofit initiative creating opportunities for emerging thinkers to share ideas, examine complex issues, and develop practical solutions across fields.

**Live site:** https://alecodominguez.github.io/perspecta/
**Instagram:** [@perspectahumaninsight](https://instagram.com/perspectahumaninsight)

## About

Perspecta Human Insight is built as an ecosystem, not a single publication: a nonprofit **Foundation** (fellowships, research, mentorship, community programming), a public-facing **Publication** (perspective pieces, deep dives, and solutions), a **Fellows** community for students and young professionals, and a future, legally separate **Consulting** LLC. The working model is Perspective → Conversation → Research → Solution(s) → Action(s). This site is the organization's public home — it's currently in its founding stage, so it leads with the mission, the fellowship, and how to get involved (board, contributors, advisors, partners) rather than a live content archive.

## Tech stack

Pure HTML5, CSS3, and vanilla JavaScript — no build step, no dependencies, no framework. Fonts (Poppins, Inter, IBM Plex Mono) load from Google Fonts via CDN. Runs anywhere static files are served, including GitHub Pages.

## Structure

```
.
├── index.html      Site markup and content
├── styles.css      Design tokens, layout, responsive rules
├── script.js       Mobile nav, category filtering, search toggle, smooth scroll
├── assets/         Brand images (logo, hero visual, infographic, Instagram reflections)
└── DEPLOYMENT.md   Step-by-step GitHub Pages deployment guide
```

## Features

- Founding-stage framing throughout: a "Founding Stage" badge in the hero, an honesty note on the reports grid, and a footer disclosure that the nonprofit is still in formation (contributions not yet tax-deductible).
- Working-model strip (Perspective → Conversation → Research → Solution(s) → Action(s)).
- Official Mission, Vision, and Values, plus a four-part Ecosystem grid (Foundation, Publication, Fellows, future Consulting).
- Content-format legend (Perspecta Human Insight 500 / 1000 / Solutions) above a filterable, illustrative insights/reports grid.
- Dedicated **Fellowship** section (submission requirements, selection criteria, founding-cohort benefits) and a **Get Involved** section for prospective board members, contributors, advisors, and partners, listing the expertise areas the founding board is seeking.
- "What Are Human Rights?" deep dive, grounded in the UDHR and the org's own Instagram reflections, framed as a sample "1000" piece.
- Fully responsive, mobile-first layout with a sticky header and off-canvas mobile nav.
- Category filtering on the reports grid — no page reload.
- Color palette and typography derived from the Perspecta brand mark.

## Local preview

No build tools required. Either open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full GitHub Pages setup. Short version: push to `main`, enable Pages in repo Settings → Pages, source = `main` branch, `/ (root)`.

## Content notes

- The logo, hero visual, "Who We Are" infographic, and reflection cards in `assets/` are real Perspecta brand assets.
- The "Latest Insights & Reports" grid currently uses placeholder photography (`picsum.photos`) and illustrative article copy — swap these in as real reports are published.
- The newsletter signup is front-end only; wire it up to a provider (Mailchimp, Buttondown, ConvertKit) before relying on it for real subscribers.

## License

© 2026 Perspecta Human Insight. All rights reserved.
