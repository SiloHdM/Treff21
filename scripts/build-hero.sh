#!/usr/bin/env bash
# Baut das Hero-Video ("Drohnenfahrt" durch die Bar) aus den Fotos in assets/raw/.
#
#   bash scripts/build-hero.sh
#
# Ergebnis in public/video/:
#   hero-1080.mp4  (H.264)   hero-1080.webm (VP9)
#   hero-720.mp4   (H.264)   hero-poster.webp (erstes Frame = LCP-Bild)
#
# Wenn es später echtes Video-Material gibt, einfach die Dateien in
# public/video/ ersetzen – der Code der Website bleibt gleich.
#
# Hinweis zu den Ausschnitten: Alle Fotos haben unten links ein eingebranntes
# Wasserzeichen-Logo. Jeder Crop/jede Kamerafahrt ist so gewählt, dass dieser
# Bereich nie im Bild ist.
set -euo pipefail

cd "$(dirname "$0")/.."
RAW=assets/raw
TMP=tmp/hero
OUT=public/video
FPS=30
D=5                 # Sekunden pro Clip
N=$((FPS * D))      # Frames pro Clip
mkdir -p "$TMP" "$OUT"

enc() { # gemeinsame Zwischen-Encoding-Optionen (fast verlustfrei)
  echo -c:v libx264 -preset veryfast -crf 14 -pix_fmt yuv420p -r $FPS
}

echo "▸ Clip 1: bogen-eingang – langsamer Zoom Richtung Rundbogen (1.0 → 1.15)"
# 16:9-Ausschnitt oben (Wasserzeichen beginnt erst bei y≈790), dann 8K für ruckelfreies zoompan.
ffmpeg -y -loglevel error -i "$RAW/bogen-eingang.jpg" -vf \
  "crop=1351:760:44:0,scale=7680:4320:flags=lanczos,\
zoompan=z='1+0.15*on/$((N-1))':x='(iw-iw/zoom)*0.62':y='(ih-ih/zoom)*0.38':d=$N:s=1920x1080:fps=$FPS" \
  -frames:v $N $(enc) "$TMP/clip1.mp4"

echo "▸ Clip 2: innenraum-gesamt – Tilt von der Pflanzendecke runter zur Theke"
# Hochformat auf 1920 px Breite (→ 1920×2423). Fahrt endet bei y=1060, also oberhalb des Wasserzeichens.
ffmpeg -y -loglevel error -loop 1 -framerate $FPS -t $D -i "$RAW/innenraum-gesamt.jpg" -vf \
  "scale=1920:-2:flags=lanczos,crop=1920:1080:0:'1060*(0.5-0.5*cos(PI*t/$D))'" \
  -frames:v $N $(enc) "$TMP/clip2.mp4"

echo "▸ Clip 3: bar-theke – Tilt von den Edison-Birnen runter zu den Barhockern, leichter Zoom"
# Erst Tilt auf 2112er Breite, dann pro Frame zoompan (1.0 → 1.08) auf 8K-Zwischengröße.
ffmpeg -y -loglevel error -loop 1 -framerate $FPS -t $D -i "$RAW/bar-theke.jpg" -vf \
  "scale=2112:-2:flags=lanczos,crop=2112:1188:0:'1680*(0.5-0.5*cos(PI*t/$D))',\
scale=7680:4320:flags=bicubic,\
zoompan=z='1+0.08*in/$((N-1))':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=$FPS" \
  -frames:v $N $(enc) "$TMP/clip3.mp4"

echo "▸ Clip 4: lounge-fenster – seitlicher Schwenk links → rechts über die Fensterfront"
ffmpeg -y -loglevel error -i "$RAW/lounge-fenster.jpg" -vf \
  "crop=1316:740:62:0,scale=7680:4320:flags=lanczos,\
zoompan=z=1.18:x='(iw-iw/zoom)*(0.5-0.5*cos(PI*on/$((N-1))))':y='(ih-ih/zoom)*0.45':d=$N:s=1920x1080:fps=$FPS" \
  -frames:v $N $(enc) "$TMP/clip4.mp4"

echo "▸ Loop-Ende: Standbild = erstes Frame von Clip 1"
ffmpeg -y -loglevel error -i "$TMP/clip1.mp4" -vf "select=eq(n\,0),loop=loop=$((FPS*2)):size=1:start=0,setpts=N/$FPS/TB" \
  -frames:v $((FPS*2)) $(enc) "$TMP/clip5.mp4"

echo "▸ Zusammenfügen mit 1 s Crossfades + einheitlicher Look"
# Offsets: Clip-Länge minus 1 s, kumulativ → 4, 8, 12, 16. Gesamt: 17 s.
# Das Video endet exakt auf dem ersten Frame → nahtlose Schleife.
LOOK="eq=saturation=0.9:contrast=1.05:brightness=0.015,noise=alls=4:allf=t,format=yuv420p"
ffmpeg -y -loglevel error \
  -i "$TMP/clip1.mp4" -i "$TMP/clip2.mp4" -i "$TMP/clip3.mp4" -i "$TMP/clip4.mp4" -i "$TMP/clip5.mp4" \
  -filter_complex "\
[0][1]xfade=transition=fade:duration=1:offset=4[a];\
[a][2]xfade=transition=fade:duration=1:offset=8[b];\
[b][3]xfade=transition=fade:duration=1:offset=12[c];\
[c][4]xfade=transition=fade:duration=1:offset=16,trim=duration=17,$LOOK[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p "$TMP/master.mp4"

echo "▸ Export"
ffmpeg -y -loglevel error -i "$TMP/master.mp4" \
  -c:v libx264 -crf 26 -preset veryfast -profile:v high -pix_fmt yuv420p -an -movflags +faststart \
  "$OUT/hero-1080.mp4"
ffmpeg -y -loglevel error -i "$TMP/master.mp4" -vf "scale=1280:720:flags=lanczos" \
  -c:v libx264 -crf 26 -preset veryfast -profile:v high -pix_fmt yuv420p -an -movflags +faststart \
  "$OUT/hero-720.mp4"
ffmpeg -y -loglevel error -i "$TMP/master.mp4" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -deadline good -cpu-used 4 -an \
  "$OUT/hero-1080.webm"
ffmpeg -y -loglevel error -i "$TMP/master.mp4" -frames:v 1 \
  -c:v libwebp -quality 72 "$OUT/hero-poster.webp"
# Mobiles Poster: Hochformat-Ausschnitt aus dem ersten Frame (passt zu object-fit: cover auf dem Handy)
ffmpeg -y -loglevel error -i "$TMP/master.mp4" -frames:v 1 -vf "crop=608:1080:(iw-608)*0.62:0" \
  -c:v libwebp -quality 62 "$OUT/hero-poster-mobile.webp"

echo "✓ Fertig:"
ls -lh "$OUT"
