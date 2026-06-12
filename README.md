# deephalder.com

Personal portfolio of **Deep Halder** — Senior AI SDET · LLM Evaluation · Agent Testing.

Pure HTML / CSS / JS. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Deploy

Any static host works. Quickest paths:

**GitHub Pages**
1. Push this repo to GitHub (e.g. `HalderDeep/deephalder.com`).
2. Settings → Pages → Deploy from branch → `main` / root.
3. The included `CNAME` file points Pages at `deephalder.com` — then add DNS records at your registrar (A records to GitHub Pages IPs, or a CNAME from `www` to `halderdeep.github.io`).

**Vercel / Netlify**
Import the repo — zero config needed.

## Structure

```
index.html      # single-page site
css/style.css   # all styling (dark eval-lab theme)
js/main.js      # boot loader, neural canvas, typer, scroll reveals
CNAME           # custom domain for GitHub Pages
```

## Touch points

- Contact links (LinkedIn / GitHub handles) live at the bottom of `index.html` — update if handles change.
- Skill scorecards: edit `data-score` / `data-target` values in the `#evals` section.
- Boot sequence lines: top of `js/main.js`.
