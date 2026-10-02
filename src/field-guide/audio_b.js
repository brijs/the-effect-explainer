SFX.motif = t => [67, 71, 74, 72].forEach((m, i) => vib(t + i * .15, mf(m), i === 3 ? 1 : .45, .09, sfxBus));
SFX.motifEnd = t => [67, 71, 74, 79].forEach((m, i) => vib(t + i * .16, mf(m), 1.4, .1, sfxBus));
SFX.roll = (t, d) => { const dur = Math.min(d || 1, 2.5); osc(t, { type: 'sawtooth', f: 55, f1: 70, dur, vol: .025, a: .15, filter: { f: 300 } }); noise(t, { dur, vol: .05, type: 'lowpass', f: 400, a: .15 }); };
SFX.think = t => { [0, .18, .36].forEach((d, i) => osc(t + d, { f: 880 + i * 220, dur: .12, vol: .05 })); };
SFX.go = t => { osc(t, { f: 660, f1: 990, dur: .18, vol: .08, glide: .15 }); };
SFX.beep = t => { osc(t, { type: 'square', f: 1320, dur: .06, vol: .04, filter: { f: 3000 } }); osc(t + .09, { type: 'square', f: 1760, dur: .06, vol: .04, filter: { f: 3000 } }); };
const DUCKERS = new Set(['ding', 'buzz', 'gong', 'stamp', 'doorShut', 'clank', 'motif', 'motifEnd', 'finalChord', 'boing', 'alarm', 'think']);
function duck(t) { duckGain.gain.setTargetAtTime(.45, t, .03); duckGain.gain.setTargetAtTime(1, t + .7, .25); }
function playCue(c, at) { const f = SFX[c.name]; if (!f) return; try { f(at, c.arg, c.t); if (DUCKERS.has(c.name)) duck(at); } catch (e) { } }

/* music: soft walking bass, brushes, chords */
const PROG = {
  calm: [{ r: 41, q: 'M7' }, { r: 43, q: '7' }, { r: 45, q: 'm7' }, { r: 40, q: 'm7' }],
  bright: [{ r: 43, q: 'M7' }, { r: 40, q: 'm7' }, { r: 45, q: 'm7' }, { r: 38, q: '7' }],
  fin: [{ r: 41, q: 'M7' }, { r: 38, q: '7' }, { r: 43, q: 'M7' }]
};
const QUAL = { m7: [0, 3, 7, 10], '7': [0, 4, 7, 10], M7: [0, 4, 7, 11] };
function bassNote(t, f, d) { osc(t, { type: 'triangle', f, dur: d, vol: .5, a: .008, filter: { f: 700 }, bus: musicBus }); osc(t, { f: f / 2, dur: d * .8, vol: .22, bus: musicBus }); }
function hat(t, v) { noise(t, { dur: .055, vol: v, type: 'highpass', f: 6500, bus: musicBus }); }
function keysChord(t, ms, d) { ms.forEach(m => osc(t, { type: 'triangle', f: mf(m), dur: d, vol: .045, a: .01, filter: { f: 1700 }, bus: musicBus })); }
function playBeat(sec, i, t, bl) {
  const bar = Math.floor(i / 4), b = i % 4, prog = PROG[sec.key];
  if (sec.key === 'fin') {
    if (bar > 2) return;
    const ch = prog[bar], q = QUAL[ch.q];
    if (bar === 2) { if (b === 0) { bassNote(t, mf(ch.r), bl * 6); keysChord(t, q.map(v => ch.r + 12 + v), bl * 8); } return; }
    bassNote(t, mf(b === 0 ? ch.r : ch.r + q[b]), bl * .9);
    if (b === 0) keysChord(t, q.slice(1).map(v => ch.r + 12 + v), bl * 3);
    return;
  }
  const ch = prog[bar % prog.length], nx = prog[(bar + 1) % prog.length], q = QUAL[ch.q];
  const m = b === 0 ? ch.r : b === 1 ? ch.r + q[1] : b === 2 ? ch.r + 7 : nx.r - 1;
  bassNote(t, mf(m), bl * .88);
  if (b === 1 || b === 3) hat(t, .17);
  hat(t + bl * 2 / 3, .06);
  if (b === 0) keysChord(t, q.slice(1).map(v => ch.r + 12 + v), bl * 2.6);
  if (sec.key === 'bright' && bar % 2 === 1 && b === 2) vib(t, mf(ch.r + 24 + q[(bar >> 1) % 4]), 1.1, .05, musicBus);
}
function scheduleMusic(a, b) {
  for (const sec of SECTIONS) {
    if (b <= sec.s || a >= sec.e) continue;
    const bl = 60 / sec.bpm;
    let i = Math.max(0, Math.ceil((Math.max(a, sec.s) - sec.s) / bl - 1e-9));
    for (; ; i++) {
      const bt = sec.s + i * bl;
      if (bt >= b || bt >= sec.e) break;
      if (bt < a) continue;
      try { playBeat(sec, i, filmToCtx(bt), bl); } catch (e) { }
    }
  }
}

/* ============================================================
   VOICE: Vari reads every caption with the browser's voice
   ============================================================ */
const SPEECH = 'speechSynthesis' in window ? window.speechSynthesis : null;
const NOVELTY = /\b(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Junior|Pipe Organ|Organ|Ralph|Trinoids|Whisper|Zarvox|Fred|Kathy|Jester|Superstar|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley|Wobble)\b/i;
/* higher score = more natural sounding */
function voiceScore(v) {
  if (!/^en/i.test(v.lang)) return -1000;
  let s = 0;
  const n = v.name;
  if (/natural|neural/i.test(n)) s += 100;
  if (/premium/i.test(n)) s += 85;
  if (/enhanced/i.test(n)) s += 65;
  if (/google/i.test(n)) s += 45;
  if (/online/i.test(n)) s += 20;
  if (v.localService === false) s += 10;
  if (/compact|espeak|robot/i.test(n)) s -= 60;
  if (NOVELTY.test(n)) s -= 200;
  if (/^en[-_](GB|US|IN|AU|IE)/i.test(v.lang)) s += 5;
  if (v.default) s += 2;
  return s;
}
let voiceList = [], voiceURI = null, voiceRate = 1;
try { voiceURI = localStorage.getItem('vari-voice'); const r = parseFloat(localStorage.getItem('vari-rate')); if (r >= .8 && r <= 1.25) voiceRate = r; } catch (e) { }
function pickVoice() {
  if (!SPEECH) return;
  const vs = SPEECH.getVoices();
  if (!vs.length) return;
  voiceList = vs.filter(v => voiceScore(v) > -100).sort((a, b) => voiceScore(b) - voiceScore(a));
  if (!voiceList.length) voiceList = vs.slice();
  voice = (voiceURI && vs.find(v => v.voiceURI === voiceURI)) || voiceList[0] || vs[0];
  if (typeof onVoicesReady === 'function') onVoicesReady();
}
function setVoice(uri) { const v = voiceList.find(x => x.voiceURI === uri); if (v) { voice = v; voiceURI = uri; try { localStorage.setItem('vari-voice', uri); } catch (e) { } } }
function setRate(r) { voiceRate = r; try { localStorage.setItem('vari-rate', String(r)); } catch (e) { } }
if (SPEECH) { pickVoice(); if (SPEECH.addEventListener) SPEECH.addEventListener('voiceschanged', pickVoice); else SPEECH.onvoiceschanged = pickVoice; }

/* rewrite symbols and acronyms the way a person would say them */
function forSpeech(t) {
  return t.replace(/\*/g, '')
    .replace(/(−|-)?₹\s?(\d[\d,]*(?:\.\d+)?)\s?k\b/g, (m, neg, n) => (neg ? 'minus ' : '') + n + ' thousand rupees')
    .replace(/(−|-)?₹\s?(\d[\d,]*(?:\.\d+)?)(\s(lakh|crore))?/g, (m, neg, n, u) => (neg ? 'minus ' : '') + n + (u || '') + ' rupees')
    .replace(/\bATE\b/g, 'A.T.E.').replace(/\bATT\b/g, 'A.T.T.').replace(/\bLATE\b/g, 'L.A.T.E.').replace(/\bGST\b/g, 'G.S.T.')
    .replace(/−/g, 'minus ').replace(/…/g, ', ').replace(/\bvs\.?\s/g, 'versus ')
    .replace(/\s+/g, ' ').trim();
}
let spPending = 0, speakTimer = null;
function speakNow(plain, onDone) {
  const u = new SpeechSynthesisUtterance(plain);
  if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
  u.rate = voiceRate; u.pitch = 1; u.volume = 1;
  u.onstart = () => { if (ctx) speechGain.gain.setTargetAtTime(.42, ctx.currentTime, .08); };
  u.onend = u.onerror = () => { spPending = Math.max(0, spPending - 1); if (ctx && spPending === 0) speechGain.gain.setTargetAtTime(1, ctx.currentTime, .3); if (onDone) onDone(); };
  spPending++;
  SPEECH.speak(u);
}
function speak(text) {
  if (!SPEECH || !voiceOn || !soundOn) return;
  const plain = forSpeech(text);
  if (spPending >= 2) { SPEECH.cancel(); spPending = 0; clearTimeout(speakTimer); speakTimer = setTimeout(() => speakNow(plain), 40); return; }
  speakNow(plain);
}
function previewVoice() {
  if (!SPEECH) return;
  SPEECH.cancel(); spPending = 0;
  setTimeout(() => speakNow(forSpeech("Hi, I'm Vari. Chai stalls near metro stations sell ₹1,500 more a day. Is the metro the reason?")), 60);
}
/* ---- recorded voice (Kokoro, voice "Heart") ---- */
let voiceMode = 'kokoro';
try { if (localStorage.getItem('vari-mode') === 'device') voiceMode = 'device'; } catch (e) { }
function setMode(m) { voiceMode = m; try { localStorage.setItem('vari-mode', m); } catch (e) { } }
const VBUF = [];
let decoding = false, decodeOrder = [];
function b64ToBuf(s) { const bin = atob(s), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a.buffer; }
/* clips come either embedded (base64, for a single-file page) or as separate MP3 files */
function clipBytes(i) {
  if (VCLIPS.data) return Promise.resolve(b64ToBuf(VCLIPS.data[i]));
  return fetch(VCLIPS.base + String(i).padStart(3, '0') + '.mp3').then(r => { if (!r.ok) throw new Error('clip ' + i); return r.arrayBuffer(); });
}
function decodeOne(i) {
  return new Promise(res => {
    if (VBUF[i] || !ctx) return res();
    let done = false; const ok = b => { if (!done) { done = true; VBUF[i] = b; res(); } }, bad = () => { if (!done) { done = true; res(); } };
    clipBytes(i).then(buf => { try { const p = ctx.decodeAudioData(buf, ok, bad); if (p && p.then) p.then(ok, bad); } catch (e) { bad(); } }, bad);
  });
}
async function decodeFrom(t) {
  const seen = new Set(), order = [];
  for (const s of SAYS) if (s.idx != null && s.t >= t - 15 && !seen.has(s.idx)) { seen.add(s.idx); order.push(s.idx); }
  for (let i = 0; i < VCLIPS.text.length; i++) if (!seen.has(i)) order.push(i);
  decodeOrder = order;
  if (decoding) return;
  decoding = true;
  while (decodeOrder.length) { const i = decodeOrder.shift(); if (!VBUF[i]) await decodeOne(i); }
  decoding = false;
}
function playClip(i, when, offset) {
  const b = VBUF[i];
  if (!b || !ctx) return false;
  const at = Math.max(when, ctx.currentTime), off = Math.max(0, offset || 0);
  const s = ctx.createBufferSource(); s.buffer = b;
  const g = ctx.createGain(); g.gain.value = 1.2;
  s.connect(g); g.connect(master);
  s.start(at, off);
  const end = at + b.duration - off;
  live.push({ n: s, end });
  speechGain.gain.setTargetAtTime(.4, at, .05); speechGain.gain.setTargetAtTime(1, end, .3);
  return true;
}
SFX.voice = (t, i) => { if (!voiceOn || voiceMode !== 'kokoro') return; if (!playClip(i, t, 0)) speak(VCLIPS.text[i]); };
function previewRecorded() {
  initAudio(); if (!ctx) return;
  if (ctx.state !== 'running') ctx.resume();
  const i = VCLIPS.text.length - 1;
  stopSpeech();
  decodeOne(i).then(() => playClip(i, ctx.currentTime + .05, 0));
}
function stopSpeech() { clearTimeout(speakTimer); spPending = 0; if (SPEECH) SPEECH.cancel(); if (ctx) speechGain.gain.setTargetAtTime(1, ctx.currentTime, .1); }

/* ============================================================
   TRANSPORT: one clock, plus stops that wait for the viewer
   ============================================================ */
let playing = false, filmT = 0, t0 = 0, c0 = 0, cueIdx = 0, sayIdx = 0, pauseIdx = 0, musicCursor = 0, thinking = false;
const clock = () => ctx ? ctx.currentTime : performance.now() / 1000;
function filmToCtx(ft) { return c0 + (ft - t0); }
function now() { return playing ? Math.max(t0, t0 + (clock() - c0)) : filmT; }
function stopAllSound() {
  for (const n of live) { try { n.n.stop(0); } catch (e) { } }
  live = [];
  if (ctx) { duckGain.gain.cancelScheduledValues(0); duckGain.gain.value = 1; speechGain.gain.cancelScheduledValues(0); speechGain.gain.value = 1; }
}
function lowerBound(arr, t, key) { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if ((key ? arr[m][key] : arr[m]) < t) lo = m + 1; else hi = m; } return lo; }
function play() {
  if (filmT >= TOTAL - .05) filmT = 0;
  if (ctx && ctx.state !== 'running') ctx.resume();
  t0 = filmT; c0 = clock() + .06;
  cueIdx = lowerBound(CUES, t0, 't'); sayIdx = lowerBound(SAYS, t0, 't'); musicCursor = t0;
  pauseIdx = lowerBound(PAUSES, t0 + .02);
  thinking = false; hideThink();
  playing = true;
  if (ctx) {
    decodeFrom(t0);
    if (voiceMode === 'kokoro' && voiceOn) for (const s of SAYS) {
      if (s.idx == null || s.t >= t0) continue;
      const left = s.t + VCLIPS.dur[s.idx] - t0;
      if (left > .6 && t0 - s.t > .05) { playClip(s.idx, c0, t0 - s.t); break; }
    }
  }
  updateUI();
}
function pause() { filmT = now(); playing = false; stopAllSound(); stopSpeech(); updateUI(); }
function thinkStop(T) {
  filmT = T; playing = false; thinking = true;
  stopAllSound();
  render(T); updateUI(T); showThink();
  if (ctx) SFX.think(ctx.currentTime + .05);
}
function seek(t) {
  const was = playing;
  if (playing) { playing = false; stopAllSound(); stopSpeech(); }
  thinking = false; hideThink();
  filmT = clamp(t, 0, TOTAL);
  render(filmT); updateUI();
  if (was) play();
}
function schedulerTick() {
  if (!playing || !ctx) return;
  const ft = now();
  let until = ft + .22;
  if (pauseIdx < PAUSES.length) until = Math.min(until, PAUSES[pauseIdx] + .01);
  while (cueIdx < CUES.length && CUES[cueIdx].t < until) {
    const c = CUES[cueIdx++];
    if (c.t >= ft - .06) playCue(c, filmToCtx(Math.max(c.t, ft)));
  }
  if (until > musicCursor) { scheduleMusic(musicCursor, until); musicCursor = until; }
  if (live.length > 400) { const cn = clock(); live = live.filter(n => n.end > cn); }
}
function frame() {
  if (playing) {
    let T = now();
    if (pauseIdx < PAUSES.length && T >= PAUSES[pauseIdx]) {
      T = PAUSES[pauseIdx]; pauseIdx++;
      let latest = null;
      while (sayIdx < SAYS.length && SAYS[sayIdx].t <= T) latest = SAYS[sayIdx++];
      if (latest && T - latest.t < 1.2 && (voiceMode === 'device' || latest.idx == null)) speak(latest.text);
      thinkStop(T);
    } else {
      let latest = null;
      while (sayIdx < SAYS.length && SAYS[sayIdx].t <= T) latest = SAYS[sayIdx++];
      if (latest && T - latest.t < 1.2 && (voiceMode === 'device' || latest.idx == null)) speak(latest.text);
      if (T >= TOTAL) { T = TOTAL; filmT = TOTAL; playing = false; stopAllSound(); showEnd(); }
      render(T); updateUI(T);
    }
  }
  requestAnimationFrame(frame);
}
