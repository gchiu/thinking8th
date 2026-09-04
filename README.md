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
- `proof/` — every build output, all generated from `manuscript/book.adoc`
  and nothing else: `Thinking-8th-proof.pdf` (the canonical reading/
  print format, Pandoc → Typst), `Thinking-8th.html` (one
  self-contained file, images embedded), `Thinking-8th.epub`
  (reflowable ebook), and two copies marked generated-only in their own
  first line — `Thinking-8th.generated.md` (a reading copy, not a
  second source of truth) and `Thinking-8th.generated.docx` (a Word
  compatibility/review copy). There is no separate editable Word/DOCX
  master and no format-specific source file anywhere — AsciiDoc is the
  single source of truth, and every file in `proof/` is a build
  artifact, not independently edited. **See [`PUBLISHING.md`](PUBLISHING.md)**
  for the canonical-source rule, exact build commands
  (`cd tools && node build.js`), pinned tool versions, and the real
  Pandoc/Typst quirks the pipeline works around.
- `thinking-forth-1.0/` — the original *Thinking Forth* LaTeX source,
  pulled from <https://sourceforge.net/projects/thinking-forth/> and
  licensed CC BY-NC-SA 2.0. Kept as reference material only, and never
  itself part of the build — the twelve publication illustrations under
  `manuscript/illustrations/` started as files found in the working
  `thinking-forth-1.0/png/` directory (itself of mixed or incompletely
  documented provenance, not treated as an authority on origin), and
  were individually verified against Brodie's actual captions and
  against the real 2004 3rd-edition PDF before being copied into the
  tracked location above (see `ILLUSTRATIONS.md` for the full
  per-figure record).
- `thinking-forth-2000/thinking-forth-color.pdf` — the actual typeset
  2004 3rd edition of *Thinking Forth* (same CC BY-NC-SA license),
  supplied directly by Graham. Reference only, like `thinking-forth-1.0/`
  — every figure this book has used was cross-checked against it and
  confirmed accurate (see `ILLUSTRATIONS.md`). Useful for finding a
  figure's real page: PDF page number = printed book page number + 18.

See [`PUBLISHING.md`](PUBLISHING.md) for the canonical-source rule and
the full multi-format build pipeline, and
[`ILLUSTRATIONS.md`](ILLUSTRATIONS.md) for the figure-by-figure
provenance record. Found a bug, an inaccuracy, or have a correction?
Open a [GitHub Issue](https://github.com/gchiu/thinking8th/issues) —
that's where outstanding questions and corrections are tracked. Pull
requests for focused improvements are welcome; `manuscript/*.adoc` is
the only place prose changes belong (see `PUBLISHING.md`'s
canonical-source rule before editing anything under `proof/`).
