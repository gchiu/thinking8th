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
- **`m:@`/`m:!` follow the same "leaves the container behind" convention
  as `a:!`**: `m:!`'s stack effect is `map key value -- map`, `m:@`'s is
  `map key -- map value`. A fetch or store used in isolation (not
  chained into another container op) needs an explicit `drop` afterward
  or a stray map accumulates on the stack. Confirmed in
  `code/ch08/box-map.8th`.
- **`G:clone` makes a genuine deep copy**, not a second reference —
  confirmed by cloning a map, mutating the original afterward, and
  reading the clone back unchanged. Necessary for any save/restore
  pattern involving a container: `var2 ! var1 @` alone would make
  `var2` an alias for `var1`'s container, not an independent snapshot.
  Verified in `code/ch08/draft-commit.8th`.
- **`defer:`/`w:is` do the same job Chapter 3 already used `defer:`
  for (a forward reference), and also a second, unrelated job**:
  letting an already-working word's behavior be reassigned at runtime,
  as many times as needed, with `' new-word w:is deferred-word`.
  Confirmed against `docs/md/07_words_interpreter.md` and verified with
  a redirect-output example in `code/ch08/redirect-log.8th` and a
  factor-a-loop-step example in `code/ch08/vectored-loop.8th`.
- **Direct self-recursion has its own dedicated word, `recurse`** —
  no `defer:`/forward-declaration needed to let a word call itself.
  8th's own docs note that invoking a word's own name inside its
  definition is deprecated in favor of `recurse`. Verified with a
  factorial in `code/ch08/recurse.8th`.
- **8th's `true`/`false` are a genuine, distinct Boolean type, not
  integers.** `true 1 n:+` throws `Expected Number but got Boolean` —
  confirmed directly. This rules out classic Forth's trick of using a
  boolean (represented as all-bits-set, i.e. `-1`) directly as a number
  to eliminate an `IF` (`( ? ) n AND` in place of `( ? ) IF n ELSE 0
  THEN`) — there's nothing to translate, the operands are different
  types. Bitwise operations on numbers are a separate, namespaced pair,
  `n:bor`/`n:band`, distinct from the boolean `and`/`or`. Verified in
  `code/ch09/light.8th`.
- **`and`/`or` are plain boolean combinators and do not (and structurally
  cannot) short-circuit** — both operands are already computed and on
  the stack before the combinator runs, since that's simply how a stack
  language evaluates an expression. Brodie's advice to nest with `if`
  instead of combining with `or`/`and` when one check is much more
  expensive than the other applies to 8th exactly as stated, for the
  same underlying reason. Verified (the combinators, not the
  short-circuit absence, which follows from the language's evaluation
  order rather than needing a runtime test) in `code/ch09/combine.8th`.
- **`a:when`/`a:when!` (documented under the unprefixed alias `when` in
  `docs/md/06_flow_control.md`, but the real word is namespaced) run a
  sequence of (test, action) word pairs and stop at the first true
  test** — `a:when!` doesn't stop, running every matching action
  instead. A final, unpaired word in the array acts as a default,
  invoked only if nothing else matched. Confirmed against
  `docs/help.sql`; verified in `code/ch09/checkout.8th` and
  `code/ch09/mode-dispatch.8th`.
- **`caseof` invoking a word with no return value leaves nothing extra
  on the stack** — despite its documented signature always showing one
  output (`a n -- x`), a zero-argument, no-return word invoked through
  `caseof` doesn't leave a stray `null` or anything else behind.
  Confirmed by checking stack depth before and after. Relevant any time
  `caseof` dispatches to plain `--` action words, as in
  `code/ch09/checkout.8th`.
- **Namespace prefixes (`n:`, `s:`, a custom `stock:`, etc.) are purely
  organizational — nothing about them restricts access.** Any code that
  knows a word's full name can call it regardless of which "component"
  declared it; `with:`/`;with` bring a namespace into unprefixed scope
  for readability, they don't create or remove a boundary. 8th's actual
  access-control primitive is a different, narrower word, **`private`**
  (paired with `public`) — but it's scoped to a *loaded library file*,
  not to namespaces in general: words declared after `private` become
  unreachable once the library finishes loading, except briefly via the
  special `#p:` namespace. Confirmed against
  `docs/md/24_libraries.md`; not otherwise used or verified with a
  runtime test in this book, since no chapter has needed genuine
  access control yet. Found while auditing Chapter 1's claim that
  namespaces are "enforced by the interpreter," which overstated the
  case — corrected in the manuscript (see `HANDOFF.md`'s 2026-08-31
  chapter-mapping audit).

## Genuinely unexplored (haven't needed them yet)

- `SED:` and the `debug/sed` library (runtime-checked stack effects,
  mentioned in `docs/help.sql`'s entry for `SED:`) — not used anywhere
  in the book yet. Would be relevant to a future chapter on testing or
  on documenting words rigorously.
- 8th's object system (the `o:` namespace) — still not used. Chapter 8's
  state-table treatment ended up using plain maps (`m:`) instead, which
  turned out sufficient; `o:` remains unexplored, not specifically
  earmarked for any planned chapter at the moment.
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
- **Correction — `img7-211` was never actually mismatched; the earlier
  entry above was wrong.** Graham supplied the real 2004 3rd-edition
  typeset PDF (`thinking-forth-2000/thinking-forth-color.pdf`, CC
  BY-NC-SA, same license as the archive), which embeds every original
  figure at its real location. Checked `img7-211` directly there (book
  p. 209): the picture genuinely *is* a woman standing beside a
  bandaged, traction-suspended patient — and that's paired with the
  cannon/windmill/trapeze/balloon caption on purpose. The joke's whole
  structure is the mismatch between an absurd caption and an unrelated
  picture (a visual-pun cartoon convention); reading it as "wrong
  image, wrong caption" was a misread of the joke, not a real
  discrepancy in the redrawn PNG set. The PNG in `thinking-forth-1.0/
  png/img7-211.png` was correct all along.
- **Full spot-check against the same PDF, same session:** every other
  figure already used in this book's manuscript —
  `fig1-7`/`fig1-8`/`fig1-9`, `fig2-3`, `fig3-8`/`fig3-9`,
  `fig4-1`/`fig4-2`/`fig4-3`, `img4-110`, `fig7-1`, `fig7-3`, `fig7-5`,
  `fig8-6` — was checked against its real page in the PDF and found
  pixel-identical to the redrawn PNG already in
  `manuscript/illustrations/`. Also viewed `fig7-7`/`fig7-8`/`fig7-9`
  (the `DOER`/`MAKE` step-by-step diagrams) for the first time, for
  completeness — confirmed genuinely useful teaching diagrams, but
  Chapter 8's `defer:`/`w:is` treatment doesn't walk through `DOER`/
  `MAKE` step-by-step the way they do, so they remain
  NOT-USED-IN-ADAPTATION, not missing. The redrawn PNG set turns out to
  have been remarkably faithful across the board; no image needs
  replacing. Page-offset note for anyone using this PDF again: PDF page
  number = printed book page number + 18, confirmed across several
  widely-spaced samples.
- **The PDF's 2004 and 1994 prefaces are new material** (Brodie
  revisiting his 1984 dismissal of object-oriented programming, and
  comparing *Thinking Forth* to Extreme Programming) — read in full.
  Nothing in them changes anything already written in this book; if
  anything they confirm the nuanced treatment `chapter03-decomposition.md`
  already gives Brodie's OOP critique (narrowing it to one specific
  dispatch shape rather than OOP broadly) was the right call, since
  Brodie's own later prefaces walk back the original blanket dismissal
  the same way.

## Historical/intellectual attribution audit, 2026-08-31

Graham asked for a full provenance pass: every "Brodie"/"Moore"/
invented/identified/introduced/discovered/argued/proposed/coined/
developed occurrence across the whole manuscript, checked against the
real 2004 edition, correcting any place where "Brodie" gets credit for
something the original book actually attributes to Charles Moore (as
Forth's inventor) or presents as established prior practice. Full
per-occurrence review (all 55 hits, every chapter) — not summarized
here in detail to keep this file's scope to 8th-behavior facts; the
reasoning for each fix lives with the fix itself, in-line as an edit
comment where useful. Three real corrections came out of it, all
small and evidence-based, none removing Brodie's genuine authorial
role (organizing, teaching, and — for `DOER`/`MAKE` specifically —
inventing something himself, confirmed via his own first-person "I
invented" claim in the source, and correctly left attributed to him
throughout):

- **Ch.1:** "Leo Brodie identified [implicit calls and implicit data
  passing] in Forth" was wrong — Brodie's own text calls these "two
  Forth inventions," i.e. Charles Moore's design choices as Forth's
  creator, which Brodie's chapter explains rather than originates.
  Corrected to credit them to Forth's own founding design.
- **Ch.2:** the "generality usually means complexity, stay sized to
  the problem you have" point was previously unattributed prose. In
  the source it's Moore's own stated position, drawn out at length
  across several pages of direct interview. Added a one-sentence
  credit.
- **Ch.6:** "Factor at the point you feel unsure" — presented as one
  of "Brodie's" factoring criteria — is Moore's own rule of thumb
  almost verbatim ("A word should be a line long... short words give
  you a good feeling," directly quoted in the source, with the
  "factor when unsure" tip's own elaboration also a direct Moore
  quote). Added a sentence crediting Moore before the heuristic list.

Everything else checked (all remaining Ch.1/3/7/8 mentions, plus
Ch.4/5/9's stray "introduced" hits, which turned out to be false
positives — cross-references to this book's own earlier chapters, not
attribution claims about Brodie or Moore at all) was already accurate:
Ch.8 in particular is largely Brodie's *own* constructed material
(the state-table example, and `DOER`/`MAKE` — confirmed by his own
first-person "I invented" claim in `chapter7.tex`) and was already
correctly attributed to him throughout, not to Moore. Also added one
sentence to `manuscript/00-preface.md` making the Brodie/Moore
relationship explicit up front, as requested, rather than leaving it
implicit until a reader happens to notice the pattern chapter by
chapter.

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
