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
7. Rebuild `proof/Thinking-8th-proof.pdf` (`cd tools && node build-pdf.js`),
   spot-check the rendered pages, commit.

## File conventions

- `manuscript/*.adoc` — the book's source, AsciiDoc as of the
  2026-08-31 migration (was Markdown before that). `manuscript/book.adoc`
  is the master: it sets the title and `include::`s every other file,
  in reading order — a new chapter needs one new `include::` line added
  there, not just a correctly-named file. Five formats build from this
  one source and nothing else — PDF, HTML, EPUB, and two files
  explicitly marked generated-only (a Markdown reading copy, a DOCX
  review copy) — via `cd tools && node build.js`. See `PUBLISHING.md`
  for the canonical-source rule and exact build commands, and
  `HANDOFF.md` for the full migration/pipeline-build history, including
  the real Typst/pandoc quirks the build works around.
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

**Book-level audit, 2026-08-31.** Before any further numbered chapters,
Graham asked for a full audit of the manuscript as a *book*, not just
nine completed chapters: a proper ending (the book had none — it
stopped cold at Chapter 9's summary), a section-by-section mapping of
every Brodie chapter 1–8 against its Thinking 8th treatment, and a
full illustration audit against the real 2004 3rd edition. Result:
`manuscript/epilogue.md` ("8th's Effect on Thinking") closes the book;
the full chapter-mapping table lives in `HANDOFF.md`; the full
illustration audit (every figure in Brodie's book, not just the ones
already used) lives in `ILLUSTRATIONS.md`, including a direct review of
whether relocating fig3.8/fig3.9 into the thermostat example (instead
of Brodie's Tiny Editor) was justified — concluded yes, reasoned there
in full. Two small, clearly-justified manuscript fixes came out of the
mapping audit (Ch.1's overclaimed namespace enforcement; Ch.3's missing
"objective units" point) — see `HANDOFF.md` for both. Nothing was
restored merely to lengthen a chapter.

**Attribution and illustration alignment pass, 2026-08-31 (same day,
later).** Follow-up requested by Graham: a full historical/intellectual
provenance audit (every "Brodie"/"Moore" mention checked against the
2004 edition, correcting places where Brodie's book gets credit for
judgment that's actually Charles Moore's, as Forth's inventor), plus a
final, stricter re-check of the illustration audit — in particular
whether relocating fig3.8/fig3.9 into the thermostat example still
holds up under a tighter test ("move only if it still illustrates
precisely the same point; restore or omit if the relocation weakens
picture-to-argument fit"). Verdict on both: three small provenance
corrections made (Ch.1, Ch.2, Ch.6 — see `GAPS.md`'s "Historical/
intellectual attribution audit" entry for the evidence behind each),
one sentence added to the Preface making the Brodie/Moore relationship
explicit, and fig3.8/fig3.9's relocation reconfirmed (`ILLUSTRATIONS.md`).
Every kept illustration's filename was cross-checked byte-for-byte
against the archive. Next up, per Graham's direction right after this
pass: the manuscript source format is moving from Markdown to
AsciiDoc, with PDF built via pandoc rather than the current DOCX +
Word-COM pipeline. That migration is intentionally a separate,
follow-up commit — see `HANDOFF.md`'s most recent session entry.

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
