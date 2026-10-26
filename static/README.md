# ebma AI — static marketing site

Vanilla HTML/CSS/JS mirror of the Next.js marketing site. The Next.js app in the repo root is unchanged.

## Setup

```bash
cd static
npm install
npm run build
```

## Develop CSS

```bash
npm run dev:css
```

Edit page bodies in `pages/`, shared chrome in `partials/`, then run `npm run build` (or at least `node scripts/assemble.mjs`).

## Serve locally

```bash
npx serve .
# or: python -m http.server 8080
```

Open `http://localhost:3000` (or the port `serve` prints).

## Config

Edit `js/config.js` for:

- `SITE_URL`
- `PORTAL_URL`
- `API_BASE_URL`
- `DOCS_URL`
- support / pricing emails

Defaults match `.env.example` (`localhost` portal/API).

## Pages

| URL path | File |
|----------|------|
| `/` | `index.html` |
| `/pricing` | `pricing.html` |
| `/contact` | `contact.html` |
| `/about` | `about.html` |
| `/careers` | `careers.html` |
| `/privacy` | `privacy.html` |
| `/terms` | `terms.html` |
| `/security` | `security.html` |
| `/products/speech-to-text` | `products/speech-to-text.html` |
| `/products/text-to-speech` | `products/text-to-speech.html` |
| `/products/llm` | `products/llm.html` |
