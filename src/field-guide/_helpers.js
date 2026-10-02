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

