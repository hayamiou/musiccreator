#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
PHIL="$ROOT/assets/_raw/philharmonia"
UIOWA="$ROOT/assets/_raw/uiowa"
OUT="$ROOT/assets/notes"

mkdir -p "$PHIL" "$UIOWA" "$OUT"

# --- Téléchargements Philharmonia (MP3) si absents ---
cd "$PHIL"
[[ -f Strings.zip ]] || curl -L -o Strings.zip "https://philharmonia-assets.s3-eu-west-1.amazonaws.com/uploads/2020/02/12112005/Strings.zip"
[[ -f all-samples.zip ]] || curl -L -o all-samples.zip "https://philharmonia-assets.s3-eu-west-1.amazonaws.com/uploads/2020/02/12112005/all-samples.zip"

unzip -o -q Strings.zip -d strings
unzip -o -q all-samples.zip -d all

# --- Helper recherche note (souple sur le nommage) ---
find_note() {
  local instrument="$1"; local note="$2"; local flavor="${3:-}"
  LC_ALL=C find . -type f -iname "*.mp3" \
    | grep -i "$instrument" \
    | { [[ -n "$flavor" ]] && grep -i "$flavor" || cat; } \
    | grep -Ei "(^|[^A-Z])${note}([^0-9]|$)|(^|[^A-Z])${note%4}[ _-]?4([^0-9]|$)" \
    | head -n1
}

# --- VIOLON ---
VIOL_C4="$(find_note 'violin' 'C4' 'arco-normal' || true)"
VIOL_A4="$(find_note 'violin' 'A4' 'arco-normal' || true)"
VIOL_B4="$(find_note 'violin' 'B4' 'arco-normal' || true)"

# C4 direct
if [[ -n "$VIOL_C4" && -f "$PHIL/${VIOL_C4#./}" ]]; then
  cp -f "$PHIL/${VIOL_C4#./}" "$OUT/violin_C4.mp3"
else
  echo "⚠️  violin_C4 non trouvé (arco-normal)."
fi

# A4 direct ou B4 -> A4 (-2 demi-tons)
if [[ -n "$VIOL_A4" && -f "$PHIL/${VIOL_A4#./}" ]]; then
  cp -f "$PHIL/${VIOL_A4#./}" "$OUT/violin_A4.mp3"
elif [[ -n "$VIOL_B4" && -f "$PHIL/${VIOL_B4#./}" ]]; then
  ffmpeg -hide_banner -loglevel error -y -i "$PHIL/${VIOL_B4#./}" \
    -af "asetrate=44100*0.8908987181403393,aresample=44100,atempo=1.122462048309373" \
    "$OUT/violin_A4.mp3"
else
  echo "⚠️  violin_A4 introuvable (ni A4 ni B4 adaptés)."
fi

# --- GUITARE ---
GUIT_A4="$(find_note 'guitar' 'A4' 'normal' || true)"
[[ -n "$GUIT_A4" ]] || GUIT_A4="$(find_note 'guitar' 'A4' 'harmonics' || true)"
GUIT_C4="$(find_note 'guitar' 'C4' 'normal' || true)"
GUIT_CS4="$(find_note 'guitar' 'Cs4' 'normal' || true)"

if [[ -n "$GUIT_A4" && -f "$PHIL/${GUIT_A4#./}" ]]; then
  cp -f "$PHIL/${GUIT_A4#./}" "$OUT/guitar_A4.mp3"
else
  echo "⚠️  guitar_A4 introuvable (normal/harmonics)."
fi

if [[ -n "$GUIT_C4" && -f "$PHIL/${GUIT_C4#./}" ]]; then
  cp -f "$PHIL/${GUIT_C4#./}" "$OUT/guitar_C4.mp3"
elif [[ -n "$GUIT_CS4" && -f "$PHIL/${GUIT_CS4#./}" ]]; then
  # Cs4 -> C4 (-1 demi-ton)
  ffmpeg -hide_banner -loglevel error -y -i "$PHIL/${GUIT_CS4#./}" \
    -af "asetrate=44100*0.9438743126816935,aresample=44100,atempo=1.0594630943592953" \
    "$OUT/guitar_C4.mp3"
else
  echo "⚠️  guitar_C4 introuvable (ni C4 ni Cs4)."
fi

# --- PIANO (UIowa) : AIFF -> MP3 ---
mkdir -p "$UIOWA"
curl -L "https://theremin.music.uiowa.edu/sound%20files/MIS/Piano_Other/piano/Piano.pp.A4.aiff" -o "$UIOWA/piano_A4.aiff"
curl -L "https://theremin.music.uiowa.edu/sound%20files/MIS/Piano_Other/piano/Piano.pp.C4.aiff" -o "$UIOWA/piano_C4.aiff"
ffmpeg -hide_banner -loglevel error -y -i "$UIOWA/piano_A4.aiff" -c:a libmp3lame -q:a 2 "$OUT/piano_A4.mp3"
ffmpeg -hide_banner -loglevel error -y -i "$UIOWA/piano_C4.aiff" -c:a libmp3lame -q:a 2 "$OUT/piano_C4.mp3"

echo "✅ Fichiers générés dans: $OUT"
