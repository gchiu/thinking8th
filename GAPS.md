# Gaps and Uncertainties

Behavior that's confirmed but non-obvious, or genuinely unresolved, and
worth knowing before relying on it in a later chapter. Not a session log
— see individual chapter commits for how each item was found. Update this
file when something here gets resolved, or when a new one turns up.

## Confirmed (not uncertain, but easy to get wrong)

- **`while` never consumes the boolean it tests, on either the loop-back
  or the fall-through path.** Confirmed by checking `depth` before/after
  in an isolated test. A loop that recomputes its condition fresh each
  iteration (rather than reusing one carried value, as the one worked
  example in 8th's own docs does) will leak one stack value per
  iteration if it uses plain `while`. Use **`while!`** (the consuming
  variant) for this shape instead. Found and fixed in
  `code/ch04/roman.8th`; grepped the repo afterward to confirm it was
  the only occurrence.
- **No `n:<=` / `n:>=`.** Build "a >= b" as `a b n:< not`.
- **`n:<` / `n:>` operand order matches how you'd read it aloud**: `a b
  n:<` asks "is `a` less than `b`?" — confirmed by direct test, not
  assumed from a Forth convention.
- **`caseof`'s argument order is container, then index** (`array 0
  caseof`), not index-then-container. Confirmed by test; easy to get
  backward since some other languages' lookup functions take the key
  first.
- **`n:/` is true division, not truncating integer division.** `1000
  2 n:* 3 n:/` gives `666.66667` (a float), not `666`. Forth
  programmers coming from `INTEGER-only` division will expect
  truncation by default and be surprised. If a whole-number result
  is required, the inputs must divide evenly, or the result needs an
  explicit rounding/truncation step (not yet needed in this book, but
  worth remembering before writing an example that assumes integer
  division). Found while verifying a compile-time-factoring example in
  ch06.
- **`a:!`'s argument order is `array index value`** (`a n x -- a`),
  i.e. index comes before value, not value before index. Getting the
  two swapped throws `Expected Array but got Number` (because the
  interpreter ends up trying to use the array itself as an array
  argument at the wrong stack position). Confirmed against
  `docs/help.sql`. It returns the array back on top of the stack
  (same object, already mutated in place) — the return value can be
  dropped when, as usual, you already hold the array in a `var`.

## Genuinely unexplored (haven't needed them yet)

- `SED:` and the `debug/sed` library (runtime-checked stack effects,
  mentioned in `docs/help.sql`'s entry for `SED:`) — not used anywhere
  in the book yet. Would be relevant to a future chapter on testing or
  on documenting words rigorously.
- `w:@` / `w:!` (word-local variables, as opposed to the global `var`/
  `var,` used throughout so far) — not used yet. 8th's own manual notes
  you *can't* declare a `var` local to a word; this pair is presumably
  the intended alternative. Relevant once a chapter needs local state
  that shouldn't leak into the surrounding namespace.
- 8th's object system (the `o:` namespace) — not used yet. Will likely
  matter for whichever later chapter maps to Brodie's data-structure
  chapters (his chapters 6–7).
- `a:each`'s exact behavior when the array is empty, or when the
  quotation itself modifies the array mid-iteration — not tested, not
  needed yet.

## Illustrations: licensing and build-pipeline uncertainty

- **Whether this book may reuse Brodie's original artwork is not
  actually settled, even though the license text looks permissive on
  its face.** `thinking-forth-1.0/copyright.tex` places one blanket CC
  BY-NC-SA 2.0 notice over "the work" as a whole, and `title.tex` states
  "With illustrations by the author" (i.e. Brodie drew them himself, no
  separate illustrator rights to untangle). Read narrowly, that permits
  derivative use with attribution, non-commercially, share-alike. What's
  *not* settled: (a) whether Graham wants this book to formally adopt
  CC BY-NC-SA for itself (the Preface currently says only that it
  "carries the same non-commercial, share-alike spirit forward," which
  is a tone, not a license grant), which reusing licensed derivative
  artwork would effectively require; (b) whether reusing Brodie's actual
  cartoons/diagrams is *pedagogically* appropriate for a book that has
  gone out of its way, throughout, to build original examples rather
  than adapt his specific ones — these figures are exactly that kind of
  specific creative artifact. Per explicit instruction, no artwork has
  been inserted; this is a decision for Graham, not something to resolve
  by inference. See `ILLUSTRATIONS.md`'s archive audit for the full
  figure-by-figure inventory this bears on.
- **Correction, found mid-audit:** no Ghostscript/ImageMagick is
  installed directly in this environment, but a complete set of
  pre-rendered PNGs for every `.eps` in the archive (64 files) was found
  at `thinking-forth-1.0/png/*.png` partway through this audit — this
  session did not generate them, and their origin (what rendered them,
  and when, beyond a file-modification timestamp of 2026-08-30) isn't
  known. If a future session needs to re-render anything not already in
  that folder, the tool that produced it hasn't been identified, so
  don't assume it's repeatable without checking first. Because these
  existed, the six "genuinely missing" figures in `ILLUSTRATIONS.md`
  were viewed directly rather than inferred from caption text alone.
- The `png/` folder is untracked (not committed) and lives under
  `thinking-forth-1.0/`, which this project otherwise treats as
  reference-only and never edits. Left as untracked, uncommitted
  working material rather than either committing it (it's 64 files of
  Brodie's own rendered artwork, and the licensing question below is
  unresolved) or deleting it (it's useful, hard-to-reproduce reference
  material, and deleting someone else's apparent output without knowing
  its origin would be presumptuous). Decide what to do with it once the
  licensing question is resolved one way or the other.
- The 4 figures with a `.tex` source alongside their `.eps`
  (`fig1-1`, `fig1-3`, `fig1-4`, `fig1-6`) *were* readable directly, and
  turned out to be plain LaTeX (tables, PSTricks-free layout) rather
  than drawn art — worth checking the `.tex` source first, before
  assuming a `.eps` needs rendering, for any figure that has one.

## Environment-dependent / not independently verifiable here

- **The exact appearance of 8th's interactive REPL prompt** (banner
  text, prompt character) when launched with zero arguments on a real
  terminal. Piping input to `8th` with no arguments on this development
  machine hits a "help.db not created" warning and exits without
  visibly entering a REPL loop, which may just be how a non-TTY session
  behaves rather than how a real interactive terminal behaves. Worked
  around in `manuscript/01-getting-started.md` by verifying the `-e`
  flag instead (`8th -e "..." -e bye`, which *is* fully verified) and
  describing the interactive prompt only in general, documented terms
  (REPL = "read-eval-print loop," per 8th's own glossary) rather than
  showing a transcript that was never actually observed.
- `bin/setup.8th` (needed for `help`/`apropos`) was never run in this
  project, deliberately — it writes `docs/help.db` and other files
  inside the read-only `D:\8th` reference distribution. All word
  documentation used in this book comes from `D:\8th\docs\md\*.md` and
  direct inspection of `D:\8th\docs\help.sql` instead.
- Whether 8th's "no optimization except tail-call elimination" claim
  (`D:\8th\docs\md\02_introduction.md`) has changed in any 8th release
  since this project's local distribution — not checked against a
  changelog; stated as true of *this* distribution, not as a permanent
  language guarantee.
