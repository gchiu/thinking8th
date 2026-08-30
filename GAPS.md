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
- **Word-local variables need `locals:` before the `:` that declares
  the word, and are accessed by string name** (`"x" w:!` / `"x" w:@`),
  not by a bare identifier the way Forth's various local-variable
  extensions typically read. Confirmed in `code/ch07/midpoint.8th`:
  each word that opts in with `locals:` gets its own private set of
  named slots — a different word using the same name (even one it
  calls) doesn't collide, per `docs/md/03_syntax.md`'s own worked
  example. Forgetting `locals:` on the defining word leaves `w:@`/
  `w:!` with no scope to store into.
- **`>r`/`r>`/`r@` are *not* the real return stack in 8th** — confirmed
  from `docs/md/04_thestack.md`: it's a separate auxiliary stack kept
  apart "for security reasons," so a mismatched push/pop can't corrupt
  the actual call/return mechanism the way it can in traditional Forth.
  The old discipline (balance every push with a pop on every code path)
  still matters for your own values, but the catastrophic failure mode
  Brodie warns about doesn't apply here. Verified in
  `code/ch07/quietly.8th`.
- **No bare `1-` (or `1+`)** — Forth's shorthand doesn't exist in 8th;
  use `n:1-` (namespaced, consistent with `n:+`/`n:-`/`n:*`/`n:/`).
  Confirmed by a runtime error (`Unknown 1-`) while writing
  `code/ch07/holes.8th`.

## Genuinely unexplored (haven't needed them yet)

- `SED:` and the `debug/sed` library (runtime-checked stack effects,
  mentioned in `docs/help.sql`'s entry for `SED:`) — not used anywhere
  in the book yet. Would be relevant to a future chapter on testing or
  on documenting words rigorously.
- 8th's object system (the `o:` namespace) — not used yet. Planned for
  the future Chapter 8 (state tables as maps; see `HANDOFF.md`).
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
  specific creative artifact. Per explicit instruction, no artwork had
  been inserted at the time this was written; that was a decision for
  Graham, not something to resolve by inference. See `ILLUSTRATIONS.md`'s
  archive audit for the full figure-by-figure inventory this bears on.
  **Resolved, 2026-08-30:** Graham directed that the verified images be
  wired into the manuscript. Ten figures (Ch.1, 2, 3, 4) are now real
  images in `manuscript/illustrations/`, referenced from the relevant
  chapter files — see `ILLUSTRATIONS.md`'s "ten figures wired in" note.
- **Correction, found mid-audit:** no Ghostscript/ImageMagick is
  installed directly in this environment, but a complete set of
  pre-rendered PNGs for every `.eps` in the archive (64 files) was found
  at `thinking-forth-1.0/png/*.png` partway through this audit — this
  session did not generate them, and their origin (what rendered them,
  and when, beyond a file-modification timestamp of 2026-08-30) isn't
  known. If a future session needs to re-render anything not already in
  that folder, the tool that produced it hasn't been identified, so
  don't assume it's repeatable without checking first. **Update from
  Graham (mid-Chapter-7 session):** new/updated PNG files are expected
  to be dropped in at the repository root to replace the `.eps`
  originals going forward — likely the answer to where `png/` came from
  and the mechanism for keeping it current. No specifics (path
  convention, whether it's automatic, timing) are known yet; re-check
  this note and the repo root next session before assuming the old
  `thinking-forth-1.0/png/*.png` set is still the authoritative one.
- **Follow-up, same session, confirmed:** Graham's update landed as an
  in-place refresh of `thinking-forth-1.0/png/` itself (76 PNGs now, up
  from 64; no separate root-level `png/` appeared) — an external
  AI-image redrawing process, not a mechanical EPS rasterizer, going by
  `png/README-filenames.txt`'s own wording ("These 7 redrawn diagrams
  are bundled from the latest batch..."). Spot-checked several figures
  already described in this file's Ch.1-5 audit against the refreshed
  versions (`fig1-7`, `fig1-9`, `fig2-3`, `fig3-8`, `fig3-9`, `fig4-2`,
  `fig4-3`) — all still match their captions and this project's earlier
  descriptions, so those write-ups in `ILLUSTRATIONS.md` stand. **Two
  real problems turned up, though, and this set should not be treated
  as verified/authoritative without checking each figure individually:**
  (a) `png/img7-211.png` does not depict its actual caption (a cannon/
  windmill/trapeze/balloon "too many variables" joke) — the image shown
  is an unrelated hospital-bed scene, either mislabeled or misgenerated;
  (b) `png/README-filenames.txt` + `png/DESCRIPTIONS.txt` document a
  batch of 7 files temporarily named `UNKNOWN-01..07` that DESCRIPTIONS.txt
  maps to `fig3-2` through `fig3-8` — but properly-named `fig3-2.png`
  through `fig3-8.png` *also* already exist in the same folder, so
  there are two candidate versions of those seven figures and no way to
  tell from inside this project which one is authoritative. Don't use
  either the `UNKNOWN-*` files or assume the `fig3-*` ones are the
  "final" versions without asking Graham which batch is meant to win.
  **Resolved:** viewed `UNKNOWN-01` and `UNKNOWN-07` directly and
  compared them pixel-for-pixel (by eye) against `fig3-2.png` and
  `fig3-8.png` — identical in both cases. The `UNKNOWN-*` batch is a
  redundant duplicate of the already-properly-named `fig3-2`..`fig3-8`,
  not a competing version; no conflict after all, just leftover files
  from whatever step failed to preserve their original names. Used the
  properly-named `fig3-8`/`fig3-9` in the manuscript; the `UNKNOWN-*`
  files were left alone (not deleted — they're Graham's, in a folder
  this project doesn't otherwise edit). `img7-211` has no resolution —
  still mismatched, still unused, and moot for now since it's material
  for the not-yet-written Chapter 8, not Chapters 1-7.
  Because these
  existed, the six "genuinely missing" figures in `ILLUSTRATIONS.md`
  were viewed directly rather than inferred from caption text alone.
- The `thinking-forth-1.0/png/` folder itself is still untracked
  (not committed) — that hasn't changed, and `thinking-forth-1.0/`
  stays reference-only per `README.md`, never directly the source
  manuscript builds read from. **What changed:** the ten specific
  images resolved for use were *copied* (not moved) into a new tracked
  location, `manuscript/illustrations/`, which the manuscript actually
  references. `thinking-forth-1.0/png/`'s other ~66 files (including the
  redundant `UNKNOWN-*` batch and the still-mismatched `img7-211`) are
  untouched, still untracked, still Graham's working material — nothing
  here forces a decision about the rest of that folder.
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
