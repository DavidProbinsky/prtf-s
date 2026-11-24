# Contributing to PRTF-S

Thanks for helping improve PRTF-S. The score gets better when practitioners share real findings that it scores too high or too low.

## What to send

- **A finding that scores wrong:** open an issue with a short, anonymized description of the finding, the vector you chose, the score you got, and the severity you think it should have, with your reasoning.
- **A clearer metric definition:** open an issue with the metric and value (for example `DL:M`) and your suggested wording.
- **Tools and integrations:** if you build PRTF-S into a report template or tool, open an issue so it can be listed.

Issues are reviewed by the maintainer. Accepted changes ship in the next release and are listed in the [CHANGELOG](CHANGELOG.md).

## Ground rules

- **Authorized work only.** No details that identify a real client, site or person.
- **Keep it vendor-neutral.** No affiliate, referral or tracking links.
- **Stable vectors.** Metric letters and values do not change within a major version. A formula change means a new major version.

## For maintainers

`prtf-s.html` is the source of truth. After editing it:

```bash
node scripts/test.js prtf-s.html          # page and reference implementation agree on all 4,096 vectors
node scripts/export_json.js prtf-s.html   # regenerate data/prtf-s.json
```

If you change the formula, update `scripts/prtf-s.js` to match. The same checks run automatically on every pull request.
