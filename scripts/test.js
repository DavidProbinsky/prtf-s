// Checks that the calculator page and the reference implementation agree on every
// possible vector (4^6 = 4,096), and that the published examples are scored correctly.
// Usage: node scripts/test.js prtf-s.html
'use strict';
const extract = require('./extract.js');
const ref = require('./prtf-s.js');

const page = extract(process.argv[2] || 'prtf-s.html');
let errors = 0;
const fail = msg => { errors++; console.error('FAIL ' + msg); };

if (page.VERSION !== ref.VERSION) fail('version: page ' + page.VERSION + ', reference ' + ref.VERSION);

for (const k of ref.ORDER) {
  const pageVals = {};
  page.METRICS[k].opts.forEach(o => { pageVals[o[0]] = o[1]; });
  if (JSON.stringify(pageVals) !== JSON.stringify(ref.VALUES[k])) fail('metric values differ for ' + k);
}

const letters = ref.ORDER.map(k => Object.keys(ref.VALUES[k]));
let checked = 0;
(function walk(i, m) {
  if (i === ref.ORDER.length) {
    const a = page.score(m), b = ref.score(m);
    if (a.s !== b.score || a.sev !== b.severity) fail(JSON.stringify(m) + ' page ' + a.s + ' ' + a.sev + ', reference ' + b.score + ' ' + b.severity);
    if (b.score > Math.round(b.impact * 10 + 1e-9) / 10 && m.CI !== 'X') fail('score above impact ceiling: ' + JSON.stringify(m));
    if (m.CI === 'X' && b.score < 2.5) fail('CI:X below HIGH: ' + JSON.stringify(m));
    checked++;
    return;
  }
  for (const l of letters[i]) walk(i + 1, Object.assign({}, m, { [ref.ORDER[i]]: l }));
})(0, {});

const expected = { 'AV:I/AC:N/DL:N/SC:M/CI:X/SE:N': 3.9, 'AV:E/AC:N/DL:L/SC:F/CI:C/SE:N': 2.8, 'AV:E/AC:M/DL:N/SC:F/CI:C/SE:N': 2.7,
  'AV:E/AC:M/DL:M/SC:Z/CI:D/SE:A': 1.7, 'AV:I/AC:L/DL:M/SC:L/CI:I/SE:C': 1.0, 'AV:E/AC:L/DL:H/SC:L/CI:I/SE:C': 1.0 };
page.EXAMPLES.forEach(e => {
  if (expected[e.v] === undefined) fail('example has no expected score: ' + e.v);
  else if (ref.score(e.v).score !== expected[e.v]) fail('example ' + e.v + ' scored ' + ref.score(e.v).score + ', expected ' + expected[e.v]);
});

if (errors) { console.error(errors + ' problem(s) found'); process.exit(1); }
console.log('OK: ' + checked + ' vectors match, ' + page.EXAMPLES.length + ' examples correct');
