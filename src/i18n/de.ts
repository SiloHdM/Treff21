// Alle UI-Texte an einer Stelle – für eine spätere englische Version
// einfach en.ts mit denselben Schlüsseln anlegen.
export default {
  lang: 'de',
  meta: {
    title: 'Treff 21 – Café & Bar in Ludwigsburg',
    description:
      'Treff 21 | TwentyOne Café & Bar, Stuttgarter Str. 36 in Ludwigsburg. Kaffee, Bier, Wein, Aperitif und Cocktails – 4,8 ★ bei 54 Google-Bewertungen, 10–20 € pro Person.',
  },
  skip: 'Zum Inhalt springen',
  nav: { bar: 'Bar', menu: 'Karte', gallery: 'Galerie', visit: 'Besuch', call: 'Anrufen', open: 'Menü öffnen', close: 'Menü schließen', home: 'Treff 21 – zur Startseite' },
  hero: {
    kicker: 'Café · Bar · Ludwigsburg',
    route: 'Route planen',
    menu: 'Getränkekarte',
    open: 'Jetzt geöffnet',
    closed: 'Geschlossen',
    scroll: 'Weiter zur Bar',
    pause: 'Hintergrundvideo anhalten',
    play: 'Hintergrundvideo abspielen',
  },
  about: { kicker: 'Die Bar' },
  menu: { kicker: 'Getränkekarte', categories: 'Kategorien der Getränkekarte', seasonal: 'Saison', each: 'je' },
  gallery: { kicker: 'Galerie', title: 'Ein Blick hinein', open: 'Bild vergrößern', close: 'Schließen', prev: 'Vorheriges Bild', next: 'Nächstes Bild' },
  reviews: { kicker: 'Stimmen', reviewsLabel: 'Google-Bewertungen', all: 'Alle Bewertungen auf Google', asOf: 'Stand', excerpt: 'Ausschnitt einer Google-Bewertung' },
  visit: {
    kicker: 'Besuch',
    address: 'Adresse',
    phone: 'Telefon',
    hours: 'Öffnungszeiten',
    price: 'Preis pro Person',
    today: 'heute',
    closedDay: 'Ruhetag',
    mapLoad: 'Karte laden (Google Maps)',
    mapNote: 'Beim Laden der Karte werden Daten an Google übertragen.',
    mapOpen: 'In Google Maps öffnen',
  },
  footer: { responsible: 'Bitte genießt verantwortungsvoll.', imprint: 'Impressum', privacy: 'Datenschutz', social: 'Social Media' },
} as const;
