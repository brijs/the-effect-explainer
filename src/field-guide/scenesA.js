/* ============================================================
   SCENES A: opening, the map, Part 1 ideas, the bridge
   ============================================================ */
function mtext(g, x, y, parts, o) {
  o = o || {};
  const t = el('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || HEAD, 'font-size': o.size || 40, 'font-weight': o.weight || 700, fill: C.ink }, g);
  parts.forEach(([s, f]) => { const sp = el('tspan', { fill: f || C.ink }, t); sp.textContent = s; });
  return t;
}
function clearAt(S, els, at, d) { els.forEach(e => S.fadeOut(e, at, d || .4)); }
function rngData(seed) { return rng(seed); }

/* ---------------- Opening ---------------- */
scene({
  name: 'Opening: does this cause that?', short: 'Opening', noFadeIn: true, music: null, menu: true, build(S) {
    const g = S.g;
    S.place(1720, VY, 'happy');
    S.roll(1.2, 1.8, VX); S.sfx(.2, 'click');
    S.t = 2.2;
    let a = S.line("Hi! I'm Vari. I help people answer one kind of question.");
    const q = pv(G(g), 690, 175);
    mtext(q, 690, 195, [['Does ', C.ink], ['X', C.X], [' cause ', C.ink], ['Y', C.Y], ['?', C.ink]], { size: 84 });
    a = S.line('Does this *cause* that?');
    S.pop(q, a); S.sfx(a, 'pop'); S.mood(a, 'point');
    const ex = [['☕', 'Does coffee make you work faster?'], ['📣', 'Do ads raise sales?'], ['🚇', 'Does a metro line cut traffic?'], ['📚', 'Does tutoring raise scores?']];
    const exG = G(g);
    a = S.line('Does coffee make you work faster? Do ads raise sales? Does a new metro line cut traffic?');
    ex.forEach(([em, s], i) => {
      const x = i % 2 ? 960 : 420, y = i < 2 ? 360 : 530;
      const c = card(exG, x, y, 480, 120, { rot: [-2, 1.5, 1, -1.5][i] });
      T(c.inner, x - 180, y + 20, em, { size: 50, font: 'sans-serif' });
      T(c.inner, x + 40, y + 12, s, { size: 27 });
      S.pop(c, a + i * 1.1); S.sfx(a + i * 1.1, 'pop');
    });
    a = S.line("Here's the trouble. We only ever see one version of the world.");
    S.fadeOut(exG, a, .4); S.fadeOut(q, a, .4); S.mood(a, 'worried');
    const wa = card(g, 420, 380, 460, 300, { rot: -1.5 }), wb = card(g, 960, 380, 460, 300, { rot: 1.5, fill: '#F2F3F5' });
    T(wa.inner, 420, 285, 'World A', { font: HEAD, size: 34, weight: 700 }); T(wb.inner, 960, 285, 'World B', { font: HEAD, size: 34, weight: 700, fill: C.grey });
    T(wa.inner, 420, 340, 'You drank coffee', { size: 28 }); T(wb.inner, 960, 340, "You didn't", { size: 28, fill: C.grey });
    T(wa.inner, 420, 410, '☕', { size: 64, font: 'sans-serif' }); T(wa.inner, 420, 480, 'Report done in 40 min', { size: 26, fill: C.X });
    T(wb.inner, 960, 450, '?', { font: HEAD, size: 120, weight: 700, fill: '#C3C9D3' });
    S.pop(wa, a + .5); S.pop(wb, a + 1.6); S.sfx(a + .5, 'pop'); S.sfx(a + 1.6, 'pop');
    a = S.line("To learn the effect, we need a stand-in for the world we didn't get to see.");
    a = S.line('So we hunt for *variation*: differences in the cause that are as fair as a coin flip.');
    S.mood(a + 1, 'eureka'); S.sfx(a + 1, 'shimmer');
    clearAt(S, [wa, wb], a + .2);
    const coin = pv(G(g), 690, 380);
    el('circle', { cx: 690, cy: 380, r: 90, fill: C.Z, stroke: C.ink, 'stroke-width': 5 }, coin);
    el('circle', { cx: 690, cy: 380, r: 68, fill: 'none', stroke: C.ink, 'stroke-width': 2.5, opacity: .5 }, coin);
    T(coin, 690, 402, '₹', { font: HEAD, size: 72, weight: 700 });
    S.pop(coin, a + .6);
    S.fn(a + .6, 2.4, p => { if (p > 0 && p < 1) st(coin).sx = Math.cos(p * Math.PI * 8); });
    S.k(coin, 'sx', [0, 1]);
    S.fn(a + .6, 2.4, p => { if (p > 0 && p < 1) applyT(coin); });
    S.fadeOut(coin, a + 4.4, .4);
    a = S.line('This is a field guide to the book *The Effect*, by Nick Huntington-Klein.');
    const tc = card(g, 690, 380, 900, 320, { rot: -1 });
    T(tc.inner, 690, 375, 'The Effect', { font: HEAD, size: 112, weight: 700 });
    T(tc.inner, 690, 440, 'a field guide to research design', { size: 38, fill: C.X });
    T(tc.inner, 690, 488, 'from the book by Nick Huntington-Klein', { size: 28, fill: C.grey });
    S.pop(tc, a + .2, .5); S.sfx(a + .2, 'type'); S.mood(a, 'happy');
    a = S.line('First, how to *think* about a causal question. Then a toolbox of designs, each with two cases for you to try.');
    a = S.line("When I stop, pause and think. Tap Continue when you're ready.");
    S.mood(a, 'think');
    S.fadeOut(tc, S.t - .2, .4);
    S.end(.8);
  }
});

/* ---------------- The map of the book ---------------- */
chap({
  title: 'The map of the book', kicker: 'Outline', sub: 'two halves, twenty-three chapters', short: 'The map', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'point');
    let a = S.line('The book has two halves.');
    const h1 = T(g, 160, 128, 'Part 1: Designing research', { font: HEAD, size: 34, weight: 700, anchor: 'start' });
    const h1s = T(g, 160, 162, 'how to think', { size: 28, fill: C.X, anchor: 'start' });
    a = S.line('Part one is about thinking: designing research before touching any data.');
    S.fadeIn(h1, a); S.fadeIn(h1s, a + .3);
    const p1 = [['Ask', 'Ch 1–2', 'a sharp question'], ['Describe', 'Ch 3–4', 'variables and patterns'], ['Identify', 'Ch 5–9', 'diagrams, paths, doors'], ['Interpret', 'Ch 10–11', 'whose effect, tested']];
    const x1 = [250, 520, 790, 1060];
    const track1 = el('path', { d: `M${x1[0]} 220 L${x1[3]} 220`, stroke: C.X, 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1 }, g);
    const lines1 = ['Ask a sharp question.', 'Describe your variables, and how they move together.', 'Identify: draw the causal diagram, and find which comparisons answer your question.', "Interpret: know which average effect you've found, and test your assumptions."];
    S.k(track1, 'd', [a, 0], [a + 1.5, 1]);
    p1.forEach(([n, c, d], i) => {
      const st1 = pv(G(g), x1[i], 220);
      el('circle', { cx: x1[i], cy: 220, r: 20, fill: '#fff', stroke: C.X, 'stroke-width': 7 }, st1);
      T(st1, x1[i], 272, n, { font: HEAD, size: 28, weight: 700 });
      T(st1, x1[i], 302, c, { size: 22, fill: C.grey });
      T(st1, x1[i], 330, d, { size: 22 });
      const at = S.line(lines1[i], .3);
      S.pop(st1, at); S.sfx(at, 'pop');
      if (i === 0) S.roll(at, 1, 1430);
    });
    const h2 = T(g, 160, 410, 'Part 2: The toolbox', { font: HEAD, size: 34, weight: 700, anchor: 'start' });
    const h2s = T(g, 160, 444, 'how to do it', { size: 28, fill: C.Y, anchor: 'start' });
    a = S.line('Part two is the toolbox: templates that put a design to work on real data.');
    S.fadeIn(h2, a); S.fadeIn(h2s, a + .3);
    const join = el('path', { d: `M220 500 L1090 500`, stroke: C.Y, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', pathLength: 1 }, g);
    g.insertBefore(join, g.firstChild); g.insertBefore(track1, g.firstChild);
    S.k(join, 'd', [a, 0], [a + 2, 1]);
    const p2 = [['Control', 'Regression,\nMatching'], ['Check', 'Simulation'], ['Over time', 'Fixed effects,\nEvent studies,\nDiff-in-diff'], ['Outside push', 'Instrumental\nvariables'], ['Cutoffs', 'Regression\ndiscontinuity'], ['Ranges', 'Partial\nidentification']];
    const x2 = [220, 394, 568, 742, 916, 1090];
    const lines2 = ['Control for back doors with regression or matching.', 'Check any method with simulation.', 'Use change over time: fixed effects, event studies, and difference-in-differences.', 'Use an outside push: instrumental variables.', "Use a rule's cutoff: regression discontinuity.", 'Or settle for an honest range: partial identification.'];
    p2.forEach(([n, d], i) => {
      const s2 = pv(G(g), x2[i], 500);
      el('circle', { cx: x2[i], cy: 500, r: 20, fill: '#fff', stroke: C.Y, 'stroke-width': 7 }, s2);
      T(s2, x2[i], 552, n, { font: HEAD, size: 23, weight: 700 });
      d.split('\n').forEach((l, j) => T(s2, x2[i], 580 + j * 25, l, { size: 21 }));
      const at = S.line(lines2[i], .3);
      S.pop(s2, at); S.sfx(at, 'pop');
    });
    const beyond = note(g, 960, 690, 'Then: other methods, and what\nevery study sweeps under the rug', { size: 23, rot: 1.5 });
    a = S.line('Then a few more methods, and the problems every study sweeps under the rug.');
    S.pop(beyond, a); S.mood(a, 'happy');
    S.end();
  }
});

/* ---------------- Part 1: Ask and describe ---------------- */
chap({
  title: 'Ask, then describe', kicker: 'Part 1, chapters 1 to 4', short: 'Ask & describe', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'point');
    let a = S.line('Chapter one: design comes before data. Start with a question you could actually answer.');
    const vague = note(g, 640, 180, 'Does social media hurt sleep?', { size: 40, rot: -2 });
    a = S.line("'Does social media hurt sleep?' is too fuzzy. Hurt how? Whose sleep? Compared to what?");
    S.pop(vague, a - 2.5); S.sfx(a - 2.5, 'pop'); S.mood(a, 'skeptical');
    const qs = [['hurt how?', 360, 290], ['whose sleep?', 640, 300], ['compared to what?', 930, 290]].map(([s, x, y], i) => { const t = pv(G(g), x, y); T(t, x, y, s, { size: 32, fill: C.Y }); S.pop(t, a + 1 + i * .9); S.sfx(a + 1 + i * .9, 'pop'); return t; });
    a = S.line("Sharper: does an extra hour of Instagram after ten p.m. cut a teen's sleep that night?");
    qs.forEach(q => S.fadeOut(q, a, .3)); S.to(vague, 'o', a, .4, .35);
    const sharp = card(g, 640, 410, 900, 150, { rot: -1 });
    T(sharp.inner, 640, 400, 'Does an extra hour of Instagram after 10 p.m.', { size: 34 });
    T(sharp.inner, 640, 446, "cut a teen's sleep that night?", { size: 34 });
    S.pop(sharp, a + .2); S.sfx(a + .2, 'pin'); S.mood(a, 'happy');
    const tags = [['who: teens', C.X, 300], ['cause: 1 hour after 10 p.m.', C.ink, 640], ['outcome: sleep that night', C.Y, 1010]].map(([s, c, x], i) => { const ch = chip(g, x, 540, s, c, { size: 22 }); S.pop(ch, a + 2.4 + i * .5); return ch; });
    a = S.line('Now you know exactly what data you need, and what comparison would answer it.');
    S.sfx(a + 1, 'ding');
    a = S.line('Chapters three and four: describe before you explain.');
    clearAt(S, [vague, sharp, ...tags], a);
    const ch = chart(g, 600, 400, 860, 440, { xr: [0, 150], yr: [0, 1.08], xl: 'one-way commute (minutes)', yl: 'how many people' });
    S.pop(ch, a + .3);
    const bw = (ch.R - ch.L) / 15;
    const hs = [0, .12, .45, .9, 1, .82, .55, .36, .25, .17, .12, .09, .07, .05, .04];
    const bars = hs.map((h, i) => el('rect', { x: ch.L + i * bw + 3, width: bw - 6, y: ch.B, height: 0, fill: C.X, opacity: .82 }, ch.plot));
    a = S.line('Here are a thousand Bengaluru commutes. Most take thirty to fifty minutes, with a long tail of two-hour slogs.');
    S.fn(a, 2.5, p => bars.forEach((b, i) => { const q = EASE.o(clamp(p * 1.8 - i / 15, 0, 1)); b.setAttribute('y', ch.py(hs[i] * q)); b.setAttribute('height', ch.B - ch.py(hs[i] * q)); }));
    for (let i = 0; i < 6; i++) S.sfx(a + i * .3, 'drop', 400 + i * 60);
    const mkV = (v, col, lab, dy) => { const lg = G(ch.plot); el('line', { x1: ch.px(v), x2: ch.px(v), y1: ch.B, y2: ch.T - 4, stroke: col, 'stroke-width': 5, 'stroke-dasharray': '10 7' }, lg); T(lg, ch.px(v) + 10, ch.T + dy, lab, { size: 26, fill: col, anchor: 'start', weight: 700 }); return lg; };
    const med = mkV(44, C.ok, 'median 44', 14), mean = mkV(52, C.Y, 'mean 52', 48);
    a = S.line('The tail drags the mean up to fifty-two minutes. The median, forty-four, barely moves.');
    S.fadeIn(mean, a + .2); S.fadeIn(med, a + 2.6); S.sfx(a + .2, 'pin'); S.sfx(a + 2.6, 'pin');
    a = S.line('So look at the whole shape, not just one number.');
    a = S.line('Relationships too. On rainier days, the average commute climbs.');
    S.fadeOut(ch, a - .2, .4);
    const c2 = chart(g, 600, 400, 860, 440, { xr: [0, 40], yr: [20, 110], xl: 'rain that day (mm)', yl: 'average commute (min)' });
    S.pop(c2, a + .1);
    const r = rng(41), pts = [];
    for (let i = 0; i < 55; i++) { const x = Math.pow(r(), 1.6) * 38, y = 42 + .9 * x + gauss(r) * 7; pts.push([x, y]); el('circle', { cx: c2.px(x), cy: c2.py(y), r: 7, fill: C.ink, opacity: .65 }, c2.plot); }
    [5, 15, 25, 35].forEach((x, k) => { const sel = pts.filter(p => Math.abs(p[0] - x) < 5); if (!sel.length) return; const m = sel.reduce((s, p) => s + p[1], 0) / sel.length; const d = pv(G(c2.plot), c2.px(x), c2.py(m)); el('rect', { x: c2.px(x) - 13, y: c2.py(m) - 13, width: 26, height: 26, fill: C.hi, stroke: C.ink, 'stroke-width': 3, transform: `rotate(45 ${c2.px(x)} ${c2.py(m)})` }, d); S.pop(d, a + 2 + k * .5); S.sfx(a + 2 + k * .5, 'tick'); });
    a = S.line("That's a conditional mean: the average commute *given* the rain. It isn't a cause yet.");
    a = S.line('Rainy days might also be school days or festival days. Describing comes first; explaining comes next.');
    S.mood(a, 'happy');
    S.end();
  }
});

/* ---------------- Part 1: Identification ---------------- */
chap({
  title: 'Identification', kicker: 'Part 1, chapter 5', short: 'Identification', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'neutral');
    let a = S.line('Chapter five: identification.');
    const ch = chart(g, 620, 230, 920, 300, { xr: [0.5, 12.5], yr: [0, 1.1], xl: 'month', padB: 52 });
    const ice = [.2, .25, .45, .7, .9, 1, .95, .85, .6, .4, .25, .2], drn = [.15, .2, .35, .55, .8, .95, 1, .8, .5, .3, .2, .15];
    const mkL = (v, col) => el('path', { d: pathD(v.map((y, i) => [ch.px(i + 1), ch.py(y)])), stroke: col, 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round', pathLength: 1 }, ch.plot);
    const l1 = mkL(ice, C.X), l2 = mkL(drn, C.Y);
    T(ch.plot, ch.px(2.6), ch.py(.62), 'ice cream sales', { size: 24, fill: C.X, weight: 700 });
    T(ch.plot, ch.px(10.6), ch.py(.62), 'drownings', { size: 24, fill: C.Y, weight: 700 });
    a = S.line('Ice cream sales and drownings rise and fall together. Does ice cream drown people?');
    S.pop(ch, a); S.k(l1, 'd', [a + .3, 0], [a + 2, 1]); S.k(l2, 'd', [a + .6, 0], [a + 2.3, 1]); S.sfx(a + .3, 'string'); S.mood(a + 3, 'skeptical');
    const nH = node(g, 620, 470, 'H', 'summer heat', 'W'), nX = node(g, 400, 630, 'X', 'ice cream', 'X'), nY = node(g, 840, 630, 'Y', 'drownings', 'Y');
    const lh1 = link(g, nH, nX, { color: C.W }), lh2 = link(g, nH, nY, { color: C.W }), lq = link(g, nX, nY, { dash: '9 8', color: C.grey });
    a = S.line('No. Summer heat drives both.');
    [nX, nY].forEach((n, i) => S.pop(n, a + i * .3)); S.pop(nH, a + .8); S.draw(lh1, a + 1.1, .5); S.draw(lh2, a + 1.3, .5, false); S.fadeIn(lq.g, a + .6);
    const bar = G(g);
    T(bar, 1110, 452, 'why sales vary', { size: 26, weight: 700 });
    const segH = pv(G(bar), 1000, 490); el('rect', { x: 1000, y: 470, width: 170, height: 46, fill: C.Wl, stroke: C.ink, 'stroke-width': 2 }, segH); T(segH, 1085, 501, 'heat', { size: 24 });
    const segP = pv(G(bar), 1170, 490); el('rect', { x: 1170, y: 470, width: 80, height: 46, fill: C.hi, stroke: C.ink, 'stroke-width': 2 }, segP); T(segP, 1210, 501, 'deals', { size: 22 });
    a = S.line("Identification means finding the variation in ice cream sales that heat *can't* explain, and seeing whether drownings follow it.");
    S.fadeIn(bar, a + 1); S.mood(a, 'think');
    a = S.line("For example, compare days with the same temperature but different ice-cream deals. If drownings don't budge, ice cream is off the hook.");
    S.k(segH, 'x', [a + 1, 0], [a + 2, 160]); S.fadeOut(segH, a + 1.5, .5); S.to(segP, 'x', a + 2.2, .6, -85); S.sfx(a + 1, 'swoosh');
    a = S.line('Every design in this book is a way of finding that clean slice of variation.');
    S.mood(a, 'eureka'); S.sfx(a + .5, 'ding');
    S.end();
  }
});

/* shared coffee diagram */
function coffeeDAG(g) {
  const N = {
    X: node(g, 300, 420, 'C', 'coffee', 'X'), Y: node(g, 920, 420, 'O', 'work output', 'Y'),
    S: node(g, 460, 210, 'S', 'poor sleep', 'W'), D: node(g, 760, 210, 'D', 'deadline', 'W'), U: node(g, 610, 620, 'St', 'stress', 'U', { ls: 26 })
  };
  const L = {
    XY: link(g, N.X, N.Y), SX: link(g, N.S, N.X, { color: C.W }), SY: link(g, N.S, N.Y, { color: C.W }), DX: link(g, N.D, N.X, { color: C.W }), DY: link(g, N.D, N.Y, { color: C.W }),
    UX: link(g, N.U, N.X, { color: C.W, dash: '9 7' }), UY: link(g, N.U, N.Y, { color: C.W, dash: '9 7' })
  };
  return { N, L };
}

/* ---------------- Part 1: Causal diagrams ---------------- */
chap({
  title: 'Causal diagrams', kicker: 'Part 1, chapters 6 and 7', short: 'Causal diagrams', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'point');
    const { N, L } = coffeeDAG(g);
    let a = S.line('Chapters six and seven: causal diagrams. A picture of what causes what.');
    a = S.line("Say we ask: does coffee raise how much you get done? Put the cause and the outcome on the page.");
    S.pop(N.X, a + 2); S.pop(N.Y, a + 2.5); S.sfx(a + 2, 'pop'); S.draw(L.XY, a + 3.2, .6);
    a = S.line('Then everything that could push either one. Poor sleep makes you drink coffee, and also slows you down.');
    S.pop(N.S, a + 2); S.draw(L.SX, a + 3, .5); S.draw(L.SY, a + 4.2, .5, false);
    a = S.line('A deadline makes you reach for coffee, and also makes you work harder.');
    S.pop(N.D, a + .5); S.draw(L.DX, a + 1.5, .5); S.draw(L.DY, a + 2.7, .5, false);
    a = S.line("Stress matters too, but we can't measure it, so it gets a dashed circle.");
    S.pop(N.U, a + .8); S.fadeIn(L.UX.g, a + 1.5); S.fadeIn(L.UY.g, a + 1.7); S.mood(a, 'skeptical');
    const shoe = node(g, 1150, 600, 'Sh', 'shoe size', 'O', { ls: 24 });
    const sx = xMark(g, 1150, 600, 30);
    a = S.line("Leave out what doesn't matter. Shoe size can go.");
    S.pop(shoe, a); S.stamp(sx, a + 1.6); S.fadeOut(shoe, a + 2.6); S.fadeOut(sx, a + 2.6);
    a = S.line('Every arrow, and every missing arrow, is an assumption you should be able to defend.');
    S.mood(a, 'happy'); S.sfx(a + 1, 'ding');
    S.end();
  }
});

/* ---------------- Part 1: Paths, back doors, colliders ---------------- */
chap({
  title: 'Back doors and colliders', kicker: 'Part 1, chapter 8', short: 'Back doors', music: 'calm', menu: true, build(S) {
    const g = S.g, dg = G(g);
    S.place(VX, VY, 'point');
    const { N, L } = coffeeDAG(dg);
    S.fadeIn(dg, 2.5);
    let a = S.line('Chapter eight: paths. Any route between coffee and output is a path.');
    a = S.line('The direct arrow is a front door: it carries the effect we want.');
    S.glow(L.XY, a + .5, .5, .9, '#B7F5C8');
    a = S.line('Routes that begin with an arrow *into* coffee are back doors. Sleep and the deadline each open one.');
    ['SX', 'SY'].forEach(k => S.glow(L[k], a + 2.6, .4, .8, C.Wl)); ['DX', 'DY'].forEach(k => S.glow(L[k], a + 3.6, .4, .8, C.Wl)); S.sfx(a + 2.6, 'swoosh');
    a = S.line('Back doors mix other causes into the comparison. Close one by controlling for the variable on it.');
    const k1 = lockIcon(dg, 520, 165), k2 = lockIcon(dg, 820, 165);
    S.pop(k1, a + 3); S.pop(k2, a + 3.6); S.sfx(a + 3, 'click'); S.sfx(a + 3.6, 'click');
    ['SX', 'SY', 'DX', 'DY'].forEach(k => { S.fadeOut(L[k].glow, a + 4, .4); S.to(L[k].g, 'o', a + 4, .4, .3); });
    a = S.line('Stress is unmeasured, so its door stays open. Part two is full of ways around that problem.');
    S.glow(L.UX, a + .5, .4, .8, C.Wl); S.glow(L.UY, a + .5, .4, .8, C.Wl); S.mood(a, 'worried');
    a = S.line('One trap: colliders. Among people in general, talent and good looks are unrelated.');
    S.fadeOut(dg, a - .2, .4); S.mood(a, 'neutral');
    const ch = chart(g, 480, 400, 640, 450, { xr: [0, 1], yr: [0, 1], xl: 'talent', yl: 'looks' });
    S.pop(ch, a + .2);
    const r = rng(8), dots = [];
    for (let i = 0; i < 90; i++) { const x = r(), y = r(); dots.push({ x, y, e: el('circle', { cx: ch.px(x), cy: ch.py(y), r: 6.5, fill: C.ink, opacity: .6 }, ch.plot) }); }
    const nT = node(g, 930, 260, 'T', 'talent', 'O'), nL = node(g, 1190, 260, 'L', 'looks', 'O'), nF = node(g, 1060, 450, 'F', 'fame', 'W');
    const f1 = link(g, nT, nF), f2 = link(g, nL, nF);
    a = S.line('But both help make someone famous. Look only at famous actors, and the talented ones seem plainer.');
    [nT, nL, nF].forEach((n, i) => S.pop(n, a + i * .3)); S.draw(f1, a + 1, .5); S.draw(f2, a + 1.2, .5, false);
    S.fn(a + 3, .8, p => dots.forEach(d => { const famous = d.x + d.y > 1.25; d.e.setAttribute('fill', famous ? C.W : C.ink); d.e.setAttribute('opacity', famous ? .9 : (.6 - .45 * p).toFixed(2)); }));
    const fl = el('path', { d: `M${ch.px(.3)} ${ch.py(.98)} L${ch.px(.98)} ${ch.py(.32)}`, stroke: C.Y, 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1 }, ch.plot);
    S.k(fl, 'd', [a + 4.2, 0], [a + 5, 1]); S.sfx(a + 4.2, 'string'); S.mood(a + 3, 'surprised');
    const lk = lockIcon(g, 1120, 410); S.pop(lk, a + 3); 
    a = S.line('Fame is a collider. Controlling for it opens a path that was closed. So leave colliders alone.');
    S.mood(a, 'skeptical'); S.sfx(a + 2, 'buzz');
    S.end();
  }
});

/* ---------------- Part 1: Front doors ---------------- */
chap({
  title: 'Finding front doors', kicker: 'Part 1, chapter 9', short: 'Front doors', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'point');
    const { N, L } = coffeeDAG(g);
    Object.values(N).forEach(n => S.fadeIn(n, 2.4)); Object.values(L).forEach(l => S.fadeIn(l.g, 2.4));
    let a = S.line("Chapter nine: when you can't close a back door, find variation it can't reach.");
    a = S.line('The cleanest way is to randomize. Flip a coin to decide who gets coffee.');
    const nZ = node(g, 300, 640, '₹', 'coin flip', 'Z'), lz = link(g, nZ, N.X, { color: C.Z, w: 5 });
    S.pop(nZ, a + 2.4); S.draw(lz, a + 3, .5); S.sfx(a + 2.4, 'dice');
    a = S.line('Now sleep, deadlines and stress no longer point into coffee. Their back doors are cut.');
    ['SX', 'DX', 'UX'].forEach((k, i) => { const m = xMark(g, L[k].mid.x, L[k].mid.y, 16); S.stamp(m, a + 1.5 + i * .5); S.sfx(a + 1.5 + i * .5, 'snip'); S.to(L[k].g, 'o', a + 2 + i * .5, .3, .15); S.fadeOut(m, a + 3.5, .3); });
    S.glow(lz, a + 4, .4); S.glow(L.XY, a + 4, .4); S.mood(a + 2, 'eureka');
    a = S.line('No experiment? Look for a natural experiment: a rule or an accident that did the coin-flipping for you.');
    const ne = note(g, 1130, 150, 'The office coffee machine\nbreaks on random days', { size: 24, rot: 2 });
    a = S.line('Say the office coffee machine breaks on random days. Those days are your coin flips.');
    S.pop(ne, a); S.sfx(a, 'pin'); S.mood(a, 'happy');
    a = S.line('Or use the front-door method: if coffee works only through alertness, and nothing else touches alertness, trace the effect through it.');
    S.fadeOut(L.XY.g, a, .3); S.fadeOut(L.XY.glow, a, .3);
    const nA = node(g, 610, 420, 'A', 'alertness', 'M');
    const la = link(g, N.X, nA), lb = link(g, nA, N.Y);
    S.pop(nA, a + 3); S.draw(la, a + 3.4, .4); S.draw(lb, a + 3.8, .4, false); S.glow(la, a + 4.4, .4); S.glow(lb, a + 4.4, .4);
    S.end();
  }
});

/* ---------------- Part 1: Treatment effects ---------------- */
chap({
  title: 'Whose effect?', kicker: 'Part 1, chapter 10', sub: 'treatment effects', short: 'Treatment effects', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'neutral');
    const eff = [6, 0, 4, 1, 8, 2, 0, 3], on = [1, 0, 1, 0, 1, 1, 0, 0], comp = [2, 3, 7];
    const base = 470, k = 26;
    let a = S.line("Chapter ten: an effect isn't one number. It differs from person to person.");
    a = S.line("Take a fitness app's new streak feature. For some users it adds eight workouts a month; for others, none.");
    const people = [], bars = [];
    eff.forEach((e, i) => {
      const x = 220 + i * 120;
      const p = person(g, x, 560, C.grey); people.push(p); S.pop(p, a + i * .1);
      const ov = el('path', { d: p.body.getAttribute('d'), fill: C.X, stroke: C.ink, 'stroke-width': 2 }, p);
      S.k(ov, 'o', [0, 0], [0, 0]);
      p.ov = ov;
      const b = pv(G(g), x, base);
      el('rect', { x: x - 24, y: base - Math.max(e * k, 3), width: 48, height: Math.max(e * k, 3), rx: 4, fill: C.ok }, b);
      T(b, x, base - e * k - 10, '+' + e, { size: 24, weight: 700 });
      S.k(b, 'sy', [a + 2 + i * .25, 0], [a + 2.4 + i * .25, 1, 'back']); S.sfx(a + 2 + i * .25, 'drop', 400 + e * 50);
      bars.push(b);
    });
    el('line', { x1: 160, x2: 1120, y1: base, y2: base, stroke: C.ink, 'stroke-width': 3 }, g);
    const mk = (v, col, lab) => { const lg = G(g), y = base - v * k; el('line', { x1: 160, x2: 1120, y1: y, y2: y, stroke: col, 'stroke-width': 5, 'stroke-dasharray': '13 8' }, lg); el('rect', { x: 1130, y: y - 20, width: 120, height: 38, rx: 7, fill: col }, lg); T(lg, 1190, y + 8, lab, { size: 23, weight: 700, fill: col === C.hi ? C.ink : '#fff' }); return lg; };
    const ate = mk(3, C.ink, 'ATE 3.0'), att = mk(5, C.X, 'ATT 5.0'), late = mk(2.7, C.W, 'LATE 2.7');
    a = S.line('Average it over everyone and you get the average treatment effect, the ATE: three extra workouts.');
    S.fadeIn(ate, a + 2); S.sfx(a + 2, 'pin');
    a = S.line('Average over just the people who switched it on and you get the effect on the treated, the ATT: five. They chose it because it helps them.');
    people.forEach((p, i) => S.k(p.ov, 'o', [a, 0], [a + .4, on[i] ? 1 : 0]));
    bars.forEach((b, i) => { if (!on[i]) S.to(b, 'o', a + .4, .4, .25); });
    S.to(ate, 'o', a, .4, .25); S.fadeIn(att, a + 3); S.sfx(a + 3, 'pin');
    a = S.line('Average over the people a random prompt nudged into using it, and you get the local average treatment effect, the LATE: about two point seven.');
    bars.forEach((b, i) => S.k(b, 'o', [a, null], [a + .4, comp.includes(i) ? 1 : .2]));
    people.forEach((p, i) => S.k(p.ov, 'o', [a, null], [a + .4, 0]));
    const halos = comp.map(i => { const h = el('ellipse', { cx: 220 + i * 120, cy: 560, rx: 44, ry: 60, fill: 'none', stroke: C.W, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, g); S.fadeIn(h, a + .4); return h; });
    S.to(att, 'o', a, .4, .25); S.fadeIn(late, a + 4); S.sfx(a + 4, 'pin');
    a = S.line('Different designs recover different averages. Always ask: whose effect is this?');
    S.mood(a, 'happy'); S.sfx(a + 2, 'ding');
    S.end();
  }
});

/* ---------------- Part 1: Less modeling ---------------- */
chap({
  title: 'Causality with less modeling', kicker: 'Part 1, chapter 11', short: 'Less modeling', music: 'calm', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'neutral');
    const dg = G(g);
    const { N, L } = coffeeDAG(dg);
    const extra = [node(dg, 160, 210, 'E', 'economy', 'O', { r: 26 }), node(dg, 1100, 210, 'Te', 'team', 'O', { r: 26, ls: 22 }), node(dg, 1100, 620, 'M', 'mood', 'O', { r: 26 })];
    S.fadeIn(dg, 2.4);
    const fog = G(g), mid = 'm' + (++UID);
    const mask = el('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
    el('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff' }, mask);
    const hole = el('circle', { cx: 380, cy: 400, r: 0, fill: '#000' }, mask);
    fog.setAttribute('mask', `url(#${mid})`);
    el('rect', { x: 130, y: 60, width: 1140, height: 680, rx: 30, fill: '#F7FAF6', opacity: .9 }, fog);
    let a = S.line("Chapter eleven: you'll never know the whole diagram. And you don't need to.");
    S.fadeIn(fog, a + 1, 1); S.sfx(a + 1, 'wind'); S.mood(a, 'worried');
    a = S.line('Focus on what drives the treatment: the roads into it. That is where back doors begin.');
    S.fn(a + 1, 1.2, p => hole.setAttribute('r', (EASE.o(p) * 290).toFixed(1))); S.sfx(a + 1, 'click');
    ['SX', 'DX'].forEach(k => S.glow(L[k], a + 2, .4, .8, C.Wl)); S.mood(a, 'point');
    a = S.line('And test what you can. A placebo test checks for an effect that *should* be zero.');
    const pc = card(g, 960, 230, 480, 250, { rot: -1 });
    T(pc.inner, 960, 152, 'Placebo test', { font: HEAD, size: 32, weight: 700 });
    T(pc.inner, 960, 188, "today's coffee vs *yesterday's* output", { size: 24 });
    el('path', { d: 'M880 300 A80 80 0 0 1 1040 300', stroke: C.ink, 'stroke-width': 5, fill: 'none' }, pc.inner);
    T(pc.inner, 960, 330, '0', { size: 26, weight: 700 });
    const ndl = el('line', { x1: 960, y1: 300, x2: 960, y2: 235, stroke: C.Y, 'stroke-width': 5, 'stroke-linecap': 'round' }, pc.inner);
    el('circle', { cx: 960, cy: 300, r: 7, fill: C.ink }, pc.inner);
    S.pop(pc, a + 2);
    S.fn(a + 2.6, 1.8, p => ndl.setAttribute('transform', `rotate(${(-70 * Math.exp(-4 * p) * Math.cos(p * 14)).toFixed(1)} 960 300)`)); S.sfx(a + 2.6, 'ratchet');
    a = S.line("Coffee today can't change yesterday's output. If it seems to, something else is going on.");
    const ck = check(g, 1165, 135, 18); S.pop(ck, a + 2); S.sfx(a + 2, 'ding');
    a = S.line("Passing a placebo test doesn't prove you're right. Failing one tells you something is wrong.");
    S.mood(a, 'happy');
    S.end();
  }
});

/* ---------------- The bridge: how the designs fit together ---------------- */
chap({
  title: 'How the designs fit together', kicker: 'The bridge from Part 1 to Part 2', short: 'How it connects', music: 'bright', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'point');
    const dg = G(g);
    const nX = node(dg, 330, 420, 'X', 'treatment', 'X'), nY = node(dg, 930, 420, 'Y', 'outcome', 'Y'), nWm = node(dg, 630, 220, 'W', 'measured', 'W'), nU = node(dg, 630, 620, 'U', 'unmeasured', 'U');
    const lxy = link(dg, nX, nY), l1 = link(dg, nWm, nX, { color: C.W }), l2 = link(dg, nWm, nY, { color: C.W }), l3 = link(dg, nU, nX, { color: C.W, dash: '9 7' }), l4 = link(dg, nU, nY, { color: C.W, dash: '9 7' });
    let a = S.line("Part one leaves you here: a diagram with back doors. Some you can measure and close. Some you can't.");
    S.fadeIn(dg, a, .6);
    a = S.line('Part two is a set of templates for dealing with them. And they all answer one question.');
    a = S.line('Which part of the variation in the treatment do we keep?');
    S.to(dg, 'o', a, .4, .12);
    const vb = G(g);
    T(vb, 690, 255, 'why the treatment varies', { font: HEAD, size: 30, weight: 700 });
    S.fadeIn(vb, a + .8, .3);
    const segs = [['measured causes', C.Wl, 210], ['fixed traits', '#D9DEE6', 170], ['shared trends', C.sky, 170], ['outside push', C.Z, 170], ['a rule', '#BDEBCB', 120], ['noise', '#fff', 120]];
    let sx = 210;
    segs.forEach(([n, f, w], i) => { const s = pv(G(vb), sx + w / 2, 320); el('rect', { x: sx, y: 290, width: w, height: 60, fill: f, stroke: C.ink, 'stroke-width': 2.5 }, s); T(s, sx + w / 2, 328, n, { size: 22 }); S.pop(s, a + 1 + i * .35); sx += w; });
    S.sfx(a + 1, 'pop');
    a = S.line('Every design keeps a different slice, and throws away the slices that back doors can reach.');
    S.mood(a, 'think');
    a = S.line('Group them, and five families appear.');
    S.fadeOut(vb, a, .4); S.fadeOut(dg, a, .4);
    const fams = [
      ['Hold back doors\nfixed', ['Regression', 'Matching'], 'if you can measure\nevery back door', C.W],
      ['Compare a unit\nwith itself', ['Fixed effects', 'Event study', 'Diff-in-diff'], 'if confounders stay\nput, or trends match', C.grey],
      ['Use an outside\npush', ['Instrumental variables'], 'if the push reaches Y\nonly through X', C.Z],
      ["Use a rule's\nedge", ['Regression discont.'], 'if no one games\nthe cutoff', C.ok],
      ['Report a range', ['Partial identification'], "if you can't defend\nmore than that", C.X]
    ];
    const lines = [
      'One: measure the back doors and hold them fixed. Regression and matching. This works if you can see every confounder.',
      'Two: compare a unit with itself over time, or with a group that shares its trend. Fixed effects, event studies, and difference-in-differences.',
      'Three: find an outside push that moves the treatment. Instrumental variables.',
      "Four: use a rule's edge, where a cutoff decides who's treated. Regression discontinuity.",
      "Five: when nothing gives a clean slice, report a range. Partial identification."
    ];
    const famG = G(g);
    fams.forEach(([t, ds, cond, col], i) => {
      const x = 250 + i * 225;
      const c = card(famG, x, 330, 210, 360, { rot: [-1.5, 1, -1, 1.5, -.5][i] });
      el('rect', { x: x - 105, y: 150, width: 210, height: 12, fill: col }, c.inner);
      t.split('\n').forEach((l, j) => T(c.inner, x, 200 + j * 27, l, { font: HEAD, size: 20, weight: 700 }));
      ds.forEach((d, j) => { const w = Math.min(196, d.length * 10 + 22); el('rect', { x: x - w / 2, y: 262 + j * 44, width: w, height: 34, rx: 17, fill: col, opacity: .25 }, c.inner); T(c.inner, x, 285 + j * 44, d, { size: d.length > 18 ? 17 : 19 }); });
      cond.split('\n').forEach((l, j) => T(c.inner, x, 430 + j * 24, l, { size: 18, fill: C.grey }));
      const at = S.line(lines[i], .3);
      S.pop(c, at); S.sfx(at, 'pop');
    });
    const sim = card(famG, 700, 585, 1100, 70, { rot: .5, fill: C.note });
    T(sim.inner, 700, 597, 'Simulation: a test bench for whichever design you choose', { size: 26 });
    a = S.line('And simulation is the test bench: build a fake world with a known answer, and check any of them.');
    S.pop(sim, a); S.sfx(a, 'pin');
    a = S.line('Why does this short list cover so much ground? Because a back door can only be handled in a few ways.');
    S.mood(a, 'think');
    a = S.line('You can see it and control it. It can stay fixed, or be shared, so comparisons within cancel it. Or you can route around it, with an outside push or a rule.');
    a = S.line("If none of those hold, you bound the answer. So choosing a design is a short flowchart.");
    S.fadeOut(famG, a + 3, .4);
    const rows = [
      ['Can you randomize?', 'Run an experiment', C.ok],
      ['Can you measure every back door?', 'Regression, Matching', C.W],
      ['Same units over time, confounders stay put?', 'Fixed effects', C.grey],
      ['A clear start date, and a group it missed?', 'Event study, Diff-in-diff', C.grey],
      ['Something outside nudges the treatment?', 'Instrumental variables', C.Z],
      ['Treatment set by a score cutoff?', 'Regression discontinuity', C.ok],
      ['None of these?', 'Partial identification', C.X]
    ];
    const flow = G(g), ans = [];
    const rowLines = ['Randomize if you can.', 'If not: can you measure every back door?', 'Do you see the same units over time?', 'Is there a start date, and a group it missed?', 'Is there an outside push?', 'Or a cutoff?', 'If nothing fits, report a range.'];
    rows.forEach(([q, an, col], i) => {
      const y = 120 + i * 84, rg = G(flow);
      el('rect', { x: 150, y: y - 28, width: 570, height: 56, rx: 12, fill: '#fff', stroke: C.ink, 'stroke-width': 2.5 }, rg);
      T(rg, 170, y + 9, q, { size: 24, anchor: 'start' });
      el('path', { d: `M726 ${y} L790 ${y}`, stroke: C.ink, 'stroke-width': 3 }, rg);
      el('polygon', { points: `${800},${y} ${786},${y - 8} ${786},${y + 8}`, fill: C.ink }, rg);
      T(rg, 758, y - 8, 'yes', { size: 18, fill: C.grey });
      const ch = chip(rg, 810 + (an.length * 13 + 36) / 2, y, an, col, { size: 23, ink: col === C.Z ? C.ink : '#fff' });
      ans.push({ x: 810 + an.length * 13 + 36, y });
      if (i < rows.length - 1) { el('path', { d: `M190 ${y + 28} L190 ${y + 56}`, stroke: C.grey, 'stroke-width': 3 }, rg); T(rg, 200, y + 48, 'no', { size: 17, fill: C.grey, anchor: 'start' }); }
      const at = S.line(rowLines[i], .25);
      S.fadeIn(rg, at, .3); S.sfx(at, 'tick');
    });
    a = S.line('The designs also combine.');
    S.mood(a, 'eureka');
    const combo = (i1, i2, txt, at) => {
      const A = ans[i1], B = ans[i2], cx = Math.max(A.x, B.x) + 60 + (i2 - i1) * 8;
      const p = el('path', { d: `M${A.x + 6} ${A.y} C${cx} ${A.y} ${cx} ${B.y} ${B.x + 6} ${B.y}`, stroke: C.Y, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '8 6' }, g);
      S.fadeIn(p, at, .5);
      return p;
    };
    a = S.line('Difference-in-differences is fixed effects for both groups and time.');
    combo(2, 3, '', a + .5);
    a = S.line('A fuzzy cutoff turns regression discontinuity into an instrument.');
    combo(4, 5, '', a + .5);
    a = S.line('And matching can build a better comparison group for difference-in-differences.');
    combo(1, 3, '', a + .5);
    a = S.line("It isn't the whole story. Synthetic control, structural models and more wait in the gallery near the end.");
    S.mood(a, 'neutral');
    a = S.line('Now, each design, one at a time. Two cases each. Ready?');
    S.mood(a, 'happy'); S.sfx(a + 1, 'go');
    S.end();
  }
});
