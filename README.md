# Treff 21 | TwentyOne Café & Bar – Website

One-Pager für die Bar in der Stuttgarter Str. 36, Ludwigsburg. Statisch, ohne Backend, ohne Cookies und Tracker.
Gebaut mit [Astro](https://astro.build), Vanilla CSS und wenig JavaScript.

**Offene Punkte:** siehe [`TODO.md`](TODO.md).

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # statische Seite in dist/
npm run preview
```

Mit Domain bauen (erzeugt canonical-URLs, `og:url` und die Sitemap):

```bash
SITE_URL=https://www.deine-domain.de npm run build
```

## Inhalte pflegen

| Was | Datei |
|---|---|
| Fakten (Adresse, Telefon, Bewertungen, Öffnungszeiten, Social) | `src/data/info.json` |
| Getränkekarte (Preise, Kategorien, Saison) | `src/data/menu.json` |
| UI-Texte (für eine spätere englische Version) | `src/i18n/de.ts` |
| Design-Tokens (Farben, Typo, Abstände) | `src/styles/tokens.css` |

## Bilder & Video

- Originale liegen in `assets/raw/`.
- `node scripts/prepare-images.mjs`: schneidet das Wasserzeichen weg und legt die Fotos in `src/assets/photos/` ab;
  `astro:assets` erzeugt beim Build daraus AVIF, WebP und JPG in mehreren Breiten. Erzeugt außerdem `public/og.jpg`.
- `bash scripts/build-hero.sh` (benötigt ffmpeg): rendert die „Drohnenfahrt“ aus den Fotos nach `public/video/`.
  Echtes Videomaterial kann die Dateien dort später einfach ersetzen.

## Struktur

```
src/
  components/   Nav, Hero, About, Menu, Gallery, Reviews, Visit, Footer (+ Logo, Leaf, Pendant, Icon, Star)
  data/         info.json, menu.json
  layouts/      Layout (SEO, JSON-LD BarOrPub), LegalLayout
  pages/        index, impressum, datenschutz, robots.txt
  scripts/      motion.ts (Reveal, Parallax, Facetten-Licht), hours.ts (Öffnungszeiten, Europe/Berlin)
  styles/       tokens.css, global.css
public/
  video/        Hero-Video + Poster
  textures/     Facetten-Pattern (Pyramidenkacheln)
```

## Deployment

Netlify, Vercel oder GitHub Pages: Build-Befehl `npm run build`, Ausgabeordner `dist/`.
Schriften (Fraunces, Manrope) werden selbst gehostet, es gibt keine Anfragen an Google Fonts.
