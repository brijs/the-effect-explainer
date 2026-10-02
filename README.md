# The Effect, animated

Two animated, voiced explainers of *The Effect: An Introduction to Research Design and Causality* by Nick Huntington-Klein (free at [theeffectbook.net](https://theeffectbook.net)).

**Live site: https://brijs.github.io/the-effect-explainer/**

- **Field guide** (`field-guide/`): Vari the robot walks through the book's outline, how the research designs connect, and every Part 2 design with two pause-and-think cases. About 28 minutes. Narration is pre-recorded with the open-source Kokoro speech model (voice "Heart").
- **Case file** (`case-file/`): Arrow the detective investigates one headline across all 23 chapters. About 11½ minutes. Uses the browser's built-in voice.

Each film is a single HTML page drawn with SVG, with synthesized music and sound effects (Web Audio). There are no frameworks and no build step at view time.

Explainers by Brijesh Shetty, [github.com/brijs](https://github.com/brijs).

## Layout

```
index.html                 landing page
field-guide/index.html     the field guide (built file)
field-guide/audio/*.mp3    268 narration clips, one per line
case-file/index.html       the case file (built file)
src/field-guide/           field guide source + build.sh
src/case-file/             case file source, storyboard + build.sh
tools/                     Kokoro narration pipeline
```

## Viewing locally

The field guide loads its narration with `fetch`, which browsers block on `file://` pages. Serve the folder instead:

```bash
python3 -m http.server 8000      # then open http://localhost:8000
```

## Editing a film

Edit files in `src/<film>/`, then run `bash src/<film>/build.sh` to regenerate `<film>/index.html`.

## Regenerating the narration (Kokoro)

Needs Python 3, Node, and ffmpeg.

```bash
pip install kokoro-onnx soundfile
mkdir -p tools/models && cd tools/models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx   # 325 MB
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin    # 28 MB
cd ../..

npm install jsdom
node tools/extract.js            # 1. list every narration line -> tools/lines.json
python tools/gen.py af_heart     # 2. record each line -> tools/wav/NNN.wav (about real time on a CPU)
bash tools/make_mp3.sh           # 3. WAV -> field-guide/audio/NNN.mp3
python tools/pack.py             # 4. caption text + exact durations -> src/field-guide/voicedata_pages.js
bash src/field-guide/build.sh    # 5. rebuild the page; scenes re-time to the real clip lengths
```

Clips are numbered by line order. If you add, remove, or reorder narration lines, delete `tools/wav/` and `field-guide/audio/` before step 2 so every clip is re-recorded in the new order. Other voices: run `gen.py` with `bf_emma`, `am_michael`, `bm_george`, and so on. The model files and WAVs are git-ignored.

## Credits

- Book: Nick Huntington-Klein, *The Effect*, [theeffectbook.net](https://theeffectbook.net).
- Narration: [Kokoro-82M](https://github.com/hexgrad/kokoro) (Apache 2.0) via [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx).
- Fonts: Space Grotesk, Patrick Hand, Fraunces, Kalam (Google Fonts).
- All case numbers and examples are illustrative.
