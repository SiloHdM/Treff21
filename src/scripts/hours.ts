// Öffnungszeiten-Logik – Zeitzone Europe/Berlin, Zeiten über Mitternacht (z. B. bis 03:00) erlaubt.
export type DayKey = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so';
export type Hours = Record<DayKey, [string, string][]>;

const KEYS: DayKey[] = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa']; // Index = JS getDay()

/** Aktueller Wochentag (Schlüssel) und Minuten seit Mitternacht in Berlin. */
export function berlinNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day: KEYS[idx], dayIndex: idx, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function isOpenNow(hours: Hours, date = new Date()) {
  const { dayIndex, minutes } = berlinNow(date);
  const today = hours[KEYS[dayIndex]] ?? [];
  const yesterday = hours[KEYS[(dayIndex + 6) % 7]] ?? [];
  for (const [o, c] of today) {
    const open = toMin(o), close = toMin(c);
    if (close > open ? minutes >= open && minutes < close : minutes >= open) return true;
  }
  // Schicht vom Vortag, die nach Mitternacht endet
  for (const [o, c] of yesterday) {
    const open = toMin(o), close = toMin(c);
    if (close <= open && minutes < close) return true;
  }
  return false;
}

/** Monat (1–12) in Berlin – für das Saison-Badge. */
export const berlinMonth = (date = new Date()) =>
  Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', month: 'numeric' }).format(date));
