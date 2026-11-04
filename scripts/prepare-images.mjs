// Bereitet die Originalfotos aus assets/raw/ für die Website vor.
//
//   node scripts/prepare-images.mjs
//
// - schneidet das eingebrannte Wasserzeichen (unten links) weg
// - legt die Ergebnisse in src/assets/photos/ ab; astro:assets erzeugt daraus
//   beim Build AVIF/WebP/JPG in 640/1280/1920 px (soweit das Original reicht)
// - erzeugt das Open-Graph-Bild public/og.jpg aus bar-theke.jpg
//
// Sobald Fotos ohne Wasserzeichen vorliegen: in assets/raw/ ersetzen und die
// "keep"-Höhe unten auf die volle Bildhöhe setzen (bzw. crop entfernen).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(root, 'assets/raw');
const OUT = path.join(root, 'src/assets/photos');
await mkdir(OUT, { recursive: true });

// keepHeight: Höhe ab oben, die erhalten bleibt (alles darunter enthält das Wasserzeichen)
const photos = [
  { file: 'bar-theke.jpg', keepHeight: 895 },
  { file: 'innenraum-gesamt.jpg', keepHeight: 1195 },
  { file: 'lounge-fenster.jpg', keepHeight: 765 },
  { file: 'bogen-eingang.jpg', keepHeight: 775 },
  // Deko-Ausschnitte ohne Logo-Schriftfragmente – nur als Detail
  { file: 'deko-04.jpg' },
  { file: 'deko-06.jpg' },
];

for (const { file, keepHeight } of photos) {
  const src = path.join(RAW, file);
  const meta = await sharp(src).metadata();
  let img = sharp(src).rotate();
  if (keepHeight) img = img.extract({ left: 0, top: 0, width: meta.width, height: Math.min(keepHeight, meta.height) });
  await img.jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(OUT, file));
  console.log('✓', file);
}

// Open-Graph-Bild 1200×630 aus der Theke (oberer Teil mit Pyramidendecke + Edison-Birnen)
await sharp(path.join(RAW, 'bar-theke.jpg'))
  .extract({ left: 0, top: 120, width: 676, height: 355 })
  .resize(1200, 630, { kernel: 'lanczos3' })
  .modulate({ saturation: 0.95 })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(root, 'public/og.jpg'));
console.log('✓ public/og.jpg');
