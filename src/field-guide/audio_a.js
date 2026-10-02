/* ============================================================
   AUDIO: synthesized with Web Audio
   ============================================================ */
let ctx = null, master, sfxBus, musicBus, duckGain, speechGain, noiseBuf, live = [];
const MUSIC_VOL = 0.16;
let voice = null, voiceOn = true, soundOn = true;
function initAudio() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
  master = ctx.createGain(); master.gain.value = soundOn ? .95 : 0;
  master.connect(comp); comp.connect(ctx.destination);
  sfxBus = ctx.createGain(); sfxBus.gain.value = .62; sfxBus.connect(master);
  speechGain = ctx.createGain(); speechGain.connect(master);
  duckGain = ctx.createGain(); duckGain.connect(speechGain);
  musicBus = ctx.createGain(); musicBus.gain.value = MUSIC_VOL; musicBus.connect(duckGain);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
function envG(t, a, peak, d) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, .0002), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  return g;
}
function osc(t, o) {
  const dur = o.dur || .3, a = o.a || .005;
  const n = ctx.createOscillator(); n.type = o.type || 'sine';
  n.frequency.setValueAtTime(o.f || 440, t);
  if (o.f1) n.frequency.exponentialRampToValueAtTime(o.f1, t + (o.glide || dur));
  const g = envG(t, a, o.vol || .2, dur);
  let src = n;
  if (o.filter) { const fl = ctx.createBiquadFilter(); fl.type = o.filter.type || 'lowpass'; fl.frequency.value = o.filter.f; fl.Q.value = o.filter.Q || 1; n.connect(fl); src = fl; }
  if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1]; l.connect(lg); lg.connect(n.frequency); l.start(t); l.stop(t + a + dur + .1); live.push({ n: l, end: t + a + dur + .1 }); }
  if (o.trem) { const l = ctx.createOscillator(), lg = ctx.createGain(), tg = ctx.createGain(); l.frequency.value = o.trem; lg.gain.value = .35; tg.gain.value = .65; l.connect(lg); lg.connect(tg.gain); src.connect(tg); src = tg; l.start(t); l.stop(t + a + dur + .1); live.push({ n: l, end: t + a + dur + .1 }); }
  src.connect(g); g.connect(o.bus || sfxBus);
  n.start(t); n.stop(t + a + dur + .05);
  live.push({ n, end: t + a + dur + .05 });
  return n;
}
function noise(t, o) {
  const dur = o.dur || .2, a = o.a || .004;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const fl = ctx.createBiquadFilter(); fl.type = o.type || 'bandpass';
  fl.frequency.setValueAtTime(o.f || 1000, t);
  if (o.f1) fl.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
  fl.Q.value = o.Q || 1;
  const g = envG(t, a, o.vol || .3, dur);
  s.connect(fl); fl.connect(g); g.connect(o.bus || sfxBus);
  s.start(t, Math.random() * 1.5); s.stop(t + a + dur + .05);
  live.push({ n: s, end: t + a + dur + .05 });
}
