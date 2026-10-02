/* ============================================================
   SCENES, PART 2: Part 2 card, chapters 12 to 23, finale
   ============================================================ */
scene({ name: 'Part 2: The Toolbox', short: 'Part 2', dur: 8, build(S) { partCard(S, 2, 'The Toolbox', 'Chapters 12 to 23', true); } });

/* ---------------- Chapter 12 ---------------- */
chap(12, 'Opening the Toolbox', 20, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'shocked');
  const tools = [
    ['🔧', 'Regression', 'controls close\nthe back doors'], ['🧲', 'Matching', 'look-alikes\nthat overlap'], ['🎲', 'Simulation', 'a believable\nfake world'],
    ['🪞', 'Fixed effects', 'no back doors that\nchange over time'], ['⏱️', 'Event study', 'the pre-trend\npredicts the after'], ['⚖️', 'Diff-in-diff', 'parallel\ntrends'],
    ['🎚️', 'Instruments', 'relevance and\nexclusion'], ['📏', 'Discontinuity', 'no gaming\nthe cutoff'], ['🥅', 'Bounds', 'weaker\nassumptions']
  ];
  const pos = [[260, 200], [530, 200], [800, 200], [1070, 200], [1340, 200], [395, 390], [665, 390], [935, 390], [1205, 390]];
  tools.forEach(([em, name, back], i) => {
    const [x, y] = pos[i];
    const tag = pv(G(g), x, y);
    const frontG = pv(G(tag), x, y), backG = pv(G(tag), x, y);
    const fc = card(frontG, x, y, 240, 160, { rot: (i % 2 ? 1.5 : -1.5) });
    T(fc.inner, x, y + 2, em, { size: 56, font: 'sans-serif' });
    T(fc.inner, x, y + 56, name, { font: SERIF, size: 27, weight: 600 });
    const bc = card(backG, x, y, 240, 160, { rot: (i % 2 ? 1.5 : -1.5), fill: '#FFF7D6' });
    back.split('\n').forEach((l, j) => T(bc.inner, x, y + 8 + j * 30, l, { size: 23 }));
    const at = 3 + i * .6;
    S.k(tag, 'y', [at, 600 - y], [at + .55, 0, 'back']); S.k(tag, 'o', [at, 0], [at + .15, 1, 'lin']);
    S.sfx(at, 'clink');
    const ft = 12 + i * .12;
    S.k(frontG, 'sx', [ft, 1], [ft + .15, 0, 'i']); S.k(backG, 'sx', [0, 0], [ft + .15, 0], [ft + .3, 1, 'o']);
  });
  const box = G(g);
  el('rect', { x: 486, y: 568, width: 640, height: 140, rx: 10, fill: '#000', opacity: .25 }, box);
  el('rect', { x: 480, y: 560, width: 640, height: 140, rx: 10, fill: C.red }, box);
  el('rect', { x: 740, y: 600, width: 120, height: 26, rx: 8, fill: '#8E1C25' }, box);
  const lidIn = pv(G(box), 800, 562);
  el('rect', { x: 480, y: 536, width: 640, height: 26, rx: 8, fill: '#6E1219' }, lidIn);
  const lid = pv(G(box), 800, 562);
  el('rect', { x: 476, y: 534, width: 648, height: 30, rx: 8, fill: '#A82430' }, lid);
  S.k(lidIn, 'sy', [2.2, 1], [2.8, 3.6, 'back']); S.k(lid, 'o', [2.2, 1], [2.3, 0, 'lin']); S.sfx(2.2, 'clank');
  S.fadeIn(box, 1.9, .3);
  S.mood(3.6, 'eureka'); S.say(3.2, 'Part two: the tools that put a design to work.');
  S.sfx(12, 'paper'); S.mood(12, 'neutral');
  S.say(12.3, 'Every tool is a template plus its assumptions.'); S.sfx(15, 'ding'); S.mood(15, 'proud');
}, 'The toolbox');

/* ---------------- Chapter 13 ---------------- */
chap(13, 'Regression', 28, S => {
  const g = S.g;
  S.place(HOME_R, FLOOR, 'suspicious');
  const ch = chart(g, 740, 370, 960, 460, { xr: [0, 5], yr: [40, 100], xl: 'tutoring', yl: 'math score' });
  S.pop(ch, 2.0);
  const D = tutorData(60, 13);
  const dots = D.map((d, i) => ({ e: el('circle', { cx: ch.px(d.x), cy: ch.py(d.y), r: 0, fill: C.body, opacity: .8 }, ch.plot), delay: i / 60 * .8 }));
  S.fn(2.2, 1.6, p => dots.forEach(d => d.e.setAttribute('r', (7 * EASE.back(clamp((p - d.delay) / .2, 0, 1))).toFixed(2))));
  S.sfx(2.2, 'paper');
  const f1 = fitLine(D.map(d => d.x), D.map(d => d.y)), f2 = fitLine(D.map(d => d.x), D.map(d => d.yAdj));
  const ln = el('path', { stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, ch.plot);
  const band = el('path', { fill: C.slate, opacity: 0 }, ch.plot);
  ch.plot.insertBefore(band, ch.plot.firstChild);
  const lineAt = q => { const a = lerp(f1.a, f1.a + (f1.b - f2.b) * 2.5, q), b = lerp(f1.b, f2.b, q); return x => a + b * x; };
  const bandFn = lineAt(1);
  const up = [], dn = [];
  for (let x = .2; x <= 4.81; x += .23) { const w = 2.2 + Math.abs(x - 2.5) * 2.2; up.push([ch.px(x), ch.py(bandFn(x) + w)]); dn.unshift([ch.px(x), ch.py(bandFn(x) - w)]); }
  band.setAttribute('d', pathD(up.concat(dn)) + 'Z');
  S.k(band, 'o', [0, 0], [17, 0], [17.8, .3]); S.sfx(17, 'shimmer');
  S.fn(3.4, 1, p => {
    const f = lineAt(0), x1 = lerp(.2, 4.8, EASE.io(p));
    ln.setAttribute('d', `M${ch.px(.2)} ${ch.py(f(.2))} L${ch.px(x1)} ${ch.py(f(x1))}`);
    ln.style.display = p > 0 ? '' : 'none';
  });
  S.fn(9.5, 1.5, p => { if (p <= 0) return; const f = lineAt(EASE.io(p)); ln.setAttribute('d', `M${ch.px(.2)} ${ch.py(f(.2))} L${ch.px(4.8)} ${ch.py(f(4.8))}`); });
  S.sfx(3.4, 'string');
  const badge = card(g, 1370, 200, 250, 130, { rot: 2 });
  T(badge.inner, 1370, 196, 'estimate', { size: 24, fill: C.slate });
  const num = T(badge.inner, 1370, 248, '+15', { font: SERIF, size: 52, weight: 700, fill: C.red });
  S.pop(badge, 4.6); S.sfx(4.6, 'pin');
  S.fn(9.5, 1.5, p => { num.textContent = '+' + Math.round(lerp(15, 6, EASE.io(p))); });
  S.say(2.6, 'Raw comparison: 15 points. Our old headline.');
  const wr = note(g, 1370, 340, '🔧 + income', { size: 28, rot: -2 });
  S.pop(wr, 9); S.sfx(9.2, 'ratchet'); S.sfx(11, 'doorShut');
  S.mood(9, 'neutral'); S.say(9.2, 'Add a control, and that back door closes.');
  S.mood(17, 'curious'); S.say(17.2, 'The band shows our uncertainty.');
  const so = note(g, 1370, 480, 'Still open:\nmotivation', { size: 28, rot: 2, color: C.red });
  S.pop(so, 22); S.sfx(22, 'pin'); S.sfx(22.4, 'softBuzz');
  S.mood(22, 'worried'); S.say(22.2, "But motivation's door is still open."); S.sfx(26, 'ding');
}, 'Regression');

/* ---------------- Chapter 14 ---------------- */
chap(14, 'Matching', 28, S => {
  const g = S.g;
  S.place(800, FLOOR, 'curious');
  const hdr1 = T(g, 330, 105, 'tutored', { size: 32, fill: C.teal, weight: 700 }), hdr2 = T(g, 1150, 105, 'not tutored', { size: 32, fill: C.slate, weight: 700 });
  S.fadeIn(hdr1, 2.1); S.fadeIn(hdr2, 2.1);
  const L = [[40, 190], [65, 320], [90, 450], [120, 580]];
  const R = [[160, 160], [64, 260], [118, 360], [42, 460], [190, 560], [88, 660]];
  const match = { 0: 3, 1: 1, 2: 5, 3: 2 };
  const mk = (x, y, inc, col) => { const grp = pv(G(g), x, y); student(grp, x, y, col); T(grp, x + 42, y + 18, `income ${inc}k`, { size: 24, anchor: 'start' }); return grp; };
  L.forEach(([inc, y], i) => { const s = mk(240, y, inc, C.teal); S.pop(s, 2.2 + i * .25); S.sfx(2.2 + i * .25, 'pin'); });
  const Rg = R.map(([inc, y], j) => { const s = mk(1060, y, inc, C.slate); S.pop(s, 3.3 + j * .2); return s; });
  S.say(2.4, 'Compare like with like.');
  Object.entries(match).forEach(([i, j], k) => {
    const at = 8 + k * .75, ty = L[i][1], s = Rg[j];
    S.k(s, 'x', [at, 0], [at + .6, 520 - 1060, 'io']); S.k(s, 'y', [at, 0], [at + .6, ty - R[j][1], 'io']);
    S.sfx(at, 'magnet');
    const br = el('rect', { x: 200, y: ty - 62, width: 520, height: 126, rx: 18, fill: 'none', stroke: C.hi, 'stroke-width': 5 }, g);
    g.insertBefore(br, g.firstChild);
    S.fadeIn(br, at + .55, .3);
  });
  S.walk(8, 3, 860, FLOOR, false);
  S.mood(8, 'neutral');
  [0, 4].forEach(j => { S.fadeOut(Rg[j], 15, .5, .2); S.fadeOut(Rg[j], 19.4, .4, 0); });
  const nm = T(g, 1260, 240, 'no match', { size: 30, fill: C.red, weight: 700 }); S.fadeIn(nm, 15.2); S.fadeOut(nm, 19.4, .4);
  S.sfx(15, 'fadeTone'); S.mood(15, 'suspicious'); S.say(15.2, 'No look-alike? No comparison.');
  const sc = pv(G(g), 1180, 420);
  el('rect', { x: 1172, y: 300, width: 16, height: 220, fill: C.wood }, sc);
  el('rect', { x: 1110, y: 515, width: 140, height: 18, rx: 6, fill: C.wood }, sc);
  const beam = pv(G(sc), 1180, 300);
  el('rect', { x: 1030, y: 292, width: 300, height: 14, rx: 7, fill: C.brass }, beam);
  [[1050, 'tutored', C.teal], [1310, 'matched', C.slate]].forEach(([x, lab, col]) => {
    el('line', { x1: x, x2: x - 40, y1: 300, y2: 380, stroke: C.ink, 'stroke-width': 2 }, beam);
    el('line', { x1: x, x2: x + 40, y1: 300, y2: 380, stroke: C.ink, 'stroke-width': 2 }, beam);
    el('path', { d: `M${x - 52} 380 Q${x} 420 ${x + 52} 380 Z`, fill: col }, beam);
    T(beam, x, 446, lab, { size: 24, weight: 700 });
  });
  el('circle', { cx: 1180, cy: 300, r: 10, fill: C.ink }, sc);
  S.fadeIn(sc, 19.8, .4); S.k(beam, 'r', [20, 14], [21.6, 0, 'back']); S.sfx(20.2, 'creak');
  S.mood(20, 'proud'); S.say(20.2, 'Balanced groups make a fair comparison.'); S.sfx(22, 'ding');
}, 'Matching');

/* ---------------- Chapter 15 ---------------- */
chap(15, 'Simulation', 24, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const dc = card(g, 330, 320, 400, 330, { rot: -1.5 });
  T(dc.inner, 330, 205, 'true effect', { font: SERIF, size: 34, weight: 650 });
  el('path', { d: 'M220 380 A110 110 0 0 1 440 380', stroke: C.ink, 'stroke-width': 6, fill: 'none' }, dc.inner);
  for (let v = 0; v <= 25; v += 5) { const a = (-180 + v / 25 * 180) * Math.PI / 180; el('line', { x1: 330 + Math.cos(a) * 96, y1: 380 + Math.sin(a) * 96, x2: 330 + Math.cos(a) * 110, y2: 380 + Math.sin(a) * 110, stroke: C.ink, 'stroke-width': 3 }, dc.inner); }
  const needle = el('line', { x1: 330, y1: 380, x2: 240, y2: 380, stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round' }, dc.inner);
  el('circle', { cx: 330, cy: 380, r: 9, fill: C.ink }, dc.inner);
  const val = T(dc.inner, 330, 450, '', { font: SERIF, size: 50, weight: 700, fill: C.green });
  S.fn(2.4, 1, p => { needle.setAttribute('transform', `rotate(${(EASE.back(p) * 72).toFixed(1)} 330 380)`); val.textContent = p > .9 ? '10' : ''; });
  S.pop(dc, 2.1); S.sfx(2.4, 'dial');
  S.say(2.4, 'Build a world where you know the answer.');
  const ch = chart(g, 1050, 360, 860, 450, { xr: [0, 25], yr: [0, 1.15], xl: 'estimate from each fake dataset', yl: 'how often' });
  S.pop(ch, 6.6);
  const bw = (ch.R - ch.L) / 25;
  const mkHist = (mu, sd, style) => Array.from({ length: 25 }, (_, i) => {
    const h = Math.exp(-((i + .5 - mu) ** 2) / (2 * sd * sd));
    return { h, e: el('rect', { x: ch.L + i * bw + 3, width: bw - 6, y: ch.B, height: 0, ...style }, ch.plot) };
  });
  const A = mkHist(10, 2, { fill: C.teal, opacity: .85 }), B = mkHist(16, 2.2, { fill: 'none', stroke: C.red, 'stroke-width': 4 });
  const grow = (bars, p) => bars.forEach((b, i) => { const q = clamp(p * 1.6 - Math.abs(i - 12) / 25, 0, 1); const h = b.h * EASE.o(q); b.e.setAttribute('y', ch.py(h)); b.e.setAttribute('height', ch.B - ch.py(h)); });
  S.fn(7.2, 4.3, p => grow(A, p)); S.fn(14, 2.5, p => grow(B, p));
  const tr = el('line', { x1: ch.px(10), x2: ch.px(10), y1: ch.B, y2: ch.T - 8, stroke: C.green, 'stroke-width': 5, 'stroke-dasharray': '10 8' }, ch.plot);
  const trl = T(ch.plot, ch.px(10), ch.T - 14, 'truth', { size: 24, fill: C.green, weight: 700 });
  S.fadeIn(tr, 6.9); S.fadeIn(trl, 6.9);
  const la = T(ch.plot, ch.px(5), ch.py(.8), 'method A', { size: 26, fill: C.teal, weight: 700 }); S.fadeIn(la, 10);
  const lb = T(ch.plot, ch.px(21.3), ch.py(.8), 'method B', { size: 26, fill: C.red, weight: 700 }); S.fadeIn(lb, 15.6);
  [7, 7.6, 8.2].forEach((t, i) => { const d = pv(G(g), 220 + i * 100, 560); T(d, 220 + i * 100, 580, '🎲', { size: 54, font: 'sans-serif' }); S.pop(d, t); });
  S.sfx(7, 'dice'); S.sfx(8.2, 'dice');
  for (let i = 0; i < 8; i++) S.sfx(7.4 + i * .45, 'drop', 500 + i * 30);
  S.mood(7, 'neutral');
  S.sfx(16.5, 'buzz'); S.mood(14, 'suspicious'); S.say(14.2, 'Method B misses. It is biased.');
  S.mood(19, 'proud'); S.say(19.2, 'Test your method before you trust it.'); S.sfx(19.6, 'ding');
}, 'Simulation');

/* ---------------- Chapter 16 ---------------- */
chap(16, 'Fixed Effects', 28, S => {
  const g = S.g;
  S.place(HOME_R, FLOOR, 'suspicious');
  const ch = chart(g, 740, 370, 960, 460, { xr: [0, 10], yr: [30, 100], xl: 'tutoring hours', yl: 'math score' });
  S.pop(ch, 2);
  const groups = [{ cx: 2, base: 85, col: C.teal, n: 'Asha' }, { cx: 5, base: 65, col: C.slate, n: 'Ben' }, { cx: 8, base: 45, col: C.purple, n: 'Chen' }];
  const r = rng(16), pts = [];
  groups.forEach((gr, k) => {
    [-1.2, -.4, .4, 1.2].forEach((dx, j) => {
      const x = gr.cx + dx, y = gr.base + 2.2 * dx + gauss(r) * 1.2;
      const e = el('circle', { cx: ch.px(x), cy: ch.py(y), r: 10, fill: gr.col, stroke: '#fff', 'stroke-width': 2 }, ch.plot);
      pts.push({ e, x, y, k, tx: 5 + dx, ty: 65 + (y - gr.base) });
      const at = 2.4 + k * .8 + j * .15; S.k(e, 'o', [0, 0], [at, 0], [at + .1, 1, 'lin']); if (j === 0) S.sfx(at, 'tick');
    });
    const nm = T(ch.plot, ch.px(gr.cx), ch.py(gr.base + 9), gr.n, { size: 26, fill: gr.col, weight: 700 });
    S.fadeIn(nm, 2.6 + k * .8); S.fadeOut(nm, 9.8, .3);
  });
  const fa = fitLine(pts.map(p => p.x), pts.map(p => p.y));
  const mis = el('path', { d: `M${ch.px(.5)} ${ch.py(fa.a + fa.b * .5)} L${ch.px(9.5)} ${ch.py(fa.a + fa.b * 9.5)}`, stroke: C.slate, 'stroke-width': 5, 'stroke-dasharray': '12 9', fill: 'none' }, ch.plot);
  S.fadeIn(mis, 5.2, .5); S.sfx(5.4, 'buzz'); S.fadeOut(mis, 9.6, .4);
  const ml = T(ch.plot, ch.px(7.6), ch.py(88), 'more tutoring, lower scores?', { size: 25, fill: C.slate });
  S.fadeIn(ml, 5.4); S.fadeOut(ml, 9.6, .4);
  S.say(2.4, 'Different students, different starting points.');
  S.fn(10, 2.2, p => pts.forEach(pt => {
    const q = EASE.io(clamp((p - pt.k * .22) / .56, 0, 1));
    pt.e.setAttribute('cx', ch.px(lerp(pt.x, pt.tx, q)).toFixed(1)); pt.e.setAttribute('cy', ch.py(lerp(pt.y, pt.ty, q)).toFixed(1));
  }));
  [10, 10.5, 11].forEach(t => S.sfx(t, 'swoosh'));
  const wl = el('path', { d: `M${ch.px(3.4)} ${ch.py(65 - 2.2 * 1.6)} L${ch.px(6.6)} ${ch.py(65 + 2.2 * 1.6)}`, stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, ch.plot);
  S.k(wl, 'd', [16, 0], [17, 1]); S.sfx(16, 'string');
  const wlab = T(ch.plot, ch.px(5), ch.py(52), 'within each student', { size: 26, fill: C.red, weight: 700 }); S.fadeIn(wlab, 16.8);
  S.mood(16, 'eureka'); S.say(16.2, 'Compare each student to *themselves*.');
  const mg = pv(G(g), 1390, 200);
  const lh = pv(G(mg), 1390, 200), rh = pv(G(mg), 1390, 200);
  el('path', { d: 'M1390 162 A38 38 0 0 0 1390 238 Z', fill: C.card, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, lh);
  el('path', { d: 'M1390 162 A38 38 0 0 1 1390 238 Z', fill: C.card, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, rh);
  T(lh, 1390, 214, 'M', { font: SERIF, size: 38, weight: 600 });
  T(mg, 1390, 278, 'motivation', { size: 24 });
  S.pop(mg, 21.6);
  S.k(lh, 'x', [22.4, 0], [23.2, -40]); S.k(lh, 'r', [22.4, 0], [23.2, -25]); S.k(rh, 'x', [22.4, 0], [23.2, 40]); S.k(rh, 'r', [22.4, 0], [23.2, 25]);
  S.fadeOut(mg, 23.4, .5); S.sfx(22.4, 'crack');
  S.mood(22, 'proud'); S.say(22.2, 'Anything fixed about them, even motivation, drops out.'); S.sfx(24, 'ding');
}, 'Fixed effects');

/* ---------------- Chapter 17 ---------------- */
chap(17, 'Event Studies', 26, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const ch = chart(g, 820, 360, 1100, 470, { xr: [-6.6, 6.6], yr: [55, 92], xl: 'months before and after tutoring starts', yl: 'average score' });
  S.pop(ch, 2);
  const r = rng(17), pre = [], post = [];
  for (let k = -6; k <= 6; k++) {
    const y = 68 + 1.0 * k + (k >= 0 ? 6 + .5 * k : 0) + gauss(r) * .7;
    const e = el('circle', { cx: ch.px(k), cy: ch.py(y), r: 10, fill: C.teal, stroke: '#fff', 'stroke-width': 2 }, ch.plot);
    const at = k < 0 ? 2.4 + (k + 6) * .45 : 8.6 + k * .33;
    S.k(e, 'o', [0, 0], [at, 0], [at + .1, 1, 'lin']); S.sfx(at, 'tick');
    (k < 0 ? pre : post).push([k, y]);
  }
  S.say(2.4, 'One school, before and after.');
  const lx = ch.px(-.5);
  const launch = el('line', { x1: lx, x2: lx, y1: ch.B, y2: ch.T - 10, stroke: C.red, 'stroke-width': 5, 'stroke-dasharray': '12 8' }, ch.plot);
  const ll = T(ch.plot, lx + 10, ch.T + 14, 'tutoring starts', { size: 24, fill: C.red, anchor: 'start', weight: 700 });
  S.k(launch, 'o', [0, 0], [8, 0], [8.05, 1, 'lin']); S.k(launch, 'sy', [8, 0], [8.4, 1, 'back']); pv(launch, lx, ch.B); S.fadeIn(ll, 8.2);
  S.sfx(8, 'gong');
  const fp = fitLine(pre.map(p => p[0]), pre.map(p => p[1]));
  const projG = G(ch.plot);
  el('path', { d: `M${ch.px(-6)} ${ch.py(fp.a - 6 * fp.b)} L${ch.px(6)} ${ch.py(fp.a + 6 * fp.b)}`, stroke: C.slate, 'stroke-width': 5, 'stroke-dasharray': '12 9', fill: 'none' }, projG);
  const pr = clipRect(projG, ch.L, ch.T - 20, 0, ch.B - ch.T + 40);
  S.fn(11, 1.5, p => pr.setAttribute('width', ((ch.R - ch.L) * EASE.io(p)).toFixed(1)));
  S.sfx(11, 'string');
  S.mood(11, 'neutral'); S.say(11.2, 'Where would scores have gone anyway?');
  const fq = fitLine(post.map(p => p[0]), post.map(p => p[1]));
  const gp = [[0, fq.a], [6, fq.a + 6 * fq.b], [6, fp.a + 6 * fp.b], [0, fp.a]].map(([x, y]) => [ch.px(x), ch.py(y)]);
  const gap = el('path', { d: pathD(gp) + 'Z', fill: C.hi, opacity: 0 }, ch.plot);
  ch.plot.insertBefore(gap, ch.plot.firstChild);
  S.k(gap, 'o', [0, 0], [16, 0], [16.6, .6]); S.sfx(16.2, 'ding');
  const gl = T(ch.plot, ch.px(3.2), ch.py(fp.a + 3.2 * fp.b + 4.5), 'the effect', { size: 28, weight: 700 }); S.fadeIn(gl, 16.6);
  S.mood(16, 'eureka'); S.say(16.2, 'That gap is the effect.');
  const ck = check(g, ch.px(-3.5) - 120, ch.py(84), 20);
  const cl = T(g, ch.px(-3.5) - 90, ch.py(84) + 9, 'no effect before it starts', { size: 24, anchor: 'start', weight: 700, fill: C.okGreen });
  S.pop(ck, 21); S.fadeIn(cl, 21.1); S.sfx(21, 'pin');
  S.mood(21, 'proud'); S.say(21.2, 'Before treatment, no effect. A good sign.');
}, 'Event studies');

/* ---------------- Chapter 18 ---------------- */
chap(18, 'Difference-in-Differences', 30, S => {
  const g = S.g;
  S.place(HOME_R, FLOOR, 'curious');
  const ch = chart(g, 800, 425, 1100, 420, { xr: [.6, 8.4], yr: [45, 105], xl: 'term', yl: 'average score' });
  S.pop(ch, 2);
  const hill = t => 52 + 3 * t, riv = t => 60 + 3 * t + (t >= 5 ? 10 : 0);
  const poly = (f, a, b) => { const p = []; for (let t = a; t <= b; t++) p.push([ch.px(t), ch.py(f(t))]); return p; };
  const mkL = (pts, col, dash) => el('path', { d: pathD(pts), stroke: col, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: dash ? null : 1, 'stroke-dasharray': dash || null }, ch.plot);
  const rPre = mkL(poly(riv, 1, 4), C.teal), hPre = mkL(poly(hill, 1, 4), C.slate);
  S.k(rPre, 'd', [2.4, 0], [6.4, 1, 'lin']); S.k(hPre, 'd', [2.4, 0], [6.4, 1, 'lin']);
  const rl = T(ch.plot, ch.px(1), ch.py(riv(1)) - 18, 'Riverbend', { size: 26, fill: C.teal, weight: 700, anchor: 'start' });
  const hl = T(ch.plot, ch.px(1), ch.py(hill(1)) + 36, 'Hillside', { size: 26, fill: C.slate, weight: 700, anchor: 'start' });
  S.fadeIn(rl, 2.6); S.fadeIn(hl, 2.6);
  S.say(2.4, 'Two schools, moving together.');
  const tx = ch.px(4.5);
  const tl = el('line', { x1: tx, x2: tx, y1: ch.B, y2: ch.T, stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, ch.plot);
  const tt = T(ch.plot, tx + 10, ch.B - 14, 'Riverbend starts tutoring', { size: 22, fill: C.red, anchor: 'start', weight: 700 });
  S.fadeIn(tl, 8.8); S.fadeIn(tt, 8.8); S.sfx(9, 'gong');
  const rPost = mkL([[ch.px(4), ch.py(riv(4))], ...poly(riv, 5, 8)], C.teal), hPost = mkL(poly(hill, 4, 8), C.slate);
  S.k(rPost, 'd', [9, 0], [10.6, 1, 'lin']); S.k(hPost, 'd', [9, 0], [10.6, 1, 'lin']);
  const ghostG = G(ch.plot);
  el('path', { d: pathD([[ch.px(4), ch.py(riv(4))], [ch.px(8), ch.py(riv(4) + 12)]]), stroke: C.teal, 'stroke-width': 5, 'stroke-dasharray': '12 9', fill: 'none', opacity: .75 }, ghostG);
  const gc = clipRect(ghostG, ch.px(4) - 10, ch.T - 30, 0, ch.B - ch.T + 60);
  S.fn(12, 1.2, p => gc.setAttribute('width', ((ch.px(8) - ch.px(4) + 20) * EASE.io(p)).toFixed(1)));
  S.sfx(12, 'string');
  S.mood(12, 'neutral'); S.say(12.2, "Hillside shows us Riverbend's “anyway.”");
  const eq = card(g, 800, 125, 1120, 104, { rot: -.6 });
  const eqg = G(eq.inner);
  T(eqg, 800, 145, '(Riverbend after − before)  −  (Hillside after − before)', { size: 34 });
  const ec = clipRect(eqg, 240, 70, 0, 120);
  S.pop(eq, 17.8); S.fn(18, 2, p => ec.setAttribute('width', (1120 * p).toFixed(1))); S.sfx(18, 'chalk'); S.sfx(19, 'chalk');
  const bx = ch.px(8) + 18, y1 = ch.py(riv(8)), y2 = ch.py(riv(4) + 12);
  const brk = pv(G(g), bx, (y1 + y2) / 2);
  el('path', { d: `M${bx - 8} ${y1} L${bx + 8} ${y1} M${bx} ${y1} L${bx} ${y2} M${bx - 8} ${y2} L${bx + 8} ${y2}`, stroke: C.red, 'stroke-width': 5 }, brk);
  el('rect', { x: bx + 14, y: (y1 + y2) / 2 - 22, width: 92, height: 42, rx: 6, fill: C.hi }, brk);
  T(brk, bx + 60, (y1 + y2) / 2 + 9, '+10', { font: SERIF, size: 28, weight: 700 });
  S.pop(brk, 20); S.sfx(20.3, 'ding');
  S.mood(18, 'eureka'); S.say(18.2, 'Difference… in differences.');
  S.fn(25, 2.6, p => ghostG.setAttribute('transform', `translate(0 ${(Math.sin(p * Math.PI * 6) * 14 * Math.sin(p * Math.PI)).toFixed(1)})`));
  S.sfx(25, 'wobble');
  S.mood(25, 'worried'); S.say(25.2, "Only works if they'd have stayed parallel.");
}, 'Diff-in-diff');

/* ---------------- Chapter 19 ---------------- */
chap(19, 'Instrumental Variables', 30, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const nZ = node(g, 330, 440, 'Z', 'lottery', 'Z'), nT = node(g, 800, 440, 'T', 'tutoring', 'T'), nY = node(g, 1270, 440, 'Y', 'math score', 'Y');
  const nM = node(g, 1035, 640, 'M', 'motivation', 'U');
  [nZ, nT, nY, nM].forEach((n, i) => S.pop(n, 2.1 + i * .2)); S.sfx(2.1, 'pin');
  const zt = link(g, nZ, nT), ty = link(g, nT, nY), mt = link(g, nM, nT), my = link(g, nM, nY);
  S.draw(zt, 2.6, .6); S.draw(ty, 3.1, .6, false); S.draw(mt, 3.6, .5, false); S.draw(my, 3.8, .5, false);
  S.say(2.4, 'The lottery is back, now as an instrument.');
  const vb = G(g);
  T(vb, 800, 175, 'why kids got tutoring', { size: 26, weight: 700 });
  const ys = pv(G(vb), 610, 215), ps = pv(G(vb), 990, 215);
  el('rect', { x: 610, y: 192, width: 152, height: 48, fill: C.hi, stroke: C.ink, 'stroke-width': 2 }, ys); T(ys, 686, 224, 'lottery', { size: 23 });
  el('rect', { x: 762, y: 192, width: 228, height: 48, fill: C.purple, stroke: C.ink, 'stroke-width': 2 }, ps); T(ps, 876, 224, 'motivation', { size: 23, fill: '#fff' });
  S.fadeIn(vb, 7.8);
  const fun = pv(G(g), 800, 300);
  el('path', { d: 'M740 262 L860 262 L818 312 L818 338 L782 338 L782 312 Z', fill: C.slate, stroke: C.ink, 'stroke-width': 3 }, fun);
  S.pop(fun, 8.1);
  S.k(ps, 'x', [8.5, 0], [9.5, 300]); S.fadeOut(ps, 9, .5); S.sfx(8.3, 'pour');
  S.glow(zt, 10.2); S.glow(ty, 10.2); S.sfx(10.5, 'ding');
  S.mood(8, 'eureka'); S.say(8.2, 'Keep only the tutoring the lottery caused.');
  S.fadeOut(vb, 15.3, .4); S.fadeOut(fun, 15.3, .4);
  const sn = link(g, nZ, nY, { bend: -.32, color: C.slate });
  S.draw(sn, 16, 1);
  const xm = xMark(g, sn.mid.x, sn.mid.y, 26); S.stamp(xm, 17.4);
  S.fadeOut(sn.g, 21.3, .4); S.fadeOut(xm, 21.3, .4);
  S.mood(16, 'suspicious'); S.say(16.2, "The lottery can't touch scores on its own.");
  S.k(vb, 'o', [21.6, 0], [22, 1]);
  S.k(ys, 'sx', [22.2, 1], [23, .18]); pv(ys, 610, 215);
  const wk = T(g, 800, 290, 'weak instrument', { size: 30, fill: C.red, weight: 700 }); S.fadeIn(wk, 22.6);
  const est = pv(G(g), 1330, 600);
  T(est, 1330, 600, 'estimate: +?', { size: 30, weight: 700 });
  S.fadeIn(est, 22.6);
  S.fn(22.6, 5, p => est.setAttribute('transform', p > 0 && p < 1 ? `translate(${(Math.sin(p * 90) * 9).toFixed(1)} ${(Math.cos(p * 70) * 5).toFixed(1)})` : ''));
  S.sfx(22.3, 'drip'); S.sfx(23, 'drip'); S.sfx(23.4, 'wobble');
  S.mood(22, 'worried'); S.say(22.2, 'Too little push, and the estimate wobbles.');
}, 'Instruments');

/* ---------------- Chapter 20 ---------------- */
chap(20, 'Regression Discontinuity', 30, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const ch = chart(g, 760, 370, 1000, 470, { xr: [30, 90], yr: [40, 90], xl: 'entrance test score', yl: 'later math score' });
  S.pop(ch, 2);
  const cx = ch.px(60);
  const shade = el('rect', { x: ch.L, y: ch.T, width: cx - ch.L, height: ch.B - ch.T, fill: C.teal, opacity: 0 }, ch.plot);
  ch.plot.insertBefore(shade, ch.plot.firstChild);
  S.k(shade, 'o', [0, 0], [2.6, 0], [3, .14]);
  const cl = el('line', { x1: cx, x2: cx, y1: ch.B, y2: ch.T - 8, stroke: C.red, 'stroke-width': 6 }, ch.plot);
  pv(cl, cx, ch.B); S.k(cl, 'sy', [2.4, 0], [2.8, 1, 'back']); S.sfx(2.4, 'thwack');
  const ctl = T(ch.plot, cx + 10, ch.T + 20, 'cutoff 60', { size: 24, fill: C.red, anchor: 'start', weight: 700 });
  const gt = T(ch.plot, (ch.L + cx) / 2, ch.T + 20, 'gets tutoring', { size: 26, fill: C.teal, weight: 700 });
  S.fadeIn(ctl, 2.8); S.fadeIn(gt, 3);
  S.say(2.5, 'Score under 60 on the entrance test? You get tutoring.');
  const r = rng(20), pts = [];
  for (let i = 0; i < 70; i++) {
    const x = 31 + r() * 58, y = 45 + .5 * (x - 30) + (x < 60 ? 9 : 0) + gauss(r) * 3;
    const e = el('circle', { cx: ch.px(x), cy: ch.py(y), r: 0, fill: C.body, opacity: .85 }, ch.plot);
    pts.push({ x, y, e, delay: i / 70 * .8 });
  }
  S.fn(8, 3, p => pts.forEach(pt => pt.e.setAttribute('r', (7 * EASE.back(clamp((p - pt.delay) / .2, 0, 1))).toFixed(2))));
  for (let i = 0; i < 10; i++) S.sfx(8 + i * .28, 'drop', 450 + i * 40);
  S.mood(8, 'neutral');
  const lf = el('path', { d: `M${ch.px(30.5)} ${ch.py(45 + .25 + 9)} L${cx} ${ch.py(60 + 9)}`, stroke: C.teal, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, ch.plot);
  const rf = el('path', { d: `M${cx} ${ch.py(60)} L${ch.px(89.5)} ${ch.py(45 + .5 * 59.5)}`, stroke: C.slate, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, ch.plot);
  S.k(lf, 'd', [12, 0], [12.6, 1]); S.k(rf, 'd', [12.6, 0], [13.2, 1]); S.sfx(12, 'string');
  const jb = pv(G(ch.plot), cx, ch.py(64.5));
  el('path', { d: `M${cx - 30} ${ch.py(69)} L${cx - 22} ${ch.py(69)} L${cx - 22} ${ch.py(60)} L${cx - 30} ${ch.py(60)}`, stroke: C.red, 'stroke-width': 4, fill: 'none' }, jb);
  T(jb, cx - 34, ch.py(64.5) + 9, 'jump', { size: 26, fill: C.red, weight: 700, anchor: 'end' });
  S.pop(jb, 13.5); S.sfx(13.5, 'pop');
  const band = el('rect', { x: ch.px(56), y: ch.T, width: ch.px(64) - ch.px(56), height: ch.B - ch.T, fill: C.hi, opacity: 0 }, ch.plot);
  ch.plot.insertBefore(band, shade.nextSibling);
  S.k(band, 'o', [0, 0], [15, 0], [15.4, .45]);
  S.fn(15, .6, p => pts.forEach(pt => { if (Math.abs(pt.x - 60) > 4) pt.e.setAttribute('opacity', (.85 - .6 * p).toFixed(2)); }));
  const mag = pv(G(g), cx, ch.py(64.5));
  el('circle', { cx, cy: ch.py(64.5), r: 105, fill: 'none', stroke: C.brass, 'stroke-width': 9 }, mag);
  el('line', { x1: cx + 74, y1: ch.py(64.5) + 74, x2: cx + 130, y2: ch.py(64.5) + 130, stroke: '#5B3A21', 'stroke-width': 14, 'stroke-linecap': 'round' }, mag);
  S.pop(mag, 15.1, .5); S.sfx(15, 'whoosh'); S.sfx(16.5, 'ding');
  S.mood(15, 'eureka'); S.say(15.2, 'Students at 59 and 61 are basically the same.');
  const mini = card(g, 1400, 300, 230, 240, { rot: 2 });
  T(mini.inner, 1400, 218, 'how many got', { size: 21 }); T(mini.inner, 1400, 242, 'each test score', { size: 21 });
  const hs = [3, 4, 5, 5, 9, 2, 4, 4, 3];
  const spikeBars = hs.map((h, i) => el('rect', { x: 1302 + i * 22, y: 390 - h * 12, width: 18, height: h * 12, fill: i === 4 ? C.red : C.slate }, mini.inner));
  el('line', { x1: 1405, x2: 1405, y1: 270, y2: 392, stroke: C.red, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, mini.inner);
  S.pop(mini, 21.8);
  S.fn(22.2, 2.4, p => spikeBars[4].setAttribute('opacity', p > 0 && p < 1 ? (Math.sin(p * 30) > 0 ? 1 : .25) : 1));
  S.sfx(22.3, 'alarm');
  S.mood(22, 'suspicious'); S.say(22.2, 'Unless people are gaming the cutoff.');
}, 'Discontinuity');

/* ---------------- Chapter 21 ---------------- */
chap(21, 'Partial Identification', 24, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const c = card(g, 800, 330, 1120, 260, { rot: -.5 });
  const px = v => 330 + (v + 5) / 25 * 940, ay = 380;
  el('line', { x1: 300, x2: 1300, y1: ay, y2: ay, stroke: C.ink, 'stroke-width': 4 }, c.inner);
  for (let v = -5; v <= 20; v += 5) { el('line', { x1: px(v), x2: px(v), y1: ay - 10, y2: ay + 10, stroke: C.ink, 'stroke-width': 3 }, c.inner); T(c.inner, px(v), ay + 42, (v > 0 ? '+' : '') + v, { size: 24 }); }
  T(c.inner, 800, 240, "tutoring's effect on scores", { size: 26, fill: C.slate });
  S.pop(c, 2);
  const dot = pv(G(g), px(6), ay - 30);
  el('circle', { cx: px(6), cy: ay - 30, r: 15, fill: C.red }, dot);
  S.pop(dot, 2.3); S.sfx(2.3, 'pop');
  S.k(dot, 's', [2.9, null], [3.1, 0]); S.sfx(2.9, 'burst');
  const bar = el('rect', { y: ay - 46, height: 32, rx: 6, fill: C.red, opacity: .8 }, g);
  const capL = el('line', { y1: ay - 56, y2: ay - 4, stroke: C.ink, 'stroke-width': 5 }, g), capR = el('line', { y1: ay - 56, y2: ay - 4, stroke: C.ink, 'stroke-width': 5 }, g);
  const lo = T(g, 0, ay - 66, '', { size: 26, weight: 700 }), hi = T(g, 0, ay - 66, '', { size: 26, weight: 700 });
  const lk = [[3, 6, 6], [3.6, -3, 18], [9.6, -3, 18], [10.6, 0, 14], [13, 0, 14], [14, 2, 9]];
  S.fn(0, 24, (p, t) => {
    let a = lk[0][1], b = lk[0][2];
    for (let i = 1; i < lk.length; i++) { const [t1, a1, b1] = lk[i], [t0, a0, b0] = lk[i - 1]; if (t >= t0) { const q = EASE.io(clamp((t - t0) / (t1 - t0), 0, 1)); a = lerp(a0, a1, q); b = lerp(b0, b1, q); } }
    const vis = t > 2.95;
    [bar, capL, capR, lo, hi].forEach(e => e.style.display = vis ? '' : 'none');
    bar.setAttribute('x', px(a)); bar.setAttribute('width', Math.max(2, px(b) - px(a)));
    capL.setAttribute('x1', px(a)); capL.setAttribute('x2', px(a)); capR.setAttribute('x1', px(b)); capR.setAttribute('x2', px(b));
    lo.setAttribute('x', px(a)); hi.setAttribute('x', px(b));
    lo.textContent = (Math.round(a) > 0 ? '+' : '') + Math.round(a); hi.textContent = '+' + Math.round(b);
  });
  S.mood(3, 'worried'); S.say(3.2, "Without strong assumptions, one number isn't honest.");
  const a1 = note(g, 560, 560, 'Assume: tutoring never hurts', { size: 26, rot: -2 });
  const a2 = note(g, 1080, 560, 'Assume: motivated kids sign up more', { size: 26, rot: 2 });
  S.pop(a1, 9); S.sfx(9, 'pin'); S.sfx(9.7, 'creak');
  S.pop(a2, 12.6); S.sfx(12.6, 'pin'); S.sfx(13.1, 'creak');
  S.walk(8.8, 1.2, 260, FLOOR);
  S.mood(9, 'neutral'); S.say(9.2, 'Each assumption buys a tighter range.');
  const fin = note(g, 800, 118, 'somewhere between +2 and +9', { size: 30, rot: -1, color: C.red });
  S.pop(fin, 17); S.sfx(17.2, 'ding');
  S.mood(17, 'proud'); S.say(17.2, 'Sometimes the honest answer is a range.');
}, 'Bounds');

/* ---------------- Chapter 22 ---------------- */
chap(22, 'A Gallery of Rogues: Other Methods', 26, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const poster = (x, name, sub, rot) => {
    const p = pv(G(g), x, 340);
    const inner = G(p, { transform: `rotate(${rot} ${x} 340)` });
    el('rect', { x: x - 164, y: 118, width: 340, height: 460, fill: '#000', opacity: .25 }, inner);
    el('rect', { x: x - 170, y: 110, width: 340, height: 460, fill: '#E9DDBF' }, inner);
    T(inner, x, 168, 'Wanted', { font: SERIF, size: 46, weight: 700, fill: '#5A3B1E' });
    el('rect', { x: x - 135, y: 190, width: 270, height: 210, fill: C.card, stroke: '#5A3B1E', 'stroke-width': 3 }, inner);
    T(inner, x, 448, name, { font: SERIF, size: name.length > 18 ? 23 : 27, weight: 700, fill: '#2B2116' });
    T(inner, x, 486, sub, { size: 20, fill: '#5A4630' });
    pushpin(inner, x, 124);
    p.inner = inner; return p;
  };
  const P1 = poster(380, 'Synthetic control', 'a blend of other towns', -2);
  const P2 = poster(800, 'Heterogeneous effects', 'who benefits most?', 1.5);
  const P3 = poster(1220, 'Structural estimation', 'theory as the machine', -1);
  [P1, P2, P3].forEach((p, i) => { S.pop(p, 2.2 + i * .4); S.sfx(2.2 + i * .4, 'paper'); });
  S.walk(2.2, 2.8, 1450);
  S.say(2.4, 'A few more characters worth knowing.');
  // poster 1: blend of other towns
  const xs = [260, 290, 320, 350, 380, 410, 440, 470, 500];
  const blend = xs.map((x, i) => 330 - i * 8);
  const others = [0, 1, 2, 3].map(k => xs.map((x, i) => blend[i] + [-40, 32, -18, 48][k] + Math.sin(i * 1.3 + k) * 10));
  const ol = others.map(ys => el('path', { stroke: '#8A93A3', 'stroke-width': 3, fill: 'none' }, P1.inner));
  S.fn(6, 1.8, p => { const q = EASE.io(p); ol.forEach((e, k) => e.setAttribute('d', pathD(xs.map((x, i) => [x, lerp(others[k][i], blend[i], q)])))); });
  const riv = el('path', { d: pathD(xs.map((x, i) => [x, i < 5 ? blend[i] : blend[i] - (i - 4) * 14])), stroke: C.teal, 'stroke-width': 5, fill: 'none' }, P1.inner);
  const rc = clipRect(riv, 255, 190, 0, 210);
  S.fn(8, 1.4, p => rc.setAttribute('width', (250 * p).toFixed(1)));
  S.sfx(6, 'blend'); S.mood(6, 'neutral');
  S.say(6.2, 'Synthetic control: build a stand-in from a blend of others.');
  // poster 2: tree of effects
  const tn = [[800, 220], [740, 290], [860, 290], [710, 360], [770, 360], [830, 360], [890, 360]];
  [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([a, b], i) => { const l = el('line', { x1: tn[a][0], y1: tn[a][1], x2: tn[b][0], y2: tn[b][1], stroke: C.ink, 'stroke-width': 3 }, P2.inner); S.fadeIn(l, 12 + (b > 2 ? .9 : .3)); });
  tn.forEach(([x, y], i) => { const n = pv(G(P2.inner), x, y); el('circle', { cx: x, cy: y, r: 12, fill: i > 2 ? C.teal : C.slate }, n); if (i > 2) T(n, x, y + 36, ['+2', '+5', '+11', '+18'][i - 3], { size: 20, weight: 700 }); S.pop(n, 12 + (i === 0 ? 0 : i < 3 ? .5 : 1.2 + (i - 3) * .25)); if (i > 2) S.sfx(13.2 + (i - 3) * .25, 'pop'); });
  S.say(12.2, 'Heterogeneous effects: let the data say who benefits most.');
  // poster 3: gears
  const gear = (x, y, r, teeth) => { const gg = G(P3.inner); el('circle', { cx: x, cy: y, r, fill: 'none', stroke: C.slate, 'stroke-width': 14, 'stroke-dasharray': `${(2 * Math.PI * r / teeth / 2).toFixed(2)} ${(2 * Math.PI * r / teeth / 2).toFixed(2)}` }, gg); el('circle', { cx: x, cy: y, r: r - 7, fill: C.brass }, gg); el('circle', { cx: x, cy: y, r: 8, fill: C.ink }, gg); return gg; };
  const g1 = gear(1180, 280, 52, 12), g2 = gear(1266, 340, 34, 8);
  S.fn(18, 6, p => { g1.setAttribute('transform', `rotate(${(p * 360).toFixed(1)} 1180 280)`); g2.setAttribute('transform', `rotate(${(-p * 550).toFixed(1)} 1266 340)`); });
  S.sfx(18, 'gear');
  S.mood(18, 'proud'); S.say(18.2, 'Structural estimation: model the whole machine with theory.');
}, 'Other methods');

/* ---------------- Chapter 23 ---------------- */
chap(23, 'Under the Rug', 24, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const rug = G(g);
  el('rect', { x: 336, y: 553, width: 860, height: 110, rx: 6, fill: '#000', opacity: .2 }, rug);
  el('rect', { x: 330, y: 545, width: 860, height: 110, rx: 6, fill: C.red }, rug);
  for (let i = 0; i < 6; i++) el('rect', { x: 330, y: 556 + i * 16, width: 860, height: 6, fill: i % 2 ? C.teal : C.hi, opacity: .7 }, rug);
  const flap = G(g);
  el('path', { d: 'M1190 545 L1190 655 L1040 655 Z', fill: C.cork }, flap);
  el('path', { d: 'M1190 545 L1040 655 L1110 520 Z', fill: '#7E1B23' }, flap);
  S.k(flap, 'o', [0, 0], [2.2, 0], [2.35, 1, 'lin']); S.sfx(2.3, 'rug');
  const labels = ['Which model?', 'Measuring the right thing?', 'Missing data', 'Spillovers', 'Fat tails', 'What is the treatment, really?'];
  const targets = [[330, 170], [760, 150], [1210, 170], [400, 380], [800, 360], [1180, 380]];
  const jar = pv(G(g), 1390, 560);
  const bunnies = labels.map((l, i) => {
    const [tx, ty] = targets[i];
    const b = pv(G(g), 1120, 610);
    const body = G(b);
    el('circle', { cx: 1120, cy: 610, r: 30, fill: '#9AA1AB', stroke: '#9AA1AB', 'stroke-width': 9, 'stroke-dasharray': '2 4', 'stroke-linecap': 'round' }, body);
    el('circle', { cx: 1110, cy: 604, r: 5, fill: '#fff' }, body); el('circle', { cx: 1130, cy: 604, r: 5, fill: '#fff' }, body);
    el('circle', { cx: 1111, cy: 605, r: 2.5, fill: C.ink }, body); el('circle', { cx: 1131, cy: 605, r: 2.5, fill: C.ink }, body);
    const lab = G(b);
    const w = l.length * 12 + 26;
    el('rect', { x: 1120 - w / 2, y: 650, width: w, height: 36, rx: 5, fill: C.card }, lab);
    T(lab, 1120, 676, l, { size: 23 });
    const at = 2.8 + i * .5;
    S.k(b, 'o', [0, 0], [at, 0], [at + .1, 1, 'lin']);
    S.k(b, 'x', [at, 0], [at + .7, tx - 1120, 'o']); S.k(b, 'y', [at, 0], [at + .7, ty - 610, 'o']);
    S.k(b, 's', [at, .3], [at + .7, 1, 'back']);
    S.sfx(at, 'squeak');
    const jt = 12 + i * .6, jx = 1390 + ((i % 3) - 1) * 26, jy = 600 - Math.floor(i / 3) * 30;
    S.k(b, 'x', [jt, null], [jt + .6, jx - 1120, 'io']); S.k(b, 'y', [jt, null], [jt + .6, jy - 610, 'io']); S.k(b, 's', [jt, null], [jt + .6, .45]);
    S.fadeOut(lab, jt, .3);
    S.sfx(jt + .6, 'clink');
    return b;
  });
  el('path', { d: 'M1320 500 L1320 660 Q1320 680 1340 680 L1440 680 Q1460 680 1460 660 L1460 500 Z', fill: '#DDEBFA', 'fill-opacity': .35, stroke: '#8EA4BF', 'stroke-width': 5 }, jar);
  el('rect', { x: 1310, y: 484, width: 160, height: 20, rx: 6, fill: C.slate }, jar);
  el('rect', { x: 1325, y: 540, width: 130, height: 36, rx: 4, fill: C.card }, jar);
  T(jar, 1390, 566, 'Limitations', { size: 22, weight: 700 });
  g.appendChild(jar);
  S.pop(jar, 11.4); S.sfx(11.4, 'clink');
  S.mood(2.6, 'shocked'); S.say(3, 'Every study sweeps something under here.');
  S.walk(11.6, 1.6, 1180); S.mood(12, 'neutral');
  S.say(12.2, "Name it, measure what you can, and say what's left.");
  S.mood(18, 'proud'); S.say(18.2, "Good researchers say what's under the rug."); S.sfx(18.6, 'ding');
}, 'Under the rug');

/* ---------------- Finale ---------------- */
scene({
  name: 'Finale: the case board', short: 'Finale', dur: 28, noFadeOut: true, noWhoosh: true, build(S) {
    const g = S.g, board = G(g);
    S.place(800, FLOOR, 'proud');
    S.sfx(0, 'swell');
    const chs = scenes.filter(s => s.chapter != null);
    const pos = chs.map((s, i) => { const r = Math.floor(i / 6), c = i % 6; const cc = r % 2 ? 5 - c : c; return [255 + cc * 218, 120 + r * 120]; });
    for (let i = 0; i < pos.length - 1; i++) {
      const p = el('path', { d: `M${pos[i][0]} ${pos[i][1]} L${pos[i + 1][0]} ${pos[i + 1][1]}`, stroke: C.red, 'stroke-width': 4, pathLength: 1 }, board);
      S.k(p, 'd', [1.8 + i * .12, 0], [2 + i * .12, 1, 'lin']);
    }
    chs.forEach((s, i) => {
      const [x, y] = pos[i];
      const cdd = card(board, x, y, 200, 74, { rot: ((i * 37) % 5) - 2 });
      T(cdd.inner, x, y + 2, String(s.chapter), { font: SERIF, size: 26, weight: 700, fill: C.red });
      T(cdd.inner, x, y + 28, s.short, { size: 20 });
      S.pop(cdd, .2 + i * .08); if (i % 4 === 0) S.sfx(.2 + i * .08, 'pin');
    });
    S.sfx(1.8, 'string');
    S.to(board, 'o', 5.6, .5, .15);
    const gz = gazette(g, 800, 290);
    S.pop(gz, 6, .5); S.sfx(6, 'paper');
    const scrib = el('path', { d: 'M598 334 L792 330', stroke: C.red, 'stroke-width': 9, 'stroke-linecap': 'round', pathLength: 1 }, gz.inner);
    S.k(scrib, 'd', [6.8, 0], [7.3, 1]); S.sfx(6.8, 'chalk');
    const rv = note(g, 830, 515, 'about 6 points, *if* our assumptions hold', { size: 38, rot: 2, color: C.red, w: 860 });
    const rvc = clipRect(rv.inner, 395, 460, 0, 120);
    S.fadeIn(rv, 7.4, .2); S.fn(7.5, 1.8, p => rvc.setAttribute('width', (880 * p).toFixed(1)));
    S.sfx(7.6, 'chalk'); S.sfx(8.5, 'chalk');
    S.say(6.3, 'Fifteen points? Let me revise that.');
    S.say(9.8, 'Not as catchy. Much more true.');
    const stp = stampBox(g, 1230, 240, ['Case open:', 'keep asking why'], { size: 32, rot: -10 });
    S.stamp(stp, 13); S.sfx(13.4, 'motifEnd');
    S.mood(13, 'eureka'); S.mood(14.5, 'proud');
    const night = el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, g);
    S.k(night, 'o', [0, 0], [17.6, 0], [18.4, .96]);
    const cr = G(g);
    const lines = [
      ['Based on', 720 - 470 + 10, HAND, 30, '#B9C3D6', 400],
      ['The Effect: An Introduction to Research Design and Causality', 300, SERIF, 40, '#FFFFFF', 600],
      ['by Nick Huntington-Klein, free to read at theeffectbook.net', 350, HAND, 30, '#DDE3EE', 400],
      ['Explainer by Brijesh Shetty', 450, SERIF, 40, '#FFFFFF', 600],
      ['github.com/brijs', 498, HAND, 32, C.hi, 400],
      ['All case numbers in this film are illustrative.', 590, HAND, 26, '#9AA6BF', 400]
    ];
    lines.forEach(([s, y, f, size, fill, w], i) => { const t = T(cr, 800, y, s, { font: f, size, fill, weight: w }); S.fadeIn(t, 18.4 + i * .45, .6); });
    S.sfx(18, 'finalChord');
    S.walk(18, 1.6, 1420);
    S.say(19.4, 'Thanks for investigating with me.');
    S.sfx(26.8, 'lamp');
  }
});
