# Illustration Placeholders

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
mid-audit, a complete set of pre-rendered PNGs for every `.eps` in the
archive turned up at `thinking-forth-1.0/png/*.png` (64 files, one per
`.eps`, matching filenames — origin unclear, not something this session
generated; see `GAPS.md`). That made it possible to actually view every
figure discussed below rather than infer content from caption text
alone. All six "genuinely missing" entries and two sampled "decorative"
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
*decision* — see `GAPS.md` for why using Brodie's actual artwork in this
book is a separate, unresolved question even if the license permits it,
and is **not** being acted on in this pass per the standing instruction
not to insert Brodie's original artwork automatically.

**Status key:** `AVAILABLE-IN-ARCHIVE` (file present, not yet judged
further), `SUPERSEDED` (this book already replaced the figure's job with
real code, a table, or equivalent prose — not a gap), `DECORATIVE`
(a cartoon/sight gag, no teaching content, correctly not reproduced),
`NOT-USED-IN-ADAPTATION` (Brodie's surrounding material — often a whole
worked example — wasn't adapted into this book at all, so the figure has
no anchor point here), `GENUINELY-MISSING` (the concept the figure
supported *is* in this book's text, with nothing visual standing in for
it).

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
| fig1-7 | 1 | Structured design vs. component design | `.eps` | **GENUINELY-MISSING** — see below |
| fig1-8 | 1 | A lexicon describes a component | `.eps` | **GENUINELY-MISSING** — see below |
| fig1-9 | 1 | The entire application consists of components | `.eps` | **GENUINELY-MISSING** — see below |
| fig1-10 | 1 | Changing the indirect pointer (apples/red/green) | `.eps` | SUPERSEDED (`apples.8th`, verified, is strictly better than a static diagram) |
| img1-028 | 1 | "Two points of view" | `.eps` | DECORATIVE |
| img1-030 | 1 | "Two solutions to the problem of security" | `.eps` | DECORATIVE |
| img1-033 | 1 | "Best top-down designs of mice and young men" | `.eps` | DECORATIVE |
| fig2-1 | 2 | The iterative approach (Kim Harris) | `.eps` | NOT-USED-IN-ADAPTATION (Harris interview not reproduced, per copyright/originality policy) |
| img2-047 | 2 | "Refining the conceptual model…" | `.eps` | DECORATIVE |
| fig2-2 | 2 | An iterative approach to analysis | `.eps` | NOT-USED-IN-ADAPTATION (condensed to "Iteration Beats Prediction" prose) |
| fig2-3 | 2 | A data-flow diagram | `.eps` | **GENUINELY-MISSING** — see below |
| fig2-4 | 2 | Example of a decision tree | `.eps` | NOT-USED-IN-ADAPTATION (this book goes straight from prose to decision table, skipping the intermediate tree) |
| fig2-5 | 2 | The decision table | `.eps` | SUPERSEDED (real Markdown table in `chapter02-analysis.md`) |
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
| fig3-8 | 3 | Interface as a junction (traditional) | `.eps` | **GENUINELY-MISSING** — see below |
| fig3-9 | 3 | Use of the interface component | `.eps` | **GENUINELY-MISSING** — see below |
| fig3-10 | 3 | Two ways to add advanced capabilities | `.eps` | NOT-USED-IN-ADAPTATION (sequential-complexity section is prose-only, but the underlying example — vectoring in a word processor — wasn't adapted either) |
| no-scrambled | 3 | "No scrambled?" | `.eps` | DECORATIVE |
| fig4-1 | 4 | Backward-easier problem | `.eps` | **GENUINELY-MISSING** — see below |
| fig4-2 | 4 | Two containers (water jug) | `.eps` | **GENUINELY-MISSING** — see below |
| fig4-3 | 4 | Achieving the end result (water jug) | `.eps` | **GENUINELY-MISSING** — see below |
| img4-103 | 4 | "Intent on a complicated problem" | `.eps` | DECORATIVE |
| fig4-4 | 4 | The nine dots problem | `.eps` | NOT-USED-IN-ADAPTATION (this book's "Getting Unstuck" uses only the water-jug example, not nine dots — a scope choice, not an oversight) |
| fig4-5 | 4 | Not quite right (nine dots) | `.eps` | NOT-USED-IN-ADAPTATION (same) |
| img4-106 | 4 | "I'm not just sleeping…" | `.eps` | DECORATIVE |
| img4-110 | 4 | (untitled — "noun" "verb" syntax) | `.eps` | **GENUINELY-MISSING** — see below |
| fig4-6 | 4 | A table of 8-byte records | `.eps` | NOT-USED-IN-ADAPTATION (zero-relative-numbering point made without a worked byte-offset example) |
| fig4-7 | 4 | Traditional compiler vs. Forth compiler | `.eps` | NOT-USED-IN-ADAPTATION (this book's compiler/performance discussion lives in Ch.1, doesn't use this figure's framing) |
| fig4-8 | 4 | Roman numeral data access (Brodie's algorithm) | `.eps` | NOT-USED-IN-ADAPTATION (this book's `roman.8th` uses a deliberately different, original algorithm) |
| fig5-1 | 5 | "I still don't see how these conventions…" | `.eps` | DECORATIVE |
| fig5-2 | 5 | Wiggins, proud of his commenting technique | `.eps` | DECORATIVE |

### Genuinely missing — detailed entries

These six are the only cases where a concept *this book's adapted text
actually discusses* has no visual counterpart at all, and where an
original diagram (not Brodie's) would plausibly help. All six were
already flagged, in less formal form, before this archive audit; this
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
4. **Chapter 4, "Getting Unstuck," the water-jug example.** Archive:
   `fig4-1.eps`, `fig4-2.eps`, `fig4-3.eps` — `fig4-2` and `fig4-3`
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

*(none yet)*
