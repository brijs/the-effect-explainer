/* ============================================================
   PLAYER: layers, controls, chapter menu, think stops
   ============================================================ */
const $ = id => document.getElementById(id);
svg = $('stage');
defs = el('defs', {}, svg);
boardLayer = G(svg); sceneLayer = G(svg); varLayer = G(svg); titleLayer = G(svg); capLayer = G(svg);
darkRect = el('rect', { x: 0, y: 0, width: W, height: H, fill: '#0B0A10', 'pointer-events': 'none' }, svg);
buildBoard(); buildVari(varLayer); buildTitle(titleLayer); buildCaption(capLayer);
buildAll();
render(0);

const ICON_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3.2v11H3.5zM9.3 2.5h3.2v11H9.3z"/></svg>';
const tickBox = $('ticks');
scenes.forEach(sc => { if (sc.menu) { const i = document.createElement('i'); i.style.left = (sc.start / TOTAL * 100) + '%'; tickBox.appendChild(i); } });
PAUSES.forEach(p => { const b = document.createElement('b'); b.style.left = (p / TOTAL * 100) + '%'; tickBox.appendChild(b); });
$('track').setAttribute('aria-valuemax', Math.round(TOTAL));

/* chapter menu */
const list = $('menuList');
let group = null;
scenes.forEach(sc => {
  if (!sc.menu) return;
  const g = /^Part 1/.test(sc.kicker || '') ? 'Part 1: how to think' : /^Toolbox/.test(sc.kicker || '') ? 'Part 2: the toolbox' : 'Start and finish';
  if (g !== group && g !== 'Start and finish') { const h = document.createElement('li'); h.className = 'grp'; h.textContent = g; list.appendChild(h); group = g; }
  const li = document.createElement('li'), b = document.createElement('button');
  b.innerHTML = `<span>${sc.chapter ? sc.title : sc.name}</span><em>${fmtTime(sc.start)}</em>`;
  b.addEventListener('click', () => { closeMenu(); startIfNeeded(); seek(sc.start + .01); if (!playing) play(); });
  li.appendChild(b); list.appendChild(li);
});
function openMenu() { $('menu').hidden = false; $('menuBtn').setAttribute('aria-expanded', 'true'); }
function closeMenu() { $('menu').hidden = true; $('menuBtn').setAttribute('aria-expanded', 'false'); }
$('menuBtn').addEventListener('click', () => { $('menu').hidden ? openMenu() : closeMenu(); if (!$('voicePanel').hidden) closeVoice(); });
$('menuClose').addEventListener('click', closeMenu);

let lastLabel = '';
function updateUI(T) {
  const t = T == null ? (playing ? now() : filmT) : T;
  const f = clamp(t / TOTAL, 0, 1);
  $('fill').style.width = (f * 100) + '%';
  $('knob').style.left = (f * 100) + '%';
  $('time').textContent = fmtTime(t) + ' / ' + fmtTime(TOTAL);
  const sc = sceneAt(clamp(t, 0, TOTAL - .001));
  const lab = sc.chapter ? (sc.kicker ? sc.kicker + ': ' : '') + sc.title : sc.name;
  if (lab !== lastLabel) { $('chapLabel').textContent = lab; lastLabel = lab; }
  const pb = $('play'), want = playing ? 'pause' : 'play';
  if (pb.dataset.state !== want) { pb.dataset.state = want; pb.innerHTML = playing ? ICON_PAUSE : ICON_PLAY; pb.setAttribute('aria-label', playing ? 'Pause' : 'Play'); }
  $('track').setAttribute('aria-valuenow', Math.round(t));
}
function showThink() { $('thinkBox').hidden = false; setTimeout(() => $('contBtn').focus({ preventScroll: true }), 50); }
function hideThink() { $('thinkBox').hidden = true; }
function unlockSpeech() { if (!SPEECH) return; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; SPEECH.speak(u); } catch (e) { } }
let started = false;
function startIfNeeded() {
  if (started) return;
  started = true;
  $('startScreen').hidden = true; $('endScreen').hidden = true;
  initAudio(); unlockSpeech(); pickVoice();
  if (ctx && ctx.state !== 'running') ctx.resume();
}
function start() { startIfNeeded(); $('endScreen').hidden = true; seek(0); play(); }
function showEnd() { $('endScreen').hidden = false; hideThink(); updateUI(TOTAL); }
function toggle() {
  if (!started) { start(); return; }
  if (thinking) { play(); return; }
  if (playing) pause(); else { $('endScreen').hidden = true; initAudio(); play(); }
}
$('startBtn').addEventListener('click', start);
$('againBtn').addEventListener('click', start);
$('contBtn').addEventListener('click', () => { if (thinking) play(); });
$('play').addEventListener('click', toggle);
$('stage').addEventListener('click', () => { if (started && $('endScreen').hidden && !thinking) toggle(); });

function setToggle(id, on) { $(id).setAttribute('aria-pressed', on ? 'true' : 'false'); }
function openVoice() { $('voicePanel').hidden = false; closeMenu(); fillVoices(); }
function closeVoice() { $('voicePanel').hidden = true; }
function fillVoices() {
  const sel = $('voiceSel');
  sel.innerHTML = '';
  const rec = document.createElement('option');
  rec.value = 'kokoro'; rec.textContent = '★ Heart: recorded natural voice (recommended)';
  if (voiceMode === 'kokoro') rec.selected = true;
  sel.appendChild(rec);
  const syncRate = () => { $('rateRng').disabled = voiceMode === 'kokoro'; $('rateRow').style.opacity = voiceMode === 'kokoro' ? .4 : 1; };
  syncRate();
  if (voiceMode === 'kokoro') { $('voiceTip').textContent = "Heart is a recorded voice, made with the free, open-source Kokoro speech model. It sounds the same on every device. Device voices below are a backup."; }
  if (!SPEECH) { if (voiceMode !== 'kokoro') $('voiceTip').textContent = "This browser has no built-in voice."; return; }
  voiceList.forEach(v => {
    const o = document.createElement('option'), sc = voiceScore(v);
    o.value = v.voiceURI;
    o.textContent = (sc >= 60 ? '★ ' : '') + v.name.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+-\s+English.*$/, '').trim() + ' (' + v.lang + ')';
    if (voiceMode === 'device' && voice && v.voiceURI === voice.voiceURI) o.selected = true;
    sel.appendChild(o);
  });
  const best = voiceList.length ? voiceScore(voiceList[0]) : 0;
  if (voiceMode !== 'kokoro') $('voiceTip').textContent = best >= 60
    ? 'Voices marked ★ are the most natural ones on this device.'
    : "This device doesn't have a natural-sounding voice installed. For a much better one: open this page in Microsoft Edge, which has free natural voices, or on an iPhone, iPad or Mac download a Premium or Enhanced voice under Settings, Accessibility, Spoken Content, Voices.";
  $('rateRng').value = voiceRate; $('rateVal').textContent = voiceRate.toFixed(2) + '×';
}
function onVoicesReady() { if (!$('voicePanel').hidden) fillVoices(); }
$('voiceBtn').addEventListener('click', () => $('voicePanel').hidden ? openVoice() : closeVoice());
$('voicePick').addEventListener('click', e => { e.stopPropagation(); openVoice(); });
$('voiceClose').addEventListener('click', closeVoice);
$('voiceSel').addEventListener('change', e => {
  stopSpeech(); stopAllSoundVoiceOnly();
  if (e.target.value === 'kokoro') { setMode('kokoro'); previewRecorded(); }
  else { setMode('device'); setVoice(e.target.value); previewVoice(); }
  fillVoices();
});
function stopAllSoundVoiceOnly() { /* clips already playing finish on their own; nothing to do */ }
$('rateRng').addEventListener('input', e => { setRate(parseFloat(e.target.value)); $('rateVal').textContent = voiceRate.toFixed(2) + '×'; });
$('rateRng').addEventListener('change', previewVoice);
$('previewBtn').addEventListener('click', () => voiceMode === 'kokoro' ? previewRecorded() : previewVoice());
$('voiceOnChk').addEventListener('change', e => { voiceOn = e.target.checked; setToggle('voiceBtn', voiceOn); if (!voiceOn) stopSpeech(); });
$('capBtn').addEventListener('click', () => { CAP.on = !CAP.on; setToggle('capBtn', CAP.on); render(playing ? now() : filmT); });
$('soundBtn').addEventListener('click', () => { soundOn = !soundOn; setToggle('soundBtn', soundOn); if (ctx) master.gain.setTargetAtTime(soundOn ? .95 : 0, ctx.currentTime, .05); if (!soundOn) stopSpeech(); });

/* scrubber */
const track = $('track');
let dragging = false;
function seekFromEvent(e) { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 1) * TOTAL; }
track.addEventListener('pointerdown', e => {
  startIfNeeded();
  dragging = true; track.setPointerCapture(e.pointerId);
  const t = seekFromEvent(e); track._resume = playing || thinking;
  if (playing) { playing = false; stopAllSound(); }
  stopSpeech(); thinking = false; hideThink();
  filmT = t; render(t); updateUI(t);
});
track.addEventListener('pointermove', e => { if (!dragging) return; const t = seekFromEvent(e); filmT = t; render(t); updateUI(t); });
const endDrag = () => { if (!dragging) return; dragging = false; $('endScreen').hidden = true; if (track._resume) { track._resume = false; play(); } };
track.addEventListener('pointerup', endDrag); track.addEventListener('pointercancel', endDrag);
track.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { seek((playing ? now() : filmT) + 5); e.preventDefault(); }
  if (e.key === 'ArrowLeft') { seek((playing ? now() : filmT) - 5); e.preventDefault(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('menu').hidden) { closeMenu(); return; }
  if (e.key === 'Escape' && !$('voicePanel').hidden) { closeVoice(); return; }
  if (e.target && /^(SELECT|INPUT)$/.test(e.target.tagName)) return;
  if (e.target && e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
  if (e.key === ' ' || e.key === 'k') { toggle(); e.preventDefault(); }
  else if (e.key === 'ArrowRight' && e.target !== track) seek((playing ? now() : filmT) + 5);
  else if (e.key === 'ArrowLeft' && e.target !== track) seek((playing ? now() : filmT) - 5);
});
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });
setInterval(schedulerTick, 25);
updateUI(0);
requestAnimationFrame(frame);
