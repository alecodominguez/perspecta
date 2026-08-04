# Perspecta — Human Insight

Static website for **Perspecta Human Insight**, a human-centered advisory initiative documenting research, culture, and society through lived experience.

**Live site:** https://alecodominguez.github.io/perspecta/
**Instagram:** [@perspectahumaninsight](https://instagram.com/perspectahumaninsight)

## About

Perspecta is a human-centered development and advisory initiative dedicated to transforming real human perspectives into solutions that advance rights, opportunity, and sustainable progress. This site is the organization's public home: it introduces who Perspecta is, defines what human rights mean, and surfaces research and reflections on human rights, culture, society, and technology.

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

- Editorial homepage: hero manifesto, "What Are Human Rights?" section grounded in the UDHR, filterable insights/reports grid, org pillars (Who We Are / Aim / Approach / Purpose / Vision), and a media feed of real Instagram content.
- Fully responsive, mobile-first layout with a sticky header and off-canvas mobile nav.
- Category filtering on the reports grid (Human Rights, Culture, Society, Tech & Humanity) — no page reload.
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
