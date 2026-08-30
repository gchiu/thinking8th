# Thinking 8th

An original book teaching [8th](https://8th-dev.com/), inspired by the
structure and spirit of Leo Brodie's *Thinking Forth* — not a mechanical
translation of it. See [`manuscript/00-preface.md`](manuscript/00-preface.md)
for what that means in practice.

- `manuscript/` — the book itself, in Markdown, chapter by chapter. Start
  with `00-preface.md`, `01-getting-started.md`, and `02-notation.md`,
  then `chapter01-philosophy.md` onward. `manuscript/Thinking-8th.docx`
  is the generated, editable publication master, built from these files
  by `tools/build-docx.js`. `manuscript/illustrations/` holds the
  figures referenced from chapter text via `![caption](illustrations/
  file.png)`; see `ILLUSTRATIONS.md` for what each one is and why it was
  chosen.
- `code/` — every runnable example from the book, as standalone `.8th`
  files, organized by chapter. Each has been executed against the local
  8th distribution; see the comment at the top of each file for how to
  reproduce that.
- `proof/Thinking-8th-proof.pdf` — a PDF proof generated from the DOCX,
  for reading and review; not independently edited.
- `thinking-forth-1.0/` — the original *Thinking Forth* LaTeX source,
  pulled from <https://sourceforge.net/projects/thinking-forth/> and
  licensed CC BY-NC-SA 2.0. Kept as reference material only, and never
  itself part of the build — the ten redrawn illustrations under
  `manuscript/illustrations/` started as files found in
  `thinking-forth-1.0/png/`, verified against Brodie's actual captions,
  then copied into the tracked location above (see `GAPS.md` for the
  verification and licensing history).
- `thinking-forth-2000/thinking-forth-color.pdf` — the actual typeset
  2004 3rd edition of *Thinking Forth* (same CC BY-NC-SA license),
  supplied directly by Graham. Reference only, like `thinking-forth-1.0/`
  — every figure this book has used was cross-checked against it and
  confirmed accurate (see `ILLUSTRATIONS.md` and `GAPS.md`). Useful for
  finding a figure's real page: PDF page number = printed book page
  number + 18.

Project tracking: [`PLAN.md`](PLAN.md) (method and chapter roadmap),
[`GAPS.md`](GAPS.md) (uncertain or version-dependent 8th behavior),
[`ILLUSTRATIONS.md`](ILLUSTRATIONS.md) (skipped-figure tracking),
[`HANDOFF.md`](HANDOFF.md) (current state and workflow).
