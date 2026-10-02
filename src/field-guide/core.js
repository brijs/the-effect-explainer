/* ---------- animatable state ---------- */
function st(e) { if (!e._st) e._st = { x: 0, y: 0, s: 1, r: 0, o: 1, sx: 1, sy: 1, ox: 0, oy: 0 }; return e._st; }
function pv(e, ox, oy) { const s = st(e); s.ox = ox; s.oy = oy; return e; }
const DEF = { x: 0, y: 0, s: 1, r: 0, o: 1, sx: 1, sy: 1, d: 1 };
function applyT(e) {
  const s = e._st;
  if (s.x || s.y || s.s !== 1 || s.r || s.sx !== 1 || s.sy !== 1) {
    e.setAttribute('transform', `translate(${(s.x + s.ox).toFixed(2)} ${(s.y + s.oy).toFixed(2)}) rotate(${s.r.toFixed(2)}) scale(${(s.s * s.sx).toFixed(4)} ${(s.s * s.sy).toFixed(4)}) translate(${-s.ox} ${-s.oy})`);
  } else e.removeAttribute('transform');
  const o = clamp(s.o, 0, 1);
  if (o < 0.999) e.setAttribute('opacity', o.toFixed(3)); else e.removeAttribute('opacity');
  e.style.display = (o <= 0.002 || (s._dt && s.d <= 0.002)) ? 'none' : '';
  if (s._dt) { e.setAttribute('stroke-dasharray', '1 1'); e.setAttribute('stroke-dashoffset', (1 - clamp(s.d, 0, 1)).toFixed(4)); }
}
function valAt(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (t < b[0]) { const a = keys[i - 1], span = b[0] - a[0]; if (span <= 0) return b[1]; return a[1] + (b[1] - a[1]) * EASE[b[2] || 'io']((t - a[0]) / span); }
  }
  return keys[keys.length - 1][1];
}
function stepAt(keys, t, def) { let v = def; for (const k of keys) { if (k[0] <= t) v = k[1]; else break; } return v; }

/* ---------- stage ---------- */
let svg, defs, boardLayer, sceneLayer, varLayer, titleLayer, capLayer, darkRect;
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
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.desk }, g);
  const pat = el('pattern', { id: 'grid', width: 40, height: 40, patternUnits: 'userSpaceOnUse' }, defs);
  el('rect', { width: 40, height: 40, fill: C.paper }, pat);
  el('path', { d: 'M40 0 L0 0 0 40', fill: 'none', stroke: C.grid, 'stroke-width': 1.4 }, pat);
  el('path', { d: 'M20 0 L20 40 M0 20 L40 20', fill: 'none', stroke: C.grid, 'stroke-width': .6, opacity: .7 }, pat);
  el('rect', { x: 34, y: 30, width: W - 60, height: H - 52, rx: 14, fill: '#000', opacity: .3 }, g);
  el('rect', { x: 26, y: 22, width: W - 52, height: H - 44, rx: 14, fill: 'url(#grid)' }, g);
  el('line', { x1: 118, x2: 118, y1: 22, y2: H - 22, stroke: C.Y, 'stroke-width': 2, opacity: .35 }, g);
  for (let y = 70; y < H - 40; y += 64) {
    el('circle', { cx: 62, cy: y, r: 9, fill: C.desk }, g);
    el('path', { d: `M40 ${y - 4} Q54 ${y - 22} 68 ${y - 2}`, stroke: '#9AA3B0', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
  }
}

/* ---------- props ---------- */
function tape(g, x, y, rot) { return el('rect', { x: x - 34, y: y - 11, width: 68, height: 22, fill: '#F7F1C8', opacity: .82, transform: `rotate(${rot || -4} ${x} ${y})` }, g); }
function card(g, cx, cy, w, h, o) {
  o = o || {};
  const outer = pv(G(g), cx, cy);
  const inner = G(outer, o.rot ? { transform: `rotate(${o.rot} ${cx} ${cy})` } : {});
  const rx = o.rx != null ? o.rx : 10;
  el('rect', { x: cx - w / 2 + 5, y: cy - h / 2 + 7, width: w, height: h, rx, fill: '#000', opacity: .13 }, inner);
  el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx, fill: o.fill || C.card, stroke: o.stroke || C.ink, 'stroke-width': o.sw != null ? o.sw : 2.5 }, inner);
  if (o.tape !== false) tape(inner, cx, cy - h / 2, (o.rot || 0) - 3);
  outer.inner = inner;
  return outer;
}
function note(g, cx, cy, text, o) {
  o = o || {};
  const size = o.size || 30, lh = size * 1.2;
  const lines = String(text).split('\n');
  const w = o.w || Math.max(...lines.map(l => l.replace(/\*/g, '').length)) * size * 0.5 + 56;
  const h = o.h || lines.length * lh + 34;
  const c = card(g, cx, cy, w, h, o);
  const top = cy - lines.length * lh / 2;
  lines.forEach((l, i) => T(c.inner, o.anchor === 'start' ? cx - w / 2 + 26 : cx, top + size * 0.86 + i * lh, l, { size, font: o.font || HAND, fill: o.color || C.ink, weight: o.weight, anchor: o.anchor }));
  c.w = w; c.h = h;
  return c;
}
function chip(g, x, y, text, col, o) {
  o = o || {};
  const size = o.size || 26, w = o.w || text.length * size * 0.56 + 36, h = size + 22;
  const c = pv(G(g), x, y);
  el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: h / 2, fill: col, stroke: o.stroke || 'none', 'stroke-width': 2.5 }, c);
  T(c, x, y + size * .36, text, { font: o.font || HEAD, size, fill: o.ink || '#fff', weight: o.weight || 600 });
  c.w = w;
  return c;
}
const KIND = { X: [C.X, '#fff', null], Y: [C.Y, '#fff', null], W: [C.Wl, C.ink, null], U: ['#fff', C.ink, '8 6'], Z: [C.Z, C.ink, null], O: ['#fff', C.ink, null], M: ['#E3F2FD', C.ink, null] };
function node(g, x, y, label, name, kind, o) {
  o = o || {}; kind = kind || 'O';
  const n = pv(G(g), x, y), r = o.r || 32;
  const [fill, ink, dash] = KIND[kind];
  el('circle', { cx: x + 3, cy: y + 5, r, fill: '#000', opacity: .14 }, n);
  el('circle', { cx: x, cy: y, r, fill, stroke: kind === 'W' || kind === 'U' ? C.W : C.ink, 'stroke-width': 3, 'stroke-dasharray': dash }, n);
  T(n, x, y + r * .33, label, { font: HEAD, size: o.ls || r * .9, fill: ink, weight: 700 });
  if (name) {
    const ns = o.ns || 22, w = name.length * ns * .5 + 18, ty = y + r + 27;
    el('rect', { x: x - w / 2, y: ty - ns - 1, width: w, height: ns + 10, rx: 6, fill: '#fff', opacity: .92 }, n);
    T(n, x, ty, name, { size: ns });
  }
  n.pos = { x, y, r };
  return n;
}
function quadPoint(a, c, b, t) { const u = 1 - t; return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }; }
function link(g, A, B, o) {
  o = o || {};
  const a = A.pos || A, b = B.pos || B;
  const ra = (a.r || 0) + 5, rb = (b.r || 0) + 9;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const bend = o.bend || 0;
  const c = { x: (a.x + b.x) / 2 - uy * bend * len, y: (a.y + b.y) / 2 + ux * bend * len };
  const sdx = c.x - a.x, sdy = c.y - a.y, sl = Math.hypot(sdx, sdy) || 1;
  const s = { x: a.x + sdx / sl * ra, y: a.y + sdy / sl * ra };
  const edx = b.x - c.x, edy = b.y - c.y, ell = Math.hypot(edx, edy) || 1;
  const e = { x: b.x - edx / ell * rb, y: b.y - edy / ell * rb };
  const lg = G(g), col = o.color || C.ink;
  const d = `M${s.x.toFixed(1)} ${s.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
  const path = el('path', { d, stroke: col, 'stroke-width': o.w || 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null, pathLength: o.dash ? null : 1 }, lg);
  const head = G(lg);
  if (!o.noHead) el('polygon', { points: '0,0 -18,-9 -18,9', fill: col, transform: `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) rotate(${(Math.atan2(edy, edx) * 180 / Math.PI).toFixed(1)})` }, head);
  return { g: lg, path, head, d, mid: quadPoint(s, c, e, .5), s, c, e, at: t => quadPoint(s, c, e, t) };
}
function chart(g, cx, cy, w, h, o) {
  o = o || {};
  const c = card(g, cx, cy, w, h, { rot: o.rot || 0, tape: o.tape });
  const L = cx - w / 2 + (o.padL || 80), R = cx + w / 2 - (o.padR || 28), Tp = cy - h / 2 + (o.padT || 40), B = cy + h / 2 - (o.padB || 60);
  const ax = G(c.inner);
  el('line', { x1: L, y1: B, x2: R, y2: B, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, ax);
  el('line', { x1: L, y1: B, x2: L, y2: Tp, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' }, ax);
  if (o.xl) T(ax, (L + R) / 2, B + 42, o.xl, { size: o.ls || 23 });
  if (o.yl) { const yt = T(ax, L - 40, (Tp + B) / 2, o.yl, { size: o.ls || 23 }); yt.setAttribute('transform', `rotate(-90 ${L - 40} ${(Tp + B) / 2})`); }
  const [x0, x1] = o.xr || [0, 1], [y0, y1] = o.yr || [0, 1];
  c.px = v => L + (v - x0) / (x1 - x0) * (R - L);
  c.py = v => B - (v - y0) / (y1 - y0) * (B - Tp);
  Object.assign(c, { L, R, T: Tp, B });
  c.plot = G(c.inner);
  return c;
}
function person(g, x, y, col, o) {
  o = o || {};
  const s = pv(G(g), x, y), k = o.k || 1;
  el('circle', { cx: x, cy: y - 26 * k, r: 15 * k, fill: o.skin || '#F2C9A5', stroke: C.ink, 'stroke-width': 2 }, s);
  s.body = el('path', { d: `M${x - 22 * k} ${y + 22 * k} Q${x - 22 * k} ${y - 8 * k} ${x} ${y - 8 * k} Q${x + 22 * k} ${y - 8 * k} ${x + 22 * k} ${y + 22 * k} Z`, fill: col || C.grey, stroke: C.ink, 'stroke-width': 2 }, s);
  return s;
}
function check(g, x, y, size) {
  const m = pv(G(g), x, y), s = size || 18;
  el('circle', { cx: x, cy: y, r: s * 1.25, fill: C.ok }, m);
  el('path', { d: `M${x - s * .55} ${y} L${x - s * .12} ${y + s * .45} L${x + s * .6} ${y - s * .45}`, stroke: '#fff', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, m);
  return m;
}
function xMark(g, x, y, size, col) {
  const m = pv(G(g), x, y), s = size || 22;
  el('path', { d: `M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}`, stroke: col || C.Y, 'stroke-width': 8, 'stroke-linecap': 'round' }, m);
  return m;
}
function lockIcon(g, x, y) {
  const l = pv(G(g), x, y);
  el('path', { d: `M${x - 11} ${y - 4} v-10 a11 11 0 0 1 22 0 v10`, fill: 'none', stroke: C.ink, 'stroke-width': 5 }, l);
  el('rect', { x: x - 17, y: y - 6, width: 34, height: 27, rx: 5, fill: C.Z, stroke: C.ink, 'stroke-width': 2.5 }, l);
  return l;
}
function pathD(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '); }
function fitLine(xs, ys) {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const b = sxy / sxx; return { a: my - b * mx, b };
}
function wrapText(str, max) {
  const words = String(str).split(' '), out = [];
  let cur = '';
  for (const w of words) { if (cur && (cur + ' ' + w).replace(/\*/g, '').length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }
  if (cur) out.push(cur);
  for (let i = 0; i < out.length - 1; i++) if ((out[i].match(/\*/g) || []).length % 2) { out[i] += '*'; out[i + 1] = '*' + out[i + 1]; }
  return out;
}
function textBlock(g, x, y, str, max, o) {
  o = o || {};
  const lh = (o.size || 28) * (o.lh || 1.25);
  const lines = wrapText(str, max);
  lines.forEach((l, i) => T(g, x, y + i * lh, l, o));
  return lines.length * lh;
}

/* ---------- scenes and builder ---------- */
const scenes = [];
function scene(def) { scenes.push(def); }
const VX = 1400, VY = 738;
function speechDur(t) {
  const k = typeof VIDX !== 'undefined' ? VIDX.get(t) : undefined;
  if (k != null) return VCLIPS.dur[k] + .15;
  const plain = t.replace(/\*/g, '');
  let n = plain.split(/\s+/).filter(Boolean).length;
  n += (plain.match(/\d[\d,.]*/g) || []).length * 1.1 + (plain.match(/[₹%+−]/g) || []).length * .7;
  return .45 + n / 2.4;
}
function makeBuilder(sc) {
  const g = G(sceneLayer); g.style.display = 'none';
  Object.assign(sc, { g, tracks: new Map(), fns: [], cues: [], says: [], pauses: [], ax: [], ay: [], ao: [], am: [] });
  const S = {
    g, sc, _x: VX, _y: VY,
    k(e, p, ...keys) { st(e); let m = sc.tracks.get(e); if (!m) { m = {}; sc.tracks.set(e, m); } (m[p] || (m[p] = [])).push(...keys.map(k => k.slice())); return e; },
    pop(e, at, d) { d = d || .42; S.k(e, 'o', [at, 0], [at + .1, 1, 'lin']); S.k(e, 's', [at, .3], [at + d, 1, 'back']); return e; },
    fadeIn(e, at, d, to) { S.k(e, 'o', [at, 0], [at + (d || .45), to == null ? 1 : to, 'o']); return e; },
    fadeOut(e, at, d, to) { S.k(e, 'o', [at, null], [at + (d || .4), to || 0, 'io']); return e; },
    to(e, p, at, d, v, ease) { S.k(e, p, [at, null], [at + d, v, ease || 'io']); return e; },
    draw(lk, at, d, snd) { d = d || .6; S.k(lk.path, 'd', [at, 0], [at + d, 1, 'io']); S.k(lk.head, 'o', [at + d - .1, 0], [at + d, 1, 'lin']); if (snd !== false) S.sfx(at, 'string'); return lk; },
    glow(lk, at, d, to, col) {
      if (!lk.glow) { lk.glow = el('path', { d: lk.d, stroke: col || C.hi, 'stroke-width': 20, fill: 'none', 'stroke-linecap': 'round' }); lk.g.insertBefore(lk.glow, lk.g.firstChild); }
      S.k(lk.glow, 'o', [at, 0], [at + (d || .5), to == null ? .95 : to]); return lk;
    },
    fn(at, d, f) { sc.fns.push({ at, d, f }); },
    sfx(at, name, arg) { sc.cues.push({ at, name, arg }); },
    say(at, text) { sc.says.push({ at, text, est: speechDur(text) }); },
    stamp(e, at) { S.k(e, 'o', [at, 0], [at + .08, 1, 'lin']); S.k(e, 's', [at, 1.8], [at + .18, 1, 'o']); S.sfx(at + .14, 'stamp'); return e; },
    place(x, y, m) { y = y == null ? VY : y; sc.ax = [[0, x]]; sc.ay = [[0, y]]; sc.am = [[0, m || 'neutral']]; S._x = x; S._y = y; },
    roll(at, d, x, y) { if (y == null) y = S._y; sc.ax.push([at, S._x], [at + d, x, 'io']); sc.ay.push([at, S._y], [at + d, y, 'io']); if (x !== S._x) S.sfx(at, 'roll', d); S._x = x; S._y = y; },
    mood(at, m) { sc.am.push([at, m]); },
    varO(...keys) { sc.ao.push(...keys); },
    /* narration cursor: visuals hang off the times it returns */
    t: 2.7,
    line(text, gap) { const at = S.t; S.say(at, text); const d = speechDur(text); S.t = at + d + (gap == null ? .4 : gap); return at; },
    wait(d) { S.t += d; return S.t; },
    pause(mood) {
      const at = S.t;
      sc.pauses.push(at);
      S.mood(at - .3, mood || 'think');
      S.t = at + .7;
      return at;
    },
    end(extra) { sc.dur = S.t + (extra == null ? 1.4 : extra); }
  };
  return S;
}
function finalizeScene(sc) {
  for (const [e, m] of sc.tracks) for (const p in m) {
    const keys = m[p].sort((a, b) => a[0] - b[0]);
    let prev = DEF[p];
    for (const k of keys) { if (k[1] === null) k[1] = prev; prev = k[1]; }
    if (p === 'd') st(e)._dt = true;
  }
  const byT = (a, b) => a[0] - b[0];
  sc.ax.sort(byT); sc.ay.sort(byT); sc.am.sort(byT); sc.ao.sort(byT);
  if (!sc.ao.length) sc.ao = [[0, 1]];
  sc.says.sort((a, b) => a.at - b.at);
  sc.says.forEach((s, i) => {
    const nx = sc.says[i + 1];
    let d = s.est + 1.4;
    if (nx) d = Math.min(d, nx.at - s.at - .08);
    s.dur = Math.max(1.4, Math.min(d, sc.dur - s.at - .2));
  });
}
function chap(def) { scene(Object.assign({ chapter: true, name: def.title }, def)); }

/* ---------- Vari, the robot host ---------- */
let VR;
function buildVari(parent) {
  const A = G(parent);
  const shadow = el('ellipse', { cx: 0, cy: -2, rx: 46, ry: 7, fill: '#000', opacity: .16 }, A);
  const flip = G(A), bob = G(flip);
  const wheels = [-22, 22].map(x => { const w = G(bob); el('circle', { cx: x, cy: -16, r: 15, fill: C.ink }, w); el('circle', { cx: x, cy: -16, r: 6, fill: '#C9D1DC' }, w); el('line', { x1: x - 12, y1: -16, x2: x + 12, y2: -16, stroke: '#C9D1DC', 'stroke-width': 3 }, w); w._x = x; return w; });
  const torso = G(bob);
  el('rect', { x: -38, y: -96, width: 76, height: 70, rx: 18, fill: C.vari, stroke: C.ink, 'stroke-width': 3 }, torso);
  el('rect', { x: -22, y: -82, width: 44, height: 26, rx: 7, fill: '#FFD9B8', stroke: C.ink, 'stroke-width': 2 }, torso);
  el('circle', { cx: -9, cy: -69, r: 4, fill: C.Y }, torso); el('circle', { cx: 3, cy: -69, r: 4, fill: C.Z }, torso); el('circle', { cx: 14, cy: -69, r: 4, fill: C.X }, torso);
  const armL = G(torso);
  el('path', { d: 'M -36 -64 Q -58 -56 -60 -38', stroke: C.ink, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, armL);
  el('circle', { cx: -60, cy: -36, r: 6, fill: C.ink }, armL);
  const armR = G(torso);
  el('path', { d: 'M 36 -64 Q 58 -70 66 -88', stroke: C.ink, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, armR);
  el('line', { x1: 66, y1: -88, x2: 92, y2: -122, stroke: C.Z, 'stroke-width': 5, 'stroke-linecap': 'round' }, armR);
  el('circle', { cx: 66, cy: -88, r: 6, fill: C.ink }, armR);
  el('rect', { x: -6, y: -108, width: 12, height: 14, fill: '#9AA3B0' }, torso);
  const head = G(bob);
  el('line', { x1: 0, y1: -172, x2: 0, y2: -192, stroke: C.ink, 'stroke-width': 3 }, head);
  const halo = el('circle', { cx: 0, cy: -197, r: 17, fill: C.Z, opacity: .38 }, head);
  const bulb = el('circle', { cx: 0, cy: -197, r: 7.5, fill: '#B9C2CF', stroke: C.ink, 'stroke-width': 2 }, head);
  el('rect', { x: -50, y: -174, width: 100, height: 72, rx: 22, fill: '#F3F6FA', stroke: C.ink, 'stroke-width': 3 }, head);
  el('rect', { x: -40, y: -164, width: 80, height: 52, rx: 14, fill: C.ink }, head);
  const face = G(head), E = C.eye;
  const sty = { stroke: E, 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' };
  const eyes = {
    n: G(face), h: G(face), o: G(face), s: G(face), w: G(face), star: G(face), t: G(face)
  };
  [-15, 15].forEach(x => el('rect', { x: x - 6, y: -150, width: 12, height: 19, rx: 5, fill: E }, eyes.n));
  el('path', Object.assign({ d: 'M -24 -136 Q -15 -148 -6 -136 M 6 -136 Q 15 -148 24 -136' }, sty), eyes.h);
  [-15, 15].forEach(x => el('circle', Object.assign({ cx: x, cy: -140, r: 9 }, sty), eyes.o));
  el('rect', { x: -21, y: -150, width: 12, height: 19, rx: 5, fill: E }, eyes.s); el('path', Object.assign({ d: 'M 8 -140 L 24 -142' }, sty), eyes.s);
  el('path', Object.assign({ d: 'M -24 -146 L -8 -140 M 8 -140 L 24 -146' }, sty), eyes.w); [-15, 15].forEach(x => el('circle', { cx: x, cy: -134, r: 4, fill: E }, eyes.w));
  [-15, 15].forEach(x => el('path', { d: `M${x} -152 L${x + 3.5} -143 L${x + 12} -142 L${x + 5} -136 L${x + 7.5} -127 L${x} -132 L${x - 7.5} -127 L${x - 5} -136 L${x - 12} -142 L${x - 3.5} -143 Z`, fill: C.Z }, eyes.star));
  [-11, 19].forEach(x => el('rect', { x: x - 5, y: -154, width: 10, height: 15, rx: 4, fill: E }, eyes.t));
  [-12, 0, 12].forEach(x => el('circle', { cx: x + 6, cy: -122, r: 2.6, fill: E }, eyes.t));
  const mouths = {
    smile: el('path', Object.assign({ d: 'M -10 -124 Q 0 -116 10 -124' }, sty), face),
    flat: el('path', Object.assign({ d: 'M -8 -121 L 8 -121' }, sty), face),
    o: el('circle', Object.assign({ cx: 0, cy: -121, r: 4.5 }, sty), face),
    wavy: el('path', Object.assign({ d: 'M -12 -121 Q -6 -126 0 -121 Q 6 -116 12 -121' }, sty), face),
    big: el('path', { d: 'M -12 -126 Q 0 -110 12 -126 Z', fill: E }, face)
  };
  VR = { A, shadow, flip, bob, wheels, torso, armL, armR, head, halo, bulb, eyes, mouths, mood: null };
}
const VMOODS = {
  neutral: { e: 'n', m: 'smile' }, happy: { e: 'h', m: 'smile' }, think: { e: 't', m: null, bulb: C.W, tilt: -7 },
  surprised: { e: 'o', m: 'o' }, skeptical: { e: 's', m: 'flat', tilt: 5 }, worried: { e: 'w', m: 'wavy' },
  eureka: { e: 'star', m: 'big', bulb: C.Z, halo: 1, arm: -35 }, point: { e: 'n', m: 'smile', arm: 30 }
};
function vshow(e, on) { e.style.display = on ? '' : 'none'; }
function setVMood(m) {
  if (VR.mood === m) return;
  VR.mood = m;
  const d = VMOODS[m] || VMOODS.neutral;
  for (const k in VR.eyes) vshow(VR.eyes[k], k === d.e);
  for (const k in VR.mouths) vshow(VR.mouths[k], k === d.m);
  VR.bulb.setAttribute('fill', d.bulb || '#B9C2CF');
  vshow(VR.halo, !!d.halo);
  VR.head.setAttribute('transform', d.tilt ? `rotate(${d.tilt} 0 -138)` : '');
  VR.armR.setAttribute('transform', d.arm ? `rotate(${d.arm} 36 -64)` : '');
}
function moveDir(keys, t) {
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= a[0] && t < b[0] && a[1] !== b[1]) return Math.sign(b[1] - a[1]); }
  return 0;
}
function renderVari(sc, t) {
  const x = valAt(sc.ax, t), y = valAt(sc.ay, t), o = valAt(sc.ao, t);
  VR.x = x; VR.y = y; VR.o = o;
  VR.A.style.display = o <= .01 ? 'none' : '';
  VR.A.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const dx = moveDir(sc.ax, t), moving = dx !== 0 || moveDir(sc.ay, t) !== 0;
  const facing = dx !== 0 ? dx : (x > 800 ? -1 : 1);
  VR.flip.setAttribute('transform', `scale(${facing} 1)`);
  const ang = (x / 15 * 180 / Math.PI) * facing;
  VR.wheels.forEach(w => w.setAttribute('transform', `rotate(${ang.toFixed(1)} ${w._x} -16)`));
  let off = 0, tilt = 0;
  if (!REDUCED) { off = moving ? Math.sin(t * 22) * 1.2 : Math.sin(t * 2) * 2.2; tilt = moving ? 5 : 0; }
  VR.bob.setAttribute('transform', `translate(0 ${off.toFixed(2)}) rotate(${tilt} 0 -16)`);
  setVMood(stepAt(sc.am, t, 'neutral'));
  const blink = !REDUCED && (t % 3.7) < .11;
  VR.eyes.n.setAttribute('transform', blink ? 'translate(0 -140) scale(1 .12) translate(0 140)' : '');
}

/* ---------- captions and title cards ---------- */
let CAP, TITLE;
function buildCaption(parent) {
  const g = G(parent);
  const tail = el('polygon', { points: '0,0 0,0 0,0', fill: '#fff', stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const rect = el('rect', { x: 150, y: 758, width: 1060, height: 96, rx: 18, fill: '#fff', stroke: C.ink, 'stroke-width': 3 }, g);
  const patch = el('line', { x1: 0, y1: 759.5, x2: 0, y2: 759.5, stroke: '#fff', 'stroke-width': 5 }, g);
  const t1 = el('text', { x: 680, y: 816, 'text-anchor': 'middle', 'font-family': HAND, 'font-size': 34, fill: C.ink }, g);
  const t2 = el('text', { x: 680, y: 840, 'text-anchor': 'middle', 'font-family': HAND, 'font-size': 32, fill: C.ink }, g);
  const t3 = el('text', { x: 680, y: 860, 'text-anchor': 'middle', 'font-family': HAND, 'font-size': 28, fill: C.ink }, g);
  CAP = { g, tail, patch, rect, t1, t2, t3, top: 758, cur: null, on: true };
}
function capLines(str) {
  const words = str.split(' ');
  const len = a => a.join(' ').replace(/\*/g, '').length, total = len(words);
  let ls;
  if (total <= 54) ls = [str];
  else if (total <= 116) {
    let best = 1, score = 1e9;
    for (let i = 1; i < words.length; i++) { const s = Math.max(len(words.slice(0, i)), len(words.slice(i))); if (s < score) { score = s; best = i; } }
    ls = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
  } else {
    let bi = 1, bj = 2, score = 1e9;
    for (let i = 1; i < words.length - 1; i++) for (let j = i + 1; j < words.length; j++) {
      const s = Math.max(len(words.slice(0, i)), len(words.slice(i, j)), len(words.slice(j)));
      if (s < score) { score = s; bi = i; bj = j; }
    }
    ls = [words.slice(0, bi).join(' '), words.slice(bi, bj).join(' '), words.slice(bj).join(' ')];
  }
  for (let i = 0; i < ls.length - 1; i++) if ((ls[i].match(/\*/g) || []).length % 2) { ls[i] += '*'; ls[i + 1] = '*' + ls[i + 1]; }
  return ls;
}
function renderCaption(sc, t) {
  let cur = null;
  for (const s of sc.says) if (t >= s.at && t < s.at + s.dur) cur = s;
  if (!cur || !CAP.on) { CAP.g.style.display = 'none'; CAP.cur = null; return; }
  CAP.g.style.display = '';
  if (CAP.cur !== cur) {
    CAP.cur = cur;
    const ls = capLines(cur.text), n = ls.length;
    const mx = Math.max(...ls.map(l => l.replace(/\*/g, '').length));
    const fs = n === 1 ? 34 : Math.min(n === 2 ? 32 : 29, Math.floor(1980 / mx));
    const lh = fs * 1.2, h = n * lh + 30, top = 854 - h;
    CAP.top = top;
    CAP.rect.setAttribute('y', top); CAP.rect.setAttribute('height', h);
    [CAP.t1, CAP.t2, CAP.t3].forEach((t, i) => { t.setAttribute('font-size', fs); t.setAttribute('y', (top + 15 + fs * .9 + i * lh).toFixed(1)); setRich(t, ls[i] || ''); });
  }
  const local = t - cur.at;
  CAP.g.setAttribute('opacity', clamp(Math.min(local / .15, (cur.dur - local) / .2), 0, 1).toFixed(3));
  const showTail = VR.o > .5;
  vshow(CAP.tail, showTail); vshow(CAP.patch, showTail);
  if (showTail) {
    const tx = clamp(VR.x - 60, 190, 1170), tip = clamp(VR.x - 30, tx - 60, tx + 70);
    const ty = CAP.top;
    CAP.tail.setAttribute('points', `${tx - 15},${ty + 2} ${tx + 15},${ty + 2} ${tip},${Math.min(ty - 24, 732)}`);
    CAP.patch.setAttribute('x1', tx - 12); CAP.patch.setAttribute('x2', tx + 12); CAP.patch.setAttribute('y1', ty + 1.5); CAP.patch.setAttribute('y2', ty + 1.5);
  }
}
function buildTitle(parent) {
  const g = pv(G(parent), 800, 380);
  const c = card(g, 800, 380, 1160, 250, { rot: -1 });
  const k = T(c.inner, 800, 338, '', { size: 34, fill: C.Y });
  const t = T(c.inner, 800, 418, '', { font: HEAD, size: 62, weight: 700 });
  const s = T(c.inner, 800, 466, '', { size: 28, fill: C.grey });
  TITLE = { g, k, t, s, cur: null };
}
function renderTitle(sc, t) {
  if (!sc.chapter || t > 2.5) { TITLE.g.style.display = 'none'; return; }
  TITLE.g.style.display = '';
  const s = st(TITLE.g);
  s.o = Math.min(1, t / .22, (2.5 - t) / .4);
  s.y = t < .3 ? (1 - EASE.o(t / .3)) * -40 : (t > 2.1 ? (t - 2.1) * -60 : 0);
  applyT(TITLE.g);
  const n = Math.round(clamp((t - .15) / .9, 0, 1) * sc.title.length);
  if (TITLE.cur !== sc || TITLE.n !== n) {
    TITLE.cur = sc; TITLE.n = n;
    TITLE.k.textContent = sc.kicker || '';
    TITLE.t.textContent = sc.title.slice(0, n);
    TITLE.s.textContent = sc.sub || '';
  }
}

/* ---------- timeline ---------- */
let TOTAL = 0, CUES = [], SAYS = [], PAUSES = [], SECTIONS = [], curScene = null;
function buildAll() {
  let t = 0;
  for (const sc of scenes) {
    sc.start = t;
    const S = makeBuilder(sc);
    sc.build(S);
    if (!sc.dur) sc.dur = S.t + 1.4;
    if (sc.chapter) { S.sfx(.12, 'type'); S.sfx(.45, 'motif'); }
    if (!sc.noWhoosh) S.sfx(sc.dur - .55, 'whoosh');
    finalizeScene(sc);
    for (const c of sc.cues) CUES.push({ t: sc.start + c.at, name: c.name, arg: c.arg });
    for (const s of sc.says) {
      const idx = typeof VIDX !== 'undefined' ? VIDX.get(s.text) : undefined;
      SAYS.push({ t: sc.start + s.at, text: s.text, idx });
      if (idx != null) CUES.push({ t: sc.start + s.at, name: 'voice', arg: idx });
    }
    for (const p of sc.pauses) PAUSES.push(sc.start + p);
    t += sc.dur;
  }
  TOTAL = t;
  CUES.sort((a, b) => a.t - b.t); SAYS.sort((a, b) => a.t - b.t); PAUSES.sort((a, b) => a - b);
  let cur = null;
  for (const sc of scenes) {
    const key = sc.music || null;
    if (cur && cur.key === key) { cur.e = sc.start + sc.dur; continue; }
    cur = key ? { s: sc.start + .6, e: sc.start + sc.dur, key, bpm: { calm: 88, bright: 98, fin: 82 }[key] } : null;
    if (cur) SECTIONS.push(cur);
  }
}
function sceneAt(T) { for (let i = scenes.length - 1; i >= 0; i--) if (T >= scenes[i].start) return scenes[i]; return scenes[0]; }
function render(Tg) {
  Tg = clamp(Tg, 0, TOTAL - 0.001);
  const sc = sceneAt(Tg), t = Tg - sc.start;
  if (sc !== curScene) { if (curScene) curScene.g.style.display = 'none'; sc.g.style.display = ''; curScene = sc; }
  for (const [e, m] of sc.tracks) { const s = st(e); for (const p in m) s[p] = valAt(m[p], t); applyT(e); }
  for (const f of sc.fns) f.f(clamp((t - f.at) / f.d, 0, 1), t);
  let so = 1;
  if (!sc.noFadeIn) so = Math.min(so, t / .35);
  if (!sc.noFadeOut) so = Math.min(so, (sc.dur - t) / .45);
  so = clamp(so, 0, 1);
  sc.g.setAttribute('opacity', so.toFixed(3));
  renderVari(sc, t);
  VR.A.setAttribute('opacity', (clamp(VR.o, 0, 1) * (sc.noFadeOut && sc.noFadeIn ? 1 : so)).toFixed(3));
  renderTitle(sc, t);
  renderCaption(sc, t);
  let dk = 0;
  if (Tg < 1.2) dk = 1 - clamp((Tg - .2) / .9, 0, 1);
  if (Tg > TOTAL - 1.6) dk = clamp((Tg - (TOTAL - 1.6)) / .9, 0, 1);
  darkRect.setAttribute('opacity', dk.toFixed(3));
  darkRect.style.display = dk <= .002 ? 'none' : '';
  return sc;
}
