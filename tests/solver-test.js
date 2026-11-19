// Checks the solver inside index.html. Run on a Mac with:
//   /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc tests/solver-test.js -- index.html
const src = readFile(arguments[0]);
const console = { log: print, error: print };
const m = src.match(/\/\/ ===== PENTO CORE[\s\S]*?\/\/ ===== END PENTO CORE =====/);
if (!m) { throw new Error('core block not found'); }
const core = new Function(m[0] + '\nreturn {PIECES, LETTERS, orientations, solveAll, canonical, symVariants, buildCatalog, buildCatalogFull};')();

let fail = 0;
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fail++; };

// Orientation counts are a known fact about pentominoes
const expect = { F: 8, I: 2, L: 8, N: 8, P: 8, T: 4, U: 4, V: 4, W: 4, X: 1, Y: 8, Z: 4 };
const got = {}; for (const L of core.LETTERS) got[L] = core.orientations(L).length;
check(JSON.stringify(got) === JSON.stringify(expect), 'orientation counts ' + JSON.stringify(got));
check(core.orientations('F').reduce((n) => n + 1, 0) && core.LETTERS.split('').every(L => core.orientations(L).every(o => o.length === 5)), 'every orientation has 5 cells');

let t0 = Date.now();
const full = core.buildCatalogFull();
console.log('full solve ' + (Date.now() - t0) + ' ms');
check(full.raw === 9356, 'full search: raw tilings = ' + full.raw + ' (expect 9356)');
check(full.list.length === 2339, 'full search: canonical solutions = ' + full.list.length + ' (expect 2339)');
t0 = Date.now();
const cat = core.buildCatalog();
console.log('fast solve (used by the game) ' + (Date.now() - t0) + ' ms');
check(cat.raw === 2339, 'fast search finds each solution exactly once (raw=' + cat.raw + ')');
check(cat.list.length === 2339, 'fast search: canonical solutions = ' + cat.list.length);
check(cat.list.join() === full.list.join(), 'fast and full searches give the identical numbered list');

// Every canonical solution: valid tiling, each letter 5 cells, each piece connected & shaped right
const shapeSet = {};
for (const L of core.LETTERS) shapeSet[L] = new Set(core.orientations(L).map(o => o.map(p => p.join(',')).join(';')));
let bad = 0, nonCanon = 0, fourDistinct = 0;
for (const s of cat.list) {
  if (s.length !== 60) { bad++; continue; }
  for (const L of core.LETTERS) {
    const cells = [];
    for (let i = 0; i < 60; i++) if (s[i] === L) cells.push([Math.floor(i / 10), i % 10]);
    if (cells.length !== 5) { bad++; break; }
    const mr = Math.min(...cells.map(p => p[0])), mc = Math.min(...cells.map(p => p[1]));
    const key = cells.map(p => [p[0] - mr, p[1] - mc]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(p => p.join(',')).join(';');
    if (!shapeSet[L].has(key)) { bad++; break; }
  }
  if (core.canonical(s) !== s) nonCanon++;
  if (new Set(core.symVariants(s)).size === 4) fourDistinct++;
}
check(bad === 0, 'all solutions are valid tilings with correct piece shapes (bad=' + bad + ')');
check(nonCanon === 0, 'all stored solutions are their own canonical form');
check(fourDistinct === 2339, 'no solution is symmetric to itself (each has 4 distinct variants)');
// Canonical mapping: every symmetric variant of solution k maps back to k
const idx = new Map(cat.list.map((s, i) => [s, i]));
let mapOk = true;
for (const s of cat.list) for (const v of core.symVariants(s)) if (idx.get(core.canonical(v)) !== idx.get(s)) mapOk = false;
check(mapOk, 'every turned/mirrored copy maps back to the same ID');
// IDs are stable: sorted order
check(cat.list.every((s, i) => i === 0 || cat.list[i - 1] < s), 'IDs follow sorted canonical order (stable)');
// Permanent IDs: these exact boards must never be renumbered (saved progress depends on it)
check(cat.list[0] === 'FFIIIIILZZVFFYLLLLZNVFYYYYXZZNVVVTWXXXNNPPPTWWXUNUPPTTTWWUUU', 'solution #1 is pinned to its known board');
check(cat.list[2338] === 'UUXIIIIIZZUXXXNTTTZYUUXNNFTZZYVVVNFFTWYYVPPNLFFWWYVPPPLLLLWW', 'solution #2339 is pinned to its known board');
console.log(fail ? fail + ' FAILED' : 'ALL TESTS PASSED');
if (fail) throw new Error(fail + ' tests failed');
