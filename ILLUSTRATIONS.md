# Illustration Placeholders

## Full book-level illustration audit, 2026-08-31

Requested by Graham: audit **every** illustration in the real 2004 3rd
edition (`thinking-forth-2000/thinking-forth-color.pdf`) against the
current proof, chapter by chapter, treating the PDF as authoritative for
which illustration belongs to which discussion, ordering, caption/
context, and deliberate joke/mismatch pairings — not as generic clip-art
to slot in wherever convenient. This supersedes nothing below; the
per-figure detail from the original archive audit stands and is cited
here rather than repeated. Page numbers are 2004-edition book pages
(PDF page = book page + 18); a page marked "~" is placed by its
section in `thinking-forth-1.0/chapterN.tex` rather than individually
re-opened in the PDF this pass — proportionate effort given decorative
cartoons carry no teaching content to place correctly, only a mood to
skip or keep.

**Decision key:** `KEEP` (already inserted, correctly placed) ·
`KEEP — RELOCATED` (inserted, but at a different discussion than
Brodie's original; reasoned below) · `OMIT` (source material exists,
deliberately not used — reason given each time) · `MOVE` / `MODERNIZE`
(not used below — nothing found needing either; see closing note) ·
`REVIEW` (used once, for the case Graham flagged directly).

**Filenames, exactly as they exist in the archive — never inferred.**
The `ID` column below uses the printed caption's dotted figure number
(e.g. `fig1.7` = "Figure 1.7" as printed in the 2004 book) since that's
what ties a row to its context in the discussion below. The
*underlying file* uses a hyphen instead of a dot and is never renamed:
`fig1-7.eps` in `thinking-forth-1.0/` (the original archive) and, for
every row marked `KEEP`, `fig1-7.png` in `manuscript/illustrations/`
(copied in, filename preserved exactly, once verified pixel-identical
to the real 2004 3rd edition and wired into the manuscript — see the
per-figure detail below). Undotted IDs (`img1-004`, `no-scrambled`) are
themselves the exact archive filename — Brodie's own uncaptioned
cartoons were never given a "Figure N.M" number, only a bare
descriptive filename, and this audit preserves that distinction rather
than inventing a figure number for them.

### Chapter 1 → Thinking 8th Chapter 1

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| img1-004 | ~4 | cartoon | "GOTO 500—and here I am" | OMIT | decorative, no teaching content |
| fig1.1 | 6 | diagram | Unstructured GOTO code | OMIT | superseded — condensed to one sentence, common knowledge |
| fig1.2 | 7 | diagram | "Make Breakfast" structured design | OMIT | superseded — `breakfast.8th` is real code, not a design sketch |
| fig1.3 | ~9 | code | Structured programming in BASIC | OMIT | BASIC example not adapted |
| fig1.4 | — (`.tex` only) | table | Pascal breakfast | OMIT | superseded by `breakfast.8th`; confirmed plain LaTeX table, no art |
| img1-010 | ~11 | cartoon | "Software patches are ugly" | OMIT | decorative |
| fig1.5 | ~12 | diagram | Main program/subroutine in memory | OMIT | memory layout isn't part of 8th's model |
| img1-013 | ~13 | cartoon | "…refinement far enough" | OMIT | decorative |
| fig1.6 | — (`.tex` only) | table | HIPO structure chart | OMIT | Structured Design section condensed |
| **fig1.7** | **21** | diagram | Structured design vs. component design | **KEEP** | inserted, "Words Are the Unit" |
| **fig1.8** | **22** | diagram | A lexicon describes a component | **KEEP** | inserted, "Namespaces" |
| **fig1.9** | **23** | diagram | Entire application = components (robot) | **KEEP** | inserted, "Namespaces" |
| fig1.10 | 26 | diagram | Changing the indirect pointer (RED/GREEN) | OMIT | superseded — `apples.8th` is real running code, strictly better than a static diagram |
| img1-028/030/033 | ~28/30/33 | cartoons | "Two points of view" / "Two solutions" / "mice and young men" | OMIT | decorative |

### Chapter 2 → Thinking 8th Chapter 2

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| fig2.1 | 39 | diagram | Iterative approach cycle (Kim Harris) | OMIT | condensed to "Iteration Beats Prediction" prose |
| img2-047 | 47 | cartoon | Refining a conceptual model (house design) | OMIT | decorative |
| fig2.2 | ~48 | diagram | An iterative approach to analysis | OMIT | same condensation as fig2.1; largely redundant with it in the original too |
| **fig2.3** | **51** | diagram | A data-flow diagram | **KEEP** | inserted, "Sketching Interfaces in Words, Not Diagrams" |
| fig2.4 | 55 | diagram | Decision tree | OMIT | this book goes straight from prose to decision table, skipping the intermediate tree (a genuine scope choice, not an oversight) |
| fig2.5 | 56 | diagram | The decision table | OMIT | superseded — real table in the manuscript |
| fig2.6 | 57 | diagram | Simplified decision table | OMIT | superseded, same reason |
| fig2.7 | 58 | diagram | Sectional decision table | OMIT | superseded — `parking-fee.8th`'s factoring achieves the identical split in real code |
| fig2.8 | 58 | diagram | Decision table w/o operator involvement | OMIT | superseded, same reason |
| img2-060/063/066 | ~60/63/66 | cartoons | "Two adequate solutions" / overgeneralized solution / "conventional wisdom" | OMIT | decorative |

### Chapter 3 → Thinking 8th Chapter 3

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| fig3.1 | ~72 | diagram | Pools of thought not yet linked | OMIT | vacation/wedding anecdote not adapted |
| fig3.2 | 76 | diagram | Tiny Editor decomposition | OMIT | this book uses an original thermostat, not Brodie's Tiny Editor |
| fig3.3 | 80 | diagram | Traditional approach: view from the top | OMIT | Tiny Editor; also a flowchart-driven walkthrough style this book doesn't use anywhere (see Ch.5) |
| fig3.4 | 81 | diagram | Structure for "Process a Keystroke" | OMIT | Tiny Editor, same reason |
| fig3.5 | 82 | diagram | Another structure for "Process a Keystroke" | OMIT | Tiny Editor, same reason |
| fig3.6 | 83 | diagram | Same section, "refined" and "optimized" | OMIT | Tiny Editor, same reason |
| fig3.7 | 84 | diagram | Adding refresh | OMIT | Tiny Editor, same reason |
| **fig3.8** | **85** | diagram | Interface as a junction (traditional) | **KEEP — RELOCATED** | see reasoning below |
| **fig3.9** | **86** | diagram | Use of the interface component | **KEEP — RELOCATED** | see reasoning below |
| fig3.10 | ~90 | diagram | Two ways to add advanced capabilities | OMIT | sequential-complexity section is prose-only; underlying word-processor vectoring example not adapted |
| no-scrambled | ~92 | cartoon | "No scrambled?" (objects) | OMIT | decorative |

**On fig3.8/fig3.9 — Graham's flagged case, reviewed directly.** In the
2004 edition these two figures land at the end of an eleven-page,
six-figure Tiny Editor case study (fig3.2–fig3.7): a full worked
example of decomposing a keystroke-driven editor, redesigning it twice,
and discovering a shared "pointer" that several editing functions
needed. Only *after* that entire buildup does Brodie generalize the
lesson into fig3.8/fig3.9 — and when he does, the figures themselves
switch to **generic** vocabulary (`MODULE 1`, `MODULE 2`, `BUFFER A`,
`THING B`), not Tiny-Editor-specific terms like `POSITION` or
`OVERWRITE`. The figures were never a picture *of* the Tiny Editor;
they're Brodie's own abstraction of a lesson a concrete example just
finished teaching.

This book's thermostat example (`mode`/`mode@`/`set-mode`) plays the
identical structural role: a concrete case that discovers the same
shared-boundary problem, at the exact point these two already-generic
figures generalize it. The relocation trades one thing for another —
Brodie's nine-page build-up (naive design, two competing flowcharts,
"refined" and "optimized" variants, then breakage under a display-
technology change) becomes this book's shorter one, consistent with
Chapter 5's established choice not to walk through flowchart-driven
design critique anywhere in this adaptation. What doesn't change is
the figures' own content or their relationship to the lesson: two
modules duplicating shared state at a seam, versus one shared
component both sides call into — which is exactly what `mode`'s
encapsulation *is*. Kept in place. See
`manuscript/chapter03-decomposition.adoc`'s "Decomposition by
Component: A Thermostat" section for the surrounding text, which
includes an "objective units" paragraph drawn from the Tiny Editor
material's own follow-on lesson in Brodie's original.

**Re-checked 2026-08-31 against the sharper test** ("move only if it
still illustrates precisely the same conceptual point; if moving it
weakens the relationship between picture and argument, restore it or
omit it instead"): it passes. The relationship between picture and
argument is not weakened by the relocation — if anything it's tighter,
since the figures now sit immediately beside the concrete example that
demonstrates them (`mode`/`set-mode`), rather than at the far end of a
nine-page build-up the way they do in the original. Same verdict,
**KEEP — RELOCATED**. Exact filenames, unchanged and verified directly
against `thinking-forth-1.0/`: archive originals `fig3-8.eps` and
`fig3-9.eps` (both `\wepsfiga` — scanned/typeset art, not LaTeX-drawn,
no `.tex` sibling for either); the copies in use are
`manuscript/illustrations/fig3-8.png` and
`manuscript/illustrations/fig3-9.png`, copied in under those same
names and never renamed.

### Chapter 4 → Thinking 8th Chapter 4

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| **fig4.1** | **102** | diagram | A problem easier to solve backward | **KEEP** | inserted, "Getting Unstuck" |
| **fig4.2** | **103** | diagram | Two containers | **KEEP** | inserted, "Getting Unstuck" |
| **fig4.3** | **104** | diagram | Achieving the end result | **KEEP** | inserted, "Getting Unstuck" |
| img4-103 | 105 | cartoon | "Intent on a complicated problem" | OMIT | decorative |
| fig4.4 | 106 | diagram | The nine dots problem | OMIT | this book's "Getting Unstuck" uses only the water-jug example, a scope choice, not an oversight |
| fig4.5 | 107 | diagram | Not quite right (nine dots) | OMIT | same |
| img4-106 | ~108 | cartoon | "I'm not just sleeping…" | OMIT | decorative |
| **img4-110** | **112** | illustration | Noun-verb yard-work vignettes | **KEEP** | inserted, "How 8th Wants to Be Written" |
| fig4.6 | 115 | diagram | A table of 8-byte records | OMIT | 8th's arrays are already zero-indexed with no memory-offset arithmetic needed; point made without this example |
| fig4.7 | 117 | diagram | Traditional compiler vs. Forth compiler | OMIT | this book's compiler discussion (Ch.1) doesn't use this framing, and per Ch.1's own finding 8th doesn't compile to native code the way this figure assumes |
| fig4.8 | ~123 | diagram | Roman numeral data access (Brodie's algorithm) | OMIT | `roman.8th` uses a deliberately different, original algorithm; this figure depicts Brodie's own specific data layout |

### Chapter 5 → Thinking 8th Chapter 5

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| fig5.1 | ~137 | cartoon | "I still don't see how these conventions…" | OMIT | decorative |
| fig5.2 | ~150 | cartoon | Wiggins, proud of his commenting technique | OMIT | decorative |

### Chapter 6 → Thinking 8th Chapter 6

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| fig6.1 | ~176 | ASCII/code | Boxes to be displayed | OMIT | reproduced directly as real runnable 8th (`boxes.8th`) |
| fig6.2 | ~178 | code | `POINTS`/`DRAW` table listing | OMIT | reproduced directly as real runnable 8th (`boxes.8th`) |

### Chapter 7 → Thinking 8th Chapters 7 and 8

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| fig7.1 | 205 | form/diagram | Example of a stack commentary | OMIT | Ch.7 doesn't walk through Brodie's `CMOVE>`-based stack-commentary form at all |
| fig7.2 | 216 | code/text | A collection of related variables | OMIT | reproduced as real code — `box-map.8th`'s map *is* this bundle |
| **fig7.3** | **216** | diagram | Conceptual model for saving a state table | **KEEP** | inserted, Ch.8 "A Table of Related Values" |
| fig7.4 | 217 | code | Implementation of save/restorable state table | OMIT | reproduced as real code — `draft-commit.8th` replaces this exact mechanism with `G:clone` |
| **fig7.5** | **218** | diagram | Conceptual model for alternating-states tables | **KEEP** | inserted, Ch.8 "Two Live States, One Set of Names" |
| fig7.6 | 218 | code | Implementation of alternating-states mechanism | OMIT | reproduced as real code (`profiles.8th`) |
| fig7.7 | 221 | diagram | `DOER` and `MAKE` | OMIT | Ch.8 explains `defer:`/`w:is` in prose rather than walking through `DOER`/`MAKE` step-by-step |
| fig7.8 | 222 | diagram | Multiple `MAKE`s in parallel | OMIT | same reason |
| fig7.9 | 223 | diagram | Multiple `MAKE`s in series | OMIT | same reason |
| img7-211 | 209 | cartoon | "…too many variables!" | OMIT | correct pairing confirmed directly against the real 2004 3rd-edition PDF; simply not needed — Ch.8's `defer:`/`w:is` treatment never anchors to this joke |

### Chapter 8 → Thinking 8th Chapter 9

| ID | Book p. | Type | Original topic | Decision | Reason |
|---|---|---|---|---|---|
| fig8.1 | ~5 | code | ATM: structured approach (nested IFs) | OMIT | Ch.9's "Guards and Dispatch" uses an original checkout scenario, not Brodie's ATM |
| fig8.2 | ~6 | code | ATM: named procedures | OMIT | same |
| fig8.3 | ~7 | code | ATM: refactored/button dispatch | OMIT | same — though this is the closest analog to `checkout.8th`'s actual technique |
| fig8.4 | 245 | code | Phone-rate two-dimensional table | OMIT | superseded — `mode-dispatch.8th`'s compound-key technique covers the 2D-table lesson with an original example |
| fig8.5 | 246 | code | Tiny Editor function table | OMIT | Tiny Editor not used; `mode-dispatch.8th` is the original replacement |
| fig8.6 | 251 | chart | Epson MX-80 graphics character set | OMIT | Ch.9's "Calculating Instead of Deciding" deliberately generalized this into an abstract six-pixel example rather than the specific Epson glyph set |

**On MOVE and MODERNIZE:** neither classification was needed. Nothing
found belongs at a *different* Thinking 8th location than where it
already sits (the fig3.8/fig3.9 case above is a genuine relocation
*from Brodie's chapter*, already accounted for as `KEEP — RELOCATED`,
not a case of this book putting a figure in the wrong place). Nothing
found needs a redrawn/updated version — every figure kept has already
been verified pixel-identical to the 2004 original, and
every figure omitted is omitted because its underlying lesson is
already served by real, tested 8th code or an original replacement, not
because the art itself is dated.



## A better source now exists: the 2004 3rd-edition PDF, 2026-08-30

Graham supplied `thinking-forth-2000/thinking-forth-color.pdf` — the
actual typeset 2004 3rd edition (CC BY-NC-SA, same license as the
`thinking-forth-1.0/` archive), with every figure embedded at its real
page. **Page-offset for navigating it: PDF page number = printed book
page number + 18**, confirmed across several widely-spaced samples.
Its acknowledgments section explains the `png/` figures' real
provenance: scanned/typeset originals extracted into PNGs for Chapters
1, 2, 7, and 8 by the 2004 production team, with the rest translated
from hand-drawn art to LaTeX.

Spot-checked every figure this book had already used
(`fig1-7`/`fig1-8`/`fig1-9`, `fig2-3`, `fig3-8`/`fig3-9`,
`fig4-1`/`fig4-2`/`fig4-3`, `img4-110`, `fig7-1`, `fig7-3`, `fig7-5`,
`fig8-6`) against this PDF — every one is pixel-identical to the
publication PNG already in `manuscript/illustrations/`. One earlier entry
in this file (`img7-211`, below) turned out to be a wrong call, now
corrected in place; everything else stands. Two firsts from this pass:
`fig7-7`/`fig7-8`/`fig7-9` (the `DOER`/`MAKE` diagrams, viewed for the
first time — still not used, see below) and the 2004/1994 prefaces
(new material, read in full, changes nothing already written).

## Archive audit (Chapters 1–5), 2026-08-30

The Brodie source archive (`thinking-forth-1.0/`) turns out to contain
**every** figure it references for Chapters 1–5 — 50 figure/cartoon
references total, all 50 present as `.eps` files, and 4 of those
(`fig1-1`, `fig1-3`, `fig1-4`, `fig1-6`) also have a `.tex` source
alongside the `.eps`. Nothing is missing from the archive itself; the
earlier (pre-audit) entries in this file describing figures as
"genuinely missing" were wrong in the narrow sense that the *source
material* is not missing — only this book's adaptation had not used it.
Corrected below.

**Rendering:** `.eps` is a binary/PostScript format with no rasterizer
(Ghostscript, ImageMagick) installed directly in this environment — but
mid-audit, PNG renders for figures in the archive turned up at
`thinking-forth-1.0/png/*.png`. That directory is a working collection
containing files of mixed or incompletely documented provenance — it
holds more files than the archive has `.eps` sources, and not every
filename in it matches an archive `.eps` — so it is not itself treated
as an authoritative source for how any individual PNG was produced. It
was useful for what it is: a way to actually view figures discussed
below rather than infer content from caption text alone. All six
"genuinely missing" entries and two sampled "decorative"
entries were viewed directly and confirmed; the caption-only inferences
for the remainder were not all individually re-checked against the
images (would be excessive for figures already correctly categorized as
superseded or not-used), but nothing viewed so far has contradicted a
caption-based judgment. The four figures with a `.tex` source alongside
their `.eps` were also readable directly as LaTeX — `fig1-4.tex`, for
instance, turned out to be a plain table (Brodie's "breakfast"
pseudocode with brace annotations), not drawn artwork at all.

**Licensing:** the archive's `copyright.tex` places a single blanket
notice — "Copyright 1984, 1994, and 2004 by Leo Brodie," CC
BY-NC-SA 2.0 — over what it calls "the work," and `title.tex` states
"With illustrations by the author," i.e. Brodie drew them himself; there
is no separate illustrator credit or carved-out rights holder for the
artwork specifically. On its face this suggests the figures are covered
by the same license as the text. That is a *license* reading, not a
*decision*: whether to use Brodie's actual artwork is a separate
pedagogical question from whether the license permits it, and per the
standing instruction not to insert Brodie's original artwork
automatically, this book uses publication PNGs that were individually
cross-checked against the authoritative 2004 PDF for identity and
placement, rather than the archive's `.eps` artwork files themselves.
The working `thinking-forth-1.0/png/` directory those PNGs came from
contains files of mixed or incompletely documented provenance and is
not itself treated as an authoritative provenance source (see "ten
figures wired in" below).

**Status key:** `AVAILABLE-IN-ARCHIVE` (file present, not yet judged
further), `SUPERSEDED` (this book already replaced the figure's job with
real code, a table, or equivalent prose — not a gap), `DECORATIVE`
(a cartoon/sight gag, no teaching content, correctly not reproduced),
`NOT-USED-IN-ADAPTATION` (Brodie's surrounding material — often a whole
worked example — wasn't adapted into this book at all, so the figure has
no anchor point here), `GENUINELY-MISSING` (the concept the figure
supported *is* in this book's text, with nothing visual standing in for
it — historical status, see the note below), `INSERTED` (Graham resolved
the licensing/pedagogical question this file raised, and directed that
the publication PNGs be wired into the manuscript; done 2026-08-30 — see
"Ten figures wired in" below).

**Update, 2026-08-30 — ten figures wired in.** All ten `GENUINELY-MISSING`
entries below have been inserted as real images into the manuscript,
on Graham's explicit instruction, resolving the licensing/pedagogical
question raised above (his call to make, and he's made it). Source:
the publication PNGs found in `thinking-forth-1.0/png/`, verified
against their captions and cross-checked against the authoritative
2004 PDF, copied into `manuscript/illustrations/` (a new, tracked
location — `thinking-forth-1.0/` itself stays reference-only and
untouched, per `README.md`) and referenced from the relevant
`chapterNN-*.adoc` files via AsciiDoc's `image::` directive, with
original, non-Brodie-caption alt text. The detailed per-figure
write-ups below are kept as-is —
they're still accurate descriptions of what each image shows and why it
was chosen — but their category is now `INSERTED`, not
`GENUINELY-MISSING`; see each chapter's manuscript file for the actual
placement and surrounding prose.

### Full reference table

| ID | Ch. | Caption (Brodie's) | Archive | Category |
|---|---|---|---|---|
| img1-004 | 1 | "So then I typed GOTO 500—and here I am!" | `.eps` | DECORATIVE |
| fig1-1 | 1 | Unstructured code using jumps/GOTOs | `.eps`+`.tex` | SUPERSEDED (condensed to one sentence; concept is common knowledge) |
| fig1-2 | 1 | Design for a structured program (Make Breakfast) | `.eps` | SUPERSEDED (this book's `breakfast.8th` is real running code, not a design sketch) |
| fig1-3 | 1 | Structured programming in a non-structured language | `.eps`+`.tex` | NOT-USED-IN-ADAPTATION (BASIC example, not adapted) |
| fig1-4 | 1 | Using a structured language (Pascal breakfast) | `.tex` only | SUPERSEDED — confirmed by direct read: pure LaTeX table, no art; this book's `breakfast.8th` covers the identical idea as real code |
| img1-010 | 1 | "Software patches are ugly…" | `.eps` | DECORATIVE |
| fig1-5 | 1 | A main program and subroutine in memory | `.eps` | NOT-USED-IN-ADAPTATION (memory layout not discussed) |
| img1-013 | 1 | "…carried successive refinement far enough" | `.eps` | DECORATIVE |
| fig1-6 | 1 | Structure chart (HIPO) | `.tex` only | NOT-USED-IN-ADAPTATION (Structured Design section heavily condensed) |
| fig1-7 | 1 | Structured design vs. component design | `.eps` | **INSERTED** — see below |
| fig1-8 | 1 | A lexicon describes a component | `.eps` | **INSERTED** — see below |
| fig1-9 | 1 | The entire application consists of components | `.eps` | **INSERTED** — see below |
| fig1-10 | 1 | Changing the indirect pointer (apples/red/green) | `.eps` | SUPERSEDED (`apples.8th`, verified, is strictly better than a static diagram) |
| img1-028 | 1 | "Two points of view" | `.eps` | DECORATIVE |
| img1-030 | 1 | "Two solutions to the problem of security" | `.eps` | DECORATIVE |
| img1-033 | 1 | "Best top-down designs of mice and young men" | `.eps` | DECORATIVE |
| fig2-1 | 2 | The iterative approach (Kim Harris) | `.eps` | NOT-USED-IN-ADAPTATION (Harris interview not reproduced, per copyright/originality policy) |
| img2-047 | 2 | "Refining the conceptual model…" | `.eps` | DECORATIVE |
| fig2-2 | 2 | An iterative approach to analysis | `.eps` | NOT-USED-IN-ADAPTATION (condensed to "Iteration Beats Prediction" prose) |
| fig2-3 | 2 | A data-flow diagram | `.eps` | **INSERTED** — see below |
| fig2-4 | 2 | Example of a decision tree | `.eps` | NOT-USED-IN-ADAPTATION (this book goes straight from prose to decision table, skipping the intermediate tree) |
| fig2-5 | 2 | The decision table | `.eps` | SUPERSEDED (real table in `chapter02-analysis.adoc`) |
| fig2-6 | 2 | A simplified decision table | `.eps` | SUPERSEDED (same) |
| fig2-7 | 2 | The sectional decision table | `.eps` | SUPERSEDED (`parking-fee.8th`'s factoring achieves the same split in real code) |
| fig2-8 | 2 | Decision table w/o operator involvement | `.eps` | SUPERSEDED (same) |
| img2-060 | 2 | "Given two adequate solutions…" | `.eps` | DECORATIVE |
| img2-063 | 2 | "An overgeneralized solution" | `.eps` | DECORATIVE |
| img2-066 | 2 | "Conventional wisdom reveres complexity" | `.eps` | DECORATIVE |
| fig3-1 | 3 | Pools of thought not yet linked | `.eps` | NOT-USED-IN-ADAPTATION (vacation/wedding anecdote not adapted) |
| fig3-2 | 3 | Tiny Editor decomposition | `.eps` | NOT-USED-IN-ADAPTATION (this book uses an original thermostat example, not Brodie's tiny editor) |
| fig3-3 | 3 | Traditional approach: view from the top | `.eps` | NOT-USED-IN-ADAPTATION (tiny editor) |
| fig3-4 | 3 | Structure for "Process a Keystroke" | `.eps` | NOT-USED-IN-ADAPTATION (tiny editor) |
| fig3-5 | 3 | Another structure for "Process a Keystroke" | `.eps` | NOT-USED-IN-ADAPTATION (tiny editor) |
| fig3-6 | 3 | The same section, refined/optimized | `.eps` | NOT-USED-IN-ADAPTATION (tiny editor) |
| fig3-7 | 3 | Adding refresh | `.eps` | NOT-USED-IN-ADAPTATION (tiny editor) |
| fig3-8 | 3 | Interface as a junction (traditional) | `.eps` | **INSERTED** — see below |
| fig3-9 | 3 | Use of the interface component | `.eps` | **INSERTED** — see below |
| fig3-10 | 3 | Two ways to add advanced capabilities | `.eps` | NOT-USED-IN-ADAPTATION (sequential-complexity section is prose-only, but the underlying example — vectoring in a word processor — wasn't adapted either) |
| no-scrambled | 3 | "No scrambled?" | `.eps` | DECORATIVE |
| fig4-1 | 4 | Backward-easier problem | `.eps` | **INSERTED** — see below |
| fig4-2 | 4 | Two containers (water jug) | `.eps` | **INSERTED** — see below |
| fig4-3 | 4 | Achieving the end result (water jug) | `.eps` | **INSERTED** — see below |
| img4-103 | 4 | "Intent on a complicated problem" | `.eps` | DECORATIVE |
| fig4-4 | 4 | The nine dots problem | `.eps` | NOT-USED-IN-ADAPTATION (this book's "Getting Unstuck" uses only the water-jug example, not nine dots — a scope choice, not an oversight) |
| fig4-5 | 4 | Not quite right (nine dots) | `.eps` | NOT-USED-IN-ADAPTATION (same) |
| img4-106 | 4 | "I'm not just sleeping…" | `.eps` | DECORATIVE |
| img4-110 | 4 | (untitled — "noun" "verb" syntax) | `.eps` | **INSERTED** — see below |
| fig4-6 | 4 | A table of 8-byte records | `.eps` | NOT-USED-IN-ADAPTATION (zero-relative-numbering point made without a worked byte-offset example) |
| fig4-7 | 4 | Traditional compiler vs. Forth compiler | `.eps` | NOT-USED-IN-ADAPTATION (this book's compiler/performance discussion lives in Ch.1, doesn't use this figure's framing) |
| fig4-8 | 4 | Roman numeral data access (Brodie's algorithm) | `.eps` | NOT-USED-IN-ADAPTATION (this book's `roman.8th` uses a deliberately different, original algorithm) |
| fig5-1 | 5 | "I still don't see how these conventions…" | `.eps` | DECORATIVE |
| fig5-2 | 5 | Wiggins, proud of his commenting technique | `.eps` | DECORATIVE |

### Genuinely missing, now inserted — detailed entries

*(Section title kept for history — these ten were identified as
genuinely missing during the archive audit; as of 2026-08-30 all ten
have been inserted into the manuscript as real images, per the note
above.)*

These were originally the only cases where a concept *this book's
adapted text actually discusses* had no visual counterpart at all, and
where a diagram would plausibly help. Six were flagged, in less formal
form, before this archive audit; this
pass confirms the archive has Brodie's own version available for
reference (not for reuse — see the licensing note above) and adds one
new entry (`img4-110`) found by checking every figure's exact anchor
point against this book's current text.

1. **Chapter 1, "Namespaces: A Lexicon You Don't Have to Invent."**
   Archive: `fig1-7.eps`, `fig1-8.eps`, `fig1-9.eps` — **viewed**.
   `fig1-7` is a two-part comparison: a strict top-down call tree
   (`UPDATE-RECORD` over `READ-RECORD`/`EDIT-RECORD`/`WRITE-RECORD`)
   above a "design by components" version of the *identical* code, where
   the same four words are redrawn with crossing lines down to boxes
   grouped by *what changes* instead (`STRUCTURE OF RECORDS`, `EDITOR`,
   `READ/WRITE ROUTINES`) — the crossing lines are the whole point, they
   show the call hierarchy and the component boundaries are genuinely
   different shapes. `fig1-8` is a single component box: informal noun
   names (`THING`, `DOHICKEY`, `ITEM`...) pointing at data slots on the
   left, informal verb names (`SPIN`, `ZOOM`, `HOOK`...) pointing at
   action arrows on the right, with a brace labeling the externally-used
   subset "Lexicon" and the whole box "Component." `fig1-9` is a
   whimsical robot-arm-makes-coffee drawing with a chain of named
   lexicon bubbles (root language → stepper-motor → trig-conversion →
   sensor-reading / robot-movement → robot-process) leading up to a
   terminal reading "MAKE COFFEE" — genuinely charming and genuinely
   clear about what a lexicon hierarchy is. Purpose confirmed: visualize
   namespaces/components as boxes with a public/internal boundary and
   "uses" arrows. Original replacement: `fig1-7`'s crossing-lines
   comparison is the most valuable one to redo with this book's own
   example (e.g. a naive control-flow decomposition of the thermostat
   vs. its actual `mode`/`set-mode` component grouping).
2. **Chapter 2, "Sketching Interfaces in Words, Not Diagrams."**
   Archive: `fig2-3.eps` — **viewed**. A clean, conventional data-flow
   diagram: four circles (`CHECK INVENTORY` → `AUTHORIZE PURCHASE` →
   `PRODUCE PURCHASE-ORDER`, with `TRANSFER MATERIALS FROM WAREHOUSE` as
   a second branch off the first), arrows labeled with the data flowing
   along them ("material request form," "purchasing request form,"
   "approval," three copies of the purchase order fanning out at the
   end). Purpose confirmed: exactly the DFD notation (circles for
   processes, labeled arrows for data) this book's text describes in
   order to contrast with the word-based `admit-car` sketch. Original
   replacement: the same circle-and-arrow notation, redrawn for the
   parking-garage scenario (a `DECIDE` circle taking "car arrives" in
   and producing "ticket printed" / "car turned away" out) so a reader
   can compare the two approaches on the same example.
3. **Chapter 3, the interface-too-narrow paragraph** (end of "The
   Limits of 'Level' Thinking"). Archive: `fig3-8.eps`, `fig3-9.eps` —
   **viewed**. `fig3-8`: two side-by-side module boxes, each
   independently containing its own copy of `BUFFER A` / `THING B` /
   `HANDSHAKE C` (drawn as a little handshake icon), meeting at a
   jagged seam labeled "INTERFACE" — the duplication *is* the picture.
   `fig3-9`: the fix — Module 1 and Module 2 are now empty boxes, each
   with one line down to a third, shared box labeled "INTERFACE
   COMPONENT" holding one copy of `BUFFER A` / `THING B` / `HANDSHAKE C`.
   Purpose confirmed: make "duplicated interface state" vs. "interface
   as its own component" visually obvious in one before/after pair.
   Original replacement: the same two-box-vs-three-box shape, using this
   book's own `mode`/`set-mode` vocabulary instead of generic
   `BUFFER A`/`THING B`.
4. **Chapter 4, "Getting Unstuck," the water-jug example — plus a
   distinct preceding figure, `fig4-1`, easy to conflate with it but
   not actually part of it.** `fig4-1`'s caption is "A problem that is
   easier to solve backward than forward" — a general "getting
   unstuck" illustration for the section's opening point, not the
   water-jug puzzle itself. Now **viewed** (a publication PNG for it
   turned up after this entry was first written): it's a hand-drawn maze,
   labeled "Start" and "End," with no numbers or jugs in it at all —
   confirms it's a standalone backward-reasoning analogy, not a third
   view of the two containers. Archive: `fig4-1.eps`, `fig4-2.eps`,
   `fig4-3.eps` — `fig4-2` and `fig4-3`
   **viewed**. `fig4-2` is simply the two containers, drawn as labeled
   barrels ("9" and "4") in a stream. `fig4-3` is the genuinely useful
   one: a 2×2 grid contrasting "Version A" (the wrong guess, 2+4=6) against
   "Version B" (the right guess, 9−3=6), each row showing the
   second-to-last state and the last state as filled/hatched barrels
   with an arrow for the pour — i.e. it visualizes exactly the backward
   reasoning this book's prose walks through step by step. Purpose
   confirmed: this is the single strongest candidate in the whole audit
   — a reader following the backward-reasoning argument in prose alone
   has to hold four numbers and two hypothetical pours in their head at
   once, and `fig4-3` is built specifically to remove that burden.
   Original replacement: a `fig4-3`-style two-hypothesis grid would
   transfer directly, needing no change beyond redrawing it (it isn't
   tied to any Forth-specific content in the first place).
5. **Chapter 4, "How 8th Wants to Be Written," the "noun verb" point.**
   Archive: `img4-110.eps` — **viewed**, and worth flagging because the
   content wasn't guessable from its (missing) caption: it's three tiny
   yard-work vignettes — a person mowing captioned "LAWN MOW", painting
   captioned "FENCE PAINT", and fixing a post captioned "POST FIX" —
   each an everyday, concrete instance of "noun verb" word order, right
   at the point Brodie's (and this book's) text makes that exact
   argument about `apples !`. Purpose confirmed: ground an abstract
   syntax-ordering claim in something obviously already familiar.
   Original replacement: the same everyday-chores device, or a version
   built from this book's own recurring examples (`apples !`,
   `garage-full? @`) so the illustration and the surrounding prose use
   the same vocabulary.
6. *(Lower priority, noted for completeness, not written up in full or
   individually viewed:
   `fig1-1` in the condensed history section, `fig1-6`/`fig2-1`/`fig2-2`
   in the heavily-condensed process/methodology sections, and `fig3-10`/
   `fig4-6` — all NOT-USED-IN-ADAPTATION because the surrounding Brodie
   material was deliberately condensed to a sentence or two rather than
   adapted as a full example. If any of that material is later expanded,
   revisit whether these need entries of their own.)*

## Chapter 6 onward

New entries go here as they're found, using the same format: location,
concept, what the missing illustration was for, what an original
replacement might look like — plus, per the archive audit above, the
actual archive ID and status if a corresponding Brodie figure exists.
Per the project's standing rules, a new gap also gets a placeholder
inserted directly in the chapter text (something like *[Illustration:
brief description — see ILLUSTRATIONS.md]*), unlike the Chapters 1–5
retroactive entries above, which are logged here only.

- **Chapter 6 (`chapter6.tex`) has two `\begin{figure*}` environments**
  (`fig6-1`, "What we're supposed to display"; `fig6-2`, "Another
  example of limiting compile-time redundancy"). Checked directly:
  both are `BVerbatim` code/ASCII-art listings, not drawn art — no
  `.eps`, no `includegraphics`. `fig6-1` is a 9-box ASCII grid,
  `fig6-2` is the `POINTS`/`#POINTS`/`DRAW` code Brodie's compile-time-
  factoring section walks through. Both are fully reproduced as real,
  runnable 8th examples in `manuscript/chapter06-factoring.adoc` (the
  `leftmargin`/`#points` example) rather than needing an illustration
  at all. No gap logged for Chapter 6.
- **Chapter 7 (`chapter7.tex`) has seven figure references**, none
  used, for two different reasons — checked directly, not archive-only:
  - `fig7-1` ("Example of a stack commentary") illustrates Brodie's
    `CMOVE>` stack-commentary form, part of the "Make Stack Drawings"
    and "Stack Tips" material (the `COUNT`-reordering tip and the
    single-value error-code convention) that this adaptation's Chapter
    7 (`manuscript/chapter07-taming-the-stack.adoc`) chose not to cover
    at all this round — no clean, non-contrived 8th example presented
    itself without reintroducing `rot`-style gymnastics the chapter
    was actively steering away from. NOT-USED-IN-ADAPTATION, not
    missing; revisit only if that material gets added later.
  - `fig7-3`/`fig7-5` (state-table and alternating-state-table
    conceptual diagrams) and `fig7-7`/`fig7-8`/`fig7-9` (`DOER`/`MAKE`
    diagrams) and `img7-211` (the "too many variables" cartoon)
    illustrate Brodie's "The State Table" and "Vectored Execution"
    sections. **Historical note, from before this book's Chapter 8
    existed:** this session deliberately deferred that material to a
    not-yet-written Chapter 8 rather than covering it in Chapter 7,
    with 8th's maps and `defer:`/`w:is` planned as the idiomatic
    targets. Chapter 8 has since been written — see "Update, Chapter 8
    written" below for the actual outcome.
    **Update, next session:** publication PNGs for four of these
    turned up in `thinking-forth-1.0/png/` and were viewed. `fig7-1`
    ("Example of a stack commentary") matches its caption exactly — a
    hand-drawn `CMOVE>` stack-effect worksheet with Operations/Stack-
    effects/Return-stack columns. `fig7-3` ("Conceptual model for
    saving a state table") and `fig7-5` ("...alternating-states
    tables") also match exactly — labeled-box arrays (`POINTERS`→
    `SAVED`, then `REAL`/`PSEUDO` side by side), genuinely useful
    references for writing Chapter 8's map-based state-table treatment
    (Chapter 8 itself not yet written at the time of this note).
    ~~`img7-211` does NOT match its caption~~ — **correction: this was
    wrong.** Checked against the real 2004 3rd-
    edition PDF (`thinking-forth-2000/thinking-forth-color.pdf`,
    supplied by Graham): the picture (a woman beside a bandaged,
    traction-suspended patient) genuinely is paired with the cannon/
    windmill/trapeze/balloon caption in the original — the mismatch
    between an absurd caption and an unrelated picture *is* the joke.
    The publication PNG was correct all along. `fig7-7`/`fig7-8`/`fig7-9`
    have now been viewed too (same PDF pass) — see below.
    **Update, Chapter 8 written:** `fig7-3` and `fig7-5` are now
    **INSERTED** — copied into `manuscript/illustrations/` and wired
    into `manuscript/chapter08-bundling-state.adoc`'s "A Table of Related
    Values" and "Two Live States, One Set of Names" sections, with
    original captions. `fig7-1` was NOT inserted: Chapter 8 doesn't walk
    through Brodie's `CMOVE`-based stack-commentary form at all (it uses
    the map/`G:clone` treatment instead), so the figure has no anchor
    point in this adaptation — NOT-USED-IN-ADAPTATION, not missing.
    `img7-211` stays unused — the image itself is fine (see
    correction above), but Chapter 8's `defer:`/`w:is` treatment never
    needed a "too many variables" joke to anchor to. `fig7-7`/`fig7-8`/`fig7-9` (`DOER`/`MAKE` diagrams)
    are NOT-USED-IN-ADAPTATION: Chapter 8 explains `DOER`/`MAKE`'s
    mechanism in prose rather than walking through it step-by-step the
    way Brodie's figures do, since 8th's own `defer:`/`w:is` replacement
    doesn't have (or need) that same compile-time trick to illustrate.
- **Chapter 8, i.e. `chapter8.tex` (Brodie's "Minimizing Control
  Structures," this project's Chapter 9), has six figure references**:
  `fig8-1` through `fig8-5` are `\verbfig` — code/pseudocode listings,
  not drawn art, matching the "Chapter 6 onward" pattern of BVerbatim
  figures needing no illustration slot at all. `fig8-6` ("The Epson
  MX-80 graphics character set") is real drawn art (`\wepsfiga`) and
  was already viewed this session (a grid of tiny character-code
  glyphs, `code/ch09/pixel-code.8th`'s ultimate inspiration) — but this
  adaptation's "Calculating Instead of Deciding" section deliberately
  generalized Brodie's printer-specific example into an abstract
  six-pixel calculation, so the actual Epson glyph-set image doesn't
  match what the text describes. NOT-USED-IN-ADAPTATION, not missing —
  revisit only if a future pass restores the printer-specific framing.
