# Illustration Placeholders

Brodie's original chapters lean heavily on figures and cartoons
(`thinking-forth-1.0/chapterN.tex`, the `\wepsfig*`/`\wtexfig*` macros).
This book does not reproduce his original artwork (different book,
different license situation for the drawings themselves) and mostly
doesn't need direct equivalents, because most of his diagrams were
replaced here with something else that carries the same weight — an
actual code example, a real Markdown table, or prose that walks through
the same idea a diagram would have shown. Pure decorative cartoons
(sight gags with no teaching content) are not tracked here at all; only
places where a diagram was doing real pedagogical work and this book's
current text doesn't have an equivalent.

Each entry: location in this book, the surrounding concept, what the
missing illustration was for, and what an original replacement might
look like. The printed book's actual illustration needs will be
reviewed separately later — this file is the working list for that
review, not a commitment to produce every entry.

## Retroactive audit: Chapters 1–4

Brodie's chapters 1–4 contain 48 figure/cartoon references in total.
Most are decorative or were superseded by this book's own examples (his
decision-table figures, for instance, became an actual Markdown table in
Chapter 2 — strictly better than a placeholder). Four genuinely left a
gap worth recording:

1. **Chapter 1, "Namespaces: A Lexicon You Don't Have to Invent."**
   Corresponds to Brodie's fig1-7/1-8/1-9 (structured design vs.
   component design; a lexicon as a component's interface; an
   application built entirely of components). This book's text argues
   the same point in prose (namespaces as a formal, enforced version of
   Brodie's "lexicon") but has no diagram. A simple box-and-arrow figure
   — one box per component/namespace, arrows showing "uses," a dashed
   boundary around each component's public words vs. its internal ones —
   would reinforce the point visually. Not essential; the prose plus the
   `apples` example already carries the idea.
2. **Chapter 2, "Sketching Interfaces in Words, Not Diagrams."**
   Corresponds to Brodie's fig2-3 (a data-flow diagram). This book's
   text explicitly *describes* a DFD (circles for operations, arrows for
   data) in order to contrast it with the word-based `admit-car` sketch,
   but never shows one. A small original DFD for the same parking-garage
   scenario — a circle for "decide," arrows in from "car arrives" and
   out to "ticket printed" / "turned away" — would let a reader
   literally compare the two approaches side by side, which is the
   chapter's actual point.
3. **Chapter 3, interface-boundary discussion** (the "related trap is
   building an interface too narrow to reach the thing behind it"
   paragraph, near the end of "The Limits of 'Level' Thinking").
   Corresponds to Brodie's fig3-8/3-9 (interface as junction vs. as its
   own component). A diagram showing two components with a too-narrow
   set of shared words between them, versus the same two components with
   the fuller `mode@`/`set-mode` style toolset exposed, would make the
   abstract "boundary drawn too tight" idea concrete.
4. **Chapter 4, "Getting Unstuck," the water-jug example.** Corresponds
   to Brodie's fig4-1/4-2/4-3. This book states the puzzle (nine-gallon
   and four-gallon containers, no markings, measure exactly six) and its
   backward-reasoning solution entirely in prose. A simple two-container
   diagram, ideally showing the actual sequence of fill/pour states in
   the solution, would help readers who think more visually than
   verbally follow the "work backward" argument — this is arguably the
   single best candidate in the whole retroactive list, since Brodie
   himself used three separate figures for exactly this reason.

## Chapter 5 onward

New entries go here as they're found, using the same format: location,
concept, what the missing illustration was for, what an original
replacement might look like. Per the project's standing rules, a
placeholder is also inserted directly in the chapter text at the point
of loss (something like *[Illustration: brief description — see
ILLUSTRATIONS.md]*) so a reader of the manuscript sees a marker, not a
silent gap — this differs from the retroactive Chapters 1–4 entries
above, which were logged here only, without editing already-completed
chapter text.

*(none yet)*
