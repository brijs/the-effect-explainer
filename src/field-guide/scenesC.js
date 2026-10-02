/* ============================================================
   SCENES C: more methods, what's under the rug, the finale
   ============================================================ */
chap({
  title: 'A gallery of other methods', kicker: 'Toolbox, chapter 22', short: 'Other methods', music: 'bright', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'point');
    let a = S.line('Chapter twenty-two: a gallery of other methods. Three quick portraits.');
    const P = [[300, 'Synthetic control', 'build a stand-in\nfrom a blend of others'], [690, 'Heterogeneous effects', 'who benefits\nthe most?'], [1080, 'Structural estimation', 'model the whole\nmachine with theory']];
    const cards = P.map(([x, n, s], i) => {
      const c = card(g, x, 370, 340, 520, { rot: [-1.5, 1, -1][i] });
      el('rect', { x: x - 140, y: 150, width: 280, height: 220, rx: 8, fill: '#F6F8FB', stroke: C.ink, 'stroke-width': 2 }, c.inner);
      T(c.inner, x, 420, n, { font: HEAD, size: n.length > 18 ? 21 : 25, weight: 700 });
      s.split('\n').forEach((l, j) => T(c.inner, x, 458 + j * 28, l, { size: 23, fill: C.grey }));
      S.pop(c, a + 1 + i * .4); S.sfx(a + 1 + i * .4, 'paper');
      return c;
    });
    a = S.line('Synthetic control. When one city adopts a policy, blend several other cities into a stand-in that tracked it closely before.');
    S.line('After the policy, the gap between the city and its blend is the effect.');
    const xs = [170, 200, 230, 260, 290, 320, 350, 380, 410], blend = xs.map((x, i) => 320 - i * 9);
    const others = [0, 1, 2, 3].map(k => xs.map((x, i) => blend[i] + [-42, 30, -18, 50][k] + Math.sin(i * 1.3 + k) * 10));
    const ol = others.map(() => el('path', { stroke: '#9AA3B0', 'stroke-width': 3, fill: 'none' }, cards[0].inner));
    S.fn(a + 3, 2, p => { const q = EASE.io(p); ol.forEach((e, k) => e.setAttribute('d', pathD(xs.map((x, i) => [x, lerp(others[k][i], blend[i], q)])))); });
    const city = el('path', { d: pathD(xs.map((x, i) => [x, i < 5 ? blend[i] - 2 : blend[i] - (i - 4) * 16])), stroke: C.X, 'stroke-width': 5, fill: 'none' }, cards[0].inner);
    const cc = clipRect(city, 165, 150, 0, 220); S.fn(a + 5.5, 1.6, p => cc.setAttribute('width', (260 * p).toFixed(1))); S.sfx(a + 3, 'blend');
    a = S.line('Heterogeneous effects. Instead of one average, let the data sort people into groups that respond differently. Maybe tutoring helps beginners the most.');
    const tn = [[690, 185], [630, 255], [750, 255], [600, 325], [660, 325], [720, 325], [780, 325]];
    [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([p, q], i) => { const l = el('line', { x1: tn[p][0], y1: tn[p][1], x2: tn[q][0], y2: tn[q][1], stroke: C.ink, 'stroke-width': 3 }, cards[1].inner); S.fadeIn(l, a + 2 + (q > 2 ? .8 : .2)); });
    tn.forEach(([x, y], i) => { const n = pv(G(cards[1].inner), x, y); el('circle', { cx: x, cy: y, r: 12, fill: i > 2 ? C.ok : C.grey }, n); if (i > 2) T(n, x, y + 34, ['+2', '+5', '+9', '+15'][i - 3], { size: 20, weight: 700 }); S.pop(n, a + 1.8 + (i === 0 ? 0 : i < 3 ? .5 : 1.2 + (i - 3) * .25)); if (i > 2) S.sfx(a + 3 + (i - 3) * .25, 'pop'); });
    a = S.line('Structural estimation. Write down a theory of how people decide, like how shoppers weigh price against distance, and fit it to data.');
    S.line('Then you can ask about policies nobody has tried yet.');
    const gear = (x, y, r, teeth) => { const gg = G(cards[2].inner); el('circle', { cx: x, cy: y, r, fill: 'none', stroke: C.grey, 'stroke-width': 14, 'stroke-dasharray': `${(Math.PI * r / teeth).toFixed(2)} ${(Math.PI * r / teeth).toFixed(2)}` }, gg); el('circle', { cx: x, cy: y, r: r - 7, fill: C.Z }, gg); el('circle', { cx: x, cy: y, r: 7, fill: C.ink }, gg); return gg; };
    const g1 = gear(1040, 250, 52, 12), g2 = gear(1128, 312, 34, 8);
    S.fn(a + 1, 8, p => { g1.setAttribute('transform', `rotate(${(p * 400).toFixed(1)} 1040 250)`); g2.setAttribute('transform', `rotate(${(-p * 610).toFixed(1)} 1128 312)`); }); S.sfx(a + 1, 'gear');
    S.mood(a, 'happy');
    S.end();
  }
});

chap({
  title: 'Under the rug', kicker: 'Toolbox, chapter 23', short: 'Under the rug', music: 'bright', menu: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'surprised');
    const rug = G(g);
    el('rect', { x: 260, y: 600, width: 860, height: 100, rx: 8, fill: C.Y }, rug);
    for (let i = 0; i < 5; i++) el('rect', { x: 260, y: 612 + i * 17, width: 860, height: 6, fill: i % 2 ? C.Z : '#fff', opacity: .7 }, rug);
    el('path', { d: 'M1120 600 L1120 700 L980 700 Z', fill: '#9E1B2C' }, rug);
    let a = S.line('Chapter twenty-three: every study sweeps something under the rug. Good researchers lift it and say what they found.');
    S.fadeIn(rug, 2.5); S.sfx(a + 1, 'rug');
    const items = [
      ['Which model?', 'two reasonable choices,\ntwo different answers'], ['Measuring the right thing?', 'is a test score\nreally learning?'], ['Missing data', 'who stopped answering,\nand why?'],
      ['Spillovers', "tutoring one child helps\nher deskmate too"], ['Fat tails', 'one billionaire can\nwreck an average'], ['What is the treatment?', '"tutoring" can mean\nmany different things']
    ];
    const lines = ['Which model? Two reasonable choices can give two different answers.', 'Are you measuring the right thing? A test score is not quite the same as learning.', 'Missing data: who stopped answering, and why?',
      'Spillovers: tutoring one child can help her deskmate too, which muddies the comparison.', 'Fat tails: one billionaire in the sample can wreck an average.', "And what exactly is the treatment? 'Tutoring' can mean many different things."];
    items.forEach(([t1, t2], i) => {
      const x = 310 + (i % 3) * 380, y = i < 3 ? 210 : 440;
      const c = pv(G(g), 1060, 650);
      el('circle', { cx: x - 120, cy: y, r: 26, fill: '#9AA1AB', stroke: '#9AA1AB', 'stroke-width': 9, 'stroke-dasharray': '2 4', 'stroke-linecap': 'round' }, c);
      el('circle', { cx: x - 128, cy: y - 4, r: 4.5, fill: '#fff' }, c); el('circle', { cx: x - 112, cy: y - 4, r: 4.5, fill: '#fff' }, c);
      const nt = note(c, x + 30, y, `${t1}\n${t2}`, { size: 22, w: 280, rot: i % 2 ? 1.5 : -1.5 });
      const at = S.line(lines[i], .3);
      S.k(c, 'o', [0, 0], [at, 0], [at + .1, 1, 'lin']);
      S.k(c, 's', [at, .2], [at + .6, 1, 'back']);
      S.sfx(at, 'squeak');
    });
    a = S.line("None of these sink a study by themselves. Hiding them does.");
    S.mood(a, 'happy'); S.sfx(a + 1, 'ding');
    S.end();
  }
});

scene({
  name: 'Finale', short: 'Finale', music: 'fin', menu: true, noFadeOut: true, noWhoosh: true, build(S) {
    const g = S.g;
    S.place(VX, VY, 'happy');
    S.sfx(0, 'swell');
    S.t = .8;
    let a = S.line('So, every design in the book is a way to find a fair comparison.');
    const core = pv(G(g), 690, 300);
    mtext(core, 690, 280, [['Find variation in ', C.ink], ['X', C.X]], { size: 64 });
    mtext(core, 690, 360, [["that back doors can't reach", C.ink]], { size: 52 });
    S.pop(core, a + .4); S.sfx(a + .4, 'pop');
    a = S.line('Part one tells you which comparisons would work. Part two gives you templates to make them. And honesty about the rug keeps you safe.');
    a = S.line("Keep asking why. Thanks for exploring with me!");
    S.mood(a, 'eureka'); S.sfx(a + .5, 'motifEnd');
    const night = el('rect', { x: 0, y: 0, width: W, height: H, fill: C.desk }, g);
    const nAt = S.t;
    S.k(night, 'o', [0, 0], [nAt, 0], [nAt + .8, .96]);
    const cr = G(g);
    const lines = [
      ['Based on', 250, HAND, 30, '#B9C3D6', 400],
      ['The Effect: An Introduction to Research Design and Causality', 300, HEAD, 38, '#FFFFFF', 700],
      ['by Nick Huntington-Klein. Free to read at theeffectbook.net', 352, HAND, 30, '#DDE3EE', 400],
      ['Explainer by Brijesh Shetty', 452, HEAD, 38, '#FFFFFF', 700],
      ['github.com/brijs', 500, HAND, 32, C.Z, 400],
      ['Narration: the open-source Kokoro speech model, voice "Heart"', 566, HAND, 26, '#9AA6BF', 400],
      ['All examples and numbers are made up for illustration.', 606, HAND, 26, '#9AA6BF', 400]
    ];
    lines.forEach(([s, y, f, size, fill, w], i) => { const t = T(cr, 690, y, s, { font: f, size, fill, weight: w }); S.fadeIn(t, nAt + .8 + i * .45, .6); });
    S.sfx(nAt, 'finalChord');
    S.t = nAt + 8.5;
    S.sfx(S.t - .4, 'click');
    S.end(1.2);
  }
});
