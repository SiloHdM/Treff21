# Offene Punkte – Treff 21 Website

Alles, was hier steht, ist auf der Seite als sichtbarer Platzhalter `[[TODO: …]]` markiert
oder bewusst ausgeblendet, bis die Information vorliegt. **Es wurden keine Fakten erfunden.**

| # | Was fehlt | Wo eintragen | Auswirkung, sobald ergänzt |
|---|---|---|---|
| 1 | **Öffnungszeiten pro Wochentag** (bekannt ist nur: schließt mind. an einem Tag um 03:00) | `src/data/info.json` → `openingHours` (Format steht in `_openingHoursFormat`) | Live-Badge „Jetzt geöffnet / Geschlossen“ im Hero, Tabelle mit heutigem Tag unter „Besuch“, `openingHoursSpecification` im JSON-LD – alles automatisch |
| 2 | **Logo** als SVG oder transparentes PNG | `src/components/Logo.astro` (aktuell typografischer Platzhalter + nachgezeichneter Pin), Favicons in `public/` | Nav, Footer, Favicon |
| 3 | **Fotos ohne Wasserzeichen** | `assets/raw/` ersetzen, dann `node scripts/prepare-images.mjs` (Crop-Höhen anpassen) und `bash scripts/build-hero.sh` | Bilder und Video können ungeschnitten genutzt werden |
| 4 | **Impressum-Daten** (Inhaber/Firma, Rechtsform, ladungsfähige Anschrift, E-Mail, ggf. USt-IdNr., Verantwortlicher) | `src/pages/impressum.astro` | Pflicht nach § 5 DDG vor Veröffentlichung |
| 5 | **Instagram, Facebook, E-Mail** | `src/data/info.json` → `instagram`, `facebook`, `email` | Footer, Impressum, Datenschutz |
| 6 | **Domain und Hosting** | Build mit `SITE_URL=https://… npm run build`; Hoster in `src/pages/datenschutz.astro` eintragen | canonical, `og:url`, `sitemap-index.xml`, Sitemap-Eintrag in `robots.txt` |
| 7 | **Preis „Hofbräu 0,5 l – 2,50 €“ prüfen** (auffällig günstig ggü. 0,33-l-Bieren) | `src/data/menu.json` → Eintrag Hofbräu, danach Feld `todo` löschen | Platzhalter in der Karte verschwindet |
| 8 | ~~1–2 Sätze vom Inhaber~~ – erledigt: orientalische Bar, Raucherbar, Okey, gemeinsame Zeit (Texte in `About.astro` und `Highlights.astro`, bitte gegenlesen) | – | – |
| 8a | **Raucherbar: Hinweis zu Zutritt/Altersgrenze** prüfen (Landesnichtraucherschutzgesetz BW) – ggf. „Zutritt ab 18“ ergänzen | `src/components/Highlights.astro` | Platzhalter in der Karte „Raucherbar“ verschwindet |
| 9 | Optional: Events, Speisen/Snacks, Reservierung per Telefon oder WhatsApp, weitere Spiele (z. B. Tavla) – nur wenn es sie wirklich gibt | – | neue Sektion bzw. Button |
| 10 | Datenschutzerklärung rechtlich prüfen lassen (Entwurf passend zum Setup: keine Cookies, keine Tracker, Google Maps erst nach Klick) | `src/pages/datenschutz.astro` | – |
| 11 | Optional: echtes Handy-/Gimbal-Video vom Laden | Dateien in `public/video/` ersetzen (gleiche Namen) | Code bleibt gleich |

## Hinweise zur Abnahme (Stand dieses Builds)

- Lighthouse Mobile: Performance 96 · Accessibility 100 · Best Practices 100 · SEO 100
- Lighthouse Desktop: 100 · 100 · 100 · 100
- LCP Mobile (simuliertes Slow 4G): 2,6 s – knapp über dem Ziel 2,5 s. LCP-Element ist die Headline „Treff 21“
  (wartet auf die Display-Schrift Fraunces, 67 KB). Auf echter 4G/5G-Verbindung deutlich darunter.
- Kontrast Hero-Text über dem Video (heller Pixel im schlechtesten Frame): ≥ 6,7 : 1
- Keine horizontale Scrollbar zwischen 320 und 1920 px; mit `prefers-reduced-motion` getestet (kein Video, keine Animationen)
- Die Fotos sind nur 676–1440 px breit; größere Bildvarianten (1920 px) werden daher nicht erzeugt. Für das Hero-Video
  wurden die Fotos hochskaliert – mit höher aufgelösten Originalen wird es schärfer.
