import info from '../data/info.json';

export { info };

export const fullAddress = `${info.address.street}, ${info.address.postalCode} ${info.address.city}`;
const mapsQuery = encodeURIComponent(`${info.name}, ${fullAddress}`);

export const links = {
  route: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  // Google-Bewertungen: führt auf den Maps-Eintrag (Reiter „Rezensionen“)
  reviews: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  mapEmbed: `https://www.google.com/maps?q=${mapsQuery}&output=embed&hl=de`,
  tel: `tel:${info.phone.tel}`,
};

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });
export const formatPrice = (n: number) => euro.format(n);
export const formatDecimal = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 1 });

export const weekdays = [
  { key: 'mo', label: 'Montag', schema: 'Monday' },
  { key: 'di', label: 'Dienstag', schema: 'Tuesday' },
  { key: 'mi', label: 'Mittwoch', schema: 'Wednesday' },
  { key: 'do', label: 'Donnerstag', schema: 'Thursday' },
  { key: 'fr', label: 'Freitag', schema: 'Friday' },
  { key: 'sa', label: 'Samstag', schema: 'Saturday' },
  { key: 'so', label: 'Sonntag', schema: 'Sunday' },
] as const;

export type Hours = Record<(typeof weekdays)[number]['key'], [string, string][]> | null;
export const openingHours = info.openingHours as Hours;

/** Für die Site-URL (Domain noch offen): per Umgebungsvariable SITE_URL setzen. */
export const siteUrl = import.meta.env.SITE as string | undefined;
