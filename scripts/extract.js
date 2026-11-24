// Reads METRICS, EXAMPLES and the score() function out of prtf-s.html.
'use strict';
const fs = require('fs');
const vm = require('vm');

function cut(src, start, end) {
  const i = src.indexOf(start);
  if (i < 0) throw new Error('Not found in page: ' + start);
  const j = src.indexOf(end, i);
  if (j < 0) throw new Error('Not found in page: ' + end);
  return src.slice(i, j);
}

module.exports = function extract(file) {
  const html = fs.readFileSync(file, 'utf8');
  const code = [
    cut(html, 'var VERSION', 'var EXP_ORDER'),
    cut(html, 'var EXAMPLES = [', 'var TECH = '),
    cut(html, 'function val(k, letter)', 'function vecBody'),
    'this.out = { VERSION: VERSION, METRICS: METRICS, ORDER: ORDER, EXAMPLES: EXAMPLES, score: score };'
  ].join('\n');
  const ctx = {};
  vm.runInNewContext(code, ctx);
  return ctx.out;
};
