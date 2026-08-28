# Thinking 8th

An original book teaching [8th](https://8th-dev.com/), inspired by the
structure and spirit of Leo Brodie's *Thinking Forth* — not a mechanical
translation of it. See [`manuscript/00-preface.md`](manuscript/00-preface.md)
for what that means in practice.

- `manuscript/` — the book itself, in Markdown, chapter by chapter. Start
  with `00-preface.md`, `01-getting-started.md`, and `02-notation.md`,
  then `chapter01-philosophy.md` onward. `manuscript/Thinking-8th.docx`
  is the generated, editable publication master, built from these files
  by `tools/build-docx.js`.
- `code/` — every runnable example from the book, as standalone `.8th`
  files, organized by chapter. Each has been executed against the local
  8th distribution; see the comment at the top of each file for how to
  reproduce that.
- `proof/Thinking-8th-proof.pdf` — a PDF proof generated from the DOCX,
  for reading and review; not independently edited.
- `thinking-forth-1.0/` — the original *Thinking Forth* LaTeX source,
  pulled from <https://sourceforge.net/projects/thinking-forth/> and
  licensed CC BY-NC-SA 2.0. Kept as reference material only; nothing in
  `manuscript/` is generated from it.

Project tracking: [`PLAN.md`](PLAN.md) (method and chapter roadmap),
[`GAPS.md`](GAPS.md) (uncertain or version-dependent 8th behavior),
[`ILLUSTRATIONS.md`](ILLUSTRATIONS.md) (skipped-figure tracking),
[`HANDOFF.md`](HANDOFF.md) (current state and workflow).
