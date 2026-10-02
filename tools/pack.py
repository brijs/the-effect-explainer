"""Writes the narration index (durations come from tools/wav if present, else lines.json) used by the field guide.

Reads tools/lines.json and the WAV clips in tools/wav/, then writes
src/field-guide/voicedata_pages.js with each line's caption text and exact
duration. The MP3s themselves are served from field-guide/audio/NNN.mp3.
Pass --embed to also write voicedata.js with the MP3s inlined as base64
(for a single self-contained HTML file).
"""
import base64, json, os, sys
import soundfile as sf

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
lines = json.load(open(os.path.join(here, "lines.json")))
texts = [l["text"] for l in lines]
def dur(l):
    w = os.path.join(here, "wav", f"{l['i']:03d}.wav")
    return round(sf.info(w).duration, 3) if os.path.exists(w) else l["dur"]
durs = [dur(l) for l in lines]
head = "/* Vari's narration: voice \"Heart\" from the open-source Kokoro-82M model */\n"
tail = "const VIDX = new Map(VCLIPS.text.map((t, i) => [t, i]));\n"
lite = {"base": "audio/", "text": texts, "dur": durs}
open(os.path.join(root, "src/field-guide/voicedata_pages.js"), "w").write(head + "const VCLIPS = " + json.dumps(lite, ensure_ascii=False) + ";\n" + tail)
print("wrote src/field-guide/voicedata_pages.js")
if "--embed" in sys.argv:
    data = [base64.b64encode(open(os.path.join(root, "field-guide/audio", f"{l['i']:03d}.mp3"), "rb").read()).decode() for l in lines]
    full = {"text": texts, "dur": durs, "data": data}
    open(os.path.join(root, "src/field-guide/voicedata.js"), "w").write(head + "const VCLIPS = " + json.dumps(full, ensure_ascii=False) + ";\n" + tail)
    print("wrote src/field-guide/voicedata.js (embedded)")
