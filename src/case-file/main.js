/* ============================================================
   PLAYER: layers, controls, start and end screens
   ============================================================ */
const $ = id => document.getElementById(id);
svg = $('stage');
defs = el('defs', {}, svg);
boardLayer = G(svg); sceneLayer = G(svg); arrowLayer = G(svg); vignetteLayer = G(svg); titleLayer = G(svg); capLayer = G(svg);
darkRect = el('rect', { x: 0, y: 0, width: W, height: H, fill: '#05070D', 'pointer-events': 'none' }, svg);
buildBoard(); buildArrow(arrowLayer); buildTitle(titleLayer); buildCaption(capLayer);
buildAll();
render(0);

const ICON_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3.2v11H3.5zM9.3 2.5h3.2v11H9.3z"/></svg>';
const tickBox = $('ticks');
scenes.forEach(sc => { if (sc.chapter != null || /^Part/.test(sc.short) || sc.short === 'Finale') { const i = document.createElement('i'); i.style.left = (sc.start / TOTAL * 100) + '%'; i.title = sc.name; tickBox.appendChild(i); } });

let lastLabel = '';
function updateUI(T) {
  const t = T == null ? (playing ? now() : filmT) : T;
  const f = clamp(t / TOTAL, 0, 1);
  $('fill').style.width = (f * 100) + '%';
  $('knob').style.left = (f * 100) + '%';
  $('time').textContent = fmtTime(t) + ' / ' + fmtTime(TOTAL);
  const sc = sceneAt(clamp(t, 0, TOTAL - .001));
  const lab = sc.chapter != null ? `Chapter ${sc.chapter} of 23: ${sc.title}` : sc.name;
  if (lab !== lastLabel) { $('chapLabel').textContent = lab; lastLabel = lab; }
  const pb = $('play');
  const want = playing ? 'pause' : 'play';
  if (pb.dataset.state !== want) { pb.dataset.state = want; pb.innerHTML = playing ? ICON_PAUSE : ICON_PLAY; pb.setAttribute('aria-label', playing ? 'Pause' : 'Play'); }
  $('track').setAttribute('aria-valuenow', Math.round(t));
}

function unlockSpeech() {
  if (!SPEECH) return;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; SPEECH.speak(u); } catch (e) { }
}
function start() {
  $('startScreen').hidden = true; $('endScreen').hidden = true;
  initAudio(); unlockSpeech(); pickVoice();
  if (ctx && ctx.state !== 'running') ctx.resume();
  seek(0); play();
}
function showEnd() { $('endScreen').hidden = false; updateUI(TOTAL); }
function toggle() {
  if (!$('startScreen').hidden) { start(); return; }
  if (playing) pause(); else { $('endScreen').hidden = true; initAudio(); play(); }
}
$('startBtn').addEventListener('click', start);
$('againBtn').addEventListener('click', start);
$('play').addEventListener('click', toggle);
$('stage').addEventListener('click', () => { if ($('startScreen').hidden && $('endScreen').hidden) toggle(); });

function setToggle(id, on) { $(id).setAttribute('aria-pressed', on ? 'true' : 'false'); }
$('voiceBtn').addEventListener('click', () => { voiceOn = !voiceOn; setToggle('voiceBtn', voiceOn); if (!voiceOn) stopSpeech(); });
$('capBtn').addEventListener('click', () => { CAP.on = !CAP.on; setToggle('capBtn', CAP.on); render(playing ? now() : filmT); });
$('soundBtn').addEventListener('click', () => {
  soundOn = !soundOn; setToggle('soundBtn', soundOn);
  if (ctx) master.gain.setTargetAtTime(soundOn ? .95 : 0, ctx.currentTime, .05);
  if (!soundOn) stopSpeech();
});

/* scrubber */
const track = $('track');
let dragging = false;
function seekFromEvent(e) {
  const r = track.getBoundingClientRect();
  const f = clamp((e.clientX - r.left) / r.width, 0, 1);
  return f * TOTAL;
}
track.addEventListener('pointerdown', e => {
  if (!$('startScreen').hidden) { initAudio(); $('startScreen').hidden = true; }
  dragging = true; track.setPointerCapture(e.pointerId);
  const t = seekFromEvent(e); filmT = t; if (playing) { playing = false; stopAllSound(); stopSpeech(); track._resume = true; }
  render(t); updateUI(t);
});
track.addEventListener('pointermove', e => { if (!dragging) return; const t = seekFromEvent(e); filmT = t; render(t); updateUI(t); });
const endDrag = () => { if (!dragging) return; dragging = false; $('endScreen').hidden = true; if (track._resume) { track._resume = false; play(); } };
track.addEventListener('pointerup', endDrag);
track.addEventListener('pointercancel', endDrag);
track.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { seek((playing ? now() : filmT) + 5); e.preventDefault(); }
  if (e.key === 'ArrowLeft') { seek((playing ? now() : filmT) - 5); e.preventDefault(); }
});
document.addEventListener('keydown', e => {
  if (e.target && e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
  if (e.key === ' ' || e.key === 'k') { toggle(); e.preventDefault(); }
  else if (e.key === 'ArrowRight' && e.target !== track) seek((playing ? now() : filmT) + 5);
  else if (e.key === 'ArrowLeft' && e.target !== track) seek((playing ? now() : filmT) - 5);
});
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });

setInterval(schedulerTick, 25);
updateUI(0);
requestAnimationFrame(frame);
