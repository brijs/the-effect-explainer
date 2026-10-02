#!/usr/bin/env bash
# Converts tools/wav/*.wav to field-guide/audio/*.mp3 (mono, 24 kHz, 48 kbps).
set -e
cd "$(dirname "$0")"
mkdir -p ../field-guide/audio
for f in wav/*.wav; do ffmpeg -loglevel error -y -i "$f" -ac 1 -ar 24000 -b:a 48k "../field-guide/audio/$(basename "$f" .wav).mp3"; done
echo "done"
