# Phase 4 — How We Work

Status: implemented and validated locally; not deployed.

- [Implementation report](./implementation-report.md)
- [Pre-change homepage captures](./before-captures.json)
- [Final capture manifest and viewport metrics](./captures.json)
- [Pixel comparison before the inserted section](./visual-regression.json)
- [Interaction results](./interaction-results.json)
- [Capture and QA script](./capture-qa.py)
- [Baseline screenshots](./screenshots/before/)
- [Final Home screenshots](./screenshots/after/home/)
- [How We Work page screenshots](./screenshots/after/how-we-work/)
- [Focused Home section screenshots](./screenshots/after/home-process/)

Preview: [English Home](http://127.0.0.1:5210/en), [Arabic Home](http://127.0.0.1:5210/ar), [English How We Work](http://127.0.0.1:5210/en/how-we-work), [Arabic How We Work](http://127.0.0.1:5210/ar/how-we-work).

Reproduce from `next-app/` while the app is available at port 5210:

```powershell
python docs/phase-4-how-we-work/capture-qa.py
python docs/phase-4-how-we-work/visual-compare.py
```
