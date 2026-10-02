// Pulls every narration line out of the field guide and writes tools/lines.json.
// Usage: npm install jsdom && node tools/extract.js
// It builds the film in a simulated browser, collects each caption, and stores
// the caption text plus a "speak" version (₹1,500 -> 1,500 rupees, ATE -> A.T.E.).
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const src = path.join(__dirname, '..', 'src', 'field-guide');
const files = ['header.js', '_helpers.js', 'core.js', 'audio_a.js', '_sfx.js', 'audio_b.js', 'scenesA.js', 'scenesB.js', 'scenesC.js', 'main.js'];
const html = fs.readFileSync(path.join(src, 'head.html'), 'utf8') + '</style></head>' + fs.readFileSync(path.join(src, 'body.html'), 'utf8').replace(/^<\/style>\s*<\/head>/, '') + '</script></body></html>';
const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window; w.requestAnimationFrame = () => 0; w.setInterval = () => 0;
// build without recorded durations so every line is listed, even new ones
w.eval(files.map(f => fs.readFileSync(path.join(src, f), 'utf8')).join('\n') + ';window.X_={SAYS,forSpeech};');
const old = fs.existsSync(path.join(__dirname, 'lines.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'lines.json'), 'utf8')) : [];
const texts = [...new Set(w.X_.SAYS.map(s => s.text))];
texts.push("Hi, I'm Vari. Chai stalls near metro stations sell ₹1,500 more a day. Is the metro the reason?");
const out = texts.map((t, i) => { const prev = old.find(o => o.text === t); return { i, text: t, speak: w.X_.forSpeech(t), dur: prev ? prev.dur : null }; });
fs.writeFileSync(path.join(__dirname, 'lines.json'), JSON.stringify(out, null, 1));
console.log(out.length, 'lines written to tools/lines.json');
