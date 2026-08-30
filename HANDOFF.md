# Handoff

Read this for current project state. See `PLAN.md` for the method and
chapter roadmap, `GAPS.md` for uncertain/version-dependent 8th behavior,
`ILLUSTRATIONS.md` for skipped-figure tracking.

## Key paths

- Working repository: `D:\repos\thinking8th`
- Official 8th distribution (**read-only**): `D:\8th`, binary at
  `D:\8th\bin\win64\8th.exe`
- Brodie's original *Thinking Forth* LaTeX source (**reference only**):
  `thinking-forth-1.0/`, CC BY-NC-SA 2.0

## Publication workflow

`manuscript/*.md` (hand-edited source) → `manuscript/Thinking-8th.docx`
(generated) → `proof/Thinking-8th-proof.pdf` (generated from the docx).
Never hand-edit the `.docx`; never independently edit the `.pdf`.

Rebuild the docx:

```bash
cd tools && npm install && node build-docx.js
```

Auto-discovers `manuscript/*.md` by filename sort — a new
`chapterNN-slug.md` is picked up with no script change.

Generate the PDF proof (no pandoc/LibreOffice on this machine — uses real
Word via PowerShell COM):

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("D:\repos\thinking8th\manuscript\Thinking-8th.docx")
$doc.Fields.Update() | Out-Null
$doc.SaveAs2("D:\repos\thinking8th\proof\Thinking-8th-proof.pdf", 17)
$doc.Close(0)
$word.Quit()
```

**`$doc.Close(0)` is mandatory.** A bare `Close()` under unattended COM
automation silently saves Word's in-memory changes (the materialized TOC,
etc.) back into the source `.docx`. Confirm the docx's size/mtime is
unchanged after every proof export.

Trim size is fixed: **6.8125" × 9.125"**, Brodie's own original *Thinking
Forth* trim (`thinking-forth-1.0/tf.sty`'s `\oldgeometry`). This is the
`brodie` profile in `tools/build-docx.js`, and the default — plain `node
build-docx.js` builds it, no environment variable needed.

## How examples are verified

Every `.8th` file under `code/chNN/` is actually executed against
`D:\8th\bin\win64\8th.exe`; the manuscript quotes real observed output,
never a prediction. One-off syntax questions are checked with disposable
scratch scripts before being used in a real example.

## Beginner-readability rule (apply from the start, every chapter)

For every new 8th word: **idea, in plain English → (8th's own shorthand
notation for it, if any, explicitly framed as shorthand) → tiny verified
demo → the real example that needed it.** Never use a word in an example
before the reader has been told what it does. Never assume prior Forth
or stack-language knowledge — Forth comparisons are asides a reader can
skip, never a prerequisite.

## Manuscript status

| File | Status |
|---|---|
| `manuscript/00-preface.md` | done |
| `manuscript/01-getting-started.md` | done |
| `manuscript/02-notation.md` | done |
| `manuscript/chapter01-philosophy.md` (Ch.1) | done |
| `manuscript/chapter02-analysis.md` (Ch.2) | done |
| `manuscript/chapter03-decomposition.md` (Ch.3) | done |
| `manuscript/chapter04-detailed-design.md` (Ch.4) | done |
| `manuscript/chapter05-style.md` (Ch.5, "Elements of Forth Style") | done |
| `manuscript/chapter06-factoring.md` (Ch.6, "Factoring") | done |
| `manuscript/chapter07-taming-the-stack.md` (Ch.7, "Taming the Stack") | done |

Our Chapter 7 covers only half of Brodie's actual chapter 7 ("Handling
Data: Stacks and States") — see `PLAN.md` for why it was split and what
the still-to-be-written Chapter 8 (state tables via maps; vectored
execution via `defer:`/`w:is`) will cover.

See `PLAN.md` for the full chapter map against Brodie's actual table of
contents and the current chapter-8-onward status.

---

## Session: 2026-08-30 — resumed after doc cleanup, wrote Chapter 5

### Work completed in this continuation

- Found that `docs/AI-HANDOFF.md`, `docs/OVERNIGHT-NOTES.md`,
  `docs/ADAPTATION-METHOD.md`, and the rejected A5 test proof had been
  deliberately removed from the repo (two commits, "Remove internal
  development artifacts" / "Remove obsolete A5 test proof") and the repo
  pushed to origin. Did not attempt to restore the old files under their
  old names — recreated equivalent tracking under the requested
  convention instead: `PLAN.md`, `GAPS.md`, `ILLUSTRATIONS.md`,
  `HANDOFF.md` (this file), all at repo root, each with a narrower,
  more purpose-built scope than the old session-log-style notes.
  Updated the stale `README.md` to match actual current structure.
- Retroactively audited Brodie's chapters 1–4 (48 figure references
  total) for genuine pedagogical gaps against this book's own text; four
  logged in `ILLUSTRATIONS.md` (component/lexicon diagram in Ch.1, a
  data-flow-diagram contrast in Ch.2, an interface-boundary diagram in
  Ch.3, the water-jug puzzle diagram in Ch.4). No manuscript text was
  changed for these — retroactive entries are documentation-only, per
  the "don't rewrite completed chapters" rule.
- Wrote **Chapter 5, "Elements of Style"** (adapts Brodie's "Implementation:
  Elements of Forth Style," `chapter5.tex`, ~2040 lines — the largest
  Brodie chapter tackled so far). Brodie's chapter is roughly half
  Forth-obsolete disk-block mechanics (fixed-size "screens," `-->`/`THRU`
  loading directives, disk partitioning) and half genuinely portable
  style guidance (stack-effect comment vocabulary, variable stack
  effects, naming philosophy). Condensed the obsolete half to one
  paragraph of honest historical context rather than forcing an
  equivalence, and built the chapter around what actually transfers:
  - **Organizing source across files** via `f:include`, explicitly tied
    back to Chapter 3's "order words by the uses hierarchy" lesson, now
    applied to files instead of words within one file.
  - **A stack-effect abbreviation vocabulary** (`n`/`s`/`flag`/`a`/`m`/
    `ref`) extending "A Note on Notation"'s SED introduction, plus
    Brodie's "variable stack effect" (`|` for alternate outcomes),
    demonstrated with an original `safe-div` example.
  - **Naming**: Brodie's own nuanced point preserved (affixes should
    *distinguish* similarly-named words, not encode a full description)
    alongside a genuine payoff moment — pointing out that every
    predicate word used earlier in this book (`hurried?`,
    `space-available?`, `due?`, `plausible?`, `level-open?`) already
    followed the `?` convention without it being named, and that 8th's
    namespaces are the same instinct formalized for "which component,"
    not just "what return type."
  - Two new verified example files under `code/ch05/`: a two-file
    component/`f:include` demo (`stock-component.8th` /
    `stock-main.8th`) and `safe-div.8th`.

### Runtime verification

All executed against `D:\8th\bin\win64\8th.exe`:

- `f:include` mechanics, isolated: confirmed it resolves paths relative
  to the **current working directory at invocation**, not relative to
  the including file — tested by running the same including script from
  two different working directories, one of which failed with "cannot
  include ...". This became an explicit callout in the chapter text,
  not just a footnote.
- Confirmed `needs` (as opposed to `f:include`) is a *parsing* word
  (bareword after it, not a string popped off the stack) restricted to
  8th's own library search paths — attempted with an arbitrary path
  first and got "library ... not found," which is what sent me to
  re-check the actual word (turned out to be `f:include`, namespaced
  under `f:`, not bare `include` as I'd first guessed from the SQL
  help-table's column layout).
- `code/ch05/stock-main.8th` (which `f:include`s
  `code/ch05/stock-component.8th`): run from the repo root, prints `8`.
  Matches the manuscript exactly.
- `code/ch05/safe-div.8th`: run standalone, prints `true` / `5` /
  `false`, in that order. **This caught a real error in my own first
  draft** — see Corrections below.
- Custom namespace prefixes on user-defined words (`stock:add`,
  `stock:count`) confirmed to work exactly like 8th's own built-in
  namespaces (no special declaration needed; the namespace is just part
  of the word's literal name).
- Full docx rebuild + OOXML schema validation (628 paragraphs, clean) +
  PDF proof regeneration via `$doc.Close(0)` (docx confirmed
  byte-size-unchanged afterward) + visual spot-check of the TOC,
  Chapter 5's opening page, the SED-abbreviation table, the corrected
  `safe-div` output, and the final page. All correct. Page count 43 → 49.

### Important discoveries

- `f:include` (not bare `include`) is the word for loading an arbitrary
  file by path; `needs` is a different word for loading a named library
  from 8th's fixed set of library search locations and parses its
  argument from the input stream rather than the stack. Easy to
  conflate; they solve different problems.
- `f:include` path resolution is CWD-relative at run time, not relative
  to the file doing the including — worth remembering for any future
  multi-file example.
- User-defined words can use their own namespace-style prefix
  (`stock:add`) with zero special ceremony — it's just part of the
  word's name, reinforcing Chapter 1's claim that namespaces are a
  first-class, not merely built-in, language feature.

### Corrections

- **A genuine bug in my own first draft, caught by actually running it**:
  I wrote the `safe-div` example's inline comment and narration
  claiming `10 2 safe-div . cr . cr` prints "5, then true." Running it
  showed the real order is **"true, then 5"** — `.` prints from the top
  of the stack down, and `true` was pushed after (so sits above) the
  quotient. Fixed in both `code/ch05/safe-div.8th` and
  `manuscript/chapter05-style.md` (the code comment and the shown
  `text` output block) before this was ever presented as verified. The
  SED itself (`n1/n2 true | false`) was already correct — only the
  *printed-output* annotation was wrong, a reminder that stack order and
  print order are related but not the same thing to get right by eye.

### Remaining uncertainties

No new `GAPS.md` entries from this session beyond what was already
there (`while` vs. `while!`, absent `n:<=`/`n:>=`, `caseof` argument
order, unexplored `SED:`/`w:@`/`w:!`/`o:`, the unverifiable interactive
REPL transcript, `bin/setup.8th` deliberately not run). Worth adding
next time something in Chapter 6 needs it: whether `needs`'s "only
includes the library once" guarantee has any equivalent for `f:include`
(current assumption, not yet tested: it does *not* dedupe, and
including the same file twice would redefine its words a second time,
printing 8th's own "Redefining: ..." warning each time — plausible
given Chapter 1's already-verified redefinition behavior, but not
directly tested for `f:include` specifically).

### Illustration placeholders

None new this session — Brodie's Chapter 5 has two figures
(`fig5-1`, `fig5-2`), both decorative cartoons about commenting/naming
jokes, not conceptual diagrams, so nothing met the bar for
`ILLUSTRATIONS.md`. (The four retroactive Ch.1–4 entries mentioned above
were added this session but concern chapters completed earlier, not
Chapter 5 itself.)

### Current stopping point

Chapter 5 ("Elements of Style") is complete, verified, and will be
committed along with this handoff update. Nothing is mid-chapter.

### Best next task

1. Read `thinking-forth-1.0/chapter6.tex` — check its real title before
   assuming (`PLAN.md`'s table deliberately leaves it unnamed for this
   reason).
2. Same method as always: what is Brodie actually teaching → separate
   universal/stack-language ideas from Forth-specific machinery → find
   the genuine 8th treatment → write original prose → verify every
   example against the real interpreter → log gaps/illustrations as
   they come up, not as an afterthought.
3. Apply the beginner-readability rule from the first draft, not as a
   later fix-up pass (see the rule stated near the top of this file).
4. Rebuild the docx, regenerate the proof PDF (`$doc.Close(0)`),
   spot-check rendered pages, update `PLAN.md`'s table and this file's
   "Manuscript status" table and session log, commit `.md` + `.docx` +
   `.pdf` + any new `code/ch06/*.8th` together.

## Safety rules

- Never modify anything under `D:\8th` — read-only, execute the binary
  only.
- Never push to the remote unless explicitly asked.
- Never discard uncommitted work without checking `git status` first.
- The DOCX is the master; never hand-edit it. The PDF is generated
  proofing output; never edit it independently.

---

## Session: 2026-08-30 (continued) — Illustration audit (Ch.1–5) + Chapters 6–7

### Work completed this session

- **Full illustration audit of Chapters 1–5 against the actual
  `thinking-forth-1.0/` archive** (not just captions/guesswork).
  Rewrote `ILLUSTRATIONS.md` from scratch with a complete reference
  table for all **50 figure references** across Ch.1–5, cross-checked
  against the archive's **64 total `.eps` files** (all 50 present; 4
  also have `.tex` source, which turned out to be plain LaTeX
  tables/layout, not drawn art, and were readable directly with no
  rendering needed). Partway through, an unexpected complete set of
  pre-rendered PNGs was found at `thinking-forth-1.0/png/*.png` (origin
  unknown, not generated by this session), which let the **6 genuinely-
  missing figures** get real visual descriptions instead of caption-
  based guesses (see `ILLUSTRATIONS.md` for the full writeups: Ch.1's
  namespace/lexicon diagrams `fig1-7`/`fig1-8`/`fig1-9`, Ch.2's
  data-flow diagram `fig2-3`, Ch.3's interface-seam diagrams
  `fig3-8`/`fig3-9`, Ch.4's water-jug diagrams `fig4-1`–`fig4-3`, and a
  newly-found Ch.4 noun-verb illustration `img4-110`). **No artwork was
  inserted anywhere** — per explicit instruction, this was a
  documentation-only audit.
- **Licensing/build uncertainty logged in `GAPS.md`**: the archive
  carries one blanket CC BY-NC-SA 2.0 notice over Brodie's whole work,
  including his own illustrations ("With illustrations by the author"
  — no separate illustrator to untangle). Whether *this* book should
  formally adopt that license, and separately whether reusing Brodie's
  specific cartoons is pedagogically appropriate for a book built
  around original examples, are both **open decisions for Graham**, not
  resolved by inference. The `png/` folder is left untracked pending
  that decision. **Mid-session update from Graham**: new/updated PNG
  files are expected to be dropped in at the repository root to
  replace the `.eps` originals going forward — likely explains where
  `png/` came from; no further specifics yet, re-check next session.
- Wrote **Chapter 6, "Factoring"** (`chapter06-factoring.md`) — factoring
  out a repeated calculation, control flow (flags vs. caller-chosen
  extra steps), a repeated decision into a `caseof`-dispatched array of
  word references, and names into a real mutable array (`a:!`) instead
  of parallel variables. Gives an honest, non-mechanical treatment of
  the one real gap found: 8th has no `CREATE`/`DOES>` equivalent, and
  doesn't need one, since native arrays solve the underlying problem
  more directly. Also covers compile-time constant derivation and
  table-size-from-itself. 5 verified examples in `code/ch06/`.
- Wrote **Chapter 7, "Taming the Stack"** (`chapter07-taming-the-stack.md`)
  — the portable half of Brodie's actual chapter 7 ("Handling Data:
  Stacks and States"), which turned out too large and too mixed for one
  chapter (see `PLAN.md` for the split rationale and what the deferred
  second half — a future Chapter 8 — will cover: state tables via maps,
  vectored execution via `defer:`/`w:is`). Covers escaping a crowded
  stack (`a:close`, native array push/pop), word-local variables
  (`locals:`/`w:@`/`w:!` — a real mechanism Forth's globals-by-
  convention never had), an auxiliary `>r`/`r>`/`r@` stack that is
  deliberately *not* the real return stack in 8th (removing most of
  Brodie's corruption warnings by construction), recognizing a
  save/restore urge as a symptom of bad factoring, and a depth counter
  (not a flag) for sharing one component safely across nested uses. 6
  verified examples in `code/ch07/`.
- Fixed a real bug in the shared build tool: `tools/build-docx.js`'s
  markdown-to-docx converter misreads any source line that happens to
  *start* with `N. ` as a numbered-list item, even mid-paragraph — a
  sentence that word-wrapped with "3." starting a line was rendered as
  a stray "11." list item in the Ch.6 proof PDF. Fixed by rewrapping
  the prose (not by loosening the parser, since this parser's model
  allows a real list to start mid-paragraph); added a comment at the
  regex so this doesn't get silently rediscovered in a later chapter.

### Runtime verification

All executed against `D:\8th\bin\win64\8th.exe`, both in scratchpad
scripts (to resolve open questions) and in the final `code/ch06/`
`code/ch07/*.8th` files that ship with the book:

- `n:/` is true (float) division — `1000 2 n:* 3 n:/` gives
  `666.66667`, not a truncated `666`.
- `a:!`'s argument order is `array index value` (`a n x -- a`), not
  value-then-index; confirmed against `docs/help.sql` after hitting
  `Expected Array but got Number` from getting it backward.
- The `caseof`-array-of-words dispatch pattern from Ch.2 (`channel-
  actions` / `alarm!` in `code/ch06/channel-alarms.8th`) — confirmed
  `caseof` calls a stored word reference, not just returns data.
- `locals:` + `w:@`/`w:!` word-local variables (`code/ch07/midpoint.8th`)
  — confirmed correct argument order (`x s --` / `s -- x`) and that
  each `locals:`-declared word gets its own private slot namespace.
- `>r`/`r>`/`r@` as 8th's auxiliary (not return) stack
  (`code/ch07/quietly.8th`) — confirmed against `docs/md/04_thestack.md`
  that this is a deliberately separate stack, "for security reasons."
- No bare `1-`/`1+` in 8th — `n:1-` is required (caught by a runtime
  `Unknown 1-` error while writing `code/ch07/holes.8th`).
- Full docx rebuild + PDF proof regeneration (via `$doc.Close(0)`) after
  both chapters, with visual spot-checks of the rendered pages for each
  (caught and fixed the stray-numbered-list bug above on the Ch.6 pass).
  Page count 49 → 56 (Ch.6) → 63 (Ch.7).

### Important discoveries

- 8th has **no `CREATE`/`DOES>` or general defining-word mechanism** —
  confirmed absent by direct search of `docs/help.sql` and
  `docs/md/*.md`. Not a gap needing a workaround: 8th's native
  arrays/maps solve the same underlying problem (a family of near-
  identical words differing only in baked-in data) more directly.
- 8th's own documentation independently gives almost exactly Brodie's
  warning against `pick`/`roll` — "if you need `pick`, those elements
  should be in an array instead" — worth quoting directly rather than
  reinventing the same argument from scratch.
- 8th's `>r`/`r>`/`r@` are a real, separate auxiliary stack, *not* the
  actual return stack — 8th deliberately doesn't expose that one, "for
  security reasons." This removes the entire category of catastrophic-
  corruption risk Brodie's chapter spends pages warning about.
- 8th has a genuine word-local-variable mechanism (`locals:`/`w:@`/
  `w:!`) that Forth never had — Brodie's "local variable" was always
  just a global used by convention within one word. This is a case
  where 8th is strictly more capable than the thing being adapted, not
  just differently-idiomed.
- `defer:` + `w:is` (confirmed to exist in
  `docs/md/07_words_interpreter.md`, not yet verified against the
  runtime) looks like a direct, much cleaner native replacement for
  Brodie's hand-invented `DOER`/`MAKE` vectored-execution syntax — the
  leading candidate for the future Chapter 8, pending actual testing.

### Remaining uncertainties

New `GAPS.md` entries this session: `n:/` true division, `a:!`'s
argument order, `locals:`/`w:@`/`w:!` scoping rules, `>r`/`r>`/`r@` as
a non-return auxiliary stack, no bare `1-`. Resolved and removed one
prior "genuinely unexplored" entry (`w:@`/`w:!`, now confirmed and
moved to "Confirmed"). Still open: `SED:`, `a:each` edge cases, 8th's
`o:` object namespace (now specifically earmarked for the future
Chapter 8's state-table material), the interactive-REPL-transcript
question, and `defer:`/`w:is` (named as a strong candidate above but
not yet actually run).

### Illustration placeholders

Chapter 6: none needed — its two `chapter6.tex` figures turned out to
be plain code/ASCII listings (a 9-box grid, the `POINTS`/`DRAW` table),
both fully reproduced as real runnable 8th examples instead. Chapter 7:
7 figure references found, none used — 1 (`fig7-1`) for stack-tip
material this chapter's adaptation chose not to cover (the `COUNT`-
reordering tip and single-value error-code convention — no clean,
non-contrived 8th example presented itself), and 6
(`fig7-3`/`fig7-5`/`fig7-7`/`fig7-8`/`fig7-9`/`img7-211`) for the
state-table/`DOER`-`MAKE` material explicitly deferred to the future
Chapter 8. Full detail in `ILLUSTRATIONS.md`'s "Chapter 6 onward"
section.

### Current stopping point

Chapters 6 and 7 are both complete, verified, committed, and **pushed
to `origin/master`** (working tree clean apart from the intentionally-
untracked `thinking-forth-1.0/png/`). Nothing is mid-chapter. The
illustration audit for Ch.1–5 is complete and will not need repeating.

### Best next task

1. Write the deferred **Chapter 8**, covering the rest of Brodie's
   actual chapter 7: his "State Table" section (target: 8th maps/`o:`
   namespace, replacing raw `CREATE`/`DOES>`/`CMOVE`-based indexed
   memory — including the "alternating states" REAL/PSEUDO-table
   variant, which should port beautifully to "swap which map a var
   currently points at," the same trick as Chapter 1's `apples`
   example) and his "Vectored Execution" section (target: verify
   `defer:`/`w:is` against the real runtime first, then use it as the
   direct replacement for hand-rolled `DOER`/`MAKE` — don't assume it
   behaves like `DOER`/`MAKE` until tested).
2. Once Chapter 8 is verified and written, revisit the 6 deferred
   `ILLUSTRATIONS.md` entries for Brodie's state-table/`DOER`-`MAKE`
   figures.
3. After Chapter 8, read `thinking-forth-1.0/chapter8.tex` in full
   before assuming its title or content — this becomes *our* Chapter 9
   (see `PLAN.md`'s renumbering note).
4. Same method as always, and the same beginner-readability rule
   (stated near the top of this file) applied from the first draft.

---

*(The sections below are filled in at the end of each work session —
see the most recent dated entry for what actually happened last.)*
