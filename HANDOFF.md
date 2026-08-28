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

See `PLAN.md` for the full chapter map against Brodie's actual table of
contents and the current chapter-5-onward status.

## Safety rules

- Never modify anything under `D:\8th` — read-only, execute the binary
  only.
- Never push to the remote unless explicitly asked.
- Never discard uncommitted work without checking `git status` first.
- The DOCX is the master; never hand-edit it. The PDF is generated
  proofing output; never edit it independently.

---

*(The sections below are filled in at the end of each work session —
see the most recent dated entry for what actually happened last.)*
