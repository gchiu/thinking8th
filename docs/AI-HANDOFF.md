# AI Handoff — Thinking 8th

Read this first, before `docs/OVERNIGHT-NOTES.md`. This file is the
current-state summary; OVERNIGHT-NOTES.md is the detailed session-by-session
log behind it. If they ever disagree, trust the repository (git log, the
files themselves) over either document, and fix the stale one.

## Project goal

An original book teaching the [8th](https://8th-dev.com/) programming
language, inspired by the structure and spirit of Leo Brodie's *Thinking
Forth* — **not** a mechanical Forth-to-8th translation. Each chapter
identifies what Brodie was actually teaching, separates that from
Forth-specific machinery, and finds the natural 8th expression of the same
idea. See `manuscript/00-preface.md` for the full statement of intent, and
`docs/ADAPTATION-METHOD.md` for the reusable methodology this project
follows (written for reuse on other source-book/target-language pairs too).

## Key paths

- Working repository: `D:\repos\thinking8th` (this repo)
- Official 8th distribution (**read-only** — see Safety rules below):
  `D:\8th`, binary at `D:\8th\bin\win64\8th.exe`
- Original *Thinking Forth* LaTeX source (**reference only**, do not edit):
  `thinking-forth-1.0/`, CC BY-NC-SA 2.0

## Manuscript status

Chapters completed, verified, and committed, in reading order:

| File | Adapts | Status |
|---|---|---|
| `manuscript/00-preface.md` | — | done |
| `manuscript/01-getting-started.md` | — | done |
| `manuscript/02-notation.md` | — | done |
| `manuscript/chapter01-philosophy.md` | Ch.1, "The Philosophy of Forth" | done |
| `manuscript/chapter02-analysis.md` | Ch.2, "Analysis" | done |
| `manuscript/chapter03-decomposition.md` | Ch.3, "Preliminary Design/Decomposition" | done |
| `manuscript/chapter04-detailed-design.md` | Ch.4, "Detailed Design/Problem Solving" | done |

Every substantive code example has a matching, executed, verified `.8th`
file under `code/chNN/`. Not yet started: Chapter 5 onward (Brodie's book
has 8 chapters + appendices; check `thinking-forth-1.0/chapterN.tex` for
each one's *actual* title before assuming — two of the four done so far had
titles that turned out different from a first guess).

**Beginner-readability rule (established after a dedicated pass over
Preface–Ch.4 — apply it from the start in every future chapter, don't
write first and fix vocabulary sequencing after):** for every 8th word or
syntactic form, the order is **idea → new word, explained in plain
English first (then in 8th's own shorthand notation, if there is one,
introduced explicitly as shorthand for the plain-English version just
given) → tiny verified demo → larger example that uses it**. Never use a
word in a code example before the reader has been told what it does.
Assume a competent programmer with zero prior Forth, stack-language, or
8th knowledge; Forth comparisons are asides a non-Forth reader can skip,
never a comprehension prerequisite. Words already taught by the end of
Chapter 4 (don't re-explain, just use): the stack, `.`/`cr`, `dup`/
`drop`/`swap`, comments (`\`, `--`, `(* *)`), words vs. functions, `:`/
`;`, namespaces (`n:`/`s:`/`a:`/`m:`), stack-effect comments (SED
notation), `var`/`var,`/`@`/`!`, `if`/`else`/`then`, booleans, `not`,
`and`, `constant`, array literals, `caseof`, `n:<`/`n:>` (and their
non-obvious operand order), `s:strfmt`, `'` (tick), `defer:`/`w:is`,
`;then`, `repeat`/`while!`/`loop`. (Plain `while` — not `while!` — was
used once, found to leak; see below. Prefer `while!` going forward
unless there's a specific reason not to.)

## Publication workflow (DOCX master → PDF proof)

**The DOCX is the only editable master.** `manuscript/Thinking-8th.docx` is
generated *from* the Markdown files in `manuscript/*.md` by a build script —
it is not hand-edited. `proof/Thinking-8th-proof.pdf` is generated *from*
the DOCX and is read-only proofing output — never edited independently, and
never treated as a second source of truth.

```
Markdown (manuscript/*.md)  -->  DOCX master  -->  PDF proof
     (source, hand-edited)       (generated)        (generated)
```

### Trim size (decided, do not silently change)

**6.8125" × 9.125"** — Leo Brodie's own original *Thinking Forth* trim size
(found in `thinking-forth-1.0/tf.sty`'s `\oldgeometry`). Chosen over A5
(tested and rejected — caused real code-line wrapping) and US Letter (judged
too large/document-like). This is the `brodie` profile in
`tools/build-docx.js` and is the **default** profile — plain `node
build-docx.js` with no environment variable builds this size. `letter` and
`a5` profiles still exist for reference/comparison, writing into `proof/`,
not `manuscript/`.

### How to rebuild the DOCX

```bash
cd tools
npm install        # only needed once per clone; node_modules is gitignored
node build-docx.js
```

Writes `manuscript/Thinking-8th.docx`. Auto-discovers every `manuscript/*.md`
file by filename sort (`00-preface.md`, `01-notation.md`, then
`chapterNN-*.md` in order) — a new chapter file just needs the right name,
no script edit required.

### How to generate the PDF proof

No `pandoc` or LibreOffice/`soffice` on this machine — PDF export goes
through real Microsoft Word via PowerShell COM automation:

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("D:\repos\thinking8th\manuscript\Thinking-8th.docx")
$doc.Fields.Update() | Out-Null
$doc.SaveAs2("D:\repos\thinking8th\proof\Thinking-8th-proof.pdf", 17)
$doc.Close(0)
$word.Quit()
```

**`$doc.Close(0)` is mandatory — never call `Close()` with no argument.**
`Fields.Update()` marks the document dirty, and a bare `Close()` under
unattended COM automation silently *saves* Word's in-memory changes (e.g.
the dynamic TOC field materialized into static paragraphs) back into the
source `.docx`. This already happened once, undetected, before the pattern
was fixed — always confirm the docx's file size/mtime is unchanged after a
proof export.

After regenerating, render a few pages to actually look at (no LibreOffice,
so use Word's own PDF plus Poppler, which *is* installed):

```bash
pdftoppm -jpeg -r 100 -f <first> -l <last> proof/Thinking-8th-proof.pdf page
```

Then read the resulting `page-NN.jpg` files. Delete them afterward — they're
inspection scratch, not deliverables; only the `.pdf` is committed.

Validate OOXML schema correctness (catches structural bugs the visual check
might not, though the reverse is also true — see below):

```bash
python <docx-skill-dir>/scripts/office/validate.py manuscript/Thinking-8th.docx
```

## How 8th code examples are verified

Every substantive `.8th` code block shown in the manuscript has a matching
file under `code/chNN/` that is actually executed:

```bash
"D:\8th\bin\win64\8th.exe" code/chNN/example.8th
```

Output is compared by hand against what the manuscript claims, and the
manuscript quotes the *actual* observed output, not a predicted one. Small
one-off syntax questions are checked with disposable scratch scripts (not
committed) before being used in a real example — never guessed.

## Important technical discoveries (8th language)

- `( ... )` is **not** a comment in 8th (unlike Forth) — it compiles an
  anonymous word. Comments are `\` / `--` (line) and `(* ... *)` (block).
- `var`/`var,` + `@`/`!` behave like Forth's `VARIABLE`; a var's name is a
  reference, not the value.
- Namespaces (`n:`, `s:`, `a:`, `m:`, ...) are a real enforced language
  feature, not a naming convention.
- `caseof` does real table lookup (pushes an array item by index, or calls
  it if it's a word) — a genuinely better fit for "decision table" than
  anything in 1984 Forth.
- `defer:` / `w:is` is 8th's forward-reference mechanism (declare a
  no-op-by-default word now, attach real behavior later).
- No `n:<=`/`n:>=` — build "a >= b" as `a b n:< not`.
- `;then` = shorthand for `;; then` (early-return-if-true, still closes the
  `if`). Useful for guard clauses.
- Pre-tested while loop shape: `COND if repeat BODY COND while! then` (the
  docs' own `repeat...while` example is post-tested — runs the body at
  least once — which is often *not* what you want).
- **`while` never consumes the boolean it tests — on *either* the
  loop-back or the fall-through path.** Confirmed by checking `depth`
  before/after in an isolated test. Using plain `while` inside a loop
  that recomputes its condition fresh each iteration (rather than
  reusing one carried value, as the docs' own example does) leaks one
  stray value per iteration. Found this the hard way: it was in
  `code/ch04/roman.8th`'s `consume-tier`, silently harmless there only
  because nothing downstream ever inspected the stack below what it
  expected. Fixed by using **`while!`** (the consuming variant) instead
  — same behavior, no leak. Default to `while!` for this pattern.
- `a:each`'s quotation receives `(item index --)`. `' word low high loop`
  passes just the index.
- 8th's execution model (per its own docs): compiling a word packs into an
  internal code cache, not native machine code; **no** optimization except
  tail-call elimination, by explicit design choice. Brodie's "Forth ≈
  assembler speed via threaded code" argument does not transfer — say so
  rather than forcing the analogy.
- Full details and how each was verified: `docs/OVERNIGHT-NOTES.md`.

## Important publishing/tooling discoveries

- **Word's TOC field silently drops a literal backslash** from a heading's
  TOC entry (confirmed via an isolated A/B test docx — it's Word's own TOC
  generation, not a bug in the emitted OOXML). Fix: insert a zero-width
  space (U+200B) immediately after the backslash in the heading source text
  — invisible everywhere it renders. Already applied in
  `manuscript/02-notation.md`'s "Comments" heading; don't strip it.
- **`**[bold link](url)**` — a markdown link wrapped in bold — renders as
  literal, unparsed markdown text**, because `parseInline`'s bold-span
  handler grabs raw text between `**` markers without recursing into it
  for nested links. Don't nest bold and links in the markdown source;
  style a link plainly instead. (One instance found and fixed, in
  `01-getting-started.md`; grepped the repo to confirm it was the only
  one.)
- **A markdown list item that wraps onto an indented continuation line**
  (how nearly every multi-sentence list item in this manuscript is written)
  needs the parser to keep gathering lines until a blank line or a new
  block starts — stopping at the literal `-`/`N.` marker line only silently
  drops the rest of the item into an unindented orphan paragraph. Already
  fixed in `tools/build-docx.js`; the fix is retroactive (applies to every
  chapter, not just the one that surfaced it).
- Fenced code blocks in the markdown are tagged with a language marker so
  the DOCX build can tell source from output: ` ```8th ` (real 8th source,
  gets the shaded "Code" style) vs. ` ```text ` (printed program output,
  gets the italic "Code Output" style with a left rule). **Tag every new
  fenced block this way from the start** — going back and fixing untagged
  ones later is tedious (had to do it once already for Chapters 1-3).
- `tools/build-docx.js`'s style set: Title, Subtitle, Heading 1 (chapter
  titles — page-break-before baked in), Heading 2 (Brodie's `\section`),
  Heading 3 (reserved, unused so far), Code, Code Output, Block Quotation,
  Caption, Table Text, Note, plus a `TOCHeading` style (looks like Heading 1
  but has no `outlineLevel`, so "Contents" doesn't list itself in the TOC).

## Known unresolved issues

- No running chapter-title header (would need a `STYLEREF` field) — judged
  out of scope for the "don't redesign" layout pass; a natural future
  refinement, not a defect.
- Relative code-file hyperlinks (`../code/chNN/...`) work correctly today
  (docx and code/ are sibling directories) but would be dead links in a
  *standalone* distributed PDF/DOCX outside this repo's layout. Not fixed;
  likely resolution is an appendix with inlined code, or converting links to
  plain path text, at final-publication time.
- `SED:` / `debug/sed` (runtime-checked stack effects), `w:@`/`w:!`
  (word-local variables), and 8th's object system (`o:` namespace) are all
  still unexplored — none needed yet, will likely matter for later chapters
  covering testing/data structures.

## Current Git status

Working tree is clean. 10 local commits ahead of `origin/master`, **none
pushed**. Latest commits, newest first:

```
3432388 Beginner-readability pass: Preface-Ch.4, plus two real bugs found
90042a1 Add AI handoff and generalized adaptation-method documentation
f8786d4 Add Chapter 4 (Detailed Design/Problem Solving) and fix a list-render bug
3b09be0 Adopt Brodie's original 6.8125in x 9.125in trim as the publication master
1740f55 Layout hardening pass: fix 9 proof issues, test A5 as exploratory trim
3b4dfd8 Add DOCX editable master and PDF proof workflow
16be86e Add Chapter 3 (Preliminary Design/Decomposition): a component thermostat
f5cb3da Light editorial pass: fix typo, soften legal/rhetorical overreach
b785310 Add Chapter 2 (Analysis): interfaces as sketches, rules as decision tables
ac62c8f Start Thinking 8th: preface, notation, and Chapter 1 (Philosophy)
```

Run `git log --oneline -n 10` and `git status` at the start of a new session
to confirm this is still accurate before doing anything else.

## Exact next logical task

1. Read `thinking-forth-1.0/chapter5.tex` — **check its actual title**,
   don't assume from memory or from Brodie's table of contents alone.
2. Follow `docs/ADAPTATION-METHOD.md`'s per-chapter process: understand what
   Brodie is teaching, separate the universal lesson from Forth machinery,
   design/verify original 8th examples (reusing an earlier chapter's
   running example, or inventing a fresh original scenario — never
   reproducing Brodie's own specific invented scenarios or interview
   quotes), write original prose, tag fenced code blocks `` ```8th ``/
   `` ```text `` from the start. **Apply the beginner-readability rule
   above as you write, not as a fix-up pass afterward** — for every new
   8th word, explain it in plain English (and its SED shorthand, if
   used) before the code that relies on it, with a tiny verified demo.
3. Add `manuscript/chapter05-<slug>.md`, add matching verified files under
   `code/ch05/`.
4. Rebuild the DOCX, regenerate the PDF proof (`$doc.Close(0)`!), spot-check
   a few rendered pages (chapter opening, any new code blocks, the TOC, the
   final page).
5. Update `docs/OVERNIGHT-NOTES.md` with what was done and any new
   technical findings; update this file's "Manuscript status" table.
6. Commit `.md` + `.docx` + `.pdf` (+ any new `code/ch05/*.8th`) together as
   one checkpoint. Do not push.

## Safety rules (do not violate)

- **Never modify anything under `D:\8th`.** It is read-only reference
  material; only ever *execute* its binary (`D:\8th\bin\win64\8th.exe`).
- **Never push to the remote** unless the user explicitly asks in that
  session. Local commits are fine and expected; `git push` is not.
- **Never discard user changes.** Run `git status` before any command that
  could discard uncommitted work; stash or commit first if anything
  unexpected is present.
- **The DOCX is the master — preserve it, don't hand-edit it.** All
  manuscript content changes go through the Markdown files and a rebuild.
  If a DOCX-only formatting tweak is ever made directly in Word by a human,
  treat that as a deliberate edit to preserve, not something to silently
  overwrite on the next `node build-docx.js` run without checking first.
- **Proofs are generated from the DOCX, never edited independently.** If a
  PDF looks wrong, fix the Markdown and/or `tools/build-docx.js`, rebuild
  the DOCX, then regenerate the PDF from that — never touch the PDF
  directly, and never maintain a hand-tweaked PDF as a second source of
  truth.
