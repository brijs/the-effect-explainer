/* ============================================================
   SCENES B: the toolbox. Every design follows one rhythm:
   name -> definition -> when it applies -> picture it ->
   case 1 (pause) -> answer -> case 2 (pause) -> answer
   ============================================================ */
const SIDE = { cx: 1315, cy: 290, w: 420, h: 400, x0: 1130, x1: 1500, y0: 140, y1: 470 };

function bracketV(g, x, y1, y2, label, col, o) {
  o = o || {};
  const b = pv(G(g), x, (y1 + y2) / 2), dir = o.left ? -1 : 1;
  el('path', { d: `M${x - 8 * dir} ${y1} L${x} ${y1} L${x} ${y2} L${x - 8 * dir} ${y2}`, stroke: col || C.Y, 'stroke-width': 4, fill: 'none' }, b);
  if (label) {
    const w = label.length * 12 + 22, bx = o.left ? x - 12 - w : x + 12;
    el('rect', { x: bx, y: (y1 + y2) / 2 - 19, width: w, height: 36, rx: 7, fill: o.fill || C.hi, stroke: C.ink, 'stroke-width': 2 }, b);
    T(b, bx + w / 2, (y1 + y2) / 2 + 8, label, { size: 22, weight: 700 });
  }
  return b;
}
function miniAxes(g, L, R, Tp, B) {
  el('line', { x1: L, y1: B, x2: R, y2: B, stroke: C.ink, 'stroke-width': 2.5 }, g);
  el('line', { x1: L, y1: B, x2: L, y2: Tp, stroke: C.ink, 'stroke-width': 2.5 }, g);
}
function growBars(bars, p) { bars.forEach(b => { const q = EASE.o(clamp(p * 1.7 - b.k * .7, 0, 1)); b.e.setAttribute('y', b.base - b.h * q); b.e.setAttribute('height', Math.max(0, b.h * q)); }); }
function histBars(g, ch, x0, x1, n, mu, sd, peak, style) {
  const bw = (ch.px(x1) - ch.px(x0)) / n, out = [];
  for (let i = 0; i < n; i++) {
    const xv = x0 + (i + .5) * (x1 - x0) / n, h = (ch.B - ch.py(peak)) * Math.exp(-((xv - mu) ** 2) / (2 * sd * sd));
    out.push({ e: el('rect', Object.assign({ x: ch.px(x0) + i * bw + 2, width: bw - 4, y: ch.B, height: 0 }, style), ch.plot), h, base: ch.B, k: Math.abs(i - n / 2) / n });
  }
  return out;
}
function warn(g, x, y, text) { return note(g, x, y, '⚠ ' + text, { size: 24, rot: 2, color: C.Y, fill: '#FFF0F0' }); }

function designSeg(spec) {
  chap({
    title: spec.name, kicker: `Toolbox, chapter ${spec.ch}`, sub: spec.sub || '', short: spec.short, music: 'bright', menu: true, build(S) {
      const g = S.g;
      S.place(VX, VY, 'point');
      /* name and definition */
      const defG = G(g);
      const n = spec.words.length, xs = n === 1 ? [605] : [385, 825];
      let a = S.line(spec.nameLine);
      spec.words.forEach(([w, col], i) => { const c = chip(defG, xs[i], 135, w, col, { size: 34, ink: col === C.Z ? C.ink : '#fff' }); S.pop(c, a + .2 + i * .35); S.sfx(a + .2 + i * .35, 'pop'); });
      spec.words.forEach(([w, col, gloss], i) => {
        const at = S.line(spec.wordLines[i]);
        const nt = note(defG, xs[i], 240, gloss, { size: 23, w: n === 1 ? 520 : 380, rot: i ? 1.5 : -1.5 });
        const ar = el('path', { d: `M${xs[i]} 162 L${xs[i]} 180`, stroke: col, 'stroke-width': 4 }, defG);
        S.pop(nt, at + .1); S.fadeIn(ar, at + .1);
      });
      const dl = wrapText(spec.def, 60), dh = dl.length * 35 + 36;
      const dc = card(defG, 605, 398, 900, dh, { rot: -.5, fill: '#EEF3FF', stroke: C.X });
      dl.forEach((l, i) => T(dc.inner, 605, 398 - dh / 2 + 44 + i * 35, l, { size: 28 }));
      a = S.line(spec.def);
      S.pop(dc, a); S.sfx(a, 'pin');
      /* side picture */
      const side = card(g, SIDE.cx, SIDE.cy, SIDE.w, SIDE.h, { rot: 1 });
      T(side.inner, SIDE.cx, SIDE.cy - SIDE.h / 2 + 38, 'Picture it', { font: HEAD, size: 22, weight: 700, fill: C.grey });
      const sideG = G(side.inner);
      a = S.line(spec.sideLine);
      S.pop(side, a); S.sfx(a, 'paper');
      spec.side(S, sideG, a + .5);
      /* when it applies */
      const wh = T(defG, 160, 508, 'Use it when', { font: HEAD, size: 26, weight: 700, anchor: 'start' });
      a = S.line('Use it when:', .2);
      S.fadeIn(wh, a);
      spec.when.forEach((w, i) => {
        const y = 552 + i * 46, at = S.line(w, .25);
        const ck = check(defG, 178, y - 8, 14); S.pop(ck, at); S.sfx(at, 'tick');
        const tx = T(defG, 205, y, w, { size: 25, anchor: 'start' }); S.fadeIn(tx, at, .3);
      });
      S.fadeOut(defG, S.t, .4); S.wait(.5);
      /* the two cases */
      spec.cases.forEach((cs, ci) => {
        const ql = wrapText(cs.q, 47), h = 96 + ql.length * 42;
        const qc = card(g, 605, 380, 880, h, { rot: ci ? .8 : -.8, fill: ci ? '#FFF4F5' : '#F2F6FF', stroke: ci ? C.Y : C.X });
        chip(qc.inner, 245, 380 - h / 2 + 42, `Case ${ci + 1}`, ci ? C.Y : C.X, { size: 22 });
        T(qc.inner, 995, 380 - h / 2 + 62, cs.icon, { size: 56, font: 'sans-serif' });
        ql.forEach((l, i) => T(qc.inner, 605, 380 - h / 2 + 108 + i * 42, l, { size: 32 }));
        a = S.line(`Case ${ci + 1}. ${cs.q}`);
        S.pop(qc, a, .5); S.sfx(a, 'pop'); S.mood(a, 'neutral');
        const pAt = S.pause('think');
        const stk = note(g, 1185, 620, 'Your turn:\npause and think', { size: 26, rot: -3, fill: C.note });
        S.pop(stk, pAt - .2); S.fadeOut(stk, pAt + .5, .3);
        a = S.t;
        S.to(qc, 'y', a, .6, 150 - 380); S.to(qc, 's', a, .6, .6); S.sfx(a, 'swoosh'); S.mood(a + .3, 'point');
        S.wait(.5);
        const vg = G(g);
        S.fadeIn(vg, S.t - .1, .3);
        const tm = cs.narr.map(l => S.line(l));
        cs.vis(S, vg, tm);
        S.mood(tm[tm.length - 1] + .5, 'happy');
        S.fadeOut(qc, S.t, .4); S.fadeOut(vg, S.t, .4); S.wait(.6);
      });
      /* takeaway */
      a = S.line(spec.take);
      const tw = spec.take.split(' '); let bi = 1, bs = 1e9; for (let i = 1; i < tw.length; i++) { const sc2 = Math.max(tw.slice(0, i).join(' ').length, tw.slice(i).join(' ').length); if (sc2 < bs) { bs = sc2; bi = i; } }
      const tk = note(g, 605, 380, tw.slice(0, bi).join(' ') + '\n' + tw.slice(bi).join(' '), { size: 38, rot: -1.5, fill: C.note });
      S.pop(tk, a); S.sfx(a + .3, 'ding'); S.mood(a, 'eureka');
      S.k(side, 's', [a, 1], [a + .3, 1.05], [a + .6, 1]);
      S.end(1.6);
    }
  });
}

/* ================= Regression ================= */
designSeg({
  ch: 13, name: 'Regression', short: 'Regression', sub: 'hold measured back doors fixed',
  words: [['Regression', C.X, 'Galton saw tall parents\' children\n"go back" toward average height.\nThe tool that showed it kept the name.']],
  nameLine: "Regression. Let's start with the name.",
  wordLines: ["Francis Galton noticed that tall parents' children tended to 'go back', or regress, toward average height. The line-fitting tool that showed it kept the name."],
  def: 'Regression fits a line through the data, so you can compare outcomes across the treatment *while holding measured controls fixed*.',
  sideLine: 'Picture a line through the cloud of data, and a lock on every control.',
  side(S, g, t) {
    miniAxes(g, 1155, 1480, 165, 300);
    const r = rng(3);
    for (let i = 0; i < 24; i++) { const x = r(), y = .2 + .6 * x + (r() - .5) * .3; const d = el('circle', { cx: 1165 + x * 300, cy: 295 - y * 125, r: 5, fill: C.ink, opacity: .6 }, g); S.fadeIn(d, t + i * .03, .2); }
    const ln = el('path', { d: 'M1165 270 L1470 195', stroke: C.Y, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1 }, g);
    S.k(ln, 'd', [t + 1, 0], [t + 1.6, 1]);
    const nx = node(g, 1185, 420, 'X', null, 'X', { r: 22 }), ny = node(g, 1445, 420, 'Y', null, 'Y', { r: 22 }), nw = node(g, 1315, 350, 'W', null, 'W', { r: 22 });
    [nx, ny, nw].forEach((n, i) => S.pop(n, t + 2 + i * .2));
    [[nx, ny, C.ink], [nw, nx, C.W], [nw, ny, C.W]].forEach(([A, B, c], i) => S.draw(link(g, A, B, { color: c, w: 3 }), t + 2.6 + i * .2, .4, false));
    const lk = lockIcon(g, 1362, 322); S.pop(lk, t + 3.4); S.sfx(t + 3.4, 'click');
  },
  when: ['You can name and measure every back-door variable', 'The outcome changes in a shape you can model, like a line', 'Treated and untreated units overlap on those controls'],
  cases: [
    {
      icon: '☕', q: 'Chai stalls near metro stations sell ₹1,500 more a day. But those stalls also sit on busier roads. How would you estimate what the metro itself adds?',
      narr: ["Regress daily sales on 'near a metro', and add the road's foot traffic as a control.",
        'The control means we compare stalls with the *same* foot traffic, near a station and far from one.',
        "The raw gap of ₹1,500 shrinks to ₹500. That's the metro's effect, if foot traffic was the only back door."],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [0, 1000], yr: [1000, 6000], xl: 'foot traffic (people per hour)', yl: 'daily sales (₹)', tape: false });
        S.pop(ch, tm[0]);
        const r = rng(13), near = [], far = [];
        for (let i = 0; i < 26; i++) { const x = clamp(683 + gauss(r) * 120, 380, 980), y = 2000 + 3 * x + gauss(r) * 260; near.push(y); el('circle', { cx: ch.px(x), cy: ch.py(y), r: 7.5, fill: C.X, opacity: .85 }, ch.plot); }
        for (let i = 0; i < 26; i++) { const x = clamp(350 + gauss(r) * 120, 40, 700), y = 1500 + 3 * x + gauss(r) * 260; far.push(y); el('circle', { cx: ch.px(x), cy: ch.py(y), r: 7.5, fill: C.grey, opacity: .85 }, ch.plot); }
        T(ch.plot, ch.L + 20, ch.T + 10, 'near a metro', { size: 23, fill: C.X, weight: 700, anchor: 'start' });
        T(ch.plot, ch.L + 20, ch.T + 38, 'far from one', { size: 23, fill: C.grey, weight: 700, anchor: 'start' });
        const mn = 4050, mf2 = 2550;
        const raw = G(ch.plot);
        el('line', { x1: ch.px(820), x2: ch.px(990), y1: ch.py(mn), y2: ch.py(mn), stroke: C.X, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, raw);
        el('line', { x1: ch.px(820), x2: ch.px(990), y1: ch.py(mf2), y2: ch.py(mf2), stroke: C.grey, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, raw);
        bracketV(raw, ch.px(990), ch.py(mn), ch.py(mf2), 'raw ₹1,500', C.ink, { left: true });
        S.fadeIn(raw, tm[0] + 2.5);
        const l1 = el('path', { d: `M${ch.px(60)} ${ch.py(1500 + 180)} L${ch.px(980)} ${ch.py(1500 + 2940)}`, stroke: C.grey, 'stroke-width': 5, pathLength: 1 }, ch.plot);
        const l2 = el('path', { d: `M${ch.px(60)} ${ch.py(2000 + 180)} L${ch.px(980)} ${ch.py(2000 + 2940)}`, stroke: C.X, 'stroke-width': 5, pathLength: 1 }, ch.plot);
        S.k(l1, 'd', [tm[1], 0], [tm[1] + 1, 1]); S.k(l2, 'd', [tm[1] + .3, 0], [tm[1] + 1.3, 1]); S.sfx(tm[1], 'string');
        const br = bracketV(ch.plot, ch.px(500), ch.py(3000), ch.py(3500), '₹500', C.Y);
        S.pop(br, tm[1] + 2.5);
        S.fadeOut(raw, tm[2] + 1.5, .4, .2); S.k(br, 's', [tm[2] + 2, 1], [tm[2] + 2.3, 1.25], [tm[2] + 2.6, 1]); S.sfx(tm[2] + 2, 'ding');
      }
    },
    {
      icon: '😴', q: 'Students who sleep more score higher. But they also study less late at night, and fewer have part-time jobs. How would regression help, and what could still go wrong?',
      narr: ['Regress exam score on hours of sleep, controlling for late-night study and job hours.',
        'Each control closes one back door. The sleep slope now compares students who are alike on both.',
        "But stress, which we didn't measure, still drives both sleep and scores. Regression is only as good as its list of controls."],
      vis(S, g, tm) {
        const nX = node(g, 280, 470, 'S', 'hours of sleep', 'X'), nY = node(g, 930, 470, 'E', 'exam score', 'Y');
        const n1 = node(g, 440, 300, 'L', 'late-night study', 'W'), n2 = node(g, 770, 300, 'J', 'job hours', 'W'), nU = node(g, 605, 620, 'St', 'stress', 'U', { ls: 24 });
        [nX, nY, n1, n2].forEach((n, i) => S.pop(n, tm[0] + i * .3)); S.sfx(tm[0], 'pop');
        const L = [link(g, nX, nY), link(g, n1, nX, { color: C.W }), link(g, n1, nY, { color: C.W }), link(g, n2, nX, { color: C.W }), link(g, n2, nY, { color: C.W })];
        L.forEach((l, i) => S.draw(l, tm[0] + 1.5 + i * .25, .4, i === 0));
        const k1 = lockIcon(g, 490, 255), k2 = lockIcon(g, 820, 255);
        S.pop(k1, tm[1] + 1); S.pop(k2, tm[1] + 1.6); S.sfx(tm[1] + 1, 'click'); S.sfx(tm[1] + 1.6, 'click');
        L.slice(1).forEach(l => S.to(l.g, 'o', tm[1] + 2, .4, .25));
        S.glow(L[0], tm[1] + 2.4, .4, .8, '#B7F5C8');
        S.pop(nU, tm[2] + .5);
        const u1 = link(g, nU, nX, { color: C.W, dash: '9 7' }), u2 = link(g, nU, nY, { color: C.W, dash: '9 7' });
        S.fadeIn(u1.g, tm[2] + 1); S.fadeIn(u2.g, tm[2] + 1); S.glow(u1, tm[2] + 1.4, .4, .8, C.Wl); S.glow(u2, tm[2] + 1.4, .4, .8, C.Wl);
        const op = T(g, 700, 690, 'still open', { size: 28, fill: C.Y, weight: 700, anchor: 'start' }); S.fadeIn(op, tm[2] + 1.6); S.sfx(tm[2] + 1.6, 'buzz');
      }
    }
  ],
  take: "Regression closes the back doors you can measure. The ones you can't, stay open."
});

/* ================= Matching ================= */
designSeg({
  ch: 14, name: 'Matching', short: 'Matching', sub: 'compare look-alikes',
  words: [['Matching', C.X, 'Like pairing socks:\nfor every treated unit,\nfind an untreated twin.']],
  nameLine: 'Matching. The name says exactly what it does.',
  wordLines: ['Like pairing socks from the laundry. For every treated unit, find an untreated one that looks the same on the back-door variables.'],
  def: 'Matching pairs each treated unit with untreated look-alikes on the measured back-door variables, then compares outcomes within those pairs.',
  sideLine: 'Picture two columns of people, joined into pairs. Anyone without a twin sits out.',
  side(S, g, t) {
    const L = [190, 255, 320, 385], R = [180, 240, 300, 360, 420], pairs = [[0, 1], [1, 0], [2, 3], [3, 2]];
    const lp = L.map((y, i) => { const p = person(g, 1215, y + 15, C.X, { k: .6 }); S.pop(p, t + i * .15); return p; });
    const rp = R.map((y, i) => { const p = person(g, 1415, y + 15, C.grey, { k: .6 }); S.pop(p, t + .6 + i * .12); return p; });
    pairs.forEach(([i, j], k) => { const l = el('path', { d: `M1240 ${L[i] + 12} L1390 ${R[j] + 12}`, stroke: C.Z, 'stroke-width': 4, 'stroke-dasharray': '6 5' }, g); S.fadeIn(l, t + 1.8 + k * .3); });
    S.to(rp[4], 'o', t + 3.2, .4, .25);
    T(g, 1215, 462, 'treated', { size: 20, fill: C.X }); T(g, 1415, 462, 'untreated', { size: 20, fill: C.grey });
  },
  when: ['Treated and untreated groups differ on traits you can measure', 'Look-alikes exist on both sides (they overlap)', "You'd rather not assume a straight-line relationship"],
  cases: [
    {
      icon: '🏋️', q: 'A gym offers free personal training to members who ask. Trainer users lose more weight, but they tend to be younger and newer members. How would you use matching?',
      narr: ['Pair each trainer user with a non-user of the same age and the same months of membership.',
        'Compare weight change within each pair, then average across the pairs.',
        'Members with no look-alike are dropped. You learn the effect for users who have a fair comparison.'],
      vis(S, g, tm) {
        const Ld = [[24, 2], [31, 1], [45, 3], [38, 6]], Rd = [[52, 24], [31, 1], [25, 2], [38, 5], [61, 12], [45, 3]];
        const LY = [300, 390, 480, 570], RY = [290, 360, 430, 500, 570, 640], match = [2, 1, 5, 3], diff = ['−1.7', '−2.0', '−1.2', '−1.9'];
        T(g, 280, 255, 'trainer users', { size: 26, fill: C.X, weight: 700 }); T(g, 780, 255, 'everyone else', { size: 26, fill: C.grey, weight: 700 });
        Ld.forEach(([ag, m], i) => { const p = pv(G(g), 240, LY[i]); person(p, 240, LY[i], C.X, { k: .8 }); T(p, 275, LY[i] + 8, `age ${ag}, ${m} mo`, { size: 22, anchor: 'start' }); S.pop(p, tm[0] + i * .2); });
        const rg = Rd.map(([ag, m], j) => { const p = pv(G(g), 740, RY[j]); person(p, 740, RY[j], C.grey, { k: .8 }); T(p, 775, RY[j] + 8, `age ${ag}, ${m} mo`, { size: 22, anchor: 'start' }); S.pop(p, tm[0] + .8 + j * .15); return p; });
        match.forEach((j, i) => { const at = tm[0] + 3 + i * .5; S.k(rg[j], 'x', [at, 0], [at + .5, 480 - 740]); S.k(rg[j], 'y', [at, 0], [at + .5, LY[i] - RY[j]]); S.sfx(at, 'pop'); });
        [0, 4].forEach(j => S.to(rg[j], 'o', tm[2], .5, .15));
        const nm = T(g, 900, 300, 'no twin', { size: 26, fill: C.Y, weight: 700 }); S.fadeIn(nm, tm[2] + .3);
        diff.forEach((d, i) => { const c = chip(g, 995, LY[i], d + ' kg', C.ok, { size: 22 }); S.pop(c, tm[1] + .6 + i * .35); S.sfx(tm[1] + .6 + i * .35, 'tick'); });
        const av = note(g, 950, 660, 'average: −1.7 kg', { size: 28, rot: -2 }); S.pop(av, tm[1] + 2.6); S.sfx(tm[1] + 2.6, 'pin');
        S.fadeOut(nm, tm[2] + 4, .3);
      }
    },
    {
      icon: '💻', q: "Did a coding bootcamp raise graduates' salaries? Attendees had more work experience and more often lived in Bengaluru. How would you set up the comparison?",
      narr: ['Match each graduate to non-attendees with the same experience, city, degree and starting salary. Now the groups are balanced.',
        'Then compare salary growth: graduates grew twenty-two percent, their matches fourteen.',
        "Careful: motivation isn't on the list. If keener people enrol, matching can't fix that."],
      vis(S, g, tm) {
        const vars = [['years of experience', .8, .35], ['lives in Bengaluru', .75, .4], ['has a CS degree', .6, .45], ['starting salary', .7, .5]];
        const hd = T(g, 605, 268, 'graduates vs. comparison group', { font: HEAD, size: 26, weight: 700 }); S.fadeIn(hd, tm[0]);
        vars.forEach(([n, gv, ov], i) => {
          const y = 310 + i * 62;
          T(g, 430, y + 18, n, { size: 23, anchor: 'end' });
          const b1 = el('rect', { x: 445, y, width: gv * 420, height: 18, fill: C.X }, g);
          const b2 = el('rect', { x: 445, y: y + 21, width: ov * 420, height: 18, fill: C.grey }, g);
          S.fadeIn(b1, tm[0] + .3 + i * .2); S.fadeIn(b2, tm[0] + .3 + i * .2);
          S.fn(tm[0] + 4, 1.2, p => b2.setAttribute('width', (lerp(ov, gv - .02, EASE.io(p)) * 420).toFixed(1)));
        });
        const bal = chip(g, 960, 400, 'balanced', C.ok, { size: 22 }); S.pop(bal, tm[0] + 5.3); S.sfx(tm[0] + 5.3, 'ding');
        T(g, 430, 594, 'salary growth', { size: 24, anchor: 'end', weight: 700 });
        const s1 = pv(G(g), 445, 580); el('rect', { x: 445, y: 572, width: 22 * 12, height: 24, fill: C.X }, s1); T(s1, 445 + 264 + 10, 592, '+22% graduates', { size: 22, anchor: 'start' });
        const s2 = pv(G(g), 445, 610); el('rect', { x: 445, y: 602, width: 14 * 12, height: 24, fill: C.grey }, s2); T(s2, 445 + 168 + 10, 622, '+14% matches', { size: 22, anchor: 'start' });
        S.k(s1, 'sx', [tm[1], 0], [tm[1] + .6, 1, 'o']); S.k(s2, 'sx', [tm[1] + 1.2, 0], [tm[1] + 1.8, 1, 'o']);
        const mv = warn(g, 830, 680, 'motivation: not matched'); S.pop(mv, tm[2] + .5); S.sfx(tm[2] + .5, 'softBuzz');
      }
    }
  ],
  take: 'Matching compares like with like, but only on the traits you can see.'
});

/* ================= Simulation ================= */
designSeg({
  ch: 15, name: 'Simulation', short: 'Simulation', sub: 'test a method where you know the answer',
  words: [['Simulation', C.X, 'To simulate is to imitate:\nbuild a pretend world on a\ncomputer, where you set the truth.']],
  nameLine: 'Simulation. To simulate is to imitate.',
  wordLines: ['You build a pretend world on a computer, where *you* choose the true effect.'],
  def: 'Simulation creates many fake datasets with a known true effect, runs your method on each one, and checks whether it gets the truth back.',
  sideLine: 'Picture a dial set to the truth, a stack of fake datasets, and a pile of estimates around the dial.',
  side(S, g, t) {
    const dial = pv(G(g), 1195, 240);
    el('path', { d: 'M1150 260 A45 45 0 0 1 1240 260', stroke: C.ink, 'stroke-width': 4, fill: 'none' }, dial);
    el('line', { x1: 1195, y1: 260, x2: 1195, y2: 222, stroke: C.ok, 'stroke-width': 4, 'stroke-linecap': 'round' }, dial);
    T(dial, 1195, 292, 'truth', { size: 20, fill: C.ok });
    S.pop(dial, t);
    for (let i = 0; i < 4; i++) { const c = pv(G(g), 1330 + i * 12, 225 + i * 8); el('rect', { x: 1300 + i * 12, y: 200 + i * 8, width: 60, height: 44, rx: 4, fill: '#fff', stroke: C.ink, 'stroke-width': 2 }, c); for (let j = 0; j < 3; j++) el('line', { x1: 1306 + i * 12, x2: 1352 + i * 12, y1: 212 + i * 8 + j * 11, y2: 212 + i * 8 + j * 11, stroke: C.grey }, c); S.pop(c, t + .8 + i * .2); }
    el('path', { d: 'M1250 235 L1290 235', stroke: C.ink, 'stroke-width': 3 }, g);
    miniAxes(g, 1155, 1480, 320, 450);
    const ch = { px: v => 1165 + v / 20 * 305, py: v => 448 - v * 115, B: 448, plot: g };
    const bars = histBars(g, ch, 0, 20, 14, 10, 2.8, 1, { fill: C.X, opacity: .8 });
    S.fn(t + 2, 1.5, p => growBars(bars, p));
    el('line', { x1: ch.px(10), x2: ch.px(10), y1: 450, y2: 322, stroke: C.ok, 'stroke-width': 4, 'stroke-dasharray': '7 5' }, g);
  },
  when: ['You want to test a method before you trust it', 'The sample is small, or the design is complicated', 'You suspect a control or an assumption could bias the answer'],
  cases: [
    {
      icon: '🏪', q: "You plan to measure a discount's effect on sales, but you only have 30 stores. Will your estimate be precise enough to trust?",
      narr: ['Build a fake world: thirty stores, a true effect of plus five percent, and realistic noise.',
        'Run your analysis on a thousand fake versions. The estimates land anywhere from minus three to plus thirteen percent.',
        'Far too noisy. Before spending money, you know you need more stores.'],
      vis(S, g, tm) {
        const dc = card(g, 300, 470, 260, 260, { rot: -2, tape: false });
        T(dc.inner, 300, 385, 'true effect', { font: HEAD, size: 24, weight: 700 });
        T(dc.inner, 300, 470, '+5%', { font: HEAD, size: 64, weight: 700, fill: C.ok });
        T(dc.inner, 300, 525, '30 stores + noise', { size: 22, fill: C.grey });
        S.pop(dc, tm[0]); S.sfx(tm[0], 'dial');
        const ch = chart(g, 770, 480, 540, 430, { xr: [-8, 18], yr: [0, 1.25], xl: 'estimated effect (%)', tape: false, padL: 40 });
        S.pop(ch, tm[1]);
        const bars = histBars(g, ch, -8, 18, 20, 5, 4, 1, { fill: C.X, opacity: .82 });
        S.fn(tm[1] + .4, 2.2, p => growBars(bars, p)); S.sfx(tm[1] + .4, 'dice'); S.sfx(tm[1] + 1.4, 'dice');
        el('line', { x1: ch.px(5), x2: ch.px(5), y1: ch.B, y2: ch.T - 6, stroke: C.ok, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, ch.plot);
        const br = pv(G(ch.plot), ch.px(5), ch.T + 10);
        el('path', { d: `M${ch.px(-3)} ${ch.T + 22} L${ch.px(-3)} ${ch.T + 10} L${ch.px(13)} ${ch.T + 10} L${ch.px(13)} ${ch.T + 22}`, stroke: C.Y, 'stroke-width': 4, fill: 'none' }, br);
        T(br, ch.px(5), ch.T, '−3% to +13%', { size: 24, fill: C.Y, weight: 700 });
        S.k(br, 'sx', [tm[1] + 3, 0], [tm[1] + 3.6, 1, 'o']);
        const nd = warn(g, 300, 660, 'need more stores'); S.pop(nd, tm[2] + .4); S.sfx(tm[2] + .4, 'softBuzz');
      }
    },
    {
      icon: '🛵', q: 'A colleague wants to control for customer satisfaction when estimating how delivery speed affects repeat orders. Is that safe?',
      narr: ['Simulate a world where speed raises satisfaction, and satisfaction drives repeat orders. Set the true effect of speed at ten.',
        'Without the control, the estimates centre on ten. With it, they centre near two.',
        'Satisfaction sits on the path from speed to orders, so controlling for it hides most of the effect. The simulation caught the mistake before it was published.'],
      vis(S, g, tm) {
        const nX = node(g, 240, 320, 'S', 'speed', 'X', { r: 28 }), nM = node(g, 440, 320, 'Sa', 'satisfaction', 'M', { r: 28, ls: 22 }), nY = node(g, 640, 320, 'R', 'repeat orders', 'Y', { r: 28 });
        [nX, nM, nY].forEach((n, i) => S.pop(n, tm[0] + i * .3));
        S.draw(link(g, nX, nM), tm[0] + 1.2, .4); S.draw(link(g, nM, nY), tm[0] + 1.5, .4, false); S.draw(link(g, nX, nY, { bend: -.35 }), tm[0] + 1.8, .5, false);
        const ch = chart(g, 605, 560, 880, 290, { xr: [-4, 16], yr: [0, 1.2], xl: 'estimated effect of speed', tape: false, padB: 52, padT: 24 });
        S.pop(ch, tm[1]);
        el('line', { x1: ch.px(10), x2: ch.px(10), y1: ch.B, y2: ch.T, stroke: C.ok, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, ch.plot);
        T(ch.plot, ch.px(10) + 8, ch.T + 18, 'truth', { size: 22, fill: C.ok, anchor: 'start', weight: 700 });
        const A = histBars(g, ch, -4, 16, 22, 10, 1.4, 1, { fill: C.X, opacity: .8 }), B = histBars(g, ch, -4, 16, 22, 2, 1.4, 1, { fill: 'none', stroke: C.Y, 'stroke-width': 3 });
        S.fn(tm[1] + .2, 1.6, p => growBars(A, p)); S.fn(tm[1] + 2.4, 1.6, p => growBars(B, p));
        const la = T(ch.plot, ch.px(12.6), ch.py(.9), 'no control', { size: 22, fill: C.X, weight: 700, anchor: 'start' }), lb = T(ch.plot, ch.px(-3.6), ch.py(.9), 'with control', { size: 22, fill: C.Y, weight: 700, anchor: 'start' });
        S.fadeIn(la, tm[1] + 1); S.fadeIn(lb, tm[1] + 3.4); S.sfx(tm[1] + 3.4, 'buzz');
        const lk = lockIcon(g, 485, 285); S.pop(lk, tm[2] + .5);
        const xm = xMark(g, 485, 290, 26); S.stamp(xm, tm[2] + 2.5);
      }
    }
  ],
  take: 'When you know the answer, you can test the method.'
});

/* ================= Fixed effects ================= */
designSeg({
  ch: 16, name: 'Fixed Effects', short: 'Fixed effects', sub: 'compare each unit with itself',
  words: [['Fixed', C.Z, 'Traits of a unit that stay\nput over time: talent,\nlocation, personality.'], ['effects', C.X, 'The push those fixed\ntraits give the outcome.']],
  nameLine: "Fixed effects. Two words, and both matter.",
  wordLines: ["'Fixed' means traits of each unit that stay put over time, like a player's talent or a shop's location.",
    "'Effects' means the push those traits give the outcome. The design wipes out every fixed effect by comparing each unit only with itself."],
  def: 'Fixed effects compare each unit with itself at different times, so everything about it that never changes drops out.',
  sideLine: 'Picture three units at different heights. Slide each one to the same level, and only the change within each is left.',
  side(S, g, t) {
    miniAxes(g, 1155, 1480, 165, 455);
    const cols = [C.X, C.W, C.ok], base = [205, 305, 405], pts = [];
    cols.forEach((c, k) => [0, 1, 2, 3].forEach(j => { const x = 1180 + k * 100 + j * 18, y = base[k] + 20 - j * 10; const gh = el('circle', { cx: x, cy: y, r: 6.5, fill: 'none', stroke: c, 'stroke-width': 2, opacity: 0 }, g); S.k(gh, 'o', [0, 0], [t + 2.4, 0], [t + 2.8, .45]); const e = el('circle', { cx: x, cy: y, r: 6.5, fill: c }, g); pts.push({ e, x, y, k, j }); S.fadeIn(e, t + k * .4 + j * .08, .2); }));
    S.fn(t + 2.4, 1.4, p => pts.forEach(q => { const tx = 1290 + q.j * 18, ty = 320 - q.j * 10, e = EASE.io(clamp(p * 1.4 - q.k * .2, 0, 1)); q.e.setAttribute('cx', lerp(q.x, tx, e).toFixed(1)); q.e.setAttribute('cy', lerp(q.y, ty, e).toFixed(1)); }));
    const wl = el('path', { d: 'M1280 328 L1356 286', stroke: C.Y, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1 }, g);
    S.k(wl, 'd', [t + 4, 0], [t + 4.5, 1]);
    const lb = T(g, 1320, 380, 'change within each unit', { size: 21, fill: C.Y }); S.fadeIn(lb, t + 4.3);
  },
  when: ['You observe the same units again and again (panel data)', 'The worrying back doors are stable traits of each unit', 'Treatment switches on and off within units over time'],
  cases: [
    {
      icon: '🏏', q: 'Do cricketers score more runs in matches where they use a new bat? Better players are more likely to get the new bat first. How do you get a fair answer?',
      narr: ["Pooled together, new-bat innings average fifty-two runs and old-bat innings twenty-five. But stars dominate the new-bat column.",
        "So compare each player's new-bat runs with *their own* old-bat runs. Talent is fixed, so it cancels out.",
        "Each player gains about six runs. That's the bat. But anything that changes over time, like form or fitness, could still sneak in."],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [0, 9], yr: [0, 90], yl: 'runs per innings', tape: false, padB: 70 });
        S.pop(ch, tm[0]);
        const pl = [['star', 60, 1, 5], ['all-rounder', 35, 3, 3], ['tail-ender', 12, 5, 1]], r = rng(5);
        pl.forEach(([n, b, no, nn], k) => {
          const cx = 1.5 + k * 3;
          T(ch.plot, ch.px(cx), ch.B + 36, n, { size: 23, weight: 700 });
          for (let i = 0; i < no; i++) el('circle', { cx: ch.px(cx - .6) + (r() - .5) * 26, cy: ch.py(b + gauss(r) * 3), r: 8, fill: '#fff', stroke: C.grey, 'stroke-width': 3 }, ch.plot);
          for (let i = 0; i < nn; i++) el('circle', { cx: ch.px(cx + .6) + (r() - .5) * 26, cy: ch.py(b + 6 + gauss(r) * 3), r: 8, fill: C.X }, ch.plot);
          const br = bracketV(ch.plot, ch.px(cx + 1.15), ch.py(b + 6), ch.py(b), '+6', C.Y);
          S.pop(br, tm[1] + 3 + k * .5); S.sfx(tm[1] + 3 + k * .5, 'tick');
        });
        T(ch.plot, ch.R - 10, ch.T + 6, '○ old bat   ● new bat', { size: 22, anchor: 'end' });
        const pool = note(g, 330, 300, 'pooled: new 52, old 25', { size: 24, rot: -2, color: C.Y });
        S.pop(pool, tm[0] + 3.5); S.sfx(tm[0] + 3.5, 'softBuzz'); S.to(pool, 'o', tm[1] + 1, .4, .3);
        const fm = warn(g, 780, 300, 'form and fitness still change'); S.pop(fm, tm[2] + 4);
      }
    },
    {
      icon: '🍽️', q: "Restaurants get better ratings in months when they're listed on a delivery app. But fancier restaurants join apps more often. How would fixed effects help?",
      narr: ["Use restaurant fixed effects: compare each restaurant's ratings in its app months with its own months off the app.",
        "Fanciness, location and cuisine don't change month to month, so they drop out. Each restaurant gains about point two stars.",
        'A new chef or a renovation *does* change, so check for those separately.'],
      vis(S, g, tm) {
        const rs = [['Fancy Fork', 4.5, 3], ['Dosa Corner', 4.0, 6], ['Biryani Box', 3.6, 9]];
        T(g, 645, 268, 'one year, month by month (blue = on the app)', { size: 23, fill: C.grey });
        rs.forEach(([n, b, from], k) => {
          const y = 330 + k * 120, row = G(g);
          T(row, 300, y + 8, n, { size: 25, weight: 700, anchor: 'end' });
          for (let m = 0; m < 12; m++) {
            const on = m >= from, x = 318 + m * 56;
            el('rect', { x, y: y - 26, width: 52, height: 52, rx: 6, fill: on ? C.X : '#fff', stroke: C.ink, 'stroke-width': 1.5 }, row);
            T(row, x + 26, y + 8, (b + (on ? .2 : 0)).toFixed(1), { size: 19, fill: on ? '#fff' : C.ink });
          }
          S.fadeIn(row, tm[0] + k * .5);
          const arr = el('path', { d: `M${318 + (from - 1) * 56 + 26} ${y + 36} Q${318 + from * 56} ${y + 58} ${318 + (from + 1) * 56 + 26} ${y + 36}`, stroke: C.Y, 'stroke-width': 3, fill: 'none' }, g);
          S.fadeIn(arr, tm[1] + 3 + k * .3);
        });
        const fx = chip(g, 605, 690, 'fixed: fanciness, location, cuisine (cancel out)', C.Z, { size: 21, ink: C.ink });
        S.pop(fx, tm[1] + .4); S.sfx(tm[1] + .4, 'pop');
        const nc = warn(g, 870, 260, 'new chef in month 8?'); S.pop(nc, tm[2] + .4);
      }
    }
  ],
  take: "Compare each unit with itself, and whatever never changes about it disappears."
});

/* ================= Event studies ================= */
designSeg({
  ch: 17, name: 'Event Studies', short: 'Event studies', sub: 'before and after a clear moment',
  words: [['Event', C.Y, 'The moment the treatment\nswitches on.'], ['study', C.X, 'Track the outcome before\nand after that moment.']],
  nameLine: 'Event studies.',
  wordLines: ["The 'event' is the moment a treatment switches on.", "The 'study' tracks the outcome before and after that moment."],
  def: 'An event study compares what happens after a treatment starts with what the trend before it predicted would happen.',
  sideLine: 'Picture the trend before the event, extended forward as a forecast. The gap after the event is the effect.',
  side(S, g, t) {
    miniAxes(g, 1155, 1480, 165, 455);
    const xs = i => 1170 + i * 25, pre = [], post = [];
    for (let i = 0; i < 13; i++) { const y = 420 - i * 9 - (i >= 7 ? 55 : 0); const e = el('circle', { cx: xs(i), cy: y, r: 6, fill: C.X }, g); S.fadeIn(e, t + i * .12, .15); }
    const ev = el('line', { x1: xs(6.5), x2: xs(6.5), y1: 455, y2: 170, stroke: C.Y, 'stroke-width': 3.5, 'stroke-dasharray': '8 6' }, g); S.fadeIn(ev, t + .8);
    const pr = el('path', { d: `M${xs(0)} 420 L${xs(12)} ${420 - 108}`, stroke: C.grey, 'stroke-width': 3.5, 'stroke-dasharray': '8 6' }, g); S.fadeIn(pr, t + 2);
    const gp = el('path', { d: `M${xs(7)} ${420 - 63} L${xs(12)} ${420 - 108} L${xs(12)} ${420 - 163} L${xs(7)} ${420 - 118} Z`, fill: C.hi, opacity: .7 }, g);
    g.insertBefore(gp, g.firstChild); S.fadeIn(gp, t + 3, .4, .7);
  },
  when: ['There is a clear date when the treatment begins', 'You have data well before and well after that date', 'Nothing else big changes at the same moment'],
  cases: [
    {
      icon: '🚇', q: 'A new metro line opens on 1 March, running right beside a busy bus route. Did ridership on that bus route fall?',
      narr: ['Plot weekly bus riders for months before and after the opening.',
        "Fit the trend before March, and extend it forward as a forecast of a world with no metro.",
        'The gap between the forecast and actual riders, about four thousand a week, is the effect. And before March, the estimated effect hovers at zero, as it should.'],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [-10.5, 10.5], yr: [20, 40], xl: 'weeks before and after 1 March', yl: 'riders (thousands)', tape: false });
        S.pop(ch, tm[0]);
        const r = rng(17), pre = [], post = [];
        for (let w = -10; w <= 10; w++) { const y = 31 + .12 * w - (w >= 0 ? 4 : 0) + gauss(r) * .5; const e = el('circle', { cx: ch.px(w), cy: ch.py(y), r: 7, fill: C.X }, ch.plot); S.fadeIn(e, tm[0] + 1 + (w + 10) * .08, .15); (w < 0 ? pre : post).push([w, y]); }
        S.sfx(tm[0] + 1, 'tick'); S.sfx(tm[0] + 1.8, 'tick');
        const ev = el('line', { x1: ch.px(-.5), x2: ch.px(-.5), y1: ch.B, y2: ch.T, stroke: C.Y, 'stroke-width': 4, 'stroke-dasharray': '10 7' }, ch.plot);
        T(ch.plot, ch.px(-.5) + 8, ch.T + 18, 'metro opens', { size: 22, fill: C.Y, weight: 700, anchor: 'start' });
        S.fadeIn(ev, tm[0] + 2.8); S.sfx(tm[0] + 2.8, 'gong');
        const fp = fitLine(pre.map(p => p[0]), pre.map(p => p[1])), fq = fitLine(post.map(p => p[0]), post.map(p => p[1]));
        const pj = el('path', { d: `M${ch.px(-10)} ${ch.py(fp.a - 10 * fp.b)} L${ch.px(10)} ${ch.py(fp.a + 10 * fp.b)}`, stroke: C.grey, 'stroke-width': 4, 'stroke-dasharray': '10 8', fill: 'none' }, ch.plot);
        const pc = clipRect(pj, ch.L, ch.T - 10, 0, ch.B - ch.T + 20);
        S.fn(tm[1] + 1, 1.5, p => pc.setAttribute('width', ((ch.R - ch.L) * EASE.io(p)).toFixed(1))); S.sfx(tm[1] + 1, 'string');
        const gp = el('path', { d: pathD([[ch.px(0), ch.py(fq.a)], [ch.px(10), ch.py(fq.a + 10 * fq.b)], [ch.px(10), ch.py(fp.a + 10 * fp.b)], [ch.px(0), ch.py(fp.a)]]) + 'Z', fill: C.hi, opacity: 0 }, ch.plot);
        ch.plot.insertBefore(gp, ch.plot.firstChild);
        S.k(gp, 'o', [0, 0], [tm[2] + .5, 0], [tm[2] + 1, .75]);
        const gl = T(ch.plot, ch.px(5), ch.py(fp.a + 5 * fp.b - 2.2), '≈ 4,000 fewer a week', { size: 24, weight: 700 }); S.fadeIn(gl, tm[2] + 1);
        const ck = check(ch.plot, ch.px(-8), ch.T + 20, 14); const cl = T(ch.plot, ch.px(-8) + 24, ch.T + 28, 'zero before', { size: 22, fill: C.ok, weight: 700, anchor: 'start' });
        S.pop(ck, tm[2] + 6); S.fadeIn(cl, tm[2] + 6); S.sfx(tm[2] + 6, 'ding');
      }
    },
    {
      icon: '📱', q: 'A shopping app launched a redesign on one day in October, and daily orders went up. Was it the redesign?',
      narr: ['Line up daily orders around launch day, and compare them with the trend before launch.',
        "But October brings festival sales. If Diwali offers began the same week, an event study can't tell the two apart.",
        'Use a narrow window around the launch, and check what else changed that day. A clean event date is everything.'],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [-20.5, 20.5], yr: [80, 150], xl: 'days before and after the redesign', yl: 'orders (hundreds)', tape: false });
        S.pop(ch, tm[0]);
        const r = rng(19);
        const pts = []; for (let d = -20; d <= 20; d++) { const y = 100 + .2 * d + (d >= 0 ? 14 : 0) + (d >= 2 ? 12 : 0) + gauss(r) * 2; pts.push([ch.px(d), ch.py(y)]); }
        const ln = el('path', { d: pathD(pts), stroke: C.X, 'stroke-width': 4, fill: 'none', pathLength: 1 }, ch.plot);
        S.k(ln, 'd', [tm[0] + .8, 0], [tm[0] + 2.8, 1, 'lin']);
        const ev = el('line', { x1: ch.px(0), x2: ch.px(0), y1: ch.B, y2: ch.T, stroke: C.Y, 'stroke-width': 4, 'stroke-dasharray': '10 7' }, ch.plot); S.fadeIn(ev, tm[0] + 1.8);
        const band = el('rect', { x: ch.px(1), y: ch.T, width: ch.px(20) - ch.px(1), height: ch.B - ch.T, fill: '#FFB4A2', opacity: 0 }, ch.plot);
        ch.plot.insertBefore(band, ch.plot.firstChild);
        S.k(band, 'o', [0, 0], [tm[1] + 3, 0], [tm[1] + 3.5, .45]);
        const bl = T(ch.plot, ch.px(11), ch.T + 26, 'Diwali sale', { size: 26, fill: C.Y, weight: 700 }); S.fadeIn(bl, tm[1] + 3.4); S.sfx(tm[1] + 3.4, 'alarm');
        const win = el('rect', { x: ch.px(-3), y: ch.T, width: ch.px(1) - ch.px(-3), height: ch.B - ch.T, fill: 'none', stroke: C.ok, 'stroke-width': 5, rx: 8 }, ch.plot);
        S.pop(win, tm[2] + .8); const wl = T(ch.plot, ch.px(-1), ch.B - 12, 'narrow window', { size: 21, fill: C.ok, weight: 700 }); S.fadeIn(wl, tm[2] + 1);
      }
    }
  ],
  take: 'Before-and-after works when the trend is predictable and nothing else changed.'
});

/* ================= Difference-in-differences ================= */
designSeg({
  ch: 18, name: 'Difference-in-Differences', short: 'Diff-in-diff', sub: 'two groups, before and after',
  words: [['Difference', C.X, 'First: after minus before,\nwithin each group.'], ['in differences', C.Y, "Then: the treated group's\nchange minus the other\ngroup's change."]],
  nameLine: 'Difference-in-differences. The name is the recipe.',
  wordLines: ['The first difference: after minus before, within each group.',
    "The second: the treated group's change minus the untreated group's change. That subtracts whatever changed for everyone."],
  def: 'Difference-in-differences compares how much a treated group changed with how much a similar untreated group changed over the same period.',
  sideLine: 'Picture two lines moving together. After treatment, a ghost line shows where the treated group would have gone.',
  side(S, g, t) {
    miniAxes(g, 1155, 1480, 165, 455);
    const xs = i => 1170 + i * 52;
    const a = [0, 1, 2, 3, 4, 5, 6].map(i => [xs(i), 380 - i * 15 - (i >= 4 ? 45 : 0)]), b = [0, 1, 2, 3, 4, 5, 6].map(i => [xs(i), 430 - i * 15]);
    const la = el('path', { d: pathD(a), stroke: C.X, 'stroke-width': 4, fill: 'none', pathLength: 1 }, g), lb = el('path', { d: pathD(b), stroke: C.grey, 'stroke-width': 4, fill: 'none', pathLength: 1 }, g);
    S.k(la, 'd', [t, 0], [t + 1.6, 1, 'lin']); S.k(lb, 'd', [t, 0], [t + 1.6, 1, 'lin']);
    const gh = el('path', { d: pathD([a[3], [xs(6), 380 - 90]]), stroke: C.X, 'stroke-width': 3.5, 'stroke-dasharray': '8 6', fill: 'none', opacity: .7 }, g); S.fadeIn(gh, t + 2.2, .4, .7);
    const br = bracketV(g, xs(6) + 12, 380 - 135, 380 - 90, 'effect', C.Y, { left: true }); S.pop(br, t + 3);
  },
  when: ['A treated and an untreated group, both seen before and after', 'Both groups were trending in parallel before treatment', 'Nothing else hit only the treated group at the same time'],
  cases: [
    {
      icon: '🏬', q: "Karnataka raises the minimum wage for shop workers; a neighbouring state doesn't. Did shop jobs in Karnataka fall?",
      narr: ["Measure Karnataka's change in shop jobs, before versus after. Do the same for the neighbouring state.",
        'Karnataka fell by two percent. The neighbour fell by three percent, for reasons that had nothing to do with wages.',
        'Difference in differences: minus two, minus minus three, gives plus one percent. No sign the wage rise cut jobs, if the two states were trending together.'],
      vis(S, g, tm) {
        const tb = card(g, 605, 450, 820, 300, { tape: false });
        const cols = [470, 660, 850], rows = [380, 460, 540];
        ['before', 'after', 'change'].forEach((h, i) => T(tb.inner, cols[i] + 20, 345, h, { font: HEAD, size: 26, weight: 700, fill: C.grey }));
        T(tb.inner, 250, 425, 'Karnataka', { size: 28, weight: 700, anchor: 'start', fill: C.X }); T(tb.inner, 250, 505, 'Neighbour', { size: 28, weight: 700, anchor: 'start', fill: C.grey });
        el('line', { x1: 230, x2: 980, y1: 362, y2: 362, stroke: C.ink, 'stroke-width': 2 }, tb.inner);
        S.pop(tb, tm[0]);
        const cell = (x, y, s, at, col) => { const c = pv(G(tb.inner), x, y); T(c, x, y, s, { font: HEAD, size: 32, weight: 700, fill: col || C.ink }); S.pop(c, at); S.sfx(at, 'tick'); return c; };
        cell(cols[0] + 20, 433, '100', tm[0] + 1.5); cell(cols[1] + 20, 433, '98', tm[0] + 2); cell(cols[0] + 20, 513, '100', tm[0] + 3.5); cell(cols[1] + 20, 513, '97', tm[0] + 4);
        cell(cols[2] + 20, 433, '−2%', tm[1] + .5, C.X); cell(cols[2] + 20, 513, '−3%', tm[1] + 2.5, C.grey);
        const res = note(g, 605, 660, '(−2%) − (−3%) = +1%', { size: 36, rot: -1.5, fill: C.note });
        S.pop(res, tm[2] + 1); S.sfx(tm[2] + 1.6, 'ding');
      }
    },
    {
      icon: '📵', q: 'One school district bans phones in class from June; a nearby district does not. Test scores rise in both. Did the ban help?',
      narr: ['Compare the change in scores in the banning district with the change next door.',
        'Banning district: up eight points. Neighbour: up five. Difference in differences: three points.',
        'But first check earlier years. If the two districts moved in parallel before the ban, the neighbour is a fair stand-in.'],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [2020.5, 2025.5], yr: [50, 80], xl: 'year', yl: 'average score', tape: false });
        [2021, 2022, 2023, 2024, 2025].forEach(y => T(ch.plot, ch.px(y), ch.B + 22, String(y), { size: 20, fill: C.grey }));
        S.pop(ch, tm[0]);
        const A = [[2021, 60], [2022, 62], [2023, 64], [2024, 66], [2025, 74]], B = [[2021, 55], [2022, 57], [2023, 59], [2024, 61], [2025, 66]];
        const mk = (d, col) => el('path', { d: pathD(d.map(([x, y]) => [ch.px(x), ch.py(y)])), stroke: col, 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round', pathLength: 1 }, ch.plot);
        const la = mk(A, C.X), lb = mk(B, C.grey);
        S.k(la, 'd', [tm[0] + .8, 0], [tm[0] + 3, 1, 'lin']); S.k(lb, 'd', [tm[0] + .8, 0], [tm[0] + 3, 1, 'lin']);
        T(ch.plot, ch.px(2021), ch.py(60) - 16, 'banning district', { size: 22, fill: C.X, weight: 700, anchor: 'start' });
        T(ch.plot, ch.px(2021), ch.py(55) + 32, 'neighbour', { size: 22, fill: C.grey, weight: 700, anchor: 'start' });
        const ban = el('line', { x1: ch.px(2024.5), x2: ch.px(2024.5), y1: ch.B, y2: ch.T, stroke: C.Y, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, ch.plot); S.fadeIn(ban, tm[0] + 2);
        const gh = el('path', { d: pathD([[ch.px(2024), ch.py(66)], [ch.px(2025), ch.py(71)]]), stroke: C.X, 'stroke-width': 4, 'stroke-dasharray': '9 7', fill: 'none', opacity: .75 }, ch.plot);
        S.fadeIn(gh, tm[1] + 2.5, .4, .75);
        const br = bracketV(ch.plot, ch.px(2025) + 14, ch.py(74), ch.py(71), '+3', C.Y); S.pop(br, tm[1] + 4); S.sfx(tm[1] + 4, 'ding');
        const pre = el('rect', { x: ch.px(2020.8), y: ch.T + 30, width: ch.px(2024.2) - ch.px(2020.8), height: ch.B - ch.T - 40, rx: 12, fill: 'none', stroke: C.ok, 'stroke-width': 4 }, ch.plot);
        S.pop(pre, tm[2] + 2); const pl = T(ch.plot, ch.px(2022.5), ch.T + 22, 'parallel before', { size: 22, fill: C.ok, weight: 700 }); S.fadeIn(pl, tm[2] + 2.2);
      }
    }
  ],
  take: 'The untreated group tells you what would have happened anyway.'
});

/* ================= Instrumental variables ================= */
designSeg({
  ch: 19, name: 'Instrumental Variables', short: 'Instruments', sub: 'a fair push from outside',
  words: [['Instrumental', C.Z, 'An instrument is a tool:\nsomething that moves the\ntreatment from outside.'], ['variable', C.X, "And it's a variable:\nsomething we can measure."]],
  nameLine: 'Instrumental variables.',
  wordLines: ['An instrument is a tool: something outside the system that moves the treatment.', "And a variable, because it's something we can measure."],
  def: 'An instrumental variable shifts the treatment but reaches the outcome only through the treatment, so we keep just the variation it creates.',
  sideLine: 'Picture a push, Z, on the treatment. Back doors still tangle X and Y, but the push has no other road to Y.',
  side(S, g, t) {
    const nZ = node(g, 1170, 300, 'Z', null, 'Z', { r: 24 }), nX = node(g, 1310, 300, 'X', null, 'X', { r: 24 }), nY = node(g, 1455, 300, 'Y', null, 'Y', { r: 24 }), nU = node(g, 1383, 420, 'U', null, 'U', { r: 24 });
    [nZ, nX, nY, nU].forEach((n, i) => S.pop(n, t + i * .25));
    const lz = link(g, nZ, nX, { color: C.Z, w: 4 }), lxy = link(g, nX, nY, { w: 3 });
    S.draw(lz, t + 1.2, .4, false); S.draw(lxy, t + 1.4, .4, false);
    const u1 = link(g, nU, nX, { color: C.W, dash: '7 6', w: 3 }), u2 = link(g, nU, nY, { color: C.W, dash: '7 6', w: 3 });
    S.fadeIn(u1.g, t + 1.8); S.fadeIn(u2.g, t + 1.8);
    const sn = link(g, nZ, nY, { bend: -.35, color: C.grey, w: 3, dash: '6 6' }); S.fadeIn(sn.g, t + 2.6);
    const xm = xMark(g, sn.mid.x, sn.mid.y, 16); S.stamp(xm, t + 3);
    S.glow(lz, t + 3.6, .4); S.glow(lxy, t + 3.6, .4);
  },
  when: ["The treatment is tangled with things you can't measure", 'Some outside push changes who gets treated', 'That push has no other road to the outcome'],
  cases: [
    {
      icon: '🎟️', q: 'Does a top coaching institute raise entrance-exam scores? Students who join are more motivated. But seats go by lottery among applicants. How can you use that?',
      narr: ["The lottery is the instrument. It decides who gets a seat, and it can't know who's motivated.",
        'Lottery winners score three points higher on average. And winning raises the chance of joining by fifty percentage points.',
        'Divide: three points over one half gives six points. That is the effect for students whose choice the lottery actually changed.'],
      vis(S, g, tm) {
        const nZ = node(g, 240, 330, 'Z', 'seat lottery', 'Z'), nX = node(g, 560, 330, 'X', 'coaching', 'X'), nY = node(g, 880, 330, 'Y', 'exam score', 'Y'), nU = node(g, 720, 470, 'U', 'motivation', 'U');
        [nZ, nX, nY, nU].forEach((n, i) => S.pop(n, tm[0] + i * .3));
        const lz = link(g, nZ, nX, { color: C.Z, w: 5 }); S.draw(lz, tm[0] + 1.4, .5); S.draw(link(g, nX, nY), tm[0] + 1.8, .5, false);
        const u1 = link(g, nU, nX, { color: C.W, dash: '9 7' }), u2 = link(g, nU, nY, { color: C.W, dash: '9 7' }); S.fadeIn(u1.g, tm[0] + 2.2); S.fadeIn(u2.g, tm[0] + 2.2);
        const bars = G(g);
        const bar = (x, h, col, lab, val) => { const b = pv(G(bars), x, 690); el('rect', { x: x - 34, y: 690 - h, width: 68, height: h, fill: col }, b); T(b, x, 690 - h - 10, val, { size: 22, weight: 700 }); T(b, x, 714, lab, { size: 20 }); return b; };
        T(bars, 330, 575, 'joined coaching', { size: 23, weight: 700 }); T(bars, 760, 575, 'exam score', { size: 23, weight: 700 });
        const bs = [bar(280, 88, C.Z, 'winners', '80%'), bar(380, 33, C.grey, 'losers', '30%'), bar(710, 80, C.Z, 'winners', '63'), bar(810, 71, C.grey, 'losers', '60')];
        bs.forEach((b, i) => S.k(b, 'sy', [tm[1] + i * .5, 0], [tm[1] + .5 + i * .5, 1, 'back']));
        S.sfx(tm[1], 'pop'); S.sfx(tm[1] + 1, 'pop');
        S.fadeOut(bars, tm[2] + .2, .4);
        const fm = note(g, 560, 640, '3 points ÷ 0.5 = 6 points', { size: 40, rot: -1.5, fill: C.note });
        S.pop(fm, tm[2] + .5); S.sfx(tm[2] + 1.6, 'ding');
      }
    },
    {
      icon: '🌳', q: 'Do people exercise more when they live near a park? Fitter people may choose park-side homes. A city housing scheme assigns flats by lottery. Where is the instrument?',
      narr: ['The flat lottery. Some winners happen to land near a park, purely by chance.',
        'Use the lottery-assigned distance to a park as the instrument for actual distance.',
        "It works only if the lottery changes exercise through the park alone. If park-side flats also came with a gym, the instrument would fail."],
      vis(S, g, tm) {
        const map = G(g);
        el('rect', { x: 170, y: 270, width: 480, height: 430, rx: 14, fill: '#E9EEF3', stroke: C.ink, 'stroke-width': 2.5 }, map);
        el('rect', { x: 330, y: 400, width: 160, height: 150, rx: 16, fill: '#A8DDB5', stroke: C.ok, 'stroke-width': 3 }, map);
        T(map, 410, 482, '🌳 park', { size: 26, font: 'sans-serif' });
        const r = rng(23), hs = [];
        for (let i = 0; i < 18; i++) { let x, y; do { x = 195 + r() * 430; y = 295 + r() * 380; } while (x > 310 && x < 510 && y > 380 && y < 570); hs.push([x, y]); }
        hs.forEach(([x, y], i) => { const h = el('rect', { x: x - 11, y: y - 11, width: 22, height: 22, rx: 3, fill: i % 3 === 0 ? C.Z : '#fff', stroke: C.ink, 'stroke-width': 2 }, map); });
        S.fadeIn(map, tm[0]);
        const lg = chip(g, 410, 690, 'yellow = lottery winners', C.Z, { size: 20, ink: C.ink }); S.pop(lg, tm[0] + 1.5);
        const nZ = node(g, 820, 310, 'Z', 'flat lottery', 'Z', { r: 28 }), nX = node(g, 820, 470, 'X', 'distance to park', 'X', { r: 28 }), nY = node(g, 820, 630, 'Y', 'exercise', 'Y', { r: 28 }), nU = node(g, 990, 550, 'U', 'fitness', 'U', { r: 28 });
        [nZ, nX, nY, nU].forEach((n, i) => S.pop(n, tm[1] + i * .25));
        S.draw(link(g, nZ, nX, { color: C.Z, w: 5 }), tm[1] + 1.3, .4); S.draw(link(g, nX, nY), tm[1] + 1.6, .4, false);
        const u1 = link(g, nU, nX, { color: C.W, dash: '8 6' }), u2 = link(g, nU, nY, { color: C.W, dash: '8 6' }); S.fadeIn(u1.g, tm[1] + 2); S.fadeIn(u2.g, tm[1] + 2);
        const gym = pv(G(g), 680, 470); T(gym, 680, 485, '🏋️', { size: 44, font: 'sans-serif' }); T(gym, 680, 520, 'gym?', { size: 22, fill: C.Y, weight: 700 });
        S.pop(gym, tm[2] + 3); const gl = link(g, { x: 700, y: 460, r: 10 }, nY, { color: C.Y, dash: '6 6', bend: .2 }); S.fadeIn(gl.g, tm[2] + 3.4); S.sfx(tm[2] + 3.4, 'buzz');
      }
    }
  ],
  take: 'An instrument is a fair push from outside. Keep only the variation it moves.'
});

/* ================= Regression discontinuity ================= */
designSeg({
  ch: 20, name: 'Regression Discontinuity', short: 'Discontinuity', sub: 'just above and just below a cutoff',
  words: [['Regression', C.X, 'Fit a line on each side\nof the cutoff.'], ['discontinuity', C.Y, 'A break, or a jump,\nright at the cutoff.']],
  nameLine: 'Regression discontinuity.',
  wordLines: ["'Regression': fit a line on each side of a cutoff.", "'Discontinuity': a sudden break in the line, right at the cutoff. The size of that jump is the effect."],
  def: "When a cutoff on some score decides who is treated, compare units just above and just below it. The jump at the cutoff is the effect.",
  sideLine: 'Picture dots climbing smoothly, then a jump at the cutoff, where treatment switches on.',
  side(S, g, t) {
    miniAxes(g, 1155, 1480, 165, 455);
    const cx = 1320, r = rng(31);
    for (let i = 0; i < 40; i++) { const x = 1165 + r() * 305, y = 430 - (x - 1165) * .55 - (x > cx ? 60 : 0) + (r() - .5) * 30; const e = el('circle', { cx: x, cy: y, r: 5, fill: C.ink, opacity: .55 }, g); S.fadeIn(e, t + i * .02, .2); }
    const cl = el('line', { x1: cx, x2: cx, y1: 455, y2: 170, stroke: C.Y, 'stroke-width': 4 }, g); S.fadeIn(cl, t + 1);
    const l1 = el('path', { d: `M1165 430 L${cx} ${430 - (cx - 1165) * .55}`, stroke: C.grey, 'stroke-width': 4.5, pathLength: 1 }, g), l2 = el('path', { d: `M${cx} ${430 - (cx - 1165) * .55 - 60} L1470 ${430 - 305 * .55 - 60}`, stroke: C.X, 'stroke-width': 4.5, pathLength: 1 }, g);
    S.k(l1, 'd', [t + 1.6, 0], [t + 2.2, 1]); S.k(l2, 'd', [t + 2.2, 0], [t + 2.8, 1]);
    const br = bracketV(g, cx - 8, 430 - (cx - 1165) * .55 - 60, 430 - (cx - 1165) * .55, 'jump', C.Y, { left: true }); S.pop(br, t + 3.2);
  },
  when: ['Treatment is assigned by a cutoff on a score', "People can't precisely control which side they land on", 'Nothing else changes at that exact cutoff'],
  cases: [
    {
      icon: '🎓', q: 'A scholarship goes to every student scoring 85 or more on a test. Does the scholarship raise college graduation?',
      narr: ['Plot graduation rates against test scores, and fit a line on each side of eighty-five.',
        'Students at eighty-four and eighty-six are nearly identical, except one has the scholarship. The jump, nine points, is its effect.',
        'Then check for bunching. If students could nudge their scores over eighty-five, the comparison would break. Here, the counts are smooth.'],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [60, 100], yr: [40, 100], xl: 'test score', yl: 'graduation rate (%)', tape: false });
        S.pop(ch, tm[0]);
        const f = x => 48 + .7 * (x - 60) + (x >= 85 ? 9 : 0);
        for (let x = 61; x < 100; x += 1.5) { const e = el('circle', { cx: ch.px(x), cy: ch.py(f(x) + Math.sin(x * 3) * 2.5), r: 7, fill: C.ink, opacity: .6 }, ch.plot); S.fadeIn(e, tm[0] + 1 + (x - 61) * .03, .2); }
        const cl = el('line', { x1: ch.px(85), x2: ch.px(85), y1: ch.B, y2: ch.T, stroke: C.Y, 'stroke-width': 5 }, ch.plot); S.fadeIn(cl, tm[0] + 2.4); S.sfx(tm[0] + 2.4, 'thwack');
        T(ch.plot, ch.px(85) + 8, ch.T + 18, 'cutoff 85', { size: 22, fill: C.Y, weight: 700, anchor: 'start' });
        const l1 = el('path', { d: `M${ch.px(60.5)} ${ch.py(f(60.5))} L${ch.px(85)} ${ch.py(f(84.99))}`, stroke: C.grey, 'stroke-width': 6, pathLength: 1 }, ch.plot), l2 = el('path', { d: `M${ch.px(85)} ${ch.py(f(85))} L${ch.px(99.5)} ${ch.py(f(99.5))}`, stroke: C.X, 'stroke-width': 6, pathLength: 1 }, ch.plot);
        S.k(l1, 'd', [tm[0] + 3.4, 0], [tm[0] + 4, 1]); S.k(l2, 'd', [tm[0] + 4, 0], [tm[0] + 4.6, 1]); S.sfx(tm[0] + 3.4, 'string');
        const band = el('rect', { x: ch.px(83), y: ch.T, width: ch.px(87) - ch.px(83), height: ch.B - ch.T, fill: C.hi, opacity: 0 }, ch.plot); ch.plot.insertBefore(band, ch.plot.firstChild);
        S.k(band, 'o', [0, 0], [tm[1] + 1, 0], [tm[1] + 1.4, .7]);
        const br = bracketV(ch.plot, ch.px(85) - 10, ch.py(f(85)), ch.py(f(84.99)), '+9', C.Y, { left: true }); S.pop(br, tm[1] + 4); S.sfx(tm[1] + 4, 'ding');
        const mini = card(g, 890, 320, 220, 130, { rot: 2, tape: false });
        [5, 5, 6, 5, 6, 5, 5, 6].forEach((h, i) => el('rect', { x: 800 + i * 23, y: 360 - h * 9, width: 19, height: h * 9, fill: C.grey }, mini.inner));
        T(mini.inner, 890, 282, 'students per score', { size: 18 });
        S.pop(mini, tm[2] + 4); const ck = check(g, 980, 270, 14); S.pop(ck, tm[2] + 5); S.sfx(tm[2] + 5, 'ding');
      }
    },
    {
      icon: '🧾', q: 'Shops with yearly turnover above ₹40 lakh must register for GST. Does registering cut profits? What would you check first?',
      narr: ['The plan: compare the profits of shops just below and just above ₹40 lakh.',
        "But first, count the shops near the line. There's a pile-up just under it. Owners are keeping turnover low on purpose.",
        "That's manipulation. Shops just below aren't like shops just above, so this cutoff won't give a clean answer."],
      vis(S, g, tm) {
        const ch = chart(g, 605, 485, 880, 440, { xr: [20, 60], yr: [0, 1.15], xl: 'yearly turnover (₹ lakh)', yl: 'number of shops', tape: false });
        S.pop(ch, tm[0]);
        const cl = el('line', { x1: ch.px(40), x2: ch.px(40), y1: ch.B, y2: ch.T, stroke: C.Y, 'stroke-width': 5 }, ch.plot); S.fadeIn(cl, tm[0] + .8);
        T(ch.plot, ch.px(40) + 8, ch.T + 18, 'GST threshold', { size: 22, fill: C.Y, weight: 700, anchor: 'start' });
        const hs = [], bw = (ch.R - ch.L) / 20;
        for (let i = 0; i < 20; i++) { const x = 20 + i * 2 + 1; let h = .55 - (x - 20) * .006; if (x > 36 && x < 40) h = 1.05; if (x > 40 && x < 44) h = .3; hs.push({ e: el('rect', { x: ch.L + i * bw + 3, width: bw - 6, y: ch.B, height: 0, fill: x > 36 && x < 40 ? C.Y : C.grey }, ch.plot), h: ch.B - ch.py(h), base: ch.B, k: i / 40 }); }
        S.fn(tm[1] + 1, 2, p => growBars(hs, p)); S.sfx(tm[1] + 3, 'alarm');
        const pl = T(ch.plot, ch.px(33), ch.py(1.08), 'pile-up', { size: 26, fill: C.Y, weight: 700 }); S.fadeIn(pl, tm[1] + 3);
        const xm = xMark(g, 800, 400, 40); S.stamp(xm, tm[2] + 3);
      }
    }
  ],
  take: 'Near a strict cutoff, chance decides the side. Unless people can game it.'
});

/* ================= Partial identification ================= */
designSeg({
  ch: 21, name: 'Partial Identification', short: 'Bounds', sub: 'an honest range instead of one number',
  words: [['Partial', C.Z, 'We pin down only part\nof the answer: a range.'], ['identification', C.X, 'Working out the effect\nfrom data plus\nassumptions.']],
  nameLine: 'Partial identification.',
  wordLines: ["'Identification' means pinning down the effect from data plus assumptions. 'Partial' means you only pin down part of it.", 'So instead of a single number, you get a range, and you can see what each assumption buys you.'],
  def: 'Partial identification reports the range of effects that fit the data under weak assumptions, and shows how each extra assumption narrows it.',
  sideLine: 'Picture a wide bar. Each assumption you add squeezes it tighter.',
  side(S, g, t) {
    el('line', { x1: 1155, x2: 1480, y1: 330, y2: 330, stroke: C.ink, 'stroke-width': 3 }, g);
    const bar = el('rect', { y: 300, height: 30, rx: 6, fill: C.X, opacity: .8 }, g);
    const tags = [['assumption 1', 380], ['assumption 2', 430]].map(([s, y], i) => { const c = chip(g, 1315, y, s, C.Z, { size: 19, ink: C.ink }); S.pop(c, t + 1.5 + i * 1.3); return c; });
    S.fn(t, 4.5, (p, tt) => { const q = tt - t; let a = 1165, b = 1470; if (q > 1.6) { const k = EASE.io(clamp((q - 1.6) / .8, 0, 1)); a = lerp(1165, 1215, k); b = lerp(1470, 1400, k); } if (q > 2.9) { const k = EASE.io(clamp((q - 2.9) / .8, 0, 1)); a = lerp(1215, 1265, k); b = lerp(1400, 1340, k); } bar.setAttribute('x', a); bar.setAttribute('width', b - a); bar.style.display = q > 0 ? '' : 'none'; });
  },
  when: ["Strong assumptions aren't believable", "Data are missing, or selection can't be fixed", 'An honest range is more useful than a shaky number'],
  cases: [
    {
      icon: '📋', q: "A job-training program surveyed participants' wages, but thirty percent never replied. What can you honestly say about the program's effect on wages?",
      narr: ['Fill the gaps with the worst case and the best case: non-repliers earn the least possible, or the most.',
        'That gives a wide range. The effect is somewhere between minus ₹2,000 and plus ₹6,000 a month.',
        "Add one believable assumption, that non-repliers earn no more than repliers, and the range tightens to between zero and plus ₹3,000."],
      vis(S, g, tm) {
        const c = card(g, 605, 470, 860, 280, { tape: false });
        const px = v => 230 + (v + 3000) / 10000 * 750;
        el('line', { x1: 210, x2: 1000, y1: 500, y2: 500, stroke: C.ink, 'stroke-width': 3 }, c.inner);
        for (let v = -3000; v <= 7000; v += 2000) { el('line', { x1: px(v), x2: px(v), y1: 490, y2: 510, stroke: C.ink, 'stroke-width': 2.5 }, c.inner); T(c.inner, px(v), 540, v === 0 ? '₹0' : (v > 0 ? '+₹' : '−₹') + Math.abs(v / 1000) + 'k', { size: 21 }); }
        T(c.inner, 605, 380, 'effect on monthly wages', { size: 24, fill: C.grey });
        S.pop(c, tm[0]);
        const bar = el('rect', { y: 455, height: 32, rx: 7, fill: C.X, opacity: .85 }, g);
        const lo = T(g, 0, 440, '', { size: 23, weight: 700 }), hi = T(g, 0, 440, '', { size: 23, weight: 700 });
        const t1 = tm[1], t2 = tm[2] + 2.5;
        S.fn(0, 999, (p, tt) => {
          const vis = tt > t1; [bar, lo, hi].forEach(e => e.style.display = vis ? '' : 'none');
          const k = EASE.io(clamp((tt - t2) / .9, 0, 1)), a = lerp(-2000, 0, k), b = lerp(6000, 3000, k);
          bar.setAttribute('x', px(a)); bar.setAttribute('width', px(b) - px(a));
          lo.setAttribute('x', px(a)); hi.setAttribute('x', px(b));
          lo.textContent = (a < 0 ? '−' : '') + '₹' + Math.abs(Math.round(a / 100) * 100).toLocaleString('en-IN'); hi.textContent = '+₹' + (Math.round(b / 100) * 100).toLocaleString('en-IN');
        });
        S.sfx(t1, 'burst');
        const as = note(g, 605, 660, "assume: non-repliers earn no more than repliers", { size: 25, rot: -1, fill: C.note });
        S.pop(as, tm[2] + 1.5); S.sfx(t2, 'creak'); S.sfx(t2 + 1, 'ding');
      }
    },
    {
      icon: '🚦', q: 'A city adds a traffic signal, and reported accidents drop. But many minor accidents never get reported. Did the signal really reduce accidents?',
      narr: ["We don't know how many accidents went unreported, before or after.",
        "Assume only that reporting didn't *fall* after the signal went in. Then the true drop is at least as big as the reported drop.",
        "That's a one-sided bound: the signal cut accidents by at least twelve percent. Honest, and still useful."],
      vis(S, g, tm) {
        const base = 655;
        const mk = (x, rep, unk, lab) => { const b = pv(G(g), x, base); el('rect', { x: x - 70, y: base - rep, width: 140, height: rep, fill: C.Y, opacity: .85 }, b); el('rect', { x: x - 70, y: base - rep - unk, width: 140, height: unk, fill: 'none', stroke: C.grey, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, b); T(b, x, base - rep - unk - 14, '?', { font: HEAD, size: 34, weight: 700, fill: C.grey }); T(b, x, base + 30, lab, { size: 24, weight: 700 }); return b; };
        el('line', { x1: 220, x2: 900, y1: base, y2: base, stroke: C.ink, 'stroke-width': 3 }, g);
        const b1 = mk(380, 300, 90, 'before'), b2 = mk(740, 264, 90, 'after');
        T(g, 560, 290, 'reported (solid) and unreported (dashed, unknown)', { size: 23, fill: C.grey });
        S.k(b1, 'sy', [tm[0], 0], [tm[0] + .6, 1, 'back']); S.k(b2, 'sy', [tm[0] + .4, 0], [tm[0] + 1, 1, 'back']); S.sfx(tm[0], 'pop');
        const ar = pv(G(g), 860, 400);
        el('line', { x1: 450, x2: 860, y1: base - 300, y2: base - 300, stroke: C.ok, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, ar);
        el('path', { d: `M860 ${base - 300} L860 ${base - 280}`, stroke: C.ok, 'stroke-width': 6 }, ar); el('polygon', { points: `860,${base - 258} 849,${base - 282} 871,${base - 282}`, fill: C.ok }, ar);
        const bd = note(g, 960, 450, 'at least\n12% fewer', { size: 30, rot: 2, color: C.ok });
        S.pop(ar, tm[1] + 3); S.pop(bd, tm[2] + .5); S.sfx(tm[2] + .5, 'ding');
      }
    }
  ],
  take: "When certainty isn't available, an honest range beats a confident guess."
});
