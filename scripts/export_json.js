// Regenerates data/prtf-s.json from prtf-s.html.
// Usage: node scripts/export_json.js prtf-s.html
'use strict';
const fs = require('fs');
const path = require('path');
const extract = require('./extract.js');
const ref = require('./prtf-s.js');

const file = process.argv[2] || 'prtf-s.html';
const page = extract(file);

const metrics = page.ORDER.map(id => {
  const m = page.METRICS[id];
  return {
    id, name: m.name, question: m.q, group: m.group === 'exp' ? 'exploitability' : 'impact',
    values: m.opts.map(o => ({ code: o[0], points: o[1], name: o[2], description: o[3] }))
  };
});
const examples = page.EXAMPLES.map(e => {
  const r = ref.score(e.v);
  const out = { title: e.t, description: e.d, vector: r.vector, score: r.score, severity: r.severity, rationale: e.w };
  if (e.tech) out.prtf_technique = e.tech;
  return out;
});

const data = {
  name: 'PRTF Severity Score',
  short_name: 'PRTF-S',
  formerly: 'PS-CVSS',
  version: page.VERSION,
  url: 'https://redteam.vip/prtf-s/',
  license: 'CC-BY-4.0',
  formula: {
    exploitability: 'E = (AV + AC + DL + SE) / 4',
    impact: 'I = (2 * max(SC, CI) + min(SC, CI)) / 3',
    score: 'Score = 1 + (I - 1) * (E + 2) / 6, rounded to one decimal',
    floor: 'If CI is X, the score is at least 2.5'
  },
  severity_bands: [
    { severity: 'LOW', min: 1.0, max: 1.6 },
    { severity: 'MEDIUM', min: 1.7, max: 2.4 },
    { severity: 'HIGH', min: 2.5, max: 3.2 },
    { severity: 'CRITICAL', min: 3.3, max: 4.0 }
  ],
  vector_format: 'PRTF-S:2.0/AV:_/AC:_/DL:_/SC:_/CI:_/SE:_',
  metrics,
  examples
};

const outDir = path.join(path.dirname(file), 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'prtf-s.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Wrote data/prtf-s.json: ' + metrics.length + ' metrics, ' + examples.length + ' examples');
