# Unique Traveler 🌍

Spin the globe, pick a country, choose up to 3 travel vibes, and get 5 things worth doing there.
Picks come from the guide *Around the World in 13 Vibes* (195 countries), plus the United States, Bhutan and Taiwan added by hand: 198 countries × 13 vibes × 5 picks = 12,870 picks.
No API keys and no server: everything ships with the site.

## Run it on your computer
You need [Node.js](https://nodejs.org) (version 18 or newer).

```bash
npm install
npm run dev
```
Then open the link it prints (usually http://localhost:5173).

> Opening `index.html` by double-clicking won't work. It's a Vite + React project, so it has to run through `npm run dev` (or be built).

## Put it on GitHub Pages
1. Upload this whole folder to your repo (keep the `.github` folder, it does the deploying).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The **Actions** tab shows the build; when it's green, your site is live at
   `https://<your-username>.github.io/<repo-name>/`.

## What's where
```
index.html                     page shell (title, fonts, favicon)
public/img/globe_icon.svg      favicon
src/main.jsx                   starts React
src/App.jsx                    the flow: globe → vibes → your 5
src/index.css                  all styling (colors are the variables at the top)
src/components/
  GlobeView.jsx                the globe: highlight + fly-to (colors at the top)
  SearchBar.jsx                country search with suggestions
  VibePicker.jsx               "Why are you traveling?" chips
  Results.jsx                  your 5 picks, per-vibe tabs, sources
  AdvisoryNote.jsx             U.S. travel advisory flag (Level 3 / 4)
src/data/
  guide.json                   all 198 countries, 13 vibes, 5 picks each, sources
  vibes.js                     the 13 vibes (labels, emoji, descriptions)
  countries.js                 matches guide countries to globe shapes + search aliases
  world.json                   country shapes for the globe
src/utils/recommend.js         blends your vibes into one list of 5
```

## Common tweaks
- **Colors:** `src/index.css` (top) and `src/components/GlobeView.jsx` (top).
- **How many vibes people can pick:** `MAX_VIBES` in `src/data/vibes.js`.
- **Edit or add picks:** `src/data/guide.json`. Each country looks like
  `{"name":"Japan","code":"JP","region":"Asia","advisory":null,"picks":{"cultural":[...5 picks], ...},"nearby":[],"sources":[...]}`.
  `advisory` is `3`, `4` or `null`.
- **A search name isn't working:** add it to `SEARCH_ALIASES` in `src/data/countries.js`.

## Credits
- Country shapes: [Natural Earth](https://www.naturalearthdata.com/) via [world-atlas](https://github.com/topojson/world-atlas) (public domain)
- Globe: [globe.gl](https://github.com/vasturiano/globe.gl)
- Travel advisories: U.S. State Department, as of October 29, 2026. These change often; check [travel.state.gov](https://travel.state.gov/traveladvisories) before booking.
# globe-interests
