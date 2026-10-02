'use strict';
/* ============================================================
   THE EFFECT: THE CASE OF THE TUTORING PROGRAM
   One master clock drives the SVG animation, the synthesized
   sound effects, the music and Arrow's voice.
   ============================================================ */
const NS = 'http://www.w3.org/2000/svg';
const W = 1600, H = 900;
const C = {
  night: '#1A2238', cork: '#B48A57', corkDark: '#93703F', card: '#F4F6F9', red: '#C62B36', hi: '#F4D03F',
  teal: '#2A8C82', slate: '#6B7A90', ink: '#22304F', body: '#2E4E8F', bodyDark: '#1C3264', brass: '#C9A227',
  wood: '#5E4026', purple: '#7B5EA7', green: '#3F8A4E', paper: '#ECE8DE', blueprint: '#2F5D8C', okGreen: '#2E8B57'
};
const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif";
const HAND = "'Kalam', 'Comic Neue', 'Comic Sans MS', cursive";
const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ---------- small helpers ---------- */
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function G(parent, attrs) { return el('g', attrs || {}, parent); }
function rng(seed) {
  let a = seed >>> 0;
  return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const EASE = {
  lin: p => p,
  io: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
  o: p => 1 - Math.pow(1 - p, 3),
  i: p => p * p * p,
  back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  step: p => p < 1 ? 0 : 1
};
function fmtTime(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

/* rich text: *word* becomes italic */
function setRich(t, str) {
  while (t.firstChild) t.removeChild(t.firstChild);
  String(str).split('*').forEach((p, i) => {
    if (!p) return;
    const s = el('tspan', {}, t);
    if (i % 2 === 1) s.setAttribute('font-style', 'italic');
    s.textContent = p;
  });
}
function T(parent, x, y, str, o) {
  o = o || {};
  const t = el('text', {
    x, y, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || HAND, 'font-size': o.size || 28,
    fill: o.fill || C.ink, 'font-weight': o.weight || 400
  }, parent);
  if (o.italic) t.setAttribute('font-style', 'italic');
  if (o.opacity != null) t.setAttribute('opacity', o.opacity);
  setRich(t, str);
  return t;
}

/* ---------- animatable state ---------- */
function st(e) { if (!e._st) e._st = { x: 0, y: 0, s: 1, r: 0, o: 1, sx: 1, sy: 1, ox: 0, oy: 0 }; return e._st; }
function pv(e, ox, oy) { const s = st(e); s.ox = ox; s.oy = oy; return e; }
const DEF = { x: 0, y: 0, s: 1, r: 0, o: 1, sx: 1, sy: 1, d: 1 };
function applyT(e) {
  const s = e._st;
  if (s.x || s.y || s.s !== 1 || s.r || s.sx !== 1 || s.sy !== 1) {
    const sc1 = s.s * s.sx, sc2 = s.s * s.sy;
    e.setAttribute('transform', `translate(${(s.x + s.ox).toFixed(2)} ${(s.y + s.oy).toFixed(2)}) rotate(${s.r.toFixed(2)}) scale(${sc1.toFixed(4)} ${sc2.toFixed(4)}) translate(${-s.ox} ${-s.oy})`);
  } else e.removeAttribute('transform');
  const o = clamp(s.o, 0, 1);
  if (o < 0.999) e.setAttribute('opacity', o.toFixed(3)); else e.removeAttribute('opacity');
  e.style.display = (o <= 0.002 || (s._dt && s.d <= 0.002)) ? 'none' : '';
  if (s._dt) {
    e.setAttribute('stroke-dasharray', '1 1');
    e.setAttribute('stroke-dashoffset', (1 - clamp(s.d, 0, 1)).toFixed(4));
  }
}
function valAt(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (t < b[0]) {
      const a = keys[i - 1], span = b[0] - a[0];
      if (span <= 0) return b[1];
      return a[1] + (b[1] - a[1]) * EASE[b[2] || 'io']((t - a[0]) / span);
    }
  }
  return keys[keys.length - 1][1];
}
function stepAt(keys, t, def) { let v = def; for (const k of keys) { if (k[0] <= t) v = k[1]; else break; } return v; }

/* ---------- stage ---------- */
let svg, defs, boardLayer, sceneLayer, arrowLayer, vignetteLayer, titleLayer, capLayer, darkRect;
let UID = 0;
function clipRect(g, x, y, w, h) {
  const id = 'c' + (++UID);
  const cp = el('clipPath', { id }, defs);
  const r = el('rect', { x, y, width: w, height: h }, cp);
  g.setAttribute('clip-path', `url(#${id})`);
  return r;
}

function buildBoard() {
  const g = boardLayer;
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, g);
  // cork speckle pattern
  const pat = el('pattern', { id: 'cork', width: 180, height: 180, patternUnits: 'userSpaceOnUse' }, defs);
  el('rect', { width: 180, height: 180, fill: C.cork }, pat);
  const r = rng(11);
  for (let i = 0; i < 140; i++) {
    el('circle', { cx: (r() * 180).toFixed(1), cy: (r() * 180).toFixed(1), r: (0.8 + r() * 2.2).toFixed(1), fill: r() < .55 ? C.corkDark : '#C9A170', opacity: (0.35 + r() * 0.4).toFixed(2) }, pat);
  }
  el('rect', { x: 22, y: 22, width: W - 44, height: H - 44, rx: 10, fill: 'url(#cork)' }, g);
  el('rect', { x: 22, y: 22, width: W - 44, height: H - 44, rx: 10, fill: 'none', stroke: C.wood, 'stroke-width': 22 }, g);
  el('rect', { x: 33, y: 33, width: W - 66, height: H - 66, rx: 4, fill: 'none', stroke: '#3B2814', 'stroke-width': 3, opacity: .5 }, g);
  // lamp vignette
  const rg = el('radialGradient', { id: 'vig', cx: '50%', cy: '42%', r: '70%' }, defs);
  el('stop', { offset: '55%', 'stop-color': '#000', 'stop-opacity': 0 }, rg);
  el('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': .38 }, rg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#vig)', 'pointer-events': 'none' }, vignetteLayer);
}

/* ---------- reusable props ---------- */
function pushpin(g, x, y, color) {
  const p = G(g);
  el('ellipse', { cx: x + 3, cy: y + 6, rx: 8, ry: 4, fill: '#000', opacity: .25 }, p);
  el('circle', { cx: x, cy: y, r: 9, fill: color || C.red }, p);
  el('circle', { cx: x - 3, cy: y - 3, r: 3, fill: '#fff', opacity: .6 }, p);
  return p;
}
function card(g, cx, cy, w, h, o) {
  o = o || {};
  const outer = pv(G(g), cx, cy);
  const inner = G(outer, o.rot ? { transform: `rotate(${o.rot} ${cx} ${cy})` } : {});
  const rx = o.rx != null ? o.rx : 6;
  el('rect', { x: cx - w / 2 + 6, y: cy - h / 2 + 8, width: w, height: h, rx, fill: '#000', opacity: .22 }, inner);
  el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx, fill: o.fill || C.card, stroke: o.stroke || 'none', 'stroke-width': o.sw || 0 }, inner);
  if (o.ruled) el('line', { x1: cx - w / 2 + 14, x2: cx + w / 2 - 14, y1: cy - h / 2 + 50, y2: cy - h / 2 + 50, stroke: C.red, 'stroke-width': 2, opacity: .45 }, inner);
  if (o.pin !== false) pushpin(inner, cx, cy - h / 2 + 13, o.pinColor || C.red);
  outer.inner = inner; outer.cx = cx; outer.cy = cy; outer.w = w; outer.h = h;
  return outer;
}
function note(g, cx, cy, text, o) {
  o = o || {};
  const size = o.size || 30, lh = size * 1.22;
  const lines = String(text).split('\n');
  const w = o.w || Math.max(...lines.map(l => l.replace(/\*/g, '').length)) * size * 0.5 + 64;
  const h = o.h || lines.length * lh + 44;
  const c = card(g, cx, cy, w, h, o);
  const top = cy - h / 2 + 22 + (h - 22 - lines.length * lh) / 2;
  lines.forEach((l, i) => T(c.inner, cx, top + size * 0.88 + i * lh, l, { size, font: o.font || HAND, fill: o.color || C.ink, weight: o.weight }));
  return c;
}
function node(g, x, y, letter, name, kind, o) {
  o = o || {}; kind = kind || 'obs';
  const n = pv(G(g), x, y), r = o.r || 34;
  el('circle', { cx: x + 4, cy: y + 6, r, fill: '#000', opacity: .22 }, n);
  let fill = C.card, ink = C.ink, stroke = C.ink, sw = 3, dash = null;
  if (kind === 'T') { fill = C.teal; ink = '#fff'; stroke = 'none'; sw = 0; }
  else if (kind === 'Y') { fill = C.red; ink = '#fff'; stroke = 'none'; sw = 0; }
  else if (kind === 'Z') { fill = C.hi; }
  else if (kind === 'U') { dash = '7 6'; }
  el('circle', { cx: x, cy: y, r, fill, stroke, 'stroke-width': sw, 'stroke-dasharray': dash }, n);
  T(n, x, y + r * 0.32, letter, { font: SERIF, size: o.ls || r * 0.95, fill: ink, weight: 600 });
  pushpin(n, x, y - r + 3, C.brass);
  if (name) {
    const ns = o.ns || 22, w = name.length * ns * 0.52 + 22, ty = y + r + 30;
    el('rect', { x: x - w / 2, y: ty - ns - 2, width: w, height: ns + 12, rx: 4, fill: C.card, opacity: .96 }, n);
    T(n, x, ty, name, { size: ns });
  }
  n.pos = { x, y, r };
  return n;
}
function quadPoint(a, c, b, t) { const u = 1 - t; return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }; }
function link(g, A, B, o) {
  o = o || {};
  const a = A.pos || A, b = B.pos || B;
  const ra = (a.r || 0) + 6, rb = (b.r || 0) + 10;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  const px = -uy, py = ux, bend = o.bend || 0;
  const c = { x: (a.x + b.x) / 2 + px * bend * len, y: (a.y + b.y) / 2 + py * bend * len };
  const sdx = c.x - a.x, sdy = c.y - a.y, sl = Math.hypot(sdx, sdy) || 1;
  const s = { x: a.x + sdx / sl * ra, y: a.y + sdy / sl * ra };
  const edx = b.x - c.x, edy = b.y - c.y, ell = Math.hypot(edx, edy) || 1;
  const e = { x: b.x - edx / ell * rb, y: b.y - edy / ell * rb };
  const lg = G(g);
  const col = o.color || C.red;
  const d = `M${s.x.toFixed(1)} ${s.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
  const path = el('path', { d, stroke: col, 'stroke-width': o.w || 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null, pathLength: o.dash ? null : 1 }, lg);
  const ang = Math.atan2(edy, edx) * 180 / Math.PI;
  const head = G(lg);
  if (!o.noHead) el('polygon', { points: '0,0 -21,-11 -21,11', fill: col, transform: `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) rotate(${ang.toFixed(1)})` }, head);
  const mid = quadPoint(s, c, e, .5);
  return { g: lg, path, head, d, mid, s, c, e, at: t => quadPoint(s, c, e, t) };
}
function door(g, x, y) {
  const d = pv(G(g), x, y);
  el('rect', { x: x - 20, y: y - 30, width: 40, height: 58, fill: '#120d0a', rx: 2 }, d);
  const leaf = pv(G(d), x - 20, y);
  el('rect', { x: x - 20, y: y - 30, width: 40, height: 58, fill: '#8A5A35', stroke: '#5E3B20', 'stroke-width': 3, rx: 2 }, leaf);
  el('circle', { cx: x + 11, cy: y, r: 3.5, fill: C.brass }, leaf);
  el('rect', { x: x - 24, y: y - 34, width: 48, height: 66, fill: 'none', stroke: '#3B2A1E', 'stroke-width': 4, rx: 3 }, d);
  d.leaf = leaf;
  return d;
}
function lock(g, x, y, label) {
  const l = pv(G(g), x, y);
  el('path', { d: `M${x - 13} ${y - 6} v-12 a13 13 0 0 1 26 0 v12`, fill: 'none', stroke: '#8d8d8d', 'stroke-width': 6 }, l);
  el('rect', { x: x - 20, y: y - 8, width: 40, height: 32, rx: 5, fill: C.brass, stroke: '#8a6d12', 'stroke-width': 2 }, l);
  el('circle', { cx: x, cy: y + 6, r: 4, fill: '#5a4508' }, l);
  if (label) {
    const w = label.length * 11 + 22;
    el('rect', { x: x - w / 2, y: y + 30, width: w, height: 30, rx: 4, fill: C.card }, l);
    T(l, x, y + 52, label, { size: 20 });
  }
  return l;
}
function student(g, x, y, col) {
  const s = pv(G(g), x, y);
  el('ellipse', { cx: x + 3, cy: y + 50, rx: 26, ry: 6, fill: '#000', opacity: .2 }, s);
  s.bodyRect = el('rect', { x: x - 24, y: y - 2, width: 48, height: 50, rx: 18, fill: col || C.slate }, s);
  s.tealRect = el('rect', { x: x - 24, y: y - 2, width: 48, height: 50, rx: 18, fill: C.teal, opacity: 0 }, s);
  el('circle', { cx: x, cy: y - 24, r: 20, fill: '#F0D0B2' }, s);
  el('path', { d: `M${x - 21} ${y - 27} Q${x} ${y - 56} ${x + 21} ${y - 27} Q${x} ${y - 38} ${x - 21} ${y - 27}Z`, fill: '#3B2A1E' }, s);
  el('circle', { cx: x - 7, cy: y - 22, r: 2.6, fill: C.ink }, s);
  el('circle', { cx: x + 7, cy: y - 22, r: 2.6, fill: C.ink }, s);
  return s;
}
function chart(g, cx, cy, w, h, o) {
  o = o || {};
  const c = card(g, cx, cy, w, h, { rot: o.rot || 0, pinColor: o.pinColor });
  const L = cx - w / 2 + (o.padL || 92), R = cx + w / 2 - (o.padR || 34), Tp = cy - h / 2 + (o.padT || 48), B = cy + h / 2 - (o.padB || 70);
  const ax = G(c.inner);
  el('line', { x1: L, y1: B, x2: R, y2: B, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, ax);
  el('line', { x1: L, y1: B, x2: L, y2: Tp, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, ax);
  if (o.xl) T(ax, (L + R) / 2, B + 48, o.xl, { size: 25 });
  if (o.yl) { const yt = T(ax, L - 46, (Tp + B) / 2, o.yl, { size: 25 }); yt.setAttribute('transform', `rotate(-90 ${L - 46} ${(Tp + B) / 2})`); }
  const [x0, x1] = o.xr || [0, 1], [y0, y1] = o.yr || [0, 1];
  c.px = v => L + (v - x0) / (x1 - x0) * (R - L);
  c.py = v => B - (v - y0) / (y1 - y0) * (B - Tp);
  Object.assign(c, { L, R, T: Tp, B });
  c.plot = G(c.inner);
  return c;
}
function stampBox(g, x, y, lines, o) {
  o = o || {};
  const s = pv(G(g), x, y);
  const inner = G(s, { transform: `rotate(${o.rot != null ? o.rot : -8} ${x} ${y})` });
  const size = o.size || 38, col = o.color || C.red;
  const w = o.w || Math.max(...lines.map(l => l.length)) * size * 0.56 + 50, h = lines.length * size * 1.2 + 30;
  el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 8, fill: o.fill || 'none', stroke: col, 'stroke-width': 6 }, inner);
  lines.forEach((l, i) => T(inner, x, y - h / 2 + 18 + size * 0.95 + i * size * 1.2, l, { font: SERIF, size, fill: col, weight: 700 }));
  return s;
}
function xMark(g, x, y, size, col) {
  const m = pv(G(g), x, y), s = size || 26;
  el('path', { d: `M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, stroke: col || C.red, 'stroke-width': 9, 'stroke-linecap': 'round' }, m);
  return m;
}
function check(g, x, y, size) {
  const m = pv(G(g), x, y), s = size || 24;
  el('circle', { cx: x, cy: y, r: s * 1.25, fill: C.okGreen }, m);
  el('path', { d: `M${x - s * .55} ${y + s * .02} L${x - s * .12} ${y + s * .45} L${x + s * .6} ${y - s * .45}`, stroke: '#fff', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, m);
  return m;
}
function pathD(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '); }
function fitLine(xs, ys) {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const b = sxy / sxx; return { a: my - b * mx, b };
}

/* ---------- scenes and the builder API ---------- */
const scenes = [];
function scene(def) { scenes.push(def); }
const HOME_L = 150, HOME_R = 1450, FLOOR = 735;

function makeBuilder(sc) {
  const g = G(sceneLayer); g.style.display = 'none';
  Object.assign(sc, { g, tracks: new Map(), fns: [], cues: [], says: [], ax: [], ay: [], ao: [], am: [] });
  const S = {
    g, sc, _x: HOME_L, _y: FLOOR,
    k(e, p, ...keys) {
      st(e);
      let m = sc.tracks.get(e); if (!m) { m = {}; sc.tracks.set(e, m); }
      (m[p] || (m[p] = [])).push(...keys.map(k => k.slice()));
      return e;
    },
    pop(e, at, d) { d = d || .42; S.k(e, 'o', [at, 0], [at + .1, 1, 'lin']); S.k(e, 's', [at, .3], [at + d, 1, 'back']); return e; },
    fadeIn(e, at, d, to) { S.k(e, 'o', [at, 0], [at + (d || .45), to == null ? 1 : to, 'o']); return e; },
    fadeOut(e, at, d, to) { S.k(e, 'o', [at, null], [at + (d || .4), to || 0, 'io']); return e; },
    to(e, p, at, d, v, ease) { S.k(e, p, [at, null], [at + d, v, ease || 'io']); return e; },
    draw(lk, at, d, snd) {
      d = d || .7;
      S.k(lk.path, 'd', [at, 0], [at + d, 1, 'io']);
      S.k(lk.head, 'o', [at + d - .1, 0], [at + d, 1, 'lin']);
      if (snd !== false) S.sfx(at, 'string');
      return lk;
    },
    glow(lk, at, d, to) {
      if (!lk.glow) { lk.glow = el('path', { d: lk.d, stroke: C.hi, 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round' }); lk.g.insertBefore(lk.glow, lk.g.firstChild); }
      S.k(lk.glow, 'o', [at, 0], [at + (d || .5), to == null ? .9 : to]);
      return lk;
    },
    fn(at, d, f) { sc.fns.push({ at, d, f }); },
    sfx(at, name, arg) { sc.cues.push({ at, name, arg }); },
    say(at, text) { sc.says.push({ at, text }); },
    stamp(e, at) { S.k(e, 'o', [at, 0], [at + .08, 1, 'lin']); S.k(e, 's', [at, 1.9], [at + .18, 1, 'o']); S.sfx(at + .15, 'stamp'); return e; },
    place(x, y, m) { y = y == null ? FLOOR : y; sc.ax = [[0, x]]; sc.ay = [[0, y]]; sc.am = [[0, m || 'neutral']]; S._x = x; S._y = y; },
    walk(at, d, x, y, steps) {
      if (y == null) y = S._y;
      sc.ax.push([at, S._x], [at + d, x, 'io']); sc.ay.push([at, S._y], [at + d, y, 'io']);
      if (steps !== false && (x !== S._x || y !== S._y)) for (let s = at + .12; s < at + d - .05; s += .34) S.sfx(s, 'step');
      S._x = x; S._y = y;
    },
    mood(at, m) { sc.am.push([at, m]); },
    arrowO(...keys) { sc.ao.push(...keys); }
  };
  return S;
}
function finalizeScene(sc) {
  for (const [e, m] of sc.tracks) {
    for (const p in m) {
      const keys = m[p].sort((a, b) => a[0] - b[0]);
      let prev = DEF[p];
      for (const k of keys) { if (k[1] === null) k[1] = prev; prev = k[1]; }
      if (p === 'd') st(e)._dt = true;
    }
  }
  const byT = (a, b) => a[0] - b[0];
  sc.ax.sort(byT); sc.ay.sort(byT); sc.am.sort(byT); sc.ao.sort(byT);
  if (!sc.ao.length) sc.ao = [[0, 1]];
  sc.says.sort((a, b) => a.at - b.at);
  sc.says.forEach((s, i) => {
    const nx = sc.says[i + 1];
    let d = nx ? Math.min(nx.at - s.at - .15, 5.2) : 5.2;
    d = Math.min(d, sc.dur - s.at - .3);
    s.dur = Math.max(1.6, d);
  });
}

/* chapter scenes get the title card, motif and transition automatically */
function chap(num, title, dur, build, short) {
  scene({ name: `Chapter ${num}: ${title}`, short: short || title, chapter: num, title, dur, build });
}

/* ---------- Arrow, the detective ---------- */
let AR;
function buildArrow(parent) {
  const A = G(parent), flip = G(A), bob = G(flip);
  el('path', { d: 'M -36 -34 C -70 -40, -62 -4, -96 -8', stroke: C.red, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, bob);
  el('polygon', { points: '-115,-9 -95,-20 -97,2', fill: C.red }, bob);
  el('ellipse', { cx: -17, cy: -6, rx: 14, ry: 7, fill: C.bodyDark }, bob);
  el('ellipse', { cx: 17, cy: -6, rx: 14, ry: 7, fill: C.bodyDark }, bob);
  const head = G(bob);
  el('circle', { cx: 0, cy: -52, r: 45, fill: C.body }, head);
  el('circle', { cx: -16, cy: -70, r: 12, fill: '#fff', opacity: .13 }, head);
  const eyes = G(head);
  const eyesOpen = G(eyes);
  el('ellipse', { cx: -15, cy: -58, rx: 11, ry: 13, fill: C.card }, eyesOpen);
  el('ellipse', { cx: 15, cy: -58, rx: 11, ry: 13, fill: C.card }, eyesOpen);
  const pupils = [el('circle', { cx: -13, cy: -56, r: 5.5, fill: '#10182B' }, eyesOpen), el('circle', { cx: 17, cy: -56, r: 5.5, fill: '#10182B' }, eyesOpen)];
  const lid = el('rect', { x: -28, y: -73, width: 27, height: 13, fill: C.body }, eyesOpen);
  const eyesClosed = G(eyes);
  el('path', { d: 'M -25 -55 Q -15 -66 -5 -55', stroke: '#10182B', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, eyesClosed);
  el('path', { d: 'M 5 -55 Q 15 -66 25 -55', stroke: '#10182B', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, eyesClosed);
  const browSus = el('path', { d: 'M 5 -80 L 27 -86', stroke: '#10182B', 'stroke-width': 4, 'stroke-linecap': 'round' }, head);
  const browWor = el('path', { d: 'M -25 -74 L -8 -80 M 8 -80 L 25 -74', stroke: '#10182B', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, head);
  const mouths = {
    smile: el('path', { d: 'M -12 -34 Q 0 -24 12 -34', stroke: '#10182B', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, head),
    o: el('ellipse', { cx: 2, cy: -31, rx: 5, ry: 6, fill: '#10182B' }, head),
    big: el('ellipse', { cx: 1, cy: -30, rx: 8, ry: 10, fill: '#10182B' }, head),
    flat: el('path', { d: 'M -10 -31 L 10 -32', stroke: '#10182B', 'stroke-width': 4, 'stroke-linecap': 'round' }, head),
    open: el('path', { d: 'M -14 -37 Q 0 -15 14 -37 Z', fill: '#10182B' }, head),
    wavy: el('path', { d: 'M -13 -30 Q -6 -36 0 -30 Q 6 -24 13 -30', stroke: '#10182B', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, head)
  };
  const sweat = el('path', { d: 'M 40 -88 Q 47 -76 40 -72 Q 33 -76 40 -88 Z', fill: '#8EC9F0' }, head);
  const hat = G(head);
  el('ellipse', { cx: 0, cy: -91, rx: 44, ry: 8, fill: '#3B2A1E' }, hat);
  el('path', { d: 'M -27 -93 L -23 -124 Q 0 -133 23 -124 L 27 -93 Z', fill: '#4A3526' }, hat);
  el('rect', { x: -26, y: -102, width: 52, height: 7, fill: C.red }, hat);
  const glass = G(bob);
  el('circle', { cx: 38, cy: -40, r: 8, fill: C.body }, glass);
  el('line', { x1: 40, y1: -42, x2: 58, y2: -60, stroke: '#5B3A21', 'stroke-width': 7, 'stroke-linecap': 'round' }, glass);
  el('circle', { cx: 70, cy: -72, r: 19, fill: '#DDEBFA', 'fill-opacity': .35, stroke: C.brass, 'stroke-width': 6 }, glass);
  AR = { A, flip, bob, head, eyes, eyesOpen, eyesClosed, pupils, lid, browSus, browWor, mouths, sweat, hat, glass, mood: null };
}
const MOODS = {
  neutral: { mouth: 'smile' },
  curious: { mouth: 'o', tilt: -8, look: [3, -3] },
  suspicious: { mouth: 'flat', lid: 1, brow: 'sus', look: [-2, 1] },
  eureka: { mouth: 'open', eye: 1.2, glass: -38 },
  worried: { mouth: 'wavy', brow: 'wor', sweat: 1, look: [0, 2] },
  proud: { mouth: 'smile', closed: 1, hat: 1 },
  shocked: { mouth: 'big', eye: 1.28, hatUp: 1 }
};
function show(e, on) { e.style.display = on ? '' : 'none'; }
function setMood(m) {
  if (AR.mood === m) return;
  AR.mood = m;
  const d = MOODS[m] || MOODS.neutral;
  for (const k in AR.mouths) show(AR.mouths[k], k === d.mouth);
  show(AR.lid, !!d.lid); show(AR.browSus, d.brow === 'sus'); show(AR.browWor, d.brow === 'wor'); show(AR.sweat, !!d.sweat);
  show(AR.eyesOpen, !d.closed); show(AR.eyesClosed, !!d.closed);
  const lk = d.look || [0, 0];
  AR.pupils[0].setAttribute('cx', -13 + lk[0]); AR.pupils[0].setAttribute('cy', -56 + lk[1]);
  AR.pupils[1].setAttribute('cx', 17 + lk[0]); AR.pupils[1].setAttribute('cy', -56 + lk[1]);
  AR.head.setAttribute('transform', d.tilt ? `rotate(${d.tilt} 0 -50)` : '');
  AR.hat.setAttribute('transform', d.hat ? 'translate(0 -9) rotate(-16 0 -92)' : d.hatUp ? 'translate(0 -16)' : '');
  AR.glass.setAttribute('transform', d.glass ? `rotate(${d.glass} 38 -40)` : '');
  AR.eyeScale = d.eye || 1;
}
function moveInfo(keys, t) {
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t >= a[0] && t < b[0] && a[1] !== b[1]) return Math.sign(b[1] - a[1]);
  }
  return 0;
}
function renderArrow(sc, t) {
  const x = valAt(sc.ax, t), y = valAt(sc.ay, t), o = valAt(sc.ao, t);
  AR.x = x; AR.y = y; AR.o = o;
  AR.A.style.display = o <= .01 ? 'none' : '';
  AR.A.setAttribute('opacity', clamp(o, 0, 1).toFixed(3));
  AR.A.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const dx = moveInfo(sc.ax, t), dy = moveInfo(sc.ay, t);
  const moving = dx !== 0 || dy !== 0;
  const facing = dx !== 0 ? dx : (x > 800 ? -1 : 1);
  AR.flip.setAttribute('transform', `scale(${facing} 1)`);
  let off = 0;
  if (!REDUCED) off = moving && dx !== 0 ? -Math.abs(Math.sin(t * Math.PI * 2.94)) * 14 : Math.sin(t * 2.2) * 2.5;
  AR.bob.setAttribute('transform', `translate(0 ${off.toFixed(2)})`);
  setMood(stepAt(sc.am, t, 'neutral'));
  const blink = !REDUCED && (t % 4.1) < .12 && !MOODS[AR.mood].closed;
  const es = AR.eyeScale || 1;
  AR.eyesOpen.setAttribute('transform', `translate(0 -58) scale(${es} ${blink ? .1 : es}) translate(0 58)`);
}

/* ---------- captions and chapter title card ---------- */
let CAP, TITLE;
function buildCaption(parent) {
  const g = G(parent);
  const tail = el('polygon', { points: '0,0 0,0 0,0', fill: C.card, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const rect = el('rect', { x: 270, y: 758, width: 1060, height: 94, rx: 22, fill: C.card, stroke: C.ink, 'stroke-width': 3 }, g);
  const patch = el('line', { x1: 0, y1: 759.5, x2: 0, y2: 759.5, stroke: C.card, 'stroke-width': 5 }, g);
  const t1 = el('text', { x: 800, y: 816, 'text-anchor': 'middle', 'font-family': HAND, 'font-size': 34, fill: C.ink }, g);
  const t2 = el('text', { x: 800, y: 840, 'text-anchor': 'middle', 'font-family': HAND, 'font-size': 32, fill: C.ink }, g);
  CAP = { g, tail, rect, patch, t1, t2, cur: null, on: true };
}
function wrapRich(str, max) {
  const words = str.split(' ');
  const plainLen = a => a.join(' ').replace(/\*/g, '').length;
  if (plainLen(words) > max) {
    let best = 1, score = 1e9;
    for (let i = 1; i < words.length; i++) { const s = Math.max(plainLen(words.slice(0, i)), plainLen(words.slice(i))); if (s < score) { score = s; best = i; } }
    if (score <= max + 8) {
      const ls = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
      if ((ls[0].match(/\*/g) || []).length % 2 === 1) { ls[0] += '*'; ls[1] = '*' + ls[1]; }
      return ls;
    }
  }
  const lines = [];
  let cur = '';
  for (const w of words) {
    const plain = (cur + ' ' + w).replace(/\*/g, '').trim();
    if (cur && plain.length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  for (let i = 0; i < lines.length - 1; i++) {
    if ((lines[i].match(/\*/g) || []).length % 2 === 1) { lines[i] += '*'; lines[i + 1] = '*' + lines[i + 1]; }
  }
  return lines;
}
function renderCaption(sc, t) {
  let cur = null;
  for (const s of sc.says) if (t >= s.at && t < s.at + s.dur) cur = s;
  if (!cur || !CAP.on) { CAP.g.style.display = 'none'; CAP.cur = null; return; }
  CAP.g.style.display = '';
  if (CAP.cur !== cur) {
    CAP.cur = cur;
    const lines = wrapRich(cur.text, 52);
    if (lines.length === 1) {
      CAP.t1.setAttribute('y', 817); CAP.t1.setAttribute('font-size', 35); setRich(CAP.t1, lines[0]); setRich(CAP.t2, '');
    } else {
      CAP.t1.setAttribute('y', 797); CAP.t1.setAttribute('font-size', 32); setRich(CAP.t1, lines[0]);
      CAP.t2.setAttribute('y', 837); setRich(CAP.t2, lines.slice(1).join(' '));
    }
  }
  const local = t - cur.at, fade = Math.min(1, local / .18, (cur.dur - local) / .25);
  CAP.g.setAttribute('opacity', clamp(fade, 0, 1).toFixed(3));
  const showTail = AR.o > .5;
  show(CAP.tail, showTail); show(CAP.patch, showTail);
  if (showTail) {
    const tx = clamp(AR.x + (AR.x < 800 ? 60 : -60), 320, 1280);
    const tipX = clamp(AR.x + (AR.x < 800 ? 30 : -30), tx - 70, tx + 70);
    CAP.tail.setAttribute('points', `${tx - 16},760 ${tx + 16},760 ${tipX},730`);
    CAP.patch.setAttribute('x1', tx - 13); CAP.patch.setAttribute('x2', tx + 13);
  }
}
function buildTitle(parent) {
  const g = pv(G(parent), 800, 370);
  const c = card(g, 800, 370, 1180, 230, { rot: -1, ruled: false });
  const k = T(c.inner, 800, 335, '', { size: 34, fill: C.red });
  const t = T(c.inner, 800, 418, '', { font: SERIF, size: 58, weight: 600 });
  TITLE = { g, k, t, cur: null };
}
function renderTitle(sc, t) {
  if (sc.chapter == null || t > 2.45) { TITLE.g.style.display = 'none'; return; }
  TITLE.g.style.display = '';
  const s = st(TITLE.g);
  s.o = Math.min(1, t / .22, (2.45 - t) / .4);
  s.y = t < .3 ? (1 - EASE.o(t / .3)) * -40 : (t > 2.05 ? (t - 2.05) * -60 : 0);
  applyT(TITLE.g);
  const n = Math.round(clamp((t - .15) / 1.0, 0, 1) * sc.title.length);
  if (TITLE.cur !== sc || TITLE.n !== n) {
    TITLE.cur = sc; TITLE.n = n;
    TITLE.k.textContent = `Chapter ${sc.chapter}`;
    TITLE.t.textContent = sc.title.slice(0, n);
  }
}

/* ---------- timeline ---------- */
let TOTAL = 0, CUES = [], SAYS = [], curScene = null;
function buildAll() {
  let t = 0;
  for (const sc of scenes) {
    sc.start = t;
    const S = makeBuilder(sc);
    sc.build(S);
    if (sc.chapter != null) { S.sfx(.12, 'type'); S.sfx(.45, 'motif'); }
    if (!sc.noWhoosh) S.sfx(sc.dur - .55, 'whoosh');
    finalizeScene(sc);
    for (const c of sc.cues) CUES.push({ t: sc.start + c.at, name: c.name, arg: c.arg });
    for (const s of sc.says) SAYS.push({ t: sc.start + s.at, text: s.text });
    t += sc.dur;
  }
  TOTAL = t;
  CUES.sort((a, b) => a.t - b.t);
  SAYS.sort((a, b) => a.t - b.t);
}
function sceneAt(T) {
  for (let i = scenes.length - 1; i >= 0; i--) if (T >= scenes[i].start) return scenes[i];
  return scenes[0];
}
function render(Tg) {
  Tg = clamp(Tg, 0, TOTAL - 0.001);
  const sc = sceneAt(Tg), t = Tg - sc.start;
  if (sc !== curScene) {
    if (curScene) curScene.g.style.display = 'none';
    sc.g.style.display = '';
    curScene = sc;
  }
  for (const [e, m] of sc.tracks) {
    const s = st(e);
    for (const p in m) s[p] = valAt(m[p], t);
    applyT(e);
  }
  for (const f of sc.fns) f.f(clamp((t - f.at) / f.d, 0, 1), t);
  let so = 1;
  if (!sc.noFadeIn) so = Math.min(so, t / .35);
  if (!sc.noFadeOut) so = Math.min(so, (sc.dur - t) / .45);
  sc.g.setAttribute('opacity', clamp(so, 0, 1).toFixed(3));
  renderArrow(sc, t);
  AR.A.setAttribute('opacity', (clamp(AR.o, 0, 1) * clamp(sc.noFadeOut ? 1 : (sc.dur - t) / .45, 0, 1) * clamp(sc.noFadeIn ? 1 : t / .35 + .0, 0, 1)).toFixed(3));
  renderTitle(sc, t);
  renderCaption(sc, t);
  let dk = 0;
  if (Tg < 1.3) dk = 1 - clamp((Tg - .3) / .95, 0, 1);
  if (Tg > TOTAL - 1.6) dk = clamp((Tg - (TOTAL - 1.6)) / .9, 0, 1);
  darkRect.setAttribute('opacity', dk.toFixed(3));
  darkRect.style.display = dk <= .002 ? 'none' : '';
  return sc;
}

/* ============================================================
   AUDIO: everything synthesized with Web Audio
   ============================================================ */
let ctx = null, master, sfxBus, musicBus, duckGain, speechGain, noiseBuf, live = [];
const MUSIC_VOL = 0.2;
function initAudio() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 4;
  master = ctx.createGain(); master.gain.value = soundOn ? 0.95 : 0;
  master.connect(comp); comp.connect(ctx.destination);
  sfxBus = ctx.createGain(); sfxBus.gain.value = .7; sfxBus.connect(master);
  speechGain = ctx.createGain(); speechGain.gain.value = 1; speechGain.connect(master);
  duckGain = ctx.createGain(); duckGain.gain.value = 1; duckGain.connect(speechGain);
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
  const type = o.type || 'sine', f = o.f || 440, dur = o.dur || .3, a = o.a || .005;
  const n = ctx.createOscillator(); n.type = type;
  n.frequency.setValueAtTime(f, t);
  if (o.f1) n.frequency.exponentialRampToValueAtTime(o.f1, t + (o.glide || dur));
  const g = envG(t, a, o.vol || .2, dur);
  let src = n;
  if (o.filter) { const fl = ctx.createBiquadFilter(); fl.type = o.filter.type || 'lowpass'; fl.frequency.value = o.filter.f; fl.Q.value = o.filter.Q || 1; n.connect(fl); src = fl; }
  if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1]; l.connect(lg); lg.connect(n.frequency); l.start(t); l.stop(t + a + dur + .1); live.push({ n: l, end: t + a + dur + .1 }); }
  if (o.trem) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.trem; lg.gain.value = .35; const tg = ctx.createGain(); tg.gain.value = .65; l.connect(lg); lg.connect(tg.gain); src.connect(tg); src = tg; l.start(t); l.stop(t + a + dur + .1); live.push({ n: l, end: t + a + dur + .1 }); }
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
const mf = m => 440 * Math.pow(2, (m - 69) / 12);
function vib(t, f, dur, vol, bus) { osc(t, { f, dur, vol, a: .004, trem: 5.5, bus }); osc(t, { f: f * 4, dur: dur * .35, vol: vol * .12, bus }); }
function ticks(t, n, span, f, vol, Q) { for (let i = 0; i < n; i++) noise(t + (i + Math.random() * .4) * span / n, { dur: .025, vol: vol || .35, f: f || 3000, Q: Q || 3 }); }

const SFX = {
  pin: t => { noise(t, { dur: .035, vol: .45, type: 'highpass', f: 2500 }); osc(t, { f: 1800, f1: 900, dur: .05, vol: .12 }); },
  pop: t => osc(t, { f: 340, f1: 900, dur: .14, vol: .26, glide: .09 }),
  string: t => { osc(t, { type: 'triangle', f: 220, f1: 660, dur: .45, vol: .2, glide: .35, filter: { f: 2400 } }); osc(t, { f: 440, f1: 1320, dur: .32, vol: .06, glide: .3 }); },
  stringDown: t => { osc(t, { type: 'triangle', f: 760, f1: 190, dur: .6, vol: .2, glide: .55, filter: { f: 2200 } }); },
  snip: t => { noise(t, { dur: .03, vol: .45, f: 5200, Q: 3 }); noise(t + .08, { dur: .03, vol: .45, f: 6200, Q: 3 }); },
  doorShut: t => { osc(t, { f: 95, f1: 42, dur: .38, vol: .55, glide: .3 }); noise(t, { dur: .16, vol: .55, type: 'lowpass', f: 520 }); osc(t + .02, { type: 'sawtooth', f: 140, f1: 110, dur: .2, vol: .05, filter: { type: 'bandpass', f: 900, Q: 6 } }); },
  doorCreak: t => { osc(t, { type: 'sawtooth', f: 85, f1: 170, dur: .95, vol: .12, a: .12, glide: .95, filter: { type: 'bandpass', f: 900, Q: 7 }, vib: [22, 18] }); },
  creak: t => { osc(t, { type: 'sawtooth', f: 110, f1: 150, dur: .5, vol: .1, a: .05, filter: { type: 'bandpass', f: 1000, Q: 7 }, vib: [26, 16] }); },
  ding: t => { osc(t, { f: 1318.5, dur: 1.5, vol: .2 }); osc(t, { f: 2637, dur: .8, vol: .05 }); osc(t, { f: 1975.5, dur: 1.1, vol: .05 }); },
  buzz: t => { osc(t, { type: 'square', f: 110, dur: .42, vol: .1, filter: { f: 900 } }); osc(t, { type: 'square', f: 116.5, dur: .42, vol: .08, filter: { f: 900 } }); },
  softBuzz: t => { osc(t, { type: 'square', f: 130, dur: .25, vol: .05, filter: { f: 700 } }); },
  type: t => { for (let i = 0; i < 9; i++) noise(t + i * .085 + Math.random() * .02, { dur: .02, vol: .32, f: 3400, Q: 2.5 }); },
  stamp: t => { noise(t, { dur: .12, vol: .7, type: 'lowpass', f: 420 }); osc(t, { f: 150, f1: 55, dur: .2, vol: .45 }); },
  whoosh: t => noise(t, { dur: .55, vol: .22, f: 320, f1: 2600, Q: .8, a: .22 }),
  paper: t => { for (let i = 0; i < 5; i++) noise(t + i * .07 + Math.random() * .03, { dur: .06, vol: .16, f: 2800 + Math.random() * 2400, Q: 1 }); },
  drop: (t, p) => osc(t, { f: p || 600, f1: (p || 600) * .62, dur: .11, vol: .14, glide: .1 }),
  step: t => { noise(t, { dur: .05, vol: .3, type: 'lowpass', f: 190 }); osc(t, { f: 95, f1: 60, dur: .06, vol: .1 }); },
  dice: t => { for (let i = 0; i < 10; i++) { const tt = t + Math.random() * .6; noise(tt, { dur: .02, vol: .3, f: 1900, Q: 4 }); osc(tt, { f: 2300 + Math.random() * 600, dur: .02, vol: .03 }); } },
  tick: t => { osc(t, { f: 1150, dur: .04, vol: .13 }); noise(t, { dur: .02, vol: .1, type: 'highpass', f: 4000 }); },
  magnet: t => { osc(t, { f: 70, f1: 150, dur: .42, vol: .16, a: .18 }); SFX.pin(t + .45); },
  gong: t => { osc(t, { f: 98, dur: 2.6, vol: .3 }); osc(t, { f: 148.4, dur: 2, vol: .13 }); osc(t, { f: 233.7, dur: 1.4, vol: .07 }); noise(t, { dur: .1, vol: .2, type: 'lowpass', f: 300 }); },
  lamp: t => { noise(t, { dur: .02, vol: .5, type: 'highpass', f: 3000 }); osc(t, { f: 2400, dur: .02, vol: .08 }); noise(t + .05, { dur: .02, vol: .35, type: 'highpass', f: 2200 }); },
  cello: t => { osc(t, { type: 'sawtooth', f: 98, dur: 2.4, a: .7, vol: .09, filter: { f: 520 } }); osc(t, { type: 'sawtooth', f: 98.6, dur: 2.4, a: .8, vol: .07, filter: { f: 480 } }); },
  rumble: t => noise(t, { dur: 1.6, vol: .45, type: 'lowpass', f: 130, a: .4 }),
  chalk: t => { for (let i = 0; i < 7; i++) noise(t + i * .09 + Math.random() * .04, { dur: .05, vol: .14, f: 4200, Q: .8 }); },
  boing: t => osc(t, { f: 240, f1: 120, dur: .5, vol: .2, glide: .45, vib: [11, 30] }),
  whoomp: t => osc(t, { f: 170, f1: 50, dur: .38, vol: .4, glide: .35 }),
  squeegee: t => { osc(t, { f: 500, f1: 1300, dur: .5, vol: .07, glide: .5 }); noise(t, { dur: .5, vol: .08, f: 2000, Q: 2 }); },
  pulse: t => osc(t, { f: 220, dur: .45, vol: .1, a: .2 }),
  wind: t => noise(t, { dur: 2, vol: .28, f: 400, f1: 1300, Q: .6, a: .6 }),
  rattle: t => { for (let i = 0; i < 7; i++) noise(t + i * .09, { dur: .04, vol: .3, f: 900, Q: 3 }); },
  click: t => { noise(t, { dur: .02, vol: .45, type: 'highpass', f: 2500 }); },
  clank: t => { osc(t, { f: 523, dur: .7, vol: .12 }); osc(t, { f: 1187, dur: .5, vol: .08 }); osc(t, { f: 1760, dur: .3, vol: .05 }); noise(t, { dur: .08, vol: .5, type: 'lowpass', f: 1500 }); },
  clink: t => { osc(t, { f: 2600 + Math.random() * 300, dur: .25, vol: .1 }); osc(t, { f: 3900, dur: .14, vol: .04 }); },
  ratchet: t => ticks(t, 6, .45, 2500, .35, 5),
  shimmer: t => [1568, 1760, 2093, 2637].forEach((f, i) => osc(t + i * .08, { f, dur: .5, vol: .045 })),
  fadeTone: t => osc(t, { f: 440, f1: 330, dur: .5, vol: .07 }),
  pour: t => noise(t, { dur: 1.2, vol: .3, type: 'lowpass', f: 900, f1: 600, a: .2 }),
  drip: t => osc(t, { f: 1400, f1: 500, dur: .1, vol: .18 }),
  hum: t => osc(t, { type: 'sawtooth', f: 120, dur: 1.2, vol: .045, a: .3, filter: { f: 420 } }),
  thwack: t => { noise(t, { dur: .08, vol: .6, type: 'lowpass', f: 1200 }); osc(t, { f: 220, f1: 90, dur: .12, vol: .3 }); },
  alarm: t => { [880, 660, 880].forEach((f, i) => osc(t + i * .16, { type: 'square', f, dur: .12, vol: .06, filter: { f: 2500 } })); },
  burst: t => { noise(t, { dur: .35, vol: .4, f: 1500, f1: 300, Q: .8 }); osc(t, { f: 300, f1: 80, dur: .3, vol: .2 }); },
  wobble: t => osc(t, { f: 330, dur: 1.6, vol: .07, vib: [6, 30] }),
  crack: t => { noise(t, { dur: .05, vol: .6, type: 'highpass', f: 1500 }); noise(t + .07, { dur: .03, vol: .4, type: 'highpass', f: 2200 }); },
  rug: t => noise(t, { dur: .3, vol: .4, type: 'lowpass', f: 800, a: .05 }),
  squeak: t => osc(t, { f: 1500, f1: 2400, dur: .08, vol: .07 }),
  blend: t => [440, 554.4, 659.3].forEach(f => osc(t, { f, dur: 1.2, vol: .045, a: .3 })),
  gear: t => ticks(t, 12, 2.4, 1600, .2, 4),
  thunk: t => { osc(t, { f: 125, f1: 70, dur: .16, vol: .4 }); noise(t, { dur: .08, vol: .35, type: 'lowpass', f: 600 }); },
  swoosh: t => noise(t, { dur: .32, vol: .16, f: 600, f1: 2400, Q: 1, a: .1 }),
  dial: t => ticks(t, 5, .6, 2000, .25, 4),
  motif: (t, a, ft) => {
    const notes = ft < 336 ? [69, 72, 76, 74] : [72, 76, 79, 77];
    notes.forEach((m, i) => vib(t + i * .17, mf(m), i === 3 ? 1.1 : .5, .1, sfxBus));
  },
  motifEnd: t => { [72, 76, 79, 84].forEach((m, i) => vib(t + i * .17, mf(m), 1.4, .1, sfxBus)); },
  swell: t => [60, 64, 67, 71].forEach(m => osc(t, { type: 'triangle', f: mf(m), dur: 3.5, vol: .035, a: 1.8, filter: { f: 1600 } })),
  finalChord: t => [48, 55, 64, 67, 71, 76].forEach(m => osc(t, { type: 'triangle', f: mf(m), dur: 5, vol: .045, a: .05, filter: { f: 1800 } }))
};
const DUCKERS = new Set(['ding', 'buzz', 'gong', 'stamp', 'doorShut', 'doorCreak', 'clank', 'motif', 'motifEnd', 'finalChord', 'boing', 'alarm']);
function duck(t) {
  duckGain.gain.setTargetAtTime(.45, t, .03);
  duckGain.gain.setTargetAtTime(1, t + .7, .25);
}
function playCue(c, at) {
  const f = SFX[c.name];
  if (!f) return;
  try { f(at, c.arg, c.t); if (DUCKERS.has(c.name)) duck(at); } catch (e) { /* ignore a single failed sound */ }
}

/* music: walking bass, brushes and soft chords, scheduled beat by beat */
const SECTIONS = [
  { s: 30.6, e: 336, bpm: 92, key: 'min' },
  { s: 336.6, e: 662, bpm: 100, key: 'maj' },
  { s: 662.3, e: 684, bpm: 84, key: 'fin' }
];
const PROG = {
  min: [{ r: 45, q: 'm7' }, { r: 50, q: 'm7' }, { r: 40, q: '7' }, { r: 45, q: 'm7' }],
  maj: [{ r: 48, q: 'M7' }, { r: 45, q: 'm7' }, { r: 41, q: 'M7' }, { r: 43, q: '7' }],
  fin: [{ r: 41, q: 'M7' }, { r: 43, q: '7' }, { r: 48, q: 'M7' }]
};
const QUAL = { m7: [0, 3, 7, 10], '7': [0, 4, 7, 10], M7: [0, 4, 7, 11] };
function bassNote(t, f, d) { osc(t, { type: 'triangle', f, dur: d, vol: .55, a: .008, filter: { f: 700 }, bus: musicBus }); osc(t, { f: f / 2, dur: d * .8, vol: .25, bus: musicBus }); }
function hat(t, v) { noise(t, { dur: .06, vol: v, type: 'highpass', f: 6500, bus: musicBus }); }
function keysChord(t, ms, d) { ms.forEach(m => osc(t, { type: 'triangle', f: mf(m), dur: d, vol: .05, a: .01, filter: { f: 1700 }, bus: musicBus })); }
function playBeat(sec, i, t, bl) {
  const bar = Math.floor(i / 4), b = i % 4;
  const prog = PROG[sec.key];
  if (sec.key === 'fin') {
    if (bar > 2) return;
    const ch = prog[bar], q = QUAL[ch.q];
    if (bar === 2) { if (b === 0) { bassNote(t, mf(ch.r), bl * 6); keysChord(t, q.map(v => ch.r + 12 + v), bl * 8); } return; }
    bassNote(t, mf(b === 0 ? ch.r : ch.r + q[b]), bl * .92);
    if (b === 0) keysChord(t, q.slice(1).map(v => ch.r + 12 + v), bl * 3);
    if (b % 2 === 1) hat(t, .12);
    return;
  }
  const ch = prog[bar % prog.length], nx = prog[(bar + 1) % prog.length], q = QUAL[ch.q];
  const m = b === 0 ? ch.r : b === 1 ? ch.r + q[1] : b === 2 ? ch.r + 7 : nx.r - 1;
  bassNote(t, mf(m), bl * .9);
  if (b === 1 || b === 3) hat(t, .2);
  hat(t + bl * 2 / 3, .07);
  if (b === 0) { osc(t, { f: 70, f1: 45, dur: .16, vol: .22, bus: musicBus }); keysChord(t, q.slice(1).map(v => ch.r + 12 + v), bl * 2.6); }
  if (sec.key === 'maj' && bar % 2 === 1 && b === 2) vib(t, mf(ch.r + 24 + q[(bar >> 1) % 4]), 1.2, .06, musicBus);
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
   VOICE: Arrow speaks each caption with the browser's voice
   ============================================================ */
let voice = null, voiceOn = true, soundOn = true;
const SPEECH = 'speechSynthesis' in window ? window.speechSynthesis : null;
function pickVoice() {
  if (!SPEECH) return;
  const vs = SPEECH.getVoices();
  if (!vs.length) return;
  const prefs = ['Daniel', 'Google UK English Male', 'Arthur', 'Aaron', 'Microsoft Ryan', 'Microsoft Guy', 'Alex', 'Google US English', 'Samantha', 'Rishi'];
  for (const p of prefs) { const v = vs.find(v => v.name.includes(p) && /^en/i.test(v.lang)); if (v) { voice = v; return; } }
  voice = vs.find(v => /^en[-_]GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || vs[0];
}
if (SPEECH) { pickVoice(); if (SPEECH.addEventListener) SPEECH.addEventListener('voiceschanged', pickVoice); else SPEECH.onvoiceschanged = pickVoice; }
let speakTimer = null;
function speak(text) {
  if (!SPEECH || !voiceOn || !soundOn) return;
  const plain = text.replace(/\*/g, '').replace(/…/g, '...').replace(/−/g, ' minus ');
  SPEECH.cancel();
  clearTimeout(speakTimer);
  speakTimer = setTimeout(() => {
    const u = new SpeechSynthesisUtterance(plain);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-US';
    u.rate = 1.04; u.pitch = 1.12; u.volume = 1;
    u.onstart = () => { if (ctx) speechGain.gain.setTargetAtTime(.45, ctx.currentTime, .08); };
    u.onend = u.onerror = () => { if (ctx) speechGain.gain.setTargetAtTime(1, ctx.currentTime, .3); };
    SPEECH.speak(u);
  }, 40);
}
function stopSpeech() { clearTimeout(speakTimer); if (SPEECH) SPEECH.cancel(); if (ctx) speechGain.gain.setTargetAtTime(1, ctx.currentTime, .1); }

/* ============================================================
   TRANSPORT: one clock (the audio clock) for everything
   ============================================================ */
let playing = false, filmT = 0, t0 = 0, c0 = 0, cueIdx = 0, sayIdx = 0, musicCursor = 0, lastSayT = -1;
const clock = () => ctx ? ctx.currentTime : performance.now() / 1000;
function filmToCtx(ft) { return c0 + (ft - t0); }
function now() { return playing ? Math.max(t0, t0 + (clock() - c0)) : filmT; }
function stopAllSound() {
  for (const n of live) { try { n.n.stop(0); } catch (e) { } }
  live = [];
  if (ctx) { duckGain.gain.cancelScheduledValues(0); duckGain.gain.value = 1; }
}
function lowerBound(arr, t) { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m].t < t) lo = m + 1; else hi = m; } return lo; }
function play() {
  if (filmT >= TOTAL - .05) filmT = 0;
  if (ctx && ctx.state !== 'running') ctx.resume();
  t0 = filmT; c0 = clock() + .06;
  cueIdx = lowerBound(CUES, t0); sayIdx = lowerBound(SAYS, t0); musicCursor = t0;
  playing = true;
  updateUI();
}
function pause() {
  filmT = now(); playing = false;
  stopAllSound(); stopSpeech();
  updateUI();
}
function seek(t) {
  const was = playing;
  if (playing) { playing = false; stopAllSound(); stopSpeech(); }
  filmT = clamp(t, 0, TOTAL);
  render(filmT); updateUI();
  if (was) play();
}
function schedulerTick() {
  if (!playing || !ctx) return;
  const ft = now(), until = ft + .22;
  while (cueIdx < CUES.length && CUES[cueIdx].t < until) {
    const c = CUES[cueIdx++];
    if (c.t >= ft - .06) playCue(c, filmToCtx(Math.max(c.t, ft)));
  }
  if (until > musicCursor) { scheduleMusic(musicCursor, until); musicCursor = until; }
  const cn = clock();
  if (live.length > 400) live = live.filter(n => n.end > cn);
}
function frame() {
  if (playing) {
    let T = now();
    let latest = null;
    while (sayIdx < SAYS.length && SAYS[sayIdx].t <= T) { latest = SAYS[sayIdx++]; }
    if (latest && T - latest.t < 1.2) speak(latest.text);
    if (T >= TOTAL) { T = TOTAL; filmT = TOTAL; playing = false; stopAllSound(); showEnd(); }
    render(T);
    updateUI(T);
  }
  requestAnimationFrame(frame);
}
