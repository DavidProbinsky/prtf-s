// PRTF Severity Score (PRTF-S) v2.0 reference implementation.
// Usage as a module: const { score } = require('./prtf-s.js'); score('AV:E/AC:N/DL:L/SC:F/CI:C/SE:N')
// Usage from the command line: node scripts/prtf-s.js "PRTF-S:2.0/AV:E/AC:N/DL:L/SC:F/CI:C/SE:N"
'use strict';

const VERSION = '2.0';
const VALUES = {
  AV: { P: 1, E: 2, I: 3, U: 4 },
  AC: { H: 1, M: 2, L: 3, N: 4 },
  DL: { H: 1, M: 2, L: 3, N: 4 },
  SC: { L: 1, Z: 2, F: 3, M: 4 },
  CI: { I: 1, D: 2, C: 3, X: 4 },
  SE: { C: 1, A: 2, P: 3, N: 4 }
};
const ORDER = ['AV', 'AC', 'DL', 'SC', 'CI', 'SE'];

function parse(vector) {
  const m = {};
  const re = /\b(AV|AC|DL|SC|CI|SE)\s*:\s*([A-Z])\b/gi;
  let x;
  while ((x = re.exec(String(vector))) !== null) {
    const k = x[1].toUpperCase(), v = x[2].toUpperCase();
    if (VALUES[k][v] !== undefined && !m[k]) m[k] = v;
  }
  return m;
}

function severity(s) {
  return s < 1.7 ? 'LOW' : s < 2.5 ? 'MEDIUM' : s < 3.3 ? 'HIGH' : 'CRITICAL';
}

function score(input) {
  const m = typeof input === 'string' ? parse(input) : input;
  for (const k of ORDER) {
    if (!m[k] || VALUES[k][m[k]] === undefined) throw new Error('Missing or invalid metric: ' + k);
  }
  const v = k => VALUES[k][m[k]];
  const E = (v('AV') + v('AC') + v('DL') + v('SE')) / 4;
  const hi = Math.max(v('SC'), v('CI')), lo = Math.min(v('SC'), v('CI'));
  const I = (2 * hi + lo) / 3;
  let raw = 1 + (I - 1) * (E + 2) / 6;
  if (m.CI === 'X' && raw < 2.5) raw = 2.5;
  const s = Math.round(raw * 10 + 1e-9) / 10;
  const vector = 'PRTF-S:' + VERSION + '/' + ORDER.map(k => k + ':' + m[k]).join('/');
  return { score: s, severity: severity(s), exploitability: E, impact: I, vector };
}

module.exports = { VERSION, VALUES, ORDER, parse, score, severity };

if (require.main === module) {
  const arg = process.argv.slice(2).join(' ');
  if (!arg) { console.error('Usage: node scripts/prtf-s.js "AV:E/AC:N/DL:L/SC:F/CI:C/SE:N"'); process.exit(1); }
  const r = score(arg);
  console.log(r.vector + ' = ' + r.score.toFixed(1) + ' (' + r.severity + ')');
}
