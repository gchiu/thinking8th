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

**As of 2026-08-31, this is AsciiDoc + pandoc, not Markdown + DOCX.**
`manuscript/*.adoc` (hand-edited source, one file per chapter/front-
matter section, all `include::`d from `manuscript/book.adoc`) →
`proof/Thinking-8th-proof.pdf` directly, via `pandoc` with Typst as the
PDF engine. There is no DOCX master anymore — Graham's explicit
direction was to drop it entirely in favor of AsciiDoc source + a
pandoc-built PDF, specifically because AsciiDoc's stricter syntax is
much harder for an outside contributor's pull request to accidentally
break the layout with, compared to this project's former hand-rolled
Markdown subset.

Rebuild the PDF:

```bash
cd tools && node build-pdf.js
```

That's the whole build — one pandoc invocation
(`tools/build-pdf.js`'s own header comment has the exact command if
you need to run pandoc directly for debugging). `manuscript/book.adoc`
auto-picks-up nothing by itself — a new chapter file needs one new
`include::chapterNN-slug.adoc[]` line added to `book.adoc` in the
right place, unlike the old build-docx.js's filename-sort
auto-discovery. That's a deliberate trade: explicit ordering in one
place a human reads, over implicit filename-sort magic.

**Neither `pandoc` nor `typst` needed admin/chocolatey access to
install** — both ship as a single portable executable with no
installer. Chocolatey itself failed in this environment (`C:\ProgramData`
isn't writable without elevation); the working path was downloading
each tool's official portable Windows zip directly from its GitHub
releases and dropping the `.exe` into `~/bin` (already on `PATH`):
`pandoc-3.11-windows-x86_64.zip` from `jgm/pandoc`, and
`typst-x86_64-pc-windows-msvc.zip` from `typst/typst`. If this
environment is ever rebuilt from scratch, redo that, don't assume a
package manager will work.

**Two real Typst/pandoc quirks the pipeline works around, both found
by isolating them with minimal test files, not assumed:**

- `tools/fix-8th-lang.lua` (a pandoc Lua filter, applied at build time
  via `--lua-filter`): Typst's raw-block parser (this Typst version,
  0.15.1) won't recognize a code-block language tag that starts with a
  digit — `` ```8th `` silently prints the literal text "8th" above
  every single code block instead of being consumed as a language tag.
  Confirmed as a Typst parser limitation, not a pandoc bug, by testing
  minimal `.typ` files directly. The `.adoc` *source* correctly keeps
  `[source,8th]` (accurate, readable for a contributor); the filter
  rewrites it to `[source,forth]` only in the built PDF.
- `tools/fix-inline-code.js` (a one-time migration script, already run
  — not part of the regular build, see below): pandoc's own asciidoc
  *reader* can't correctly round-trip a literal backslash or `--`
  inside a single-backtick inline code span — a backslash gets
  silently dropped, and `--` gets typographically substituted into an
  em dash, corrupting SED notation (`\ n -- m`) and string-escape
  references (`` `\n` ``) throughout. Both are constant in this book.
  The fix: Asciidoctor's standard "monospace, no substitutions" idiom,
  `` `+content+` `` (backtick-plus), round-trips correctly — confirmed
  directly. This script was run once, during the Markdown→AsciiDoc
  migration itself, to convert every affected span; it's kept in
  `tools/` for the record and in case a future contributor's plain
  Markdown-style `` `\n` `` needs the same fix applied to new prose by
  hand (there's no ongoing markdown-to-adoc conversion step anymore).

Trim size is fixed: **6.8125" × 9.125"**, Brodie's own original *Thinking
Forth* trim, same as the old DOCX pipeline — hardcoded in
`tools/book-template.typ`'s `#set page(...)`. That template is a
from-scratch Typst template, not an extension of pandoc's own default
one — see the comment at the top of the file for why (pandoc's default
template imports a packaged `conf()` function whose page-size parameter
only accepts named presets like `"us-letter"`, not a custom trim).

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

Filenames below are `.adoc` as of the 2026-08-31 AsciiDoc migration
(each was `.md` before that — see the migration's own session-log
entry near the end of this file for the conversion history). All are
`include::`d from `manuscript/book.adoc`, which is the actual master.

| File | Status |
|---|---|
| `manuscript/00-preface.adoc` | done |
| `manuscript/01-getting-started.adoc` | done |
| `manuscript/02-notation.adoc` | done |
| `manuscript/chapter01-philosophy.adoc` (Ch.1) | done |
| `manuscript/chapter02-analysis.adoc` (Ch.2) | done |
| `manuscript/chapter03-decomposition.adoc` (Ch.3) | done |
| `manuscript/chapter04-detailed-design.adoc` (Ch.4) | done |
| `manuscript/chapter05-style.adoc` (Ch.5, "Elements of Forth Style") | done |
| `manuscript/chapter06-factoring.adoc` (Ch.6, "Factoring") | done |
| `manuscript/chapter07-taming-the-stack.adoc` (Ch.7, "Taming the Stack") | done |
| `manuscript/chapter08-bundling-state.adoc` (Ch.8, "Bundling State, Redirecting Behavior") | done |
| `manuscript/chapter09-minimizing-control-structures.adoc` (Ch.9, "Minimizing Control Structures") | done |
| `manuscript/epilogue.adoc` ("8th's Effect on Thinking") | done |

Our Chapters 7 and 8 together cover Brodie's actual chapter 7
("Handling Data: Stacks and States") — see `PLAN.md` for why it was
split. Our Chapter 9 is Brodie's actual chapter 8, same title
("Minimizing Control Structures") — condensed substantially since much
of it (case statements, decide-vs-calculate, decision tables) was
already covered in earlier chapters; see `PLAN.md` for exactly what's
new there.

See `PLAN.md` for the full chapter map against Brodie's actual table of
contents. Only the appendices remain unaccounted for — check with
Graham whether they're in scope before starting on them.

## Chapter Mapping Audit (2026-08-31)

Requested by Graham: map every substantive section of Brodie's chapters
1–8 to its treatment here, classified as retained directly / adapted
into an 8th example / deliberately condensed / deliberately omitted as
obsolete or Forth-specific / accidentally omitted and worth
reconsidering. Built by re-reading each `chapterN.tex`'s section
structure against the corresponding manuscript chapter, not from
memory. Two things this audit is *not*: a license to restore material
just to lengthen a chapter, and a claim that every single subsection
below was re-verified at the same depth (Chapters 1–3 got a full
re-read this pass; 4–5 were checked against strong existing knowledge
plus targeted spot-checks; 6–9 were written this session with the
source already fresh, so are reported with high confidence but weren't
re-opened again for this audit).

**Legend:** RETAINED (ported with only cosmetic change) · ADAPTED
(same lesson, original 8th example) · CONDENSED (kept, compressed —
often several Brodie subsections into one) · OMITTED-OBSOLETE
(Forth/hardware/interview-specific, correctly dropped) · **GAP** (found
this pass, not previously flagged — see whether it was fixed).

### Chapter 1 → Thinking 8th Chapter 1

| Brodie section | Treatment |
|---|---|
| An Armchair History of Software Elegance (Memorability→Information-Hiding, ~13 subsections) | CONDENSED into "A Short History of Trying to Make Software Manageable" — keeps the destination (Parnas, Liskov/Zilles data abstraction via the stack example) and drops the historical breadth (Writeability, Designing from the Top, Subroutines, Successive Refinement, Functional Strength, Coupling, HIPO as named stops) |
| The Superficiality of Structure (Parnas's reuse/change criteria, "uses hierarchy") | ADAPTED — folded into the history section; the "uses hierarchy" idea specifically resurfaces later, in Ch.3 and Ch.5's "Organizing Your Source" |
| Looking Back, and Forth (Implicit Calls, Implicit Data Passing) | RETAINED — "Words Are the Unit," same two bolded subheadings, `breakfast.8th` replacing Brodie's example |
| Component Programming | ADAPTED — "Namespaces: A Lexicon You Don't Have to Invent," using fig1.7–1.9 |
| Hide From Whom? (Forth's info-hiding = design discipline against *change*, not Modula-2-style access control against *other code*) | **GAP, fixed this session** — Ch.1 previously overclaimed that namespaces are "enforced by the interpreter." Corrected: namespaces organize, don't lock; added a short paragraph distinguishing that from 8th's actual (unrelated, library-scoped) `private` word, directly channeling Brodie's own distinction |
| Hiding the Construction of Data Structures | RETAINED — "Hiding the Construction of a Data Structure," `apples.8th` |
| But Is It a High-Level Language? | RETAINED, same title |
| The Language of Design (stub components, instant feedback replaces batch-compile) | ADAPTED — folded into the end of "Is 8th a High-Level Language?" |
| The Language of Performance (Speed, Capability, Size) | ADAPTED, honestly reframed — the speed argument doesn't survive (8th has no native-code path); reframed around portability instead |
| Summary | RETAINED |

### Chapter 2 → Thinking 8th Chapter 2

| Brodie section | Treatment |
|---|---|
| The Nine Phases of the Programming Cycle | CONDENSED to a passing acknowledgment in the chapter intro |
| The Iterative Approach / Value of Planning / Limitations of Planning | ADAPTED, merged into "Iteration Beats Prediction" |
| The Analysis Phase (Requirements, Constraints, Conceptual Model) | ADAPTED into "What Analysis Actually Produces" (three questions) |
| Defining the Interfaces | ADAPTED — "Sketching Interfaces in Words, Not Diagrams," garage example, fig2.3 |
| Defining the Rules (Structured English, Decision Tree, Decision Table) | ADAPTED — Structured English's "hard to check by eye" pain point and the Decision Table solution both present; the intermediate Decision Tree step deliberately skipped (already flagged in `ILLUSTRATIONS.md`) |
| Defining the Data Structures | ADAPTED — "Data Structures and the Limits of Generality," garage-spaces example replacing the library-index one |
| Achieving Simplicity (generality↔complexity, "exploit the don't-cares," quantize, keep the user out of trouble, use available tools) | CONDENSED — only the generality↔complexity point ("simple and changeable beats general") survived explicitly; "exploit the don't-cares," "to simplify, quantize," and "keep the user out of trouble" are real, distinct, portable tips not currently restated anywhere. Judgment call: left as CONDENSED, not restored — genuinely secondary to this chapter's actual payload (the parking-fee decision table), and Ch.9 already independently covers "avoid the need for special handling," a close cousin of "keep the user out of trouble," as a new bullet added this session |
| Budgeting and Scheduling | OMITTED-OBSOLETE — project management, not a programming technique |
| Reviewing the Conceptual Model | OMITTED-OBSOLETE — process-review step, folded implicitly into the book's general iterate-and-test theme |
| Summary | RETAINED |

### Chapter 3 → Thinking 8th Chapter 3

| Brodie section | Treatment |
|---|---|
| Decomposition by Component | ADAPTED — thermostat replaces the setup for Tiny Editor |
| Example: A Tiny Editor (fig3.2–3.7, ~9 pages) | OMITTED-OBSOLETE by design — original examples policy; see `ILLUSTRATIONS.md`'s fig3.8/3.9 note for the full reasoning on what specifically was and wasn't carried forward |
| Maintaining a Component-based Application | ADAPTED — "A Change in Plan" (mode-name logging change) |
| Designing and Maintaining a Traditional Application (+ its own "Change in Plan," the bad/traditional response to the same change) | CONDENSED into one prose paragraph ("Compare that to what would have happened...") rather than a full second worked example — a deliberate compression, not an omission |
| The Interface Component (+ "A Design Mistake": express shared data in *objective units*, using an oven-temperature example almost identical in spirit to this book's thermostat) | ADAPTED, and **GAP found and fixed this session** — the "objective units" point (a real, distinct lesson from "too narrow," about interfaces leaking raw/unconverted state) wasn't in the chapter at all. Brodie's own example for it is a thermostat-adjacent oven-temperature scenario, an unusually direct fit; added a short paragraph tying it to `read-temp` already returning degrees, not a raw sensor voltage |
| Decomposition by Sequential Complexity | RETAINED, `defer:`/`on-bad-reading` |
| The Limits of "Level" Thinking — Where to Begin? (Moore's "fun-down" interview, tip list on where to start) | ADAPTED, condensed into one paragraph of criteria (feedback, stakeholder-visibility) |
| — No Segregation Without Representation (the "objects" critique; also the IBM PC ROM/video-routines anecdote, "don't bury your tools") | ADAPTED — the objects critique is retained faithfully, including the accurate acknowledgment that Brodie's own later prefaces walk it back (confirmed word-for-word against the real 1994/2004 prefaces this session); the ROM/video anecdote's point is folded into the "interface too narrow" material already present |
| — The Tower of Babble (all code, regardless of distance from the machine, should read the same; a true Forth engine has one continuous dictionary) | OMITTED-OBSOLETE — doesn't map cleanly onto 8th's actual architecture, which (per Ch.1) doesn't compile to machine code the way this point assumes |
| Summary | RETAINED |

### Chapter 4 → Thinking 8th Chapter 4

| Brodie section | Treatment |
|---|---|
| Problem-Solving Techniques (tips 4.1–4.11) | RETAINED — "Getting Unstuck," all tips present |
| Interview with a Software Inventor (Donald Burgess) | OMITTED-OBSOLETE — named interview, not reproduced per the no-manufactured/no-reproduced-interviews policy |
| Detailed Design (4-step list) | RETAINED — "Designing a Component" |
| Forth Syntax (tips 4.13–4.22) | ADAPTED — "How 8th Wants to Be Written" covers numbers-precede-words, name-precedes-text, noun-verb, definitions-consume-arguments, avoid-lookahead, zero-relative-numbering. Minor, genuinely Forth-memory-specific tips dropped (addresses precede counts, sources precede destinations — `CMOVE` conventions). "Don't write your own interpreter" (4.22) folded into Ch.1's stronger, earlier statement of the same point |
| Algorithms and Data Structures (general definitions, letter-filing example) | OMITTED-OBSOLETE — basic definitional content this book's assumed audience doesn't need explained |
| Calculations vs. Data Structures vs. Logic | RETAINED, same title and ordering-of-preference |
| Solving a Problem: Computing Roman Numerals | ADAPTED — original algorithm and code, same problem |
| Summary / For Further Thinking | RETAINED / not applicable (this book doesn't carry chapter exercises anywhere) |

### Chapter 5 → Thinking 8th Chapter 5

| Brodie section | Treatment |
|---|---|
| Listing Organization (9 subsections of screen mechanics + "Alternative to Screens: Named Files") | CONDENSED heavily — screens material reduced to one paragraph of historical context; `f:include` is the direct port of "Named Files" |
| Screen Layout / Spacing and Indentation | CONDENSED / ADAPTED |
| Comment Conventions (12 subsections: Stack Notation/Picture/Effect/Comment/Abbreviations/Flags/Variable-Possibilities, Data-Structure, Input-stream, Purpose, Defining-word, Compiling-word comments) | ADAPTED for the SED/abbreviation/variable-stack-effect material (well covered); CONDENSED for the rest. Data-Structure, Input-stream, Defining-word, and Compiling-word comments are all genuinely Forth-memory-specific (byte layouts, `CREATE`/`DOES>`) and correctly not applicable. **Purpose Comments — a real, portable, currently-unstated tip** ("every definition should have a purpose comment unless obvious from its name or SED") was not restored this pass; flagged here as the one item in this section worth a small addition in a future pass, not done now to avoid scope creep on an already-large audit |
| Vertical Format vs. Horizontal Format | CONDENSED — this book has consistently used one format throughout by example, without stating the tradeoff explicitly the way Brodie does |
| Choosing Names: The Art | RETAINED, same title |
| Naming Standards: The Science / More Tips for Readability | Not independently re-verified this pass (lower confidence) — likely folded into "Choosing Names," not separately re-checked against the source |
| Summary | RETAINED |

### Chapters 6–9 (written this session with the source fresh)

Not re-audited at the same depth this pass since each was written with
`chapterN.tex` read in full immediately beforehand, within this same
extended session — see each chapter's own commit message for what was
retained/adapted/condensed/omitted, and `PLAN.md` for the Ch.7 split
rationale and the Ch.8/Brodie-ch.8 correspondence. One retrospective
addition made this session: Ch.9 gained a "don't test for something
that can't possibly happen" bullet (from Brodie's "Redesigning"
subsection), which had been genuinely dropped without acknowledgment
when Ch.9 was first written.

### Overall assessment

No chapter shows an *accidental* structural gap at the level of a whole
missing section — everything Brodie covers either has a direct 8th
analog already present, or was condensed/omitted for a defensible,
statable reason (Forth-memory-specificity, a named interview not
reproduced, an original-examples policy, redundancy with an earlier
chapter). The two concrete **GAPs** this audit surfaced and fixed
(Ch.1's namespace-enforcement overclaim; Ch.3's missing "objective
units" point) were both small, surgical, and directly tied to material
already in the chapter — not new scenarios invented to fill a hole.
One further candidate (Ch.5's Purpose Comments) is logged but
deliberately left for later, per the standing instruction not to
restore material merely to increase page count.

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
  inserted anywhere at the time this was written** — per explicit
  instruction, this was a documentation-only audit. **Superseded
  2026-08-30 (later the same day):** Graham reviewed and directed
  insertion; all ten of these are now real images in
  `manuscript/illustrations/`, wired into Chapters 1-4. See the
  session log entry below dated the same day for what changed and why.
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

## Session: 2026-08-30 (same day, later) — Illustrations wired in

Graham reviewed the illustration findings above and gave two follow-up
instructions in chat: resolve the two ambiguous-image findings, then
wire the verified images into Chapters 1-7 and regenerate the proof.

**Resolved:** the `UNKNOWN-01..07` batch is a confirmed duplicate of
`fig3-2`..`fig3-8` (viewed both directly, identical) — no real conflict.
`img7-211` stays mismatched and unused; irrelevant to Ch.1-7 since it's
Chapter 8 material that doesn't exist yet.

**Wired in:** the 10 previously-`GENUINELY-MISSING` figures (Ch.1's
`fig1-7`/`fig1-8`/`fig1-9`, Ch.2's `fig2-3`, Ch.3's `fig3-8`/`fig3-9`,
Ch.4's `fig4-1`/`fig4-2`/`fig4-3`/`img4-110`) are now real images,
copied into a new tracked `manuscript/illustrations/` directory and
referenced from `chapter01-philosophy.md` through
`chapter04-detailed-design.md` with original captions. `ILLUSTRATIONS.md`
and `GAPS.md` are updated to `INSERTED` status with full detail; don't
re-read this paragraph as the authoritative record, read those.

**Build tool:** `tools/build-docx.js` didn't support images at all
before this — added markdown `![caption](path)` parsing, a PNG-header
dimension reader, and page-fit sizing. While proofing the result, found
and fixed a real pre-existing bug unrelated to images: every numbered
list in the document shared one numbering counter, so the second and
third numbered lists in the book started at 4./5. instead of 1./2.
(now each gets its own reference). `.gitignore`'s blanket `*.png` rule
needed a new carve-out for `manuscript/illustrations/`, or the commit
would have silently dropped the images.

Rebuilt and visually spot-checked all 72 pages of the proof PDF (up
from 63 before images). Committed and pushed
(`6c53455`) — working tree clean apart from the still-intentionally-
untracked `thinking-forth-1.0/png/`.

**Stopping point:** Chapters 1-4's illustration gaps are closed.
Chapters 5-7 have nothing to insert (already established: Ch.5's two
figures are decorative, Ch.6's two are code/ASCII listings already
reproduced as real code, Ch.7's are deferred to the not-yet-written
Chapter 8). Next task is unchanged from above: write Chapter 8
(state tables via maps, vectored execution via `defer:`/`w:is`),
verify `defer:`/`w:is` against the real runtime before assuming it
behaves like Brodie's `DOER`/`MAKE`, then revisit the Chapter 7/8
figure entries once that chapter's content exists to anchor them to.

---

## Session: 2026-08-30/31 — Chapters 8-9, then a full book-level audit

Between the last dated entry and this one (not separately logged at
the time — noted here for continuity): Chapter 8 ("Bundling State,
Redirecting Behavior") and Chapter 9 ("Minimizing Control Structures")
were both written, verified, illustrated, and pushed — see their own
commit messages and `PLAN.md`'s chapter table for what each covers.
Graham then supplied the real 2004 3rd-edition PDF
(`thinking-forth-2000/thinking-forth-color.pdf`), which was used to
verify every illustration already in use (all pixel-identical to the
original; one earlier "mismatch" finding, `img7-211`, turned out to be
wrong and was corrected — see `GAPS.md`).

With all eight of Brodie's numbered chapters covered, Graham asked for
a book-level audit before any further numbered chapters: an ending (the
manuscript stopped cold after Chapter 9 with no closing material at
all), a full section-by-section mapping of Brodie's chapters 1–8
against this book's actual treatment, and a full illustration audit
against the real 2004 edition — explicitly including a review of
whether relocating fig3.8/fig3.9 into the thermostat example was
pedagogically justified, not just administratively convenient.

**Ending:** wrote `manuscript/epilogue.md`, "8th's Effect on Thinking"
— original prose (no manufactured interviews, per explicit
instruction), returning to the book's own running examples (the
thermostat, `apples`, `roman`, `checkout`, `channel-actions`) rather
than inventing new ones, organized around the themes Graham named:
human-scale software, simplicity, factoring as a habit of noticing,
knowing when not to generalize, and what a concatenative language
teaches that outlasts the language itself.

**Chapter-mapping audit:** full table now lives in this file, above
this entry. Two real gaps found and fixed (both small, both directly
tied to material already in the affected chapter, neither restoring
content just to lengthen a chapter): Ch.1 was overclaiming that
namespaces are "enforced by the interpreter" (they're organizational;
8th's real access-control word, `private`, is a different, narrower,
library-scoped mechanism — now logged in `GAPS.md`); Ch.3 was missing
Brodie's "objective units" point (interfaces should pass converted,
meaningful values, not raw/unconverted state) — added as a short
paragraph tying directly into the thermostat's already-existing
`read-temp` (which already does this correctly, just never named why).
One candidate left unfixed on purpose: Ch.5's "Purpose Comments" tip,
logged as worth a future small addition, not done now.

**Illustration audit:** full table (every figure in Brodie's book, not
just the ones already used, with book page, type, and reasoning) now
lives in `ILLUSTRATIONS.md`. Verdict on fig3.8/fig3.9: **kept in
place.** Both figures are Brodie's own *generalized* abstraction
(generic `MODULE 1`/`BUFFER A` vocabulary, not Tiny-Editor-specific
terms), introduced right after his nine-page Tiny Editor case study
generalizes into them — the thermostat's `mode`/`set-mode` reaches the
identical generalization point, just via a shorter build-up, consistent
with this book's established choice (Ch.5) never to walk through
flowchart-driven design critique. No figure was found needing MOVE or
MODERNIZE.

**Runtime verification:** none needed this session — no new 8th code
was written; the audit and fixes were prose/documentation work plus
two short additions to already-verified chapters (neither introduced
new runnable examples).

**Current stopping point:** epilogue written, both audits complete and
recorded, three small manuscript fixes applied (Ch.1 namespace
accuracy, Ch.3 objective-units paragraph, Ch.9 "don't test the
impossible" bullet). Docx/PDF rebuild and full visual inspection still
pending as of this entry — see the build log immediately below once
it's done. **Not pushed yet** — Graham asked explicitly to hold the
push until the audit and final pages are checked.

**Best next task:** once the rebuild is inspected and looks right,
push this checkpoint. After that, the appendices question is still
open (see `PLAN.md`) — Appendix E ("Summary of Style Conventions,"
rebuilt from this book's own conventions rather than Brodie's list) is
the only one of the five that looked clearly worth doing when last
discussed; Graham dismissed that question rather than answering it, so
ask again rather than assuming.

---

## Session: 2026-08-31 (continued) — Attribution audit + illustration re-check

Two follow-up asks, same day as the book-level audit above, before any
appendix or format work: (1) a full historical/intellectual provenance
pass — does the manuscript's cumulative impression correctly separate
Charles Moore's own judgment (as Forth's inventor) from Leo Brodie's
role as author/interviewer/synthesizer/teacher? — and (2) a stricter
final re-check of the illustration audit, explicitly re-testing
fig3.8/fig3.9's relocation into the thermostat example.

**Attribution audit:** searched the whole manuscript for every
"Brodie"/"Moore"/invented/identified/introduced/discovered/argued/
proposed/coined/developed occurrence (55 hits) and checked each
substantive one against `thinking-forth-2000/thinking-forth-color.pdf`.
Three real corrections, all evidence-based:

- Ch.1: "Leo Brodie identified [implicit calls/data passing] in Forth"
  → Brodie's own text calls these "two Forth inventions" (Moore's, as
  the language's creator); corrected to credit Forth's own design.
- Ch.2: the generality-means-complexity point (resist over-generalizing
  a data structure) was unattributed prose; it's Moore's own position,
  drawn out at length in a direct interview. Added one sentence of
  credit.
- Ch.6: "Factor at the point you feel unsure" was presented as one of
  "Brodie's" factoring criteria; it's close to a direct Moore quote
  ("A word should be a line long... short words give you a good
  feeling"). Added a sentence crediting Moore before the heuristic list.

Everything else checked out already accurate — notably Ch.8, which is
substantially Brodie's *own* constructed material (the state-table
example, and `DOER`/`MAKE`, confirmed via his own first-person "I
invented" claim in the source) and was already correctly attributed to
him throughout, not over- or under-credited either way. Full reasoning
for each fix is in `GAPS.md`'s "Historical/intellectual attribution
audit" entry. Also added one sentence to `manuscript/00-preface.md`
making the Brodie/Moore relationship explicit, as requested, rather
than leaving a reader to infer it chapter by chapter.

**Illustration re-check:** re-tested fig3.8/fig3.9's relocation against
a stricter standard — move only if it still illustrates precisely the
same conceptual point, restore or omit otherwise. Held up: both figures
are already Brodie's own generalized abstraction (generic `MODULE 1`/
`BUFFER A` vocabulary, not Tiny-Editor-specific), introduced at the
exact point his nine-page Tiny Editor case study generalizes into them;
the thermostat's `mode`/`set-mode` reaches that same generalization
point, just via a shorter build-up. Verdict unchanged: **KEEP —
RELOCATED**. Every `KEEP` illustration's filename was also cross-
checked byte-for-byte against `thinking-forth-1.0/` (all exact matches,
no filename was ever inferred) and against `manuscript/illustrations/`
— see `ILLUSTRATIONS.md` for the full table with the filename-
convention note added this pass.

**Rebuild and inspection:** no `.8th` code files were touched this
session (all edits were prose), so no runtime re-verification was
needed. Rebuilt the docx and PDF proof (93 pages, up from 91) and
visually inspected the front matter, TOC, all of Chapters 1–3 in full
(where the fixes landed), the Ch.6 and Ch.9 edit points, and the
epilogue through the final page. Clean throughout — no orphan
captions, no duplicated or missing images, no stray page breaks, no
trailing blank pages.

**Mid-session pivot, same day:** while the visual inspection was still
running, Graham gave new direction for the *next* pass: move the
manuscript source from Markdown to **AsciiDoc** (`.adoc`), specifically
because AsciiDoc tooling is more robust for outside contributors
sending pull requests without accidentally breaking the layout, and
build the PDF via **pandoc** rather than the current hand-rolled
`tools/build-docx.js` + Word-COM pipeline. Asked and confirmed two
things before touching anything: (1) finish and commit this attribution/
illustration pass on the *current* pipeline first, migration is its own
follow-up, not folded in; (2) **DOCX is being dropped entirely** —
AsciiDoc source and a pandoc-built PDF are the only outputs going
forward, no more editable Word master. **Blocker found, not yet
resolved:** pandoc is not installed in this environment (confirmed via
`which pandoc`); chocolatey is available (`which choco` succeeds) and
is the likely install path, but that hasn't been done yet — first task
next session.

**Current stopping point:** attribution + illustration alignment pass
complete, committed (see this file's own commit for the hash — check
`git log` rather than assuming a specific one here). Not yet decided
whether this was pushed; check `git status`/`git log origin/master`
before assuming.

**Best next task:** the AsciiDoc/pandoc migration. Concretely: (1)
install pandoc (chocolatey looks like the path); (2) convert
`manuscript/*.md` (13 files: 3 front-matter + 9 chapters + epilogue) to
`.adoc`, preserving structure, code blocks, tables, and image
references exactly — decide and document an explicit convention for
this project's markdown-specific bits (the `![caption](path)` image
syntax, the fenced-code language tags `8th`/`text`, internal cross-
chapter links) since AsciiDoc's equivalents aren't identical syntax;
(3) write a new build script that runs `pandoc` to produce
`proof/Thinking-8th-proof.pdf` directly from the `.adoc` sources —
decide whether pandoc's default PDF engine (likely wanting a LaTeX
install, e.g. via `tectonic` or `wkhtmltopdf`/`weasyprint` as
alternatives) is available or needs installing too, and don't assume
it produces the same 6.8125"×9.125" trim size or pagination as the
current build without checking; (4) retire `tools/build-docx.js` and
the Word-COM PDF-export instructions once the new pipeline is proven
equivalent (or better) — don't delete them until there's a working
replacement to compare against; (5) update `README.md`,
`HANDOFF.md`'s "Publication workflow" section, and `PLAN.md`'s file
conventions to describe the new pipeline, since several existing docs
currently describe the DOCX-based one as canonical.

---

## Session: 2026-08-31 (continued) — Markdown to AsciiDoc + pandoc migration

Same day, right after the attribution/illustration alignment pass:
Graham gave direction to move the manuscript source from Markdown to
AsciiDoc (`.adoc`), specifically because AsciiDoc's stricter syntax is
much harder for an outside contributor's pull request to silently
break the layout with, and to build the PDF via `pandoc` instead of
the old `tools/build-docx.js` + Word-COM pipeline. Confirmed two things
before starting (see the `AskUserQuestion` in this session): finish and
commit the attribution/illustration pass on the old pipeline first
(done, see the entry above), and **drop DOCX entirely** — AsciiDoc
source and a pandoc-built PDF only, no editable Word master going
forward.

**Tooling install, no admin rights available:** `choco install pandoc`
failed (`C:\ProgramData` not writable without elevation). Worked
around by downloading each tool's official portable Windows zip
directly from GitHub releases and dropping the `.exe` into `~/bin`
(already on `PATH`, no install step needed): `pandoc` 3.11 from
`jgm/pandoc`, `typst` 0.15.1 from `typst/typst` (chosen as the PDF
engine — a single ~20MB portable binary, vastly lighter than a LaTeX
install, and pandoc has first-class `--pdf-engine=typst` support).

**Conversion:** `pandoc -f markdown -t asciidoc` on each of the 13
`manuscript/*.md` files, quality-checked against a hand-written
alternative before trusting it at scale — genuinely good (headings,
tables, images with auto-generated figure captions, links all
converted correctly) with two real bugs found by isolating them in
minimal test files, not assumed:

1. **Typst's raw-block parser won't accept a language tag starting
   with a digit** — `` ```8th `` prints the literal text "8th" above
   every code block instead of being consumed as a language tag
   (confirmed: `` ```eighth `` works fine, `` ```8th `` doesn't, in
   Typst 0.15.1 specifically). Fixed at build time only, not in the
   source, via `tools/fix-8th-lang.lua` — the `.adoc` files correctly
   keep `[source,8th]`.
2. **Pandoc's asciidoc reader can't correctly round-trip a backslash
   or `--` inside a single-backtick inline code span** — a backslash
   gets silently dropped, `--` gets typographically substituted into
   an em dash. This is not cosmetic: it's this book's SED notation
   (`` `\ n -- m` ``) and every inline `` `\n` `` string-escape
   reference, both constant throughout. Root-caused precisely (not
   guessed) by dumping pandoc's internal AST with `-t native` and
   testing candidate fixes the same way. The fix that round-trips
   cleanly: Asciidoctor's standard `` `+content+` `` "monospace, no
   substitutions" idiom. Wrote `tools/fix-inline-code.js`, ran it once
   across all 13 converted files (47 spans fixed), verified the fix
   with full-book renders before and after.

**Assembly:** `manuscript/book.adoc` is the new master — sets the
title/subtitle and `include::`s all 13 chapter/front-matter files in
reading order (confirmed pandoc's asciidoc reader resolves `include::`
directly, no preprocessing needed).

**Page setup:** pandoc's *default* typst template only accepts named
paper presets (`"us-letter"` etc.) for page size, not this book's
6.8125"×9.125" custom trim — confirmed by testing `-V papersize=` with
a raw dimension string and getting a hard error listing only named
presets. Rather than patch that template's imported, opaque `conf()`
function, wrote `tools/book-template.typ` from scratch: exact trim
size, heading styles (H1 with a rule underneath, matching the old DOCX
look), shaded code blocks, italic figure captions, a native
`#outline()` TOC. See that file's own header comment.

**Verification:** full-book PDF rendered and visually inspected end to
end — title page, TOC, every chapter, every kept illustration (with
auto-generated "Figure N: caption" text), the epilogue, final page.
Specifically re-checked every spot the two bugs above could have hit:
02-notation's SED/backslash examples, Ch.6's `a:!` SED, Ch.8's map
SEDs, Ch.9's `pixel-code.8th` (uses `n:*` inline) — all correct after
the fixes. One minor, purely cosmetic issue noted and left alone:
Typst's automatic hyphenation occasionally breaks an already-hyphenated
compound word awkwardly (e.g. "easy-to-get-wrong" → "easy-to-get-
wrong" with a stray space) — not a content bug, not fixed this pass.

**File changes:** removed all 13 `manuscript/*.md` files,
`manuscript/Thinking-8th.docx`, and `tools/build-docx.js` from the
repo (recoverable from git history, not deleted from disk-only
scratch work). Added the 13 `.adoc` files, `manuscript/book.adoc`,
`tools/build-pdf.js`, `tools/book-template.typ`,
`tools/fix-8th-lang.lua`, and `tools/fix-inline-code.js` (the last one
a completed one-time migration script, not part of the ongoing build —
see its own header comment). Updated `README.md` and this file's
"Publication workflow"/"Manuscript status" sections to describe the
new pipeline.

**Resolved, same session:** `proof/Thinking-8th-proof.pdf` was locked
by another process (`Device or resource busy`, persisted across
retries) — Graham had it open in a viewer. He closed it and said so;
rebuilt clean via `cd tools && node build-pdf.js` (89 pages, correct
6.8125"×9.125" trim, matching the version already verified page-by-page
above) and committed/pushed separately from the rest of the migration.

**Current stopping point:** migration complete, verified, committed,
and pushed in full, including the proof PDF.

**Best next task:** nothing blocking. Only if Graham wants further
pipeline polish: the automatic-hyphenation
cosmetic issue noted above, and reconsidering whether chapter-start
page breaks are worth re-adding to `tools/book-template.typ` (removed
during this pass because a naive `pagebreak()` inside the H1 `show`
rule errored — "pagebreaks are not allowed inside of containers" — a
different approach, e.g. `pagebreak(weak: true)` placed via a `context`
block or applied only to top-level document flow, wasn't attempted
yet).

---

*(The sections below are filled in at the end of each work session —
see the most recent dated entry for what actually happened last.)*
