# Adaptation Method: Turning a Classic Programming Book Into a Teaching Work for a New Language

This document generalizes the method that produced *Thinking 8th* (an
adaptation of Leo Brodie's *Thinking Forth* for the 8th language) into a
reusable template. Section A is the general method — it applies to adapting
*any* classic programming-teaching work to *any* modern target language.
Section B parameterizes the specific project inputs. Section C holds the
rules specific to the current target language (8th) in one clearly
separated place, so a future project (for example, adapting *Thinking
Forth* to Ren-C) can replace Section C alone and reuse A, B, and D
unchanged.

If you are an AI picking this up mid-project, read `docs/AI-HANDOFF.md`
first for current state; read this file for *how to work*, not what's been
done so far.

---

## A. General Principles

These apply regardless of source book or target language.

### Understanding before writing

1. **Identify what the original author is actually trying to teach.**
   Every passage, example, and anecdote in the source book exists to make
   some point. Find the point before deciding how to render the passage.
   A passage can be technically about the source language while actually
   *teaching* something language-independent (a design principle, a
   problem-solving habit) — adapt the lesson, not the surface.
2. **Separate universal ideas from source-language machinery.** Some of
   what the source book teaches is a permanent, portable idea (information
   hiding, decomposition by what's likely to change, working backward from
   a goal). Some of it is specific to how the *source* language happens to
   implement that idea (a particular memory-layout trick, a particular
   control-flow word). Keep the former; don't force the latter.
3. **Find the genuine idiomatic target-language concept**, not the closest
   surface-level syntax match. The right question is never "what's the
   target-language word that looks like the source-language word?" It's
   "how would someone who only ever learned the target language naturally
   express this same underlying idea?" Sometimes the honest answer is that
   the target language already has a *better*, more formalized version of
   what the source language's author had to argue readers into doing by
   convention — say so explicitly when it's true, because it's a genuine
   selling point of the target language, not just a translation detail.
4. **Explain contrasts where there is no direct analogue, rather than
   forcing one.** If the target language simply doesn't have a clean
   equivalent to some source-language technique, say that plainly, explain
   why (what problem did the source language have that the target language
   doesn't, or solves differently), and move on. A forced, unconvincing
   analogue is worse than an honest gap.
5. **Never mechanically translate syntax.** Renaming source-language words
   to target-language words while preserving the source's exact code
   structure produces something that reads like neither language natively.
   If the natural target-language solution to a problem has a different
   *shape* than the source's solution — different control flow, different
   data structures, different factoring — use the different shape.

### Verification discipline

6. **Verify every non-trivial claim against authoritative local sources**
   before writing it down: the target language's own official
   documentation, its bundled examples/samples, and — when those don't
   settle a question — a small experiment run against the actual
   interpreter/compiler. Do not rely on general training knowledge about a
   language when an authoritative local source is available and the claim
   is checkable.
7. **Execute every substantive code example** against the real target-
   language toolchain, and quote the *actual observed output* in the
   manuscript, not a predicted one. If an example genuinely can't be
   executed in the working environment (needs a GUI, hardware, network,
   an unavailable commercial feature), say so plainly rather than silently
   presenting untested code as verified, and verify what you can from
   documentation instead.
8. **Prefer a small experiment over speculation.** When uncertain whether
   some construct behaves as expected, write the smallest possible test
   that would settle the question and run it, rather than reasoning at
   length about what "should" happen. This is cheaper in both time and
   correctness than guessing and being wrong later. Isolated A/B test
   files (in a scratch location, not committed) are a legitimate and
   often-fastest way to root-cause a surprising result — including
   *tooling* bugs, not just language-behavior questions.

### Writing discipline

9. **Produce real, readable book prose — not research notes, not an
   outline, not an AI-generated work log.** The deliverable at the end of
   working on a chapter is something a human can open and read start to
   finish and come away having learned the material. Research and
   verification happen in service of that prose; they are not a
   substitute for it, and they don't belong mixed into it.
10. **Work chapter by chapter, sequentially**, with each chapter reaching a
    genuinely finished, verified state before moving to the next. Do not
    draft the whole book in a rough pass and polish later — a smaller
    number of excellent, fully-verified chapters is a better outcome than
    a larger number of shaky ones, and is also the more honest form of
    progress to report.
11. **Preserve the source's pedagogical progression where it's genuinely
    useful, without slavishly copying its examples.** The order in which
    ideas are introduced, and the way one chapter's running example sets
    up the next chapter's lesson, are often worth keeping — they reflect
    real pedagogical judgment. The *specific* scenarios, numbers, and
    invented anecdotes used to illustrate those ideas usually are not
    worth keeping verbatim.
12. **Use original replacement examples where they teach the same idea
    more naturally in the target language**, or where reusing the
    source's specific invented scenario would mean reproducing the
    source author's own creative expression too closely (see Copyright,
    below) — not just for variety's own sake. A replacement example
    should exist because it's a *better fit*, not merely a *different*
    one.
13. **Avoid rhetorical overreach.** Before committing a broad or vivid
    claim about the target language, ask: *is this vivid, or is it
    actually true?* Absolute language ("the only way," "X doesn't
    distinguish Y at all," "this makes other approaches obsolete") is
    rarely defensible and is easy to quietly walk back into something
    narrower and still interesting ("X makes this style unusually
    natural"). Don't disparage other languages or paradigms to make the
    target language look better by comparison; fair comparisons are more
    convincing and more honest. When the source author's own historical
    claims (about a *rival* paradigm, say) have been softened or
    retracted by later editions or by the wider field, say so rather than
    repeating the original claim uncritically.

### Working style

14. **Conserve tokens and context deliberately.** Search before reading;
    read only the relevant section of a large source file, not the whole
    thing; don't re-read material already understood earlier in the same
    session; don't produce large speculative internal summaries. This
    matters more, not less, as a project spans many sessions.
15. **Use the filesystem and Git as durable memory, not the conversation.**
    A session-boundary or context reset should lose nothing important,
    because everything that matters is already committed to files:
    manuscript prose, verified code, and a concise, current project log
    (see Section D). Don't rely on anything being remembered that wasn't
    written down.
16. **Make small, safe, logical commits**, one per coherent unit of work
    (a chapter, a tooling fix, a layout pass) — not one giant commit at
    the end, and not commits so fine-grained they don't represent a
    complete, working state. Check `git status` before anything
    destructive; never discard uncommitted work without being certain
    it's disposable; never push unless explicitly asked.

### Publication

17. **Produce an editable publication master in a real word-processor
    format (DOCX), generated from a plain-text/Markdown source, plus a
    PDF proof generated from that DOCX** — not the other way around, and
    not treating the PDF as independently editable. Decide the DOCX
    structure (styles for headings, code, code output, block quotes,
    tables, captions) deliberately, generally modeled on the source
    book's own typographic conventions where they still make sense, not
    on whatever a document-generation library defaults to.
18. **Visually inspect the generated proof early and often, not just at
    the end.** Render pages to images and actually look at them. Schema
    validation (does the file conform to the format spec) and visual
    correctness (does it look right) are different questions, and each
    catches bugs the other misses — a file can be perfectly valid OOXML
    and still render with invisible text, broken lists, or awkward page
    breaks. Trust neither check alone.
19. **Keep code editable text in the publication, never a screenshot or
    image of code.** A reader of the eventual book needs to be able to
    select, copy, and modify example code.
20. **Maintain copyright and licensing awareness throughout.** Note the
    source work's license explicitly and follow it (attribution,
    non-commercial/share-alike terms, etc., as applicable). Do not
    reproduce large passages, specific invented anecdotes, interview
    quotes, or a source author's particular creative solution to a
    generic problem, even in translated code form — paraphrase and
    reinterpret, or replace with an original example, so the result is a
    genuine adaptation rather than a disguised reproduction. Generic,
    timeless problems (a classic puzzle, a well-known algorithmic
    exercise) are fine to reuse; a specific author's particular way of
    solving or presenting one usually is not.

---

## B. Parameterized Project Inputs

Fill these in once per project. Everything in Section A and Section D
refers to these placeholders rather than hard-coding a specific project.

| Placeholder | Meaning | This project's value |
|---|---|---|
| `<SOURCE-BOOK-REPOSITORY>` | Working repo containing the source book's original material (kept as read-only reference, not edited) | `thinking-forth-1.0/` inside `<WORKING-REPOSITORY>` |
| `<SOURCE-BOOK-PATH>` | Path/glob to the source book's chapter files | `thinking-forth-1.0/chapterN.tex` |
| `<TARGET-LANGUAGE-SOURCE>` | Where the target language's own source or distribution lives, if relevant | — |
| `<TARGET-LANGUAGE-DOCUMENTATION>` | Authoritative local docs for the target language | `D:\8th\docs\md\*.md`, `D:\8th\docs\help.sql`, `D:\8th\samples\` |
| `<TARGET-LANGUAGE-BINARY>` | Executable used to verify examples | `D:\8th\bin\win64\8th.exe` |
| `<WORKING-REPOSITORY>` | The adaptation project's own repo | `D:\repos\thinking8th` |
| `<OUTPUT-DOCX>` | Generated editable publication master | `manuscript/Thinking-8th.docx` |
| `<OUTPUT-PDF>` | Generated proof, from the DOCX | `proof/Thinking-8th-proof.pdf` |

To start a **new** adaptation project (e.g. *Thinking Forth* → Ren-C):
copy this file into the new project's repo, refill the table above for the
new source/target pair, replace Section C with a new addendum for the new
target language (see the note at the top of Section C), and leave Sections
A and D as they are.

---

## C. Target-Language-Specific Addendum — 8th

*(This section is specific to the current project's target language, 8th.
A future adaptation to a different language — Ren-C, for instance —
should replace this entire section with its own addendum, written the
same way: syntax gotchas that trip up someone arriving from the source
language, verified stack/data-flow idioms, and any tooling specifics for
that language's own build/run workflow. Sections A, B, and D above don't
need to change.)*

### Syntax gotchas versus Forth

- `( ... )` is **not** a comment in 8th — it compiles an anonymous word.
  Comments are `\` / `--` (line) and `(* ... *)` (block). This is the
  single biggest trap for a Forth-experienced reader and must be
  explained before the first code example.
- Namespaces (`n:`, `s:`, `a:`, `m:`, `w:`, ...) are a real, enforced
  language feature — most operators aren't usable unprefixed.
- No `n:<=` / `n:>=`; build them from `n:<` / `n:>` and `not`.
- `;then` is shorthand for `;; then` — an early-return-if-true that also
  closes the `if`.

### Verified idioms worth reusing

- `caseof` (array/map lookup, executing the result if it's a word) is the
  natural 8th realization of a "decision table."
- `defer:` / `w:is` is the natural 8th realization of a forward reference
  / "solve this later" placeholder.
- Pre-tested loop shape: `COND if repeat BODY COND while then` (8th's own
  documented `repeat...while` example is post-tested — runs at least
  once — which is a different, easily-confused thing).
- `a:each` quotations receive `(item index --)`; `loop` passes just the
  index.

### Tooling specifics for this project

- No `pandoc`, no LibreOffice/`soffice` on the working machine. DOCX is
  built directly with the `docx` npm package (`tools/build-docx.js`); PDF
  proofs come from real Microsoft Word via PowerShell COM automation.
  **`$doc.Close(0)`, never a bare `Close()`**, when exporting — see
  `docs/AI-HANDOFF.md` for why.
- `D:\8th` is read-only reference material; never modify it, never run
  its setup/installer scripts, only ever execute the bundled binary.

For the full, up-to-date list of technical and tooling discoveries (this
list is a summary; the authoritative record is longer), see
`docs/OVERNIGHT-NOTES.md` and `docs/AI-HANDOFF.md`.

---

## D. Continuation / Recovery Prompt

Use this prompt verbatim (filling in the placeholders from Section B) to
resume the project after an AI context reset, a new session, or a machine
restart, when no other instructions are available:

> Resume the `<WORKING-REPOSITORY>` adaptation project using Git and the
> repository's own files as ground truth — not this conversation, which
> has no memory of prior sessions.
>
> 1. Run `git status` and `git log --oneline -n 10` in
>    `<WORKING-REPOSITORY>` to see the actual current state. Do not assume
>    anything about progress beyond what these show.
> 2. Read `docs/AI-HANDOFF.md` for a concise summary of current state,
>    workflow, decisions made, and the exact next task.
> 3. Read `docs/ADAPTATION-METHOD.md` (this file) for the working method —
>    Section A for general principles, Section C for target-language-
>    specific rules.
> 4. If `docs/AI-HANDOFF.md` and the actual repository state disagree
>    (e.g. it references a chapter or commit that doesn't match `git log`),
>    trust the repository and fix the stale parts of the handoff doc as
>    part of your work, rather than proceeding on stale assumptions.
> 5. Continue with the "Exact next logical task" from `docs/AI-HANDOFF.md`,
>    following the method in Section A: understand what the source
>    chapter is actually teaching before writing anything, verify
>    technical claims against `<TARGET-LANGUAGE-DOCUMENTATION>` and by
>    executing examples against `<TARGET-LANGUAGE-BINARY>`, write real
>    prose (not notes), rebuild `<OUTPUT-DOCX>` and regenerate
>    `<OUTPUT-PDF>` per the documented workflow, visually inspect the
>    result, and commit as a self-contained checkpoint.
> 6. Before stopping, update `docs/AI-HANDOFF.md` (current state, latest
>    commit) and `docs/OVERNIGHT-NOTES.md` (what was done, what was
>    found) so the *next* resume is equally safe.
> 7. Never modify the read-only target-language reference distribution.
>    Never push to the remote unless explicitly asked. Never discard
>    uncommitted work without checking it first. The DOCX is the
>    publication master — never hand-edit it directly; regenerate it from
>    the Markdown source. The PDF is proofing output generated from the
>    DOCX — never edit it independently.
