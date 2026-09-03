# Thinking 8th

An original book teaching [8th](https://8th-dev.com/), inspired by the
structure and spirit of Leo Brodie's *Thinking Forth* — not a mechanical
translation of it. See [`manuscript/00-preface.adoc`](manuscript/00-preface.adoc)
for what that means in practice.

- `manuscript/` — the book itself, in **AsciiDoc**, chapter by chapter.
  `manuscript/book.adoc` is the master document — it sets the title and
  `include::`s every other file in reading order, so it's the one file
  that defines the book's structure; every other `.adoc` file is a
  self-contained chapter or front-matter section a contributor can edit
  (or send a pull request against) without touching anything else.
  AsciiDoc was chosen deliberately over Markdown here: its stricter,
  more structured syntax is far less likely to have an outside
  contributor's edit silently break the book's layout the way a stray
  Markdown quirk can. `manuscript/illustrations/` holds the figures
  referenced from chapter text via `image::illustrations/file.png[...]`;
  see `ILLUSTRATIONS.md` for what each one is and why it was chosen.
- `code/` — every runnable example from the book, as standalone `.8th`
  files, organized by chapter. Each has been executed against the local
  8th distribution; see the comment at the top of each file for how to
  reproduce that.
- `proof/Thinking-8th-proof.pdf` — the book's only build output, generated
  directly from `manuscript/book.adoc` via `tools/build-pdf.js` (which
  shells out to `pandoc`, using `tools/book-template.typ` to drive the
  Typst PDF engine). There is no separate editable Word/DOCX master —
  AsciiDoc is the single source of truth, and the PDF is a build
  artifact, not independently edited. See `HANDOFF.md`'s "Publication
  workflow" section for how to reproduce the build, including how
  `pandoc`/`typst` were installed without admin rights in this
  environment, and two real Typst/pandoc quirks (`tools/fix-8th-lang.lua`,
  `tools/fix-inline-code.js`) that the pipeline works around.
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
