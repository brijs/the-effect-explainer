/* ============================================================
   SCENES, PART 1: cold open, Part 1 card, chapters 1 to 11
   Times are seconds from the start of each scene.
   ============================================================ */

/* shared fictional data: tutoring hours, income and scores */
function tutorData(n, seed) {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) {
    const inc = gauss(r);
    const x = clamp(2.5 + 1.0 * inc + 0.9 * gauss(r), 0.15, 4.85);
    const y = 62 + 2.4 * x + 6 * inc + 3 * gauss(r);
    out.push({ x, y, inc, yAdj: y - 6 * inc });
  }
  return out;
}
function gazette(g, cx, cy) {
  const gz = pv(G(g), cx, cy);
  const gi = G(gz, { transform: `rotate(-2 ${cx} ${cy})` });
  const x0 = cx - 320, y0 = cy - 135;
  el('rect', { x: x0 + 7, y: y0 + 8, width: 640, height: 270, fill: '#000', opacity: .25 }, gi);
  el('rect', { x: x0, y: y0, width: 640, height: 270, fill: C.paper }, gi);
  T(gi, cx, y0 + 52, 'The Riverbend Gazette', { font: SERIF, size: 36, weight: 700, italic: true });
  el('line', { x1: x0 + 30, x2: x0 + 610, y1: y0 + 68, y2: y0 + 68, stroke: C.ink, 'stroke-width': 2 }, gi);
  el('line', { x1: x0 + 30, x2: x0 + 610, y1: y0 + 74, y2: y0 + 74, stroke: C.ink, 'stroke-width': 1 }, gi);
  T(gi, cx, y0 + 128, 'Tutored students score', { font: SERIF, size: 46, weight: 700 });
  T(gi, cx, y0 + 182, '15 points higher!', { font: SERIF, size: 46, weight: 700 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) el('rect', { x: x0 + 30 + i * 196, y: y0 + 210 + j * 15, width: 176 - (j === 2 ? 50 : 0), height: 7, fill: '#A29F96' }, gi);
  pushpin(gi, cx, y0 + 12);
  gz.inner = gi; gz.x0 = x0; gz.y0 = y0;
  return gz;
}

/* ---------------- 0. Cold open ---------------- */
scene({
  name: 'Cold open: the headline', short: 'Open', dur: 30, noFadeIn: true, build(S) {
    const g = S.g, world = pv(G(g), 800, 450);
    S.sfx(.25, 'lamp');
    const gz = gazette(world, 800, 300);
    S.pop(gz, 1.5, .5); S.sfx(1.5, 'pin'); S.sfx(1.6, 'paper');
    const ring = el('ellipse', { cx: 622, cy: 334, rx: 50, ry: 34, fill: 'none', stroke: C.red, 'stroke-width': 5, pathLength: 1 }, gz.inner);
    S.k(ring, 'd', [7.2, 0], [8.0, 1]); S.sfx(7.2, 'chalk');

    S.place(1300, FLOOR, 'suspicious');
    S.sc.ay = [[0, 990], [6, 990], [6.45, FLOOR, 'back']];
    S.arrowO([0, 0], [5.95, 0], [6.0, 1, 'lin']);
    S.sfx(6, 'pop'); S.sfx(6.2, 'motif');
    S.say(6.5, 'Fifteen points. But did tutoring *cause* that?');

    S.to(gz, 's', 12, .8, .55); S.to(gz, 'x', 12, .8, -430); S.to(gz, 'y', 12, .8, -160);
    const nT = node(world, 520, 520, 'T', 'tutoring', 'T'), nY = node(world, 1080, 520, 'Y', 'math score', 'Y');
    S.pop(nT, 12.4); S.sfx(12.4, 'pin'); S.pop(nY, 13.0); S.sfx(13.0, 'pin');
    S.draw(link(world, nT, nY), 13.6, .8);
    S.mood(12, 'curious');
    const q = node(world, 800, 300, '?', null, 'U', { r: 40 });
    const l1 = link(world, q, nT, { color: C.slate, dash: '10 9', w: 4 }), l2 = link(world, q, nY, { color: C.slate, dash: '10 9', w: 4 });
    S.fadeIn(q, 16, 1); S.fadeIn(l1.g, 16.6, .8, .8); S.fadeIn(l2.g, 16.6, .8, .8);
    S.sfx(16, 'cello'); S.mood(16, 'worried');
    S.say(16.4, 'Or is something else pulling the strings?');

    S.to(world, 'o', 19.5, .6, .14);
    const tc = card(g, 800, 360, 1100, 330, { rot: -1 });
    const tTitle = T(tc.inner, 800, 395, '', { font: SERIF, size: 120, weight: 650 });
    const tSub = T(tc.inner, 800, 455, 'a case file in 23 chapters', { size: 38, fill: C.red });
    const tBy = T(tc.inner, 800, 498, 'after the book by Nick Huntington-Klein', { size: 28, fill: C.slate });
    S.pop(tc, 19.8, .5);
    S.fn(20.1, 1.1, p => { tTitle.textContent = 'The Effect'.slice(0, Math.round(p * 10)); });
    S.sfx(20.1, 'type'); S.fadeIn(tSub, 21.6, .5); S.sfx(21.6, 'type'); S.fadeIn(tBy, 22.6, .6); S.sfx(22.6, 'shimmer');
    S.walk(19.4, 1.6, 1440);
    S.mood(23, 'proud');
  }
});

/* ---------------- Part cards ---------------- */
function partCard(S, num, title, range, clank) {
  const g = S.g;
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, g);
  const f = pv(G(g), 800, 460);
  el('path', { d: 'M440 236 L440 206 Q440 196 450 196 L690 196 Q700 196 706 206 L720 236 Z', fill: '#C9A465' }, f);
  el('rect', { x: 446, y: 244, width: 760, height: 460, rx: 8, fill: '#000', opacity: .35 }, f);
  el('rect', { x: 430, y: 232, width: 760, height: 460, rx: 8, fill: '#D9B676' }, f);
  T(f, 810, 345, 'Part ' + num, { size: 46, fill: C.red });
  T(f, 810, 440, title, { font: SERIF, size: title.length > 14 ? 54 : 72, weight: 650, fill: '#2B2116' });
  T(f, 810, 500, range, { size: 32, fill: '#5A4630' });
  S.k(f, 'y', [0, -760], [.55, 0, 'back']); S.k(f, 'r', [0, -7], [.55, -2]);
  const sb = stampBox(g, 1030, 610, ['Case file'], { size: 32, rot: -9 });
  S.stamp(sb, .7);
  if (clank) S.sfx(.5, 'clank');
  S.place(HOME_L, FLOOR); S.arrowO([0, 0]);
}
scene({ name: 'Part 1: The Design of Research', short: 'Part 1', dur: 8, build(S) { partCard(S, 1, 'The Design of Research', 'Chapters 1 to 11'); } });

/* ---------------- Chapter 1 ---------------- */
chap(1, 'Designing Research', 24, S => {
  const g = S.g;
  S.place(560, FLOOR, 'curious');
  const ss = card(g, 800, 330, 440, 270, { rot: -1.5 });
  const r = rng(5);
  for (let i = 0; i <= 6; i++) el('line', { x1: 600, x2: 1000, y1: 228 + i * 34, y2: 228 + i * 34, stroke: '#B8C2D2', 'stroke-width': 2 }, ss.inner);
  for (let j = 0; j <= 4; j++) el('line', { x1: 600 + j * 100, x2: 600 + j * 100, y1: 228, y2: 432, stroke: '#B8C2D2', 'stroke-width': 2 }, ss.inner);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) T(ss.inner, 650 + j * 100, 252 + i * 34, i === 0 ? ['id', 'hours', 'income', 'score'][j] : String(Math.round(r() * 90 + 5)), { size: 20, fill: i === 0 ? C.red : C.ink });
  S.pop(ss, 2.2); S.sfx(2.2, 'pin');
  S.say(2.5, "Staring at data doesn't answer anything.");
  S.mood(5, 'suspicious');
  S.fadeOut(ss, 7.4, .4);

  const bp = pv(G(g), 160, 375);
  el('rect', { x: 160, y: 150, width: 1280, height: 450, fill: C.blueprint, rx: 4 }, bp);
  for (let x = 200; x < 1440; x += 40) el('line', { x1: x, x2: x, y1: 150, y2: 600, stroke: '#fff', opacity: .12 }, bp);
  for (let y = 190; y < 600; y += 40) el('line', { x1: 160, x2: 1440, y1: y, y2: y, stroke: '#fff', opacity: .12 }, bp);
  S.k(bp, 'sx', [8, 0], [9, 1, 'o']); S.k(bp, 'o', [7.99, 0], [8.01, 1, 'lin']); S.sfx(8, 'paper');

  const labels = [['Question', 'What do I want to know?'], ['Theory', 'Why would it happen?'], ['Design', 'What variation answers it?'], ['Data', 'What must I collect?']];
  const xs = [330, 640, 960, 1270];
  labels.forEach(([a, b], i) => {
    const c = card(g, xs[i], 370, 262, 170, { rot: [-2, 1.5, -1, 2][i], ruled: true });
    T(c.inner, xs[i], 322, a, { font: SERIF, size: 38, weight: 600 });
    T(c.inner, xs[i], 392, b, { size: 19 });
    const at = 9.8 + i * .652; S.pop(c, at); S.sfx(at, 'pin');
  });
  S.walk(9.6, 3, 1270);
  for (let i = 0; i < 3; i++) S.draw(link(g, { x: xs[i] + 131, y: 370 }, { x: xs[i + 1] - 131, y: 370 }), 16 + i * .45, .4, i === 0);
  const icon = card(g, 1270, 530, 110, 70, { pin: false });
  for (let i = 1; i < 3; i++) el('line', { x1: 1215, x2: 1325, y1: 495 + i * 23, y2: 495 + i * 23, stroke: '#B8C2D2', 'stroke-width': 2 }, icon.inner);
  for (let j = 1; j < 3; j++) el('line', { x1: 1215 + j * 37, x2: 1215 + j * 37, y1: 495, y2: 565, stroke: '#B8C2D2', 'stroke-width': 2 }, icon.inner);
  S.pop(icon, 17.6); S.sfx(17.6, 'pop');
  S.mood(16.2, 'eureka');
  S.say(16.3, 'Plan what you need to learn. *Then* open the data.');
  S.sfx(18.6, 'ding'); S.mood(19.5, 'proud');
}, 'Research design');

/* ---------------- Chapter 2 ---------------- */
chap(2, 'Research Questions', 24, S => {
  const g = S.g;
  S.place(440, FLOOR, 'suspicious');
  const q = note(g, 800, 320, 'Is tutoring good?', { size: 58, rot: -2 });
  S.pop(q, 2.2); S.sfx(2.2, 'pin'); S.sfx(3.0, 'buzz');
  S.say(2.6, 'Good for what? For whom? Compared to what?');
  [['for what?', 520, 190], ['for whom?', 1090, 200], ['compared to what?', 1080, 470]].forEach(([s, x, y], i) => {
    const lg = pv(G(g), x, y); T(lg, x, y, s, { size: 38, fill: C.red });
    S.pop(lg, 3.6 + i * .65); S.sfx(3.6 + i * .65, 'pop'); S.fadeOut(lg, 7.8, .3);
  });
  const bin = pv(G(g), 1350, 640);
  el('path', { d: 'M1300 600 L1310 690 L1390 690 L1400 600 Z', fill: '#7D8796', stroke: '#4E5766', 'stroke-width': 3 }, bin);
  el('ellipse', { cx: 1350, cy: 600, rx: 52, ry: 10, fill: '#5E6777', stroke: '#4E5766', 'stroke-width': 3 }, bin);
  for (let i = 0; i < 3; i++) el('line', { x1: 1325 + i * 25, x2: 1328 + i * 22, y1: 615, y2: 680, stroke: '#4E5766', 'stroke-width': 2 }, bin);
  S.fadeIn(bin, 7.3, .4);
  S.k(q, 's', [8, null], [8.5, .25]); S.k(q, 'r', [8, 0], [8.5, 180], [9.6, 440]);
  S.k(q, 'x', [8.5, 0], [9.6, 550, 'lin']); S.k(q, 'y', [8.5, 0], [9.05, -150, 'o'], [9.6, 280, 'i']); S.k(q, 'o', [9.55, null], [9.62, 0, 'lin']);
  S.sfx(8, 'paper'); S.sfx(9.6, 'thunk');
  S.walk(7.8, 1, 560, FLOOR, false);

  const nq = card(g, 800, 300, 1020, 200, { rot: -1 });
  const tg = G(nq.inner);
  T(tg, 800, 290, 'Does one hour a week of tutoring', { size: 48 });
  T(tg, 800, 352, "*raise* a student's math score?", { size: 48 });
  const cr = clipRect(tg, 290, 200, 0, 200);
  S.fn(11.2, 2.1, p => cr.setAttribute('width', 1020 * p));
  S.pop(nq, 10.8); S.sfx(10.8, 'pin'); S.sfx(11.2, 'chalk'); S.sfx(12.1, 'chalk');
  const mkTag = (txt, col) => { const t = pv(G(g), 800, 490); el('rect', { x: 660, y: 462, width: 280, height: 58, rx: 29, fill: col }, t); T(t, 800, 502, txt, { size: 32, fill: '#fff' }); return t; };
  const tagD = mkTag('descriptive', C.slate), tagC = mkTag('causal', C.red);
  S.pop(tagD, 13.2); S.sfx(13.2, 'pop');
  S.k(tagD, 'sx', [14.4, 1], [14.7, 0, 'i']); S.k(tagC, 'sx', [0, 0], [14.7, 0], [15, 1, 'o']);
  S.sfx(15, 'stamp');
  S.mood(11.5, 'proud');
  S.say(12, "Specific. Answerable. And it's causal.");
  S.mood(19.4, 'eureka');
  S.say(19.6, 'A sharp question tells you what data you need.'); S.sfx(20.2, 'ding');
}, 'Questions');

/* ---------------- Chapter 3 ---------------- */
chap(3, 'Describing Variables', 24, S => {
  const g = S.g;
  S.place(HOME_R, FLOOR, 'curious');
  const left = pv(G(g), 760, 360);
  const ch = chart(left, 760, 360, 940, 450, { xr: [40, 100], yr: [0, 19], xl: 'math score', yl: 'students' });
  S.pop(ch, 2.0);
  const r = rng(3), counts = new Array(12).fill(0), dots = [], scores = [];
  for (let i = 0; i < 72; i++) {
    const s = clamp(70 + 10 * gauss(r), 40.5, 99.5); scores.push(s);
    const b = Math.floor((s - 40) / 5), c = counts[b]++;
    const tx = ch.px(40 + b * 5 + 2.5), ty = ch.py(c + .5);
    dots.push({ e: el('circle', { cx: tx, cy: ty, r: 9.5, fill: C.body }, ch.plot), tx, ty, b, delay: i / 72 * .8 });
  }
  S.fn(2.4, 5.2, p => {
    for (const d of dots) {
      const q = clamp((p - d.delay) / .2, 0, 1);
      d.e.setAttribute('cy', lerp(ch.T - 40, d.ty, EASE.i(q)).toFixed(1));
      d.e.setAttribute('opacity', q > 0 ? 1 : 0);
    }
  });
  dots.forEach((d, i) => { if (i % 3 === 0) S.sfx(2.4 + (d.delay + .2) * 5.2, 'drop', 320 + d.b * 55); });
  S.say(2.5, "A variable isn't one number. It's a whole shape.");
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const sd = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length);
  const mx = ch.px(mean);
  const ml = el('path', { d: `M${mx} ${ch.B} L${mx} ${ch.T - 6}`, stroke: C.red, 'stroke-width': 5, pathLength: 1 }, ch.plot);
  S.k(ml, 'd', [9, 0], [9.8, 1]); S.sfx(9, 'pin');
  const mlab = T(ch.plot, mx + 12, ch.T + 4, 'mean', { size: 26, fill: C.red, anchor: 'start' });
  S.fadeIn(mlab, 9.6);
  const br = pv(G(ch.plot), mx, ch.T + 34);
  const y1 = ch.T + 34, xa = ch.px(mean - sd), xb = ch.px(mean + sd);
  el('path', { d: `M${xa} ${y1 - 12} L${xa} ${y1} L${xb} ${y1} L${xb} ${y1 - 12}`, stroke: C.ink, 'stroke-width': 4, fill: 'none' }, br);
  T(br, xb + 10, y1 + 8, '±1 SD', { size: 24, anchor: 'start' });
  S.k(br, 'sx', [10.4, 0], [11.2, 1, 'o']); S.sfx(10.4, 'string');
  S.say(9.2, 'Center… and spread.'); S.mood(9, 'eureka');

  S.to(left, 's', 14, .6, .6); S.to(left, 'x', 14, .6, -340); S.to(left, 'y', 14, .6, -30);
  const ch2 = chart(g, 1120, 330, 640, 400, { xr: [0, 10], yr: [0, 1.05], yl: 'people', padL: 80 });
  const lab = T(ch2.inner, (ch2.L + ch2.R) / 2, ch2.B + 48, 'income', { size: 25 });
  S.pop(ch2, 14.4); S.sfx(14.4, 'pin');
  const hA = [.55, 1, .8, .5, .32, .2, .13, .08, .06, .04], hB = [.12, .3, .6, .88, 1, .86, .6, .34, .14, .05];
  const bw = (ch2.R - ch2.L) / 10;
  const bars = hA.map((h, i) => el('rect', { x: ch2.L + i * bw + 4, width: bw - 8, y: ch2.py(h), height: ch2.B - ch2.py(h), fill: C.green }, ch2.plot));
  S.fn(16.5, 1.0, p => {
    const q = EASE.back(p);
    bars.forEach((b, i) => { const h = Math.max(0, lerp(hA[i], hB[i], q)); b.setAttribute('y', ch2.py(h)); b.setAttribute('height', ch2.B - ch2.py(h)); });
    lab.textContent = p < .5 ? 'income' : 'log(income)';
  });
  S.sfx(16.5, 'boing'); S.mood(15, 'proud');
  S.say(15, 'Long tails? Try the log.');
  S.say(20.4, 'Shape, center, spread: describe before you explain.'); S.sfx(21, 'ding');
}, 'Variables');

/* ---------------- Chapter 4 ---------------- */
chap(4, 'Describing Relationships', 26, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'curious');
  const ch = chart(g, 800, 360, 1000, 460, { xr: [0, 5], yr: [40, 100], xl: 'tutoring hours per week', yl: 'math score' });
  S.pop(ch, 2.0);
  const D = tutorData(64, 4);
  const dots = D.map((d, i) => ({ ...d, e: el('circle', { cx: ch.px(d.x), cy: ch.py(d.y), r: 0, fill: C.body, opacity: .85 }, ch.plot), delay: i / 64 * .85 }));
  S.fn(2.3, 2.6, p => dots.forEach(d => d.e.setAttribute('r', (7.5 * EASE.back(clamp((p - d.delay) / .15, 0, 1))).toFixed(2))));
  for (let i = 0; i < 12; i++) S.sfx(2.3 + i * .2, 'drop', 500 + (i % 5) * 80);
  for (let k = 0; k < 5; k++) {
    const sel = D.filter(d => d.x >= k && d.x < k + 1);
    if (!sel.length) continue;
    const m = sel.reduce((a, b) => a + b.y, 0) / sel.length, x = ch.px(k + .5), y = ch.py(m);
    const dm = pv(G(ch.plot), x, y);
    el('polygon', { points: `${x},${y - 15} ${x + 15},${y} ${x},${y + 15} ${x - 15},${y}`, fill: C.hi, stroke: C.ink, 'stroke-width': 3 }, dm);
    S.pop(dm, 6 + k * .652); S.sfx(6 + k * .652, 'pin'); S.fadeOut(dm, 15.8, .4);
  }
  S.say(6.2, "What's the average score *given* each level of tutoring?");
  const f1 = fitLine(D.map(d => d.x), D.map(d => d.y));
  const line = el('path', { d: `M${ch.px(.2)} ${ch.py(f1.a + f1.b * .2)} L${ch.px(4.8)} ${ch.py(f1.a + f1.b * 4.8)}`, stroke: C.red, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, ch.plot);
  S.draw({ path: line, head: G(ch.plot) }, 12, 1);
  S.mood(12, 'eureka'); S.say(12.3, 'A line sums up how the average shifts.');
  // squeegee: remove the part of the score that income explains
  const sq = G(ch.plot);
  el('rect', { x: -6, y: ch.T - 20, width: 12, height: ch.B - ch.T + 20, rx: 5, fill: '#3B4A63' }, sq);
  el('rect', { x: -20, y: ch.T - 40, width: 40, height: 22, rx: 6, fill: C.slate }, sq);
  const f2 = fitLine(D.map(d => d.x), D.map(d => d.yAdj));
  const line2 = el('path', { d: `M${ch.px(.2)} ${ch.py(f2.a + f2.b * .2)} L${ch.px(4.8)} ${ch.py(f2.a + f2.b * 4.8)}`, stroke: C.teal, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, ch.plot);
  S.fn(16, 3, p => {
    const sx = lerp(ch.L - 20, ch.R + 20, p);
    sq.setAttribute('transform', `translate(${sx.toFixed(1)} 0)`);
    sq.style.display = p > 0 && p < 1 ? '' : 'none';
    for (const d of dots) {
      const q = clamp((sx - ch.px(d.x)) / 110, 0, 1);
      d.e.setAttribute('cy', ch.py(lerp(d.y, d.yAdj, EASE.io(q))).toFixed(1));
    }
  });
  S.fadeOut(line, 15.8, .4, .25);
  S.k(line2, 'd', [19.1, 0], [19.9, 1]); S.sfx(19.1, 'string');
  S.sfx(16, 'squeegee'); S.sfx(17.4, 'squeegee');
  const tag = note(g, 1180, 150, 'income removed', { size: 26, rot: 3 });
  S.pop(tag, 19.6); S.sfx(19.6, 'pin');
  S.mood(16, 'neutral'); S.walk(16, 3, HOME_R);
  S.say(16.3, "Controlling for income: keep only what income *can't* explain.");
  S.mood(22.4, 'proud'); S.say(22.6, 'Same data, a fairer comparison.'); S.sfx(23, 'ding');
}, 'Relationships');

/* ---------------- Chapter 5 ---------------- */
chap(5, 'Identification', 28, S => {
  const g = S.g;
  S.place(330, FLOOR, 'worried');
  const yarn = pv(G(g), 800, 380);
  el('circle', { cx: 800, cy: 380, r: 165, fill: '#E9DDC4', opacity: .35 }, yarn);
  const r = rng(21);
  const strand = (grp, col) => {
    const pts = []; for (let k = 0; k < 4; k++) { const a = r() * Math.PI * 2, rad = 30 + r() * 135; pts.push([800 + Math.cos(a) * rad, 380 + Math.sin(a) * rad]); }
    return el('path', { d: `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} C${pts[1].map(v => v.toFixed(1)).join(' ')} ${pts[2].map(v => v.toFixed(1)).join(' ')} ${pts[3].map(v => v.toFixed(1)).join(' ')}`, stroke: col, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, grp);
  };
  const glowG = G(yarn), red = G(yarn), pur = pv(G(yarn), 800, 380), grn = pv(G(yarn), 800, 380);
  const reds = [];
  for (let i = 0; i < 9; i++) { reds.push(strand(red, C.red)); strand(pur, C.purple); strand(grn, C.green); }
  reds.forEach(p => el('path', { d: p.getAttribute('d'), stroke: C.hi, 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, glowG));
  S.k(glowG, 'o', [0, 0], [16, 0], [16.8, .9]);
  S.pop(yarn, 2.2, .6); S.sfx(2.2, 'rumble');
  const gap = note(g, 800, 140, 'the 15-point gap', { size: 30, rot: -2 });
  S.pop(gap, 2.6); S.sfx(2.6, 'pin');
  S.say(2.5, 'That 15-point gap is a tangle of reasons.');
  S.k(pur, 'x', [9, 0], [10.6, -560, 'i']); S.fadeOut(pur, 10.2, .5); S.sfx(9, 'stringDown');
  const lm = pv(G(g), 300, 330); T(lm, 300, 330, 'motivation', { size: 38, fill: C.purple, weight: 700 }); S.pop(lm, 9.4);
  S.k(grn, 'x', [12, 0], [13.6, 560, 'i']); S.fadeOut(grn, 13.2, .5); S.sfx(12, 'stringDown');
  const li = pv(G(g), 1300, 330); T(li, 1300, 330, 'income', { size: 38, fill: C.green, weight: 700 }); S.pop(li, 12.4);
  S.mood(8.8, 'suspicious'); S.walk(8.8, .8, 250); S.walk(11.8, 1.2, 600);
  const lt = pv(G(g), 800, 600); T(lt, 800, 600, "tutoring's effect", { size: 36, fill: C.red, weight: 700 });
  S.pop(lt, 16.6); S.sfx(17, 'ding'); S.mood(16, 'eureka');
  S.say(16.2, 'Identification: find the variation where *only* your answer is left.');
  const kn = note(g, 1230, 560, 'Know the process\nthat made your data.', { size: 28, rot: 2 });
  S.pop(kn, 23.2); S.sfx(23.2, 'pin'); S.mood(23, 'proud');
  S.say(23.4, 'Know the process that made your data.');
}, 'Identification');

/* ---------------- Chapter 6 ---------------- */
chap(6, 'Causal Diagrams', 28, S => {
  const g = S.g;
  S.place(HOME_R, FLOOR, 'curious');
  const nT = node(g, 470, 440, 'T', 'tutoring', 'T'), nY = node(g, 1130, 440, 'Y', 'math score', 'Y');
  const nI = node(g, 800, 200, 'I', 'income'), nM = node(g, 800, 620, 'M', 'motivation', 'U');
  [nT, nY, nI, nM].forEach((n, i) => { S.pop(n, 2.2 + i * .652); S.sfx(2.2 + i * .652, 'pin'); });
  S.say(2.4, 'Variables become pins.');
  const ls = [[nT, nY], [nI, nT], [nI, nY], [nM, nT], [nM, nY]];
  ls.forEach(([a, b], i) => S.draw(link(g, a, b), 8 + i * 1.3, .8));
  S.say(8.3, 'Every arrow says: this causes that.'); S.mood(8, 'neutral');
  S.k(nM, 's', [18, 1], [18.4, 1.15], [18.8, 1], [19.2, 1.15], [19.6, 1], [20, 1.15], [20.4, 1]);
  [18, 18.8, 19.6].forEach(t => S.sfx(t, 'pulse'));
  const un = T(g, 900, 610, 'unobserved', { size: 28, fill: C.ink, anchor: 'start', weight: 700 });
  S.fadeIn(un, 18.2);
  S.mood(18, 'suspicious'); S.say(18.2, "We can't measure motivation. It still goes on the board.");
  S.mood(23.4, 'proud'); S.say(23.6, 'Each arrow is an assumption you have to defend.'); S.sfx(24.2, 'ding');
}, 'Causal diagrams');

/* ---------------- Chapter 7 ---------------- */
chap(7, 'Drawing Causal Diagrams', 26, S => {
  const g = S.g, world = G(g);
  S.place(HOME_L, FLOOR, 'shocked');
  const spec = [
    ['T', 'tutoring', 430, 350, 'T'], ['Y', 'score', 1170, 350, 'Y'], ['I', 'income', 690, 180], ['P', 'parent education', 450, 175],
    ['M', 'motivation', 800, 560, 'U'], ['H', 'homework', 800, 350], ['S', 'shoe size', 190, 250], ['W', 'weather', 1390, 190],
    ['B', 'bus route', 1400, 520], ['Sc', 'school', 1010, 180], ['Te', 'teacher', 1160, 560], ['Sl', 'sleep', 210, 500],
    ['Ph', 'phone use', 590, 560], ['Br', 'breakfast', 990, 570], ['Si', 'siblings', 1380, 360]
  ];
  const N = spec.map(([l, n, x, y, k]) => node(world, x, y, l, n, k || 'obs', { r: 28, ns: 20, ls: 24 }));
  const r = rng(77), mess = [];
  for (let i = 0; i < 16; i++) {
    const a = N[Math.floor(r() * N.length)], b = N[Math.floor(r() * N.length)];
    if (a === b) continue;
    const lk = link(world, a, b, { w: 3, bend: (r() - .5) * .5 });
    world.insertBefore(lk.g, world.firstChild);
    S.draw(lk, 3.2 + r() * 1.6, .5, false); mess.push(lk);
  }
  N.forEach((n, i) => { S.pop(n, 2.2 + i * .1); if (i % 3 === 0) S.sfx(2.2 + i * .1, 'pin'); });
  S.sfx(3.3, 'paper');
  S.say(2.4, 'Everything affects everything…');
  mess.forEach(lk => S.fadeOut(lk.g, 8, .6));
  [6, 7, 8].forEach((idx, j) => {
    const at = 8 + j * .6, n = N[idx];
    S.k(n, 'y', [at, 0], [at + 1.2, 700, 'i']); S.k(n, 'r', [at, 0], [at + 1.2, 150]); S.fadeOut(n, at + .8, .4); S.sfx(at, 'pop');
  });
  S.mood(8, 'suspicious'); S.say(8.2, "Drop what doesn't matter.");
  [9, 10, 11, 12, 13, 14].forEach(idx => S.fadeOut(N[idx], 10.2, .5)); S.sfx(10.2, 'paper');
  const keepL = [[2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [4, 1], [0, 5], [5, 1]].map(([a, b]) => link(world, N[a], N[b], { w: 4 }));
  keepL.forEach((lk, i) => { world.insertBefore(lk.g, world.firstChild); S.draw(lk, 10.8 + i * .12, .5, i === 0); });
  S.k(N[2], 'x', [13, 0], [13.6, -120]); S.k(N[3], 'x', [13, 0], [13.6, 120]);
  S.to(N[2], 's', 13, .6, 0); S.to(N[3], 's', 13, .6, 0);
  [0, 1, 2, 3].forEach(i => S.fadeOut(keepL[i].g, 13, .4));
  const bg = node(world, 570, 178, 'B', 'background', 'obs', { r: 30 });
  S.pop(bg, 13.5); S.sfx(13.2, 'whoomp');
  [link(world, bg, N[0], { w: 4 }), link(world, bg, N[1], { w: 4 })].forEach((lk, i) => { world.insertBefore(lk.g, world.firstChild); S.draw(lk, 13.9 + i * .3, .6, i === 0); });
  S.mood(13, 'neutral'); S.say(13.2, 'Merge what acts alike.');
  S.to(world, 'o', 17.3, .5, .05);
  const lT = node(g, 440, 330, 'T', 'tutoring', 'T'), lY = node(g, 760, 330, 'Y', 'score', 'Y');
  const loop1 = link(g, lT, lY, { bend: .3 }), loop2 = link(g, lY, lT, { bend: .3 });
  [lT, lY].forEach((n, i) => S.pop(n, 17.6 + i * .2));
  S.draw(loop1, 17.9, .6); S.draw(loop2, 18.5, .6);
  const xm = xMark(g, 600, 330, 30); S.stamp(xm, 19.6); S.sfx(19.6, 'snip');
  [lT, lY, loop1.g, loop2.g, xm].forEach(e => S.fadeOut(e, 20.4, .4, .2));
  S.mood(17.6, 'worried'); S.say(17.8, 'A loop? Scores change tutoring, tutoring changes scores…');
  const t1 = node(g, 980, 330, 'T₁', 'tutoring, year 1', 'T', { ns: 19 }), y1 = node(g, 1180, 330, 'Y₁', 'score, year 1', 'Y', { ns: 19 }), t2 = node(g, 1380, 330, 'T₂', 'tutoring, year 2', 'T', { ns: 19 });
  [t1, y1, t2].forEach((n, i) => { S.pop(n, 20.6 + i * .3); S.sfx(20.6 + i * .3, 'pin'); });
  S.draw(link(g, t1, y1), 21.6, .5); S.draw(link(g, y1, t2), 22.1, .5);
  S.mood(21.4, 'eureka'); S.say(21.4, 'Break loops with time.'); S.sfx(23.6, 'ding');
}, 'Drawing diagrams');

/* ---------------- Chapter 8 (centerpiece) ---------------- */
chap(8, 'Causal Paths and Closing Back Doors', 36, S => {
  const g = S.g;
  S.place(380, FLOOR, 'curious');
  const back = G(g), front = G(g);
  const nT = node(front, 380, 420, 'T', 'tutoring', 'T'), nY = node(front, 1220, 420, 'Y', 'math score', 'Y'), nH = node(front, 800, 420, 'H', 'homework time');
  S.pop(nT, 2.2); S.pop(nY, 2.4); S.pop(nH, 2.8); S.sfx(2.2, 'pin'); S.sfx(2.8, 'pin');
  const f1 = link(front, nT, nH), f2 = link(front, nH, nY);
  S.draw(f1, 3.2, .6); S.draw(f2, 3.8, .6, false); S.glow(f1, 4.6); S.glow(f2, 4.6);
  const fl = T(front, 800, 350, 'front door', { size: 28, weight: 700 }); S.fadeIn(fl, 4.8);
  S.walk(3.2, 3.8, 1300);
  S.say(2.4, 'Front doors carry the effect.');
  // back door through income
  const nI = node(back, 800, 175, 'I', 'income');
  const b1 = link(back, nI, nT), b2 = link(back, nI, nY);
  S.pop(nI, 8.8); S.sfx(8.8, 'pin'); S.draw(b1, 9, .6); S.draw(b2, 9.3, .6, false);
  const d1 = door(back, b1.mid.x, b1.mid.y); S.pop(d1, 9.5);
  S.k(d1.leaf, 'sx', [10, 1], [10.5, .22]); S.sfx(9.3, 'wind'); S.sfx(10, 'doorCreak');
  const r = rng(8);
  for (let i = 0; i < 3; i++) {
    const p = pv(G(back), b1.mid.x, b1.mid.y);
    el('rect', { x: b1.mid.x - 14, y: b1.mid.y - 18, width: 28, height: 36, fill: C.card, stroke: '#9AA6BF' }, p);
    S.k(p, 'x', [10.3 + i * .35, 0], [11.8 + i * .35, 500 + r() * 300, 'o']); S.k(p, 'y', [10.3 + i * .35, 0], [11.8 + i * .35, -120 + r() * 240, 'o']);
    S.k(p, 'r', [10.3 + i * .35, 0], [11.8 + i * .35, 300]); S.k(p, 'o', [0, 0], [10.29 + i * .35, 0], [10.3 + i * .35, 1, 'lin'], [11.4 + i * .35, 1], [11.8 + i * .35, 0]);
  }
  S.mood(9, 'worried'); S.say(9.2, 'Back doors carry bias.');
  const bl = T(back, b1.mid.x - 40, b1.mid.y - 50, 'back door', { size: 26, weight: 700, anchor: 'end' }); S.fadeIn(bl, 10.2);
  const lk1 = lock(back, 965, 118, 'control: income'); S.pop(lk1, 14); S.sfx(14, 'click');
  S.k(d1.leaf, 'sx', [14.4, null], [14.65, 1, 'i']); S.sfx(14.6, 'doorShut');
  S.fadeOut(b1.g, 15, .5, .35); S.fadeOut(b2.g, 15, .5, .35);
  S.mood(14.2, 'proud'); S.say(14.2, 'Control for income: door closed.');
  // back door through motivation (unobserved)
  const nM = node(back, 800, 640, 'M', 'motivation', 'U');
  const m1 = link(back, nM, nT), m2 = link(back, nM, nY);
  S.pop(nM, 18.8); S.sfx(18.8, 'pin'); S.draw(m1, 19, .6); S.draw(m2, 19.3, .6, false);
  const d2 = door(back, m1.mid.x, m1.mid.y); S.pop(d2, 19.5);
  S.k(d2.leaf, 'sx', [19.8, 1], [20.2, .35]);
  S.k(d2, 'r', [20.5, 0], [20.6, 4], [20.7, -4], [20.8, 4], [20.9, -4], [21, 3], [21.1, -3], [21.2, 0]);
  S.sfx(20.5, 'rattle');
  const lk2 = lock(back, 910, 600); S.pop(lk2, 21);
  S.k(lk2, 'y', [21.6, 0], [22.4, 150, 'i']); S.k(lk2, 'r', [21.6, 0], [22.4, 70]); S.fadeOut(lk2, 22.1, .3);
  S.sfx(21.7, 'buzz');
  S.mood(19, 'worried'); S.say(19.2, "Can't control what we can't measure.");
  // collider
  S.to(back, 'o', 24.4, .5, .08); S.fadeOut(fl, 24.4, .4); S.fadeOut(f1.glow, 24.4, .4); S.fadeOut(f2.glow, 24.4, .4);
  const nC = node(g, 800, 180, 'C', 'featured in the Gazette');
  const c1 = link(g, nT, nC), c2 = link(g, nY, nC);
  S.pop(nC, 25); S.sfx(25, 'pin'); S.draw(c1, 25.3, .6); S.draw(c2, 25.6, .6, false);
  const d3 = door(g, c1.mid.x, c1.mid.y); S.pop(d3, 26.2);
  const lk3 = lock(g, 1010, 120, 'control: featured?'); S.pop(lk3, 27.5); S.sfx(27.5, 'click');
  S.k(d3.leaf, 'sx', [28, 1], [28.8, .22]); S.sfx(28, 'doorCreak'); S.sfx(29, 'buzz');
  const pathPts = t => t < .5 ? c1.at(t * 2) : c2.at(1 - (t - .5) * 2);
  const flow = [0, 1, 2].map(() => el('circle', { r: 11, fill: C.red, stroke: '#fff', 'stroke-width': 3 }, g));
  S.fn(28.6, 3.2, p => flow.forEach((c, i) => {
    const u = (p * 2 + i / 3) % 1, pt = pathPts(u);
    c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1));
    c.style.display = p > 0 && p < 1 ? '' : 'none';
  }));
  S.mood(25.2, 'curious'); S.say(25.2, 'A collider: this path starts closed.');
  S.mood(28.3, 'shocked'); S.say(28.5, 'Control for it… and the path opens!');
  S.mood(32, 'proud'); S.say(32.2, 'Close every back door. Leave colliders alone.'); S.sfx(32.5, 'ding');
}, 'Back doors');

/* ---------------- Chapter 9 ---------------- */
chap(9, 'Finding Front Doors', 30, S => {
  const g = S.g;
  S.place(HOME_L, FLOOR, 'worried');
  const nT = node(g, 560, 440, 'T', 'tutoring', 'T'), nY = node(g, 1180, 440, 'Y', 'math score', 'Y');
  const nI = node(g, 870, 200, 'I', 'income'), nM = node(g, 870, 640, 'M', 'motivation', 'U');
  const lTY = link(g, nT, nY), lIT = link(g, nI, nT), lIY = link(g, nI, nY), lMT = link(g, nM, nT), lMY = link(g, nM, nY);
  const all = [nT, nY, nI, nM, lTY.g, lIT.g, lIY.g, lMT.g, lMY.g];
  all.forEach(e => S.fadeIn(e, 2.2, .5));
  const dr = door(g, lMT.mid.x, lMT.mid.y); S.fadeIn(dr, 2.2, .5);
  S.k(dr.leaf, 'sx', [0, .35]);
  S.k(dr, 'r', [2.6, 0], [2.7, 4], [2.8, -4], [2.9, 4], [3, -4], [3.1, 4], [3.2, -3], [3.3, 0]);
  S.sfx(2.6, 'rattle');
  S.say(2.4, "Motivation's door won't lock.");
  const drum = pv(G(g), 230, 290);
  el('rect', { x: 200, y: 360, width: 60, height: 40, fill: C.wood }, drum);
  el('circle', { cx: 230, cy: 290, r: 88, fill: '#E3D6B8', stroke: C.wood, 'stroke-width': 8 }, drum);
  const spin = G(drum);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; el('line', { x1: 230, y1: 290, x2: 230 + Math.cos(a) * 82, y2: 290 + Math.sin(a) * 82, stroke: C.wood, 'stroke-width': 4 }, spin); }
  const rb = rng(9);
  for (let i = 0; i < 9; i++) el('circle', { cx: 230 + (rb() - .5) * 110, cy: 290 + (rb() - .5) * 110, r: 10, fill: [C.teal, C.slate, C.hi][i % 3], stroke: C.ink, 'stroke-width': 2 }, spin);
  S.fn(6, 4, p => spin.setAttribute('transform', `rotate(${(EASE.io(p) * 900).toFixed(1)} 230 290)`));
  S.pop(drum, 5.8); S.sfx(6.2, 'dice'); S.sfx(7.3, 'dice'); S.sfx(8.4, 'dice');
  S.walk(5.6, .8, 380); S.mood(6, 'neutral');
  S.say(6.2, 'So let chance decide who gets tutoring.');
  const nZ = node(g, 260, 470, 'Z', 'lottery', 'Z');
  S.pop(nZ, 9.6); S.sfx(9.6, 'pin');
  const lZT = link(g, nZ, nT); S.draw(lZT, 10, .6);
  [[lIT, 12], [lMT, 12.6]].forEach(([lk, at]) => { const x = xMark(g, lk.mid.x, lk.mid.y, 20); S.stamp(x, at); S.sfx(at, 'snip'); S.fadeOut(lk.g, at + .3, .4, .1); S.fadeOut(x, at + .9, .4); });
  S.fadeOut(dr, 12.9, .4);
  S.glow(lZT, 13.2); S.glow(lTY, 13.2); S.sfx(13.6, 'ding');
  S.mood(12.2, 'eureka'); S.say(12.3, 'Nothing else points into treatment now.');
  const nn = note(g, 1240, 150, 'Natural experiment: a rule or\naccident that did the randomizing.', { size: 24, rot: 2 });
  S.pop(nn, 19); S.sfx(19, 'pin');
  S.mood(19, 'neutral'); S.say(19.2, 'Or find a natural experiment that randomized for you.');
  S.fadeOut(lTY.g, 23.8, .4); S.fadeOut(lTY.glow, 23.8, .4);
  const nH = node(g, 870, 440, 'H', 'homework');
  S.pop(nH, 24.1); S.sfx(24.1, 'pin');
  const h1 = link(g, nT, nH), h2 = link(g, nH, nY);
  S.draw(h1, 24.3, .5); S.draw(h2, 24.8, .5, false); S.glow(h1, 25.3); S.glow(h2, 25.3);
  S.mood(24.2, 'curious'); S.say(24.3, 'Or trace the effect through a mediator: the front-door method.');
}, 'Front doors');

/* ---------------- Chapter 10 ---------------- */
chap(10, 'Treatment Effects', 28, S => {
  const g = S.g;
  S.place(HOME_R, FLOOR, 'curious');
  const eff = [20, 3, 0, 12, 8, 15, 5, -2], tut = [1, 0, 1, 1, 0, 1, 0, 0], comp = [0, 3, 6];
  const base = 450, k = 11;
  const cones = G(g);
  const studs = [], bars = [];
  eff.forEach((e, i) => {
    const x = 240 + i * 150;
    const cone = el('polygon', { points: `${x - 28},70 ${x + 28},70 ${x + 78},610 ${x - 78},610`, fill: C.hi, opacity: 0 }, cones);
    S.k(cone, 'o', [0, 0], [19, 0], [19.5, comp.includes(i) ? .3 : 0]);
    const s = student(g, x, 540, C.slate); studs.push(s); S.pop(s, 2.2 + i * .08);
    S.k(s.tealRect, 'o', [0, 0], [14, 0], [14.4, tut[i] ? 1 : 0]);
    const bg = pv(G(g), x, base);
    const h = Math.abs(e) * k;
    el('rect', { x: x - 26, y: e >= 0 ? base - h : base, width: 52, height: Math.max(h, 3), rx: 4, fill: e >= 0 ? C.red : C.slate }, bg);
    T(bg, e >= 0 ? x : x + 32, e >= 0 ? base - h - 12 : base + 22, (e > 0 ? '+' : '') + e, { size: 26, weight: 700, anchor: e >= 0 ? 'middle' : 'start' });
    S.k(bg, 'sy', [2.6 + i * .3, 0], [3.1 + i * .3, 1, 'back']); S.sfx(2.6 + i * .3, 'drop', 400 + e * 25);
    bars.push(bg);
  });
  el('line', { x1: 180, x2: 1340, y1: base, y2: base, stroke: C.ink, 'stroke-width': 3 }, g);
  S.say(2.4, "Tutoring doesn't help everyone equally.");
  const mkLine = (v, col, label, side) => {
    const lg = G(g), y = base - v * k;
    el('line', { x1: 180, x2: 1340, y1: y, y2: y, stroke: col, 'stroke-width': 5, 'stroke-dasharray': '14 9' }, lg);
    const tx = side === 'L' ? 172 : 1350;
    el('rect', { x: side === 'L' ? tx - 152 : tx, y: y - 22, width: 152, height: 40, rx: 6, fill: col }, lg);
    T(lg, side === 'L' ? tx - 76 : tx + 76, y + 9, label, { size: 24, fill: col === C.hi ? C.ink : '#fff', weight: 700 });
    return lg;
  };
  const ate = mkLine(7.6, C.ink, 'ATE +7.6', 'R'); S.fadeIn(ate, 9.4); S.sfx(9.4, 'pin');
  S.say(9.2, 'Average over everyone: the ATE.');
  const att = mkLine(11.75, C.teal, 'ATT +11.8', 'R'); S.fadeIn(att, 14.4); S.sfx(14.4, 'pin');
  S.fadeOut(ate, 14.4, .4, .2);
  bars.forEach((b, i) => { if (!tut[i]) S.fadeOut(b, 14.2, .4, .25); });
  S.say(14.2, 'Over the treated: the ATT.');
  const late = mkLine(12.3, C.hi, 'LATE +12.3', 'L'); S.fadeIn(late, 19.6); S.sfx(19.2, 'hum');
  S.fadeOut(att, 19.4, .4, .2);
  bars.forEach((b, i) => S.k(b, 'o', [19.2, null], [19.6, comp.includes(i) ? 1 : .2]));
  S.mood(19, 'eureka'); S.say(19.2, 'Over those your design moved: the LATE.');
  S.mood(23.6, 'proud'); S.say(23.8, 'Ask: *whose* effect am I estimating?'); S.sfx(24.2, 'ding');
}, 'Treatment effects');

/* ---------------- Chapter 11 ---------------- */
chap(11, 'Causality with Less Modeling', 24, S => {
  const g = S.g;
  S.place(300, FLOOR, 'worried');
  const nT = node(g, 800, 420, 'T', 'tutoring', 'T'), nY = node(g, 1130, 470, 'Y', 'score', 'Y');
  const nI = node(g, 560, 230, 'I', 'income'), nM = node(g, 560, 600, 'M', 'motivation', 'U');
  const nS = node(g, 1040, 200, 'S', 'school'), nH = node(g, 1000, 620, 'H', 'homework');
  const ls = [[nI, nT], [nM, nT], [nT, nY], [nS, nY], [nS, nI], [nT, nH], [nH, nY], [nI, nY]].map(([a, b]) => link(g, a, b, { w: 4 }));
  [nT, nY, nI, nM, nS, nH, ...ls.map(l => l.g)].forEach(e => S.fadeIn(e, 2.1, .4));
  const fogG = G(g);
  const mid = 'm' + (++UID);
  const mask = el('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff' }, mask);
  const hole = el('circle', { cx: 720, cy: 420, r: 0, fill: '#000' }, mask);
  fogG.setAttribute('mask', `url(#${mid})`);
  const fr = rng(4);
  el('rect', { x: 40, y: 40, width: W - 80, height: 700, fill: '#E7ECF2', opacity: .82 }, fogG);
  for (let i = 0; i < 14; i++) el('ellipse', { cx: 230 + fr() * 1140, cy: 150 + fr() * 480, rx: 110 + fr() * 70, ry: 55 + fr() * 40, fill: '#F6F8FB', opacity: .5 }, fogG);
  S.k(fogG, 'o', [0, 0], [2.6, 0], [4, 1]); S.sfx(2.4, 'wind');
  S.say(2.4, "We'll never see the whole map.");
  S.fn(7, 1.2, p => hole.setAttribute('r', (EASE.o(p) * 250).toFixed(1)));
  S.sfx(7, 'click'); S.glow(ls[0], 7.8); S.glow(ls[1], 7.8);
  const beam = el('polygon', { points: '345,668 640,250 740,610', fill: C.hi, opacity: 0 }, g);
  S.k(beam, 'o', [0, 0], [7, 0], [7.3, .22]);
  S.mood(7, 'curious'); S.say(7.2, 'You only need the roads into treatment.');
  const pc = card(g, 1210, 190, 520, 240, { rot: -1 });
  T(pc.inner, 1210, 128, 'Placebo test', { font: SERIF, size: 34, weight: 650 });
  T(pc.inner, 1210, 164, 'effect of tutoring on *height*', { size: 24 });
  el('path', { d: 'M1130 270 A80 80 0 0 1 1290 270', stroke: C.ink, 'stroke-width': 5, fill: 'none' }, pc.inner);
  T(pc.inner, 1120, 296, '−', { size: 26 }); T(pc.inner, 1300, 296, '+', { size: 26 });
  T(pc.inner, 1210, 300, '0', { size: 24, weight: 700 });
  const needle = el('line', { x1: 1210, y1: 270, x2: 1210, y2: 205, stroke: C.red, 'stroke-width': 5, 'stroke-linecap': 'round' }, pc.inner);
  el('circle', { cx: 1210, cy: 270, r: 7, fill: C.ink }, pc.inner);
  S.fn(13.4, 1.8, p => { const a = -75 * Math.exp(-4 * p) * Math.cos(p * 14); needle.setAttribute('transform', `rotate(${a.toFixed(1)} 1210 270)`); });
  S.pop(pc, 13); S.sfx(13, 'pin'); S.sfx(13.5, 'dial');
  const ck = check(g, 1420, 110, 22); S.pop(ck, 15.2); S.sfx(15.2, 'ding');
  S.mood(13.2, 'eureka'); S.say(13.2, 'Test what *should* come out zero.');
  S.mood(18.6, 'proud'); S.say(18.6, 'If it does, your assumptions survive a test.');
}, 'Less modeling');
