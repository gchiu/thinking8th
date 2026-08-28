# Overnight Notes

Working log for the *Thinking 8th* project. Concise, not a transcript.
Update this file at the start/end of future sessions rather than replacing
it wholesale.

## Session 2026-08-28

### Starting state

The repo contained only `README.md` and the untouched *Thinking Forth*
LaTeX source (`thinking-forth-1.0/`). No 8th adaptation existed yet — this
was a greenfield start, not a resume of prior conversion work.

### What was done

- Established the manuscript structure: `manuscript/` (prose, Markdown),
  `code/` (standalone, runnable `.8th` files, one subdir per chapter),
  `docs/OVERNIGHT-NOTES.md` (this file).
- Wrote `manuscript/00-preface.md` — what this book is and isn't (not a
  mechanical Forth→8th translation), licensing note for the Brodie source.
- Wrote `manuscript/01-notation.md` — up front, because it prevents a
  specific, immediate misreading: **`( ... )` is not a comment in 8th**.
  It compiles an anonymous word. Comments are `\` or `--` (line) and
  `(* ... *)` (nesting, multi-line). This is the single biggest syntactic
  trap for anyone arriving with Forth reflexes and had to be dealt with
  before showing any code.
- Wrote `manuscript/chapter01-philosophy.md`, adapting Brodie's Chapter 1
  ("The Philosophy of Forth"). Kept his pedagogical arc (elegance history →
  Parnas/information-hiding → words as the atom of the language → implicit
  calls/implicit data passing → lexicons → hiding data-structure
  construction → is it high-level → design language → performance) but
  rewrote all of it in original prose, condensed the generic CS-history
  material substantially (it isn't Forth-specific and Brodie spends ~700
  lines on it), and rewrote the Forth-specific back half around actual 8th
  behavior rather than adjusting terminology only.

### Verified 8th technical findings (executed, not guessed)

All run against `D:\8th\bin\win64\8th.exe`, an unmodified install.

- **`( ... )` really does mean "anonymous word," not "comment."** Confirmed
  in `docs/md/03_syntax.md`. Comments are `\`, `--` (both line, per
  `docs/help.sql` word entries), and `(* ... *)` (nesting block comment).
  `SED:` also exists as a stack-effect-diagram comment word, intended to be
  overridden by `debug/sed` for runtime-checked stack effects — worth a
  callout in a later chapter on testing/documentation, not used yet.
- **`var` / `var,` / `@` / `!` / `n:+!`** work exactly as Brodie's
  `VARIABLE` / `@` / `!` / `+!`, including the "name is a reference, not
  the value" semantics. Verified with
  [`code/ch01/apples.8th`](../code/ch01/apples.8th) — output is exactly
  `20 21 20 5 6 20` on stdout.
- **Redefining a name from a `var` to a `:` word is legal** and prints
  `Redefining: user:apples` **to stderr** (confirmed by redirecting stdout
  and stderr separately) — it does not corrupt stdout output or program
  behavior. This is 8th's own built-in redefinition warning, analogous to
  a Forth system's "isn't unique" message, and is used in the book as a
  teaching point rather than something to suppress.
- **`if / else / then`** compile-only conditionals confirmed identical in
  spirit to Forth's, verified with
  [`code/ch01/breakfast.8th`](../code/ch01/breakfast.8th) — output
  `cereal / wash up` then (after flipping the `hurried` var to `false`)
  `eggs and bacon / wash up`.
- **Namespaces (`n:`, `s:`, `a:`, `m:`, ...) are a real, enforced language
  feature**, not a naming convention — confirmed in
  `docs/md/02_introduction.md` ("namespace: a vocabulary of (usually)
  related words," which is functionally identical to Brodie's own
  definition of "lexicon"). `with: n ... ;with` (bringing a namespace into
  unprefixed scope) confirmed in `samples/tutorials/02-numbers.8th`.
- **8th's actual execution model**, per `docs/md/02_introduction.md`: word
  compilation packs into an internal "code cache," *not* native machine
  code (an earlier version could generate native code; dropped due to iOS
  platform restrictions). 8th performs **no code optimization at all
  except tail-call elimination**, by explicit design choice (stated
  rationale: optimizers can silently change behavior; algorithm choice
  matters more than instruction selection). Brodie's "Forth is nearly as
  fast as assembler, via threaded code" argument does **not** transfer to
  8th and the chapter says so explicitly rather than forcing the analogy —
  the honest 8th story is portability (one implementation, many platforms)
  rather than raw speed.

### Inherited material found wrong / not applicable

N/A this session — there was no prior 8th conversion to audit; this is the
first chapter written from scratch.

### Unresolved questions / things to check before relying on them later

- Have not yet exercised `SED:` / `debug/sed` (runtime-checked stack
  effects) — flagged above as a good fit for a later chapter on testing,
  not verified.
- Have not yet looked at 8th's `w:@` / `w:!` word-local variables (used to
  replace what Forth would do with locals inside a definition) — will
  matter once the book reaches factoring/recursion territory
  (Brodie chapter 2-3 material).
- Have not yet investigated 8th's object system (`o:` namespace) or
  `structs`, which will matter for the "data structures" chapters later in
  Brodie's book (chapters 6-7). Not needed for chapter 1.
- Did not run `bin/setup.8th` (it writes `docs/help.db` inside `D:\8th`,
  which is out of scope per the read-only constraint on that directory).
  All word documentation used tonight came from `docs/md/*.md` and direct
  `grep` of `docs/help.sql` instead of the live `help`/`apropos` words.
  Future sessions should keep doing it this way rather than running setup.

### Correction to the note above

Brodie's actual Chapter 2 is **"Analysis"** (the programming cycle,
iterative development, defining interfaces/rules/data structures) — not
"A Dozen Easy Pieces" (that title belongs to a different, unrelated Forth
book, *Starting Forth*). Corrected after actually reading
`thinking-forth-1.0/chapter2.tex`.

### Chapter 2 ("Analysis") — done this session

Wrote `manuscript/chapter02-analysis.md`. Chapter 2 is mostly
language-agnostic project-management wisdom delivered through Brodie's
1980s interviews with working Forth programmers. Those interviews are
Brodie's own copyrighted material (real people, real quotes) and were
**not** paraphrased-to-the-point-of-reproduction or attributed as if
original to this book; the chapter instead extracts the underlying lesson
(iterate, don't over-plan, prototype) in fully original prose and cites
Brodie/the interviews only in general terms.

Where Brodie's own examples were genuinely reusable (the REQUEST/NEED
"interface pseudocode" idea; the phone-bill "decision table" idea), this
session deliberately built **original, differently-scenarios** rather than
copying Brodie's specific invented numbers/domain, per the project's
originality requirement — both new examples teach the identical lesson:

- **Interfaces as executable sketches**: an `admit-car` / `space-available?`
  parking-garage entry policy, in place of Brodie's warehouse
  REQUEST/REORDER example. Verified,
  [`code/ch02/admit-car.8th`](../code/ch02/admit-car.8th).
- **Decision tables**: a three-tier (day/evening/weekend) parking fee with
  a first-hour/additional-hour rate and a flat valet surcharge, in place of
  Brodie's phone-bill rate schedule. Verified,
  [`code/ch02/parking-fee.8th`](../code/ch02/parking-fee.8th) — output
  `800 / 400 / 500 / 900`, matches hand-calculated expectations exactly.

### New verified 8th technical finding

- **`caseof` is a real table-lookup, not sugar for `if`/`else` chains.**
  Confirmed by running `[ 400 , 200 , 100 ] constant first-hour-rates
  first-hour-rates tier @ caseof`: with a numeric array, `caseof` pushes
  the item at the given index (rather than executing it — that only
  happens when the stored item is itself a word). This makes Brodie's
  "decision table" idea implementable as an *actual* table in 8th, which
  is a genuinely better fit than anything available in the Forth Brodie
  was writing about in 1984, and was called out in the chapter as such.
- `not` is a plain, unprefixed global word (confirmed working on a `var`
  fetched with `@`), unlike most other operators which live in a
  namespace (`n:`, `s:`, etc.).

### Next logical place to continue

Brodie's Chapter 3 is "Problem Solving" (or check the actual title before
assuming — Chapter 1's title was correctly guessed, Chapter 2's was not).
Read `thinking-forth-1.0/chapter3.tex` first before writing anything.
General process for future chapters, unchanged from last session:

1. Read the relevant `thinking-forth-1.0/chapterN.tex` fully (or in large
   sections) before deciding what's language-specific vs. general wisdom.
2. For genuinely Forth-specific code examples, verify the 8th idiom by
   execution before writing prose.
3. For Brodie's own invented example scenarios (not core language
   features), prefer inventing an original scenario that teaches the same
   lesson over reproducing his specific numbers/domain — for copyright
   cleanliness, per this project's originality requirement.
4. Do not reproduce or closely paraphrase Brodie's interview subjects'
   quotes; extract the lesson in original prose and cite generally.

No uncommitted junk, temp files, or generated binaries were left in the
repository; scratch test files used to verify examples before finalizing
them live only in the session scratchpad, outside the repo.

## Session 2026-08-29 (continuation, survived a laptop restart)

### Editorial pass (approved by Graham, done before Chapter 3)

Fixed a typo in `01-notation.md` ("unit of an Forth" -> "unit of a Forth"),
softened an unnecessary legal conclusion in the preface ("a new,
independent work" -> "an original adaptation"), and narrowed three
rhetorically-overreaching claims in Chapter 1 (information-hiding as the
"only" way to build anything in 8th; an absolute claim that 8th "doesn't
distinguish... at the language level" between things and actions; an
implication that module/object-based code is inherently less changeable).
No content added; Chapters 1-2 otherwise unchanged.

### Chapter 3 ("Preliminary Design/Decomposition") — done this session

Read `thinking-forth-1.0/chapter3.tex` in full before writing (title
double-checked this time, no repeat of the Chapter 2 mistake). Brodie's
actual chapter covers two decomposition strategies (by component, by
sequential complexity), worked through via a "Tiny Editor" example, then
"the limits of level thinking" (where to start, don't bury your tools, and
a critique of "objects" that later editions of Brodie's own book
acknowledge is really a critique of selector-dispatch, not OOP generally).

Wrote `manuscript/chapter03-decomposition.md` around one original running
example — a thermostat — rather than adapting the tiny editor (which would
have been closer to reproducing Brodie's specific invented scenario than
the project's originality standard allows). The thermostat carries the
whole chapter: a `set-mode` word discovered to be shared by both an
automatic decision path and manual overrides (echoing Brodie's
INSERT-reuses-OVERWRITE moment); a "change in plan" (log only on mode
*transitions*, not every cycle) absorbed in one line because `set-mode`
already saw both old and new mode; and a `defer:`/`w:is` forward reference
letting an early-written sensor component call into a diagnostics
component that doesn't exist yet. The "objects" critique was deliberately
reframed narrowly (selector-dispatch vs. many named words) rather than
repeated as a broad claim against OOP, per this session's fairness
standard.

Verified: [`code/ch03/thermostat.8th`](../code/ch03/thermostat.8th), run
against `D:\8th\bin\win64\8th.exe`, output exactly:
```
now heating
now idle
now cooling
sensor reading 999 looks implausible -- check wiring
final mode: cooling
```
Also independently verified the standalone `60 decide-mode .` snippet
quoted in the "Limits of Level Thinking" section (prints `1`, i.e.
HEATING) since it's presented outside the main file.

### New verified 8th technical findings

- **`defer:` / `w:is`** work exactly as documented in
  `docs/md/07_words_interpreter.md`: `defer: name` creates a no-op forward
  reference; `' word-name w:is deferred-name` attaches real behavior later.
  Calling the deferred word before assignment is silent, not an error.
- **`n:<` / `n:>` / `n:=`** confirmed to take `(a b -- flag)` with the
  conventional operator order (`a b n:<` tests `a < b`), consistent with
  standard Forth comparison-word ordering. There is no `n:<>`; "not equal"
  is `n:= not` (using the plain `not` word already confirmed in Chapter 2).

### Unresolved / deferred to a later session

- `SED:` / `debug/sed`, `w:@`/`w:!` word-locals, and the `o:` object system
  are still unexplored (noted previously; still not needed yet).
- Brodie's Chapter 4 title not yet checked — read it before assuming.

### FORMAT CHANGE (mid-session correction from Graham)

The editable manuscript master is now **`manuscript/Thinking-8th.docx`**,
not the Markdown files. Markdown remains as source/checkpoint material and
should keep being written/verified first per the established method, but
each chapter now also needs to be added to the DOCX, using Word styles
modeled on `thinking-forth-1.0`'s LaTeX layout conventions (not LaTeX
itself, and not pixel-perfect). PDF will eventually be generated from the
DOCX later — not attempted yet. See this session's DOCX work below (if
any was completed before the session ended) for the current state of the
Word master and its style set.

### DOCX master built this session

`manuscript/Thinking-8th.docx` now exists and contains the full manuscript
(title page, TOC, Preface, Notation, Chapters 1-3).

**Environment note (important for future sessions):** this machine has
neither `pandoc` nor LibreOffice/`soffice` installed, contrary to what the
`docx` skill assumes. What *is* available: Node + npm (so the `docx` npm
package installs fine), and a working, automatable **Microsoft Word**
install (COM-automatable via PowerShell — confirmed working, see below).
Given no pandoc, the conversion approach is a small hand-rolled
markdown->docx converter, not pandoc+reference-doc.

- `tools/build-docx.js` (Node, uses the `docx` npm package) reads every
  `manuscript/*.md` file in filename-sorted order and rebuilds
  `manuscript/Thinking-8th.docx` from scratch each run. `tools/package.json`
  pins the `docx` dependency. Run with:
  ```
  cd tools && npm install && node build-docx.js
  ```
  `tools/node_modules` is git-ignored; `npm install` must be re-run after a
  fresh clone. The script auto-discovers `manuscript/*.md` by filename sort
  (`00-preface.md`, `01-notation.md`, `chapter01-*.md`, ...) — a new
  `chapterNN-*.md` is picked up automatically, no script edit needed, as
  long as the naming convention is kept.
- Styles defined (all in `tools/build-docx.js`'s `styles` object): Title,
  Subtitle, Heading 1 (used for chapter/front-matter titles — page-break-
  before is baked into the style, along with a bottom rule; this doubles as
  the "chapter title" style Graham asked for, since Word's TOC field keys
  off the real built-in Heading1/2/3 styles), Heading 2 (Brodie's
  \section), Heading 3 (reserved, unused so far — no chapter has needed a
  \subsection yet), Code, Code Output (defined but not yet wired into the
  markdown->docx conversion — see caveat below), Block Quotation, Caption,
  Table Text, Note. A numbered-list config (`book-numbering`) and native
  Word bullets are wired up.
- **Known caveat, deliberately not fixed yet (low value, per "don't chase
  pixel-perfect"):** the converter applies the "Code" style to *every*
  fenced code block uniformly; it does not yet distinguish 8th source from
  printed terminal output (both are bare ` ``` ` fences in the markdown,
  undifferentiated). A "Code Output" style exists and is ready to use once
  the markdown adopts some marker (e.g. a language tag) for output blocks.
- **Known caveat:** the "Comments: `\`, not `( ... )`" heading (Notation
  chapter) loses its backslash character specifically in the generated
  Word TOC entry (visible in the TOC as "Comments: , not..."); the heading
  itself renders correctly in the body. This looks like a Word-native TOC
  field quirk with a literal backslash in heading text, not a bug in the
  generated XML (the docx passed full OOXML schema validation). Not worth
  rewording an already-good heading to route around a cosmetic TOC-only
  glitch; noted here instead.
- Validated: `python <docx-skill>/scripts/office/validate.py
  manuscript/Thinking-8th.docx` passes full OOXML schema validation
  (0 errors). Also opened and re-saved via real Word (COM automation, see
  below), which is a stronger validity signal than schema-only checking.

### Proof PDF workflow (per Graham's mid-session instruction)

`proof/Thinking-8th-proof.pdf` is generated **from** the DOCX, never edited
independently. Since neither `pandoc` nor `soffice` exist on this machine,
PDF export uses real Word via PowerShell COM automation:
```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("D:\repos\thinking8th\manuscript\Thinking-8th.docx")
$doc.Fields.Update() | Out-Null          # refreshes the TOC page numbers
$doc.SaveAs2("D:\repos\thinking8th\proof\Thinking-8th-proof.pdf", 17)  # 17 = wdFormatPDF
$doc.Close(); $word.Quit()
```
This doubles as the "open and validate the DOCX" step Graham asked for —
if Word can open it, update its fields, and re-save it, the file is
structurally sound in the way that actually matters. Rendered the PDF to
JPEG (`pdftoppm`, from the Poppler install already on this machine's PATH)
and inspected several pages directly: title page, TOC, a Notation page
(code shading, inline `code` spans, bold/italic all correct), the
Chapter 2 rate table (this caught and led to fixing a real bug — see
below), and the last page of Chapter 3 (confirms the document ends
cleanly). Deleted the inspection JPEGs afterward; only the PDF is kept
under `proof/`.

**Real bug found and fixed during this visual check:** the initial
table-header-bolding code tried to read a `.text` property off an
already-constructed `TextRun` object (`r.text`), which is `undefined` on a
`docx`-npm `TextRun` (it's not a plain data object) — so every table
header cell rendered as invisible bold empty text. Fixed by threading a
`forceBold` option through `parseInline` itself, so header-cell runs are
built bold from the start rather than patched after construction. Rebuilt,
re-validated, re-rendered, confirmed the fix (`code/ch02`'s rate table
headers "first hour" / "additional hour" now visible). This is exactly why
the instruction to actually open/render generated documents matters — the
schema validator alone did not catch this, because empty bold runs are
perfectly valid OOXML.

### Layout hardening pass (2026-08-29, before Chapter 4)

Graham reviewed the 22-page Letter proof and asked for nine specific fixes
before continuing. All nine done in `tools/build-docx.js` plus small
markdown edits, then Graham asked to also test A5 as a trim size before
finalizing anything — that test is below, master is **still Letter**,
nothing permanent changed on trim size.

**Fixes made:**
1. **Blank page removed.** Cause: manual `PageBreak()` paragraphs stacked
   on top of `Heading1`'s own baked-in `pageBreakBefore: true`, producing
   an extra blank page each time. Removed the manual breaks; the heading
   style's own `pageBreakBefore` is sufficient.
2. **"Contents" no longer lists itself in the TOC.** Gave it its own
   `TOCHeading` paragraph style (visually identical to `Heading1` —
   same page-break-before, border, size — but with no `outlineLevel`), so
   it's outside the `headingStyleRange: "1-3"` sweep the TOC field uses.
3. **TOC backslash bug, root-caused and fixed.** Word's *own* TOC-field
   generation (not anything in the OOXML I emit — confirmed by an isolated
   4-heading A/B test docx) silently drops a literal `\` character from a
   TOC entry's display text when it sits directly next to other text, in a
   way unrelated to run boundaries or styling (tried isolating it in its
   own run and that alone did **not** fix it). Confirmed fix: insert a
   zero-width space (U+200B) immediately **after** the backslash in the
   heading source text. Applied to `01-notation.md`'s "Comments: `\`, not
   `( ... )`" heading — the character is invisible in every rendering
   (body text, TOC, print) and is there **on purpose**; don't strip it if
   you ever touch that line, and don't be surprised if a plain-text diff
   tool renders it oddly.
4. **Preface no longer names `01-notation.md`** — now says "the following
   section, 'A Note on Notation.'"
5. **Page numbers + header/footer added.** Footer: centered page number
   (`PageNumber.CURRENT`), small and gray. Header: "Thinking 8th," small
   italic gray, right-aligned. Both suppressed on the title page via
   `titlePage: true` + separate empty `first` header/footer. No running
   chapter-title header (no `STYLEREF` field) — judged out of scope for a
   "don't redesign" cleanup pass; would be the natural next typographic
   refinement if/when the book is closer to final.
6. **Code blocks no longer split across pages when they'd fit on one.**
   `codeParagraphs()` now chains every line but the last with
   `keepNext: true` (plus `keepLines: true` on each), so Word treats the
   whole block as one keep-together unit. Verified against the longest
   blocks in the manuscript (the 12-line rate-table block in Ch.2, several
   in Ch.3) — none split in the rebuilt proof.
7. **Widow/orphan control.** Added `widowControl: true` explicitly to
   every prose-bearing style (`Normal`, `Code`, `CodeOutput`,
   `BlockQuotation`, `Note`) and `keepNext: true` to all three heading
   styles (so a heading can't be stranded at the bottom of a page,
   separated from the paragraph under it). This is what fixed Chapter 3's
   "Summary" heading, which previously split across two pages — it now
   sits cleanly on one page with its full paragraph, confirmed visually.
8. **"Code Output" style wired up.** Fenced code blocks in the markdown
   now carry a language tag: ` ```8th ` for real source, ` ```text ` for
   printed program output. `tools/build-docx.js` picks the Word style
   accordingly (`Code` = gray-shaded monospace; `CodeOutput` = italic gray
   monospace with a left rule, no shading). All ~24 fenced blocks across
   the manuscript were classified and tagged by hand (20 source, 4
   output). Confirmed visually distinct in the rebuilt proof.
9. **Relative code-file hyperlinks reviewed, left as-is.** They resolve
   correctly today (`manuscript/Thinking-8th.docx` and `code/` are sibling
   directories, so `../code/ch01/apples.8th` opens correctly from Word).
   Documented caveat for whoever handles final distribution: a
   *standalone* distributed PDF/DOCX (outside this repo's directory
   layout) will have dead links. Not fixed now, per Graham's own framing
   ("for now they may remain useful... do not assume [it] will be
   meaningful in the eventual distributed PDF") — likely resolution later
   is either an appendix with inlined code, or converting links to plain
   path text at final-publication time.

**Real bug found and fixed in the tooling itself, not the manuscript:**
the Word-COM PDF-export snippet used in earlier sessions (`$doc.Close()`
with no argument) let Word **silently save changes back into the source
`.docx`** on close — because `Fields.Update()` marks the document dirty,
and an argument-less `Close()` under unattended COM automation apparently
defaults to saving rather than discarding. This had already happened once
undetected: `manuscript/Thinking-8th.docx` grew from ~33.5KB to ~46.7KB
and gained 28 paragraphs (Word had materialized the dynamic TOC field into
real static paragraphs) after what was meant to be a read-only proof
export. **Fix: always call `$doc.Close(0)`** (`0` =
`wdDoNotSaveChanges`), confirmed by checking the docx's size/mtime is
unchanged after the PDF export. This matters a lot given the standing
instruction that the DOCX is the master and the PDF/proof pipeline must
never write back to it — **use `Close(0)` in every future Word-COM
snippet, no exceptions.**

### A5 trim-size test (exploratory only — master is still Letter)

Per Graham's request, tested A5 (148mm x 210mm) as a possible trim size,
motivated by wanting a page to feel like "a bounded unit of thought," the
way Brodie's book used the disk-block/screen page rhythm. Built via
`PAGE_PROFILE=a5 node build-docx.js` (script now takes this env var;
`letter`, the default, is unaffected and still writes to
`manuscript/Thinking-8th.docx`). A5 output goes to
`proof/Thinking-8th-A5-test.docx` / `-proof.pdf`, deliberately **not** in
`manuscript/`, and is not the master.

Same fonts/sizes as Letter in both, on purpose — a fair trim-only
comparison, not a re-tuned A5 design. Margins used for the test: top
0.7in, bottom 0.75in, left/right 0.6in (giving a ~4.63in text column,
vs. Letter's ~6.5in).

**Findings:**
- **Page count:** 21 (Letter) vs. **33 (A5)**, +57%, for identical content.
- **Body-text readability:** genuinely good at A5 — comfortable measure,
  doesn't feel cramped, reads more like an actual book than Letter does.
- **Tables:** fine, no cramping (checked the Ch.2 rate table).
- **Chapter openings, headers/footers, widow/orphan/keepNext behavior:**
  all carry over correctly at A5 (same style rules, just different
  absolute page numbers).
- **Code width and wrapping — the real cost of A5:** most code blocks fit
  the ~4.6in column fine at the current 9.5pt Consolas. But the longest
  lines in the manuscript (up to 72 characters, all in Chapter 3) do
  **not** all fit. Confirmed one concrete visible casualty: the
  "before/after" annotated `defer:` example in Chapter 3 ("Decomposition
  by Sequential Complexity") has two long commented lines that soft-wrap
  mid-line, breaking the code's visual alignment (page 31 of the A5 test
  PDF). This did not happen anywhere in the Letter proof. A smaller
  code-specific font size (the "Code"/"Code Output" styles are already
  factored out and easy to retune independently of body text) or
  reformatting that one block's long comment lines would fix it, but
  neither was done here since this is a trim-size test, not a final tune.
- **Whether page-by-page rhythm helps learning:** genuinely plausible and
  worth taking seriously — a page more often ends near a natural
  paragraph/section boundary at A5 just because there's less content per
  page, which does create more of a "one idea per page" feel in spots.
  But this is a subjective, content-dependent effect that will vary
  chapter to chapter and is hard to fully judge from 3 chapters alone.

**Not decided.** Graham's first question about page size was dismissed
(interactive question, not answered) before this A5 test was requested;
this section is the promised "report the options" instead of a silent
choice. Three live options, unchanged from that dismissed question:
6"x9" (standard POD trim, also a named option in Brodie's own LaTeX
source), 6.8125"x9.125" (Brodie's own book's actual default trim, also in
the LaTeX source), or continuing with US Letter. A5 is now a fourth,
Graham-proposed option with real trade-offs measured above (much better
"bounded unit of thought" feel and portability; a real, non-trivial code-
wrapping cost at current type sizes; +57% page count). Waiting on Graham's
call before touching the master's page size.

### Trim size decided (2026-08-29): Brodie's original 6.8125" x 9.125"

Graham decided: use Leo Brodie's own original *Thinking Forth* trim size
(6.8125in x 9.125in — `tf.sty`'s `\oldgeometry`), not A5, not Letter.
Reasoning: preserves the original's proportions/character, gives
substantially more horizontal room than A5 (this is a programming book —
readable code lines matter more than minimizing page count), and Letter
was unnecessarily large/document-like.

**This is now the default and only master trim.** `tools/build-docx.js`'s
`PROFILES` was restructured:
- `brodie` (6.8125in x 9.125in) is now the **default** profile (plain
  `node build-docx.js`, no env var needed) and writes to
  `manuscript/Thinking-8th.docx` — i.e. it's the master now.
- `letter` and `a5` still exist as named profiles (`PAGE_PROFILE=letter`
  / `PAGE_PROFILE=a5`) but now write into `proof/` as reference/rejected
  material, not the master. `a5`'s output path is unchanged from the
  earlier exploratory test (`proof/Thinking-8th-A5-test.docx`), so those
  already-committed files were left as-is rather than regenerated.

Margins chosen for the `brodie` profile (not copied from Brodie's own
LaTeX margins, which reserve a wide right margin for marginalia/tip boxes
this book doesn't use): top 0.6in, bottom 0.7in, left 0.6in, right 0.55in
— giving a ~5.66in text column (vs. Letter's ~6.5in, A5's ~4.63in).

**Verified this fixes the A5 code-wrapping problem it was chosen to
fix:** the same "before/after `defer:`" annotated block in Chapter 3 that
visibly wrapped at A5 (including its 72-character line, the longest in
the manuscript) now renders with **no wrapping at all** at this trim —
confirmed by rendering and reading the actual page. Page count: 26 (vs.
21 at Letter, 33 at A5) — a reasonable middle ground, as expected.

Also re-checked at this trim: TOC (backslash fix still holds), the Ch.2
rate table (clean, no cramping), a chapter opening (the long title
"Chapter 3: Preliminary Design and Decomposition" now wraps to two
lines — normal and expected at this narrower width, not a defect), the
title page (still no header/footer/page number), and the final page
(Chapter 3's Summary still ends cleanly, keepNext/widowControl still
holding). No further margin adjustment was needed beyond the initial
choice above — verified by inspection, not just assumed.

### Chapter 4 ("Detailed Design/Problem Solving") — done this session

Read `thinking-forth-1.0/chapter4.tex` in full (title checked, ~1800
lines). Brodie's chapter covers general problem-solving technique
(Polya-style: work backward, recognize auxiliary problems, etc.), a
"detailed design" step list, 8th's-worth-keeping syntax conventions
(numbers precede names, definitions consume their arguments, zero-
relative numbering, avoid input-stream lookahead...), a
calculation-vs-data-structure-vs-logic decision hierarchy, and an
extended worked example (converting a number to Roman numerals).

Wrote `manuscript/chapter04-detailed-design.md`. The general
problem-solving material (water-jug puzzle, nine-dots puzzle) is
condensed into original prose — these are famous, generic puzzles, not
Brodie's invention, safe to reference by description without
reproducing his wording. The syntax-conventions section ties two points
back to earlier chapters rather than treating them as new: "recognize
the auxiliary problem" connects to Chapter 3's `defer:`, and "avoid
input-stream lookahead" is answered the same way. The
calculation/data-structure/logic section uses an original parking-garage
clearance example (calculation) + a callback to Chapter 2's rate table
(data structure, already established, not re-derived) + an original
`level-open?` example (logic).

**Roman numerals: an original algorithm, not Brodie's.** Brodie's own
solution is a byte-table-plus-column-offset design tied to raw
`CREATE`/`C@`/`C,` memory manipulation (`COLUMN#`, `ONER`/`FIVER`/`TENER`,
`ALMOST`, `DIGIT`) that doesn't map naturally to 8th's container-based
idioms and is, in any case, his own specific creative expression of the
problem, not just "the Roman numeral problem" itself (which is a
generic, timeless exercise, fine to reuse). Designed and verified an
independent solution instead: two parallel arrays (values descending,
matching symbols including the subtractive shortcuts like `"CM"`) and a
greedy "consume this tier while it still fits" loop, looked up with
`caseof` (nice callback to Chapter 2's decision-table lesson).
[`code/ch04/roman.8th`](../code/ch04/roman.8th), executed, output
verified against 10 known values including `1994` -> `MCMXCIV` and the
largest classical value `3999` -> `MMMCMXCIX`.

**A real stack-balance bug caught and fixed during verification** (not
in the final manuscript, but worth recording the failure mode): an early
draft of the `level-open?` logic example did `8 n:< if drop false ;then`
— but `n:<` already consumes both its operands to produce the flag, so
by the time the `if`-true branch ran there was nothing left on the stack
for `drop` to remove, and it crashed with an access violation. Fixed by
dropping the now-redundant `drop`. A reminder that "the code runs at
all" and "the code is stack-balanced in every branch" are different
questions — this one only surfaced by exercising the *false* branch of
an early check, not just the happy path.

**New verified 8th technical findings:**
- `;then` exists and works as documented: shorthand for `;; then`, i.e.
  "if true, exit the word immediately; either way, close the `if`." Good
  for guard-clause-style early returns.
- No `n:<=`/`n:>=` — express "a >= b" as `a b n:< not`.
- Confirmed a **pre-tested** while-loop shape for 8th:
  `COND if repeat BODY COND while then` — the `if` guards against
  running the body zero times when the condition starts false (unlike
  the docs' own `repeat...while` example, which is post-tested / always
  runs the body at least once). Verified in isolation before use.
- `a:each`'s quotation receives `(item index --)`, both available,
  confirmed by direct test. `' word low high loop` passes just the index.

### DOCX tooling bug found and fixed while building Chapter 4's proof

**Multi-line list items were silently broken since the very first DOCX
build** — not just in Chapter 4, but retroactively in every proof PDF
produced across this whole project so far, including ones already
signed off on. `tools/build-docx.js`'s markdown parser for `-`/`1.`
lists only consumed the literal marker line; a continuation line that
merely wrapped in the `.md` source (indented, no `-`/`N.` of its own —
which is how essentially every multi-sentence list item in this
manuscript is written) fell through into becoming its own ordinary,
non-indented paragraph. Visually this showed up as a bullet/number
whose first line was properly indented, followed by "wrapped" text that
was actually a separate paragraph starting back at the page margin —
easy to mistake for a hanging-indent styling bug (which is what it first
looked like) rather than a parsing bug. Confirmed the real cause by
checking whether Chapter 2's numbered list (which does span multiple
source lines per item) had the same problem in the regenerated proof —
it did, before the fix, and doesn't after.

**Fixed**: both list parsers now gather continuation lines the same way
the plain-paragraph parser already did (stop only at blank lines or the
start of a new block). Also added an explicit `bullet-numbering`
config (previously bullets used the bare `bullet:` shorthand with no
custom indent) and explicit `indent: { left: 720, hanging: 360 }` on
both list-item paragraph types, belt-and-suspenders alongside the
numbering config's own indent. Rebuilt, re-validated, re-rendered — the
Chapter 2 numbered list and Chapter 4 bulleted list both confirmed
correct in the current proof. **This fix is already baked into the
committed `manuscript/Thinking-8th.docx` and `proof/Thinking-8th-proof.pdf`**
alongside Chapter 4 — no separate cleanup pass needed for Chapters 1-3.

### Next logical place to continue

1. Read `thinking-forth-1.0/chapter5.tex`, determine its real
   title/purpose (don't assume), continue the established
   verify-then-write process for the Markdown source.
2. Tag new fenced code blocks with ` ```8th ` / ` ```text ` from the
   start (established habit now, not a fix-up).
3. If a new list (bulleted or numbered) is needed, the wrap-continuation
   bug above is already fixed — no special handling required, multi-line
   items in the `.md` source will render correctly.
4. Rebuild the DOCX (`cd tools && node build-docx.js` — `brodie` profile
   is the default), regenerate the proof PDF via Word COM using
   `$doc.Close(0)` (never a bare `Close()`), spot-check a few rendered
   pages (chapter opening, any code blocks, the TOC, the last page),
   commit `.md` + `.docx` + `.pdf` together as one checkpoint.
