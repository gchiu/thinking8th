# Plan

*Thinking 8th* adapts Leo Brodie's *Thinking Forth* (1984) into an original
teaching work for the [8th](https://8th-dev.com/) language — not a
mechanical Forth-to-8th translation. See
[`manuscript/00-preface.md`](manuscript/00-preface.md) for the full
statement of intent and [`manuscript/01-getting-started.md`](manuscript/01-getting-started.md) /
[`manuscript/02-notation.md`](manuscript/02-notation.md) for the reader
on-ramp.

## Method, per chapter

1. Determine what Brodie is actually trying to teach in the source
   chapter (`thinking-forth-1.0/chapterN.tex` — read it before assuming
   its title or content from memory).
2. Separate universal programming/stack-language ideas from Forth-specific
   machinery.
3. Find the genuine, idiomatic 8th treatment — not the closest-looking
   syntax, the way an 8th-only programmer would actually write it.
4. Write original prose. Reuse Brodie's pedagogical progression where
   useful; do not reuse his specific invented scenarios, anecdotes, or
   interview quotes (copyright and originality — see the Preface).
5. Verify every substantive code example against
   `D:\8th\bin\win64\8th.exe` before writing it down. Never present
   untested code as tested.
6. Record uncertain/version-dependent findings in `GAPS.md`; record
   skipped illustrations in `ILLUSTRATIONS.md`.
7. Rebuild `manuscript/Thinking-8th.docx` and `proof/Thinking-8th-proof.pdf`,
   spot-check the rendered pages, commit.

## File conventions

- `manuscript/*.md` — the book's source, in reading order by filename:
  `00-preface.md`, `01-getting-started.md`, `02-notation.md`, then
  `chapterNN-slug.md`. This is what gets edited; the `.docx` is generated
  from it (`cd tools && node build-docx.js`), and the `.pdf` proof is
  generated from the `.docx` (Word COM automation — see `HANDOFF.md`).
- `code/chNN/*.8th` — every runnable example, one file per example. This
  project does not keep a separate `examples/` vs. `tests/` split:
  each `.8th` file *is* both the example shown in the book and the thing
  actually executed to verify it, with expected output noted in comments
  and confirmed by running it. This is deliberate (keeps verification
  honest and unglamorous — the exact code in the book is the exact code
  that ran) rather than an oversight.
- `thinking-forth-1.0/` — Brodie's original LaTeX source, reference only,
  never edited, never the source of generated content.
- `docs/` (see note) — no longer present; internal AI-session working
  notes were removed as development artifacts. `GAPS.md`, `ILLUSTRATIONS.md`,
  and `HANDOFF.md`, all at repo root, are the current project-tracking
  files and should be kept lean and genuinely useful, not session diaries.

## Chapter status

Brodie's book has 8 chapters plus appendices. Titles below are verified
against `thinking-forth-1.0/chapterN.tex` directly — don't trust a
remembered table of contents; two chapters so far turned out to have
different titles/content than a first guess suggested.

| # | Brodie's title | Status | Manuscript file |
|---|---|---|---|
| 1 | The Philosophy of Forth | done | `chapter01-philosophy.md` |
| 2 | Analysis | done | `chapter02-analysis.md` |
| 3 | Preliminary Design/Decomposition | done | `chapter03-decomposition.md` |
| 4 | Detailed Design/Problem Solving | done | `chapter04-detailed-design.md` |
| 5 | Implementation: Elements of Forth Style | done | `chapter05-style.md` |
| 6 | Factoring | done | `chapter06-factoring.md` |
| 7 | Handling Data: Stacks and States | split across two of our chapters (see below) | `chapter07-taming-the-stack.md` + `chapter08-bundling-state.md` |
| 8 | Minimizing Control Structures | done | `chapter09-minimizing-control-structures.md` |
| A–E | Appendices | not started, may not all be needed | — |

Brodie's chapter 7 turned out too large and too mixed (genuinely
portable stack/local-variable discipline alongside two large, deeply
Forth-memory-specific mechanisms — `CREATE`/`DOES>` state tables and
`DOER`/`MAKE` vectored execution) for one of our chapters. Split:
**our Chapter 7** ("Taming the Stack," done) covers the portable half —
escaping a crowded stack, word-local variables, the auxiliary `>r`
stack, save/restore-as-bad-factoring, sharing a component safely.
**Our Chapter 8** ("Bundling State, Redirecting Behavior," done) covers
the rest — Brodie's "State Table" section, using 8th's maps and
`G:clone` (not `o:` objects, which turned out not to be needed) in
place of raw indexed memory, and "Vectored Execution", using 8th's
native `defer:`/`w:is` in place of hand-rolled `DOER`/`MAKE` — verified
against the runtime, including the one corner (self-recursion) that
doesn't map onto `defer:` at all and uses `recurse` instead. Brodie's
own chapter 8, "Minimizing Control Structures," became *our* Chapter 9
("Minimizing Control Structures," done) — condensed substantially:
case statements, decide-vs-calculate, and decision tables were already
covered (Ch.2/4/6/7/8), so Chapter 9 focuses on what hadn't been shown
yet — `a:when`/`a:when!` for sequential guarded dispatch with a default,
a two-dimensional decision table via compound map keys, `n:min`/`n:max`
for clipping, arithmetic bit-packing, and an honest note that classic
Forth's boolean-as-integer `AND` trick and its return-stack-based
`R> DROP` early-exit technique both have no 8th equivalent (real
booleans; `>r`/`r>` deliberately isn't the real return stack) and don't
need one, since 8th already has safer, dedicated words for the same
jobs. Appendices are next, if wanted — check with Graham before
assuming they're in scope.

Depth over speed: a chapter isn't "done" until its code has actually run
and its prose has actually been read back for the beginner-readability
rule below. Fewer, solid chapters beat more, shaky ones.

## Standing rules (do not relax)

- Original teaching work, not a translation. Explain *why*, not just
  *what*.
- Every new 8th word: plain-English idea → (notation shorthand if any,
  explicitly framed as shorthand) → tiny verified demo → real example.
  Never use an unexplained word in an example. Never assume prior Forth
  or stack-language knowledge — Forth comparisons are skippable asides.
- Verify against the real interpreter (`D:\8th\bin\win64\8th.exe`) and
  the local docs (`D:\8th\docs\md\*.md`, `docs/help.sql`,
  `D:\8th\samples\`). Never modify `D:\8th`.
- Where Brodie's own example is his particular creative invention (not a
  generic, timeless problem), build an original replacement that teaches
  the same lesson rather than reproducing his.
- Where a Brodie figure/cartoon is skipped, note it in `ILLUSTRATIONS.md`
  rather than silently dropping it or attempting to recreate the
  original artwork.
- Small, safe, local commits per logical unit of work. Never push unless
  explicitly asked. Never discard uncommitted work without checking.
