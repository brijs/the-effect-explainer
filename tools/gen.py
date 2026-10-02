"""Records every narration line with Kokoro (voice "Heart").

Usage:  python gen.py [voice] [seconds_budget]
Reads lines.json, writes wav/NNN.wav (24 kHz mono). Skips clips that
already exist, so you can stop and resume. Delete a WAV to re-record it.
Needs: pip install kokoro-onnx soundfile, and the two model files in models/.
"""
import json, os, sys, time
import soundfile as sf
from kokoro_onnx import Kokoro

os.chdir(os.path.dirname(os.path.abspath(__file__)))
voice = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
budget = float(sys.argv[2]) if len(sys.argv) > 2 else 1e9
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
os.makedirs("wav", exist_ok=True)
t0 = time.time()
for l in json.load(open("lines.json")):
    if time.time() - t0 > budget:
        print("time budget reached; run again to continue"); break
    p = f"wav/{l['i']:03d}.wav"
    if os.path.exists(p):
        continue
    samples, sr = k.create(l["speak"], voice=voice, speed=1.0, lang="en-us" if voice[0] == "a" else "en-gb")
    sf.write(p + ".tmp.wav", samples, sr)
    os.replace(p + ".tmp.wav", p)
    print(f"{l['i']:03d}  {len(samples) / sr:5.1f}s  {l['speak'][:60]}")
print("done")
