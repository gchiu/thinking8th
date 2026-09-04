# Publishing

## Canonical source rule

**`manuscript/book.adoc` and the files it `include::`s are the only
place prose, code examples, or illustration references belong.**

`manuscript/book.adoc` sets the title/subtitle and `include::`s every
chapter and front-matter file, in reading order — it's the actual
master; the presence of a correctly-named chapter file alone doesn't
put it in the book, it has to be `include::`d too. Everything under
`proof/` is a **generated build artifact**. Nobody edits a file in
`proof/` directly, and nobody sends a correction against one — every
one of them is silently overwritten the next time someone runs the
build, and none of them is where a pull request should touch:

| File | What it is |
|---|---|
| `manuscript/book.adoc` | The master document. Sets title/subtitle, `include::`s everything else. |
| `manuscript/*.adoc` | One chapter or front-matter section each. **This is where prose edits and pull requests belong.** |
| `manuscript/illustrations/*.png` | The book's figures, referenced from chapter text via `image::illustrations/file.png[...]`. |
| `code/chNN/*.8th` | Every runnable example, one file per example — the exact code shown in the book, actually executed to verify it. |
| `proof/Thinking-8th-proof.pdf` | Generated. The canonical reading/print format — Pandoc → Typst. |
| `proof/Thinking-8th.html` | Generated. Single self-contained file, images embedded. |
| `proof/Thinking-8th.epub` | Generated. Reflowable ebook. |
| `proof/Thinking-8th.generated.md` | Generated. **Reading copy only** — see the notice at the top of the file itself. Not a second source of truth. |
| `proof/Thinking-8th.generated.docx` | Generated. **Compatibility/review copy only** — for tools or reviewers that need Word, not for editing. |

Five formats, one source, one AST: every one of them is Pandoc reading
`manuscript/book.adoc` (AsciiDoc) once and writing a different target.
None of them is hand-maintained, and none of them is generated from
any of the others — there's no HTML-from-DOCX or EPUB-from-Markdown
step anywhere in this pipeline. Fix a typo in exactly one place
(the relevant `manuscript/*.adoc` file) and every output picks it up
on the next build.

## Reproducing the build

### Tools required, pinned to the versions this was built and tested against

| Tool | Version used | Why |
|---|---|---|
| [Pandoc](https://pandoc.org/) | **3.11** | Reads the AsciiDoc source once; writes all five output formats. |
| [Typst](https://typst.app/) | **0.15.1** | Pandoc's PDF engine (`--pdf-engine=typst`) — not a system LaTeX install. |
| [Node.js](https://nodejs.org/) | 24.20.0 (any reasonably recent LTS should work) | Runs `tools/build.js`, which just shells out to `pandoc`. No npm packages required. |

Neither Pandoc nor Typst needs an installer or admin rights — both
ship as a single portable executable:

```bash
# Windows example (adjust the URL/arch for your platform):
# Pandoc: https://github.com/jgm/pandoc/releases -- grab the
#   windows-x86_64.zip, extract pandoc.exe somewhere on PATH.
# Typst: https://github.com/typst/typst/releases -- grab the
#   x86_64-pc-windows-msvc.zip, extract typst.exe somewhere on PATH.
```

Confirm both are on `PATH` before building:

```bash
pandoc --version
typst --version
```

### Build commands

```bash
cd tools

node build.js          # builds all five formats
node build.js pdf       # just proof/Thinking-8th-proof.pdf
node build.js html      # just proof/Thinking-8th.html
node build.js epub      # just proof/Thinking-8th.epub
node build.js md        # just proof/Thinking-8th.generated.md
node build.js docx      # just proof/Thinking-8th.generated.docx
```

That's the entire pipeline. A fresh clone, with Pandoc and Typst on
`PATH`, reproduces every output above with those commands alone — no
other tool, no manual step, and nothing that requires an AI assistant
to run.

## Format-specific build details

- **PDF** (`tools/build-pdf.js`, invoked by `build.js pdf`) — Pandoc
  with `--pdf-engine=typst` and a from-scratch Typst template,
  `tools/book-template.typ` (not an extension of Pandoc's own default
  template, whose imported `conf()` function only accepts named paper
  presets like `"us-letter"`, not this book's custom trim). Sets the
  exact page size (6.8125"×9.125", Brodie's own original *Thinking
  Forth* trim), heading styles, shaded code blocks, and a native
  `#outline()` table of contents.
- **HTML** — `--standalone --embed-resources --toc`. One file; all 12
  illustrations embedded as base64 data URIs, so there's no companion
  `images/` folder to lose track of when the file is moved or shared.
- **EPUB** — `--toc`, EPUB3 with both `nav.xhtml` (EPUB3) and
  `toc.ncx` (EPUB2 compatibility) generated automatically. Chapters
  split on level-1 (`==`) headings — the same points a reader would
  expect chapter breaks. Reflowable by design; no fixed-layout
  metadata is set.
- **Markdown** — Pandoc's plain `markdown` writer, deliberately *not*
  `gfm` (confirmed: `gfm` silently drops this book's `8th`/`text`
  code-fence language tags entirely; plain `markdown` preserves them).
  `tools/build.js`'s `buildMarkdown()` step does two things Pandoc's
  writer doesn't do on its own: rewrites the illustration image links
  (written in the source relative to `manuscript/`, where they
  actually live) so they still resolve from the generated file's real
  location in `proof/`, and prepends a generated-file notice so the
  file is unambiguous about not being editable source.
- **DOCX** — `--reference-doc=tools/book-reference.docx`. That
  reference document is Pandoc's own default reference DOCX
  (`pandoc --print-default-data-file reference.docx`) with exactly one
  deliberate change: an explicit page size matching this book's
  6.8125"×9.125" trim, added by hand-editing the extracted
  `word/document.xml`'s `<w:sectPr>` to include a `<w:pgSz>`/`<w:pgMar>`
  pair, then re-zipping. Everything else — fonts, heading styles,
  table borders — is Pandoc's own sensible default. Deliberately not a
  second authoring system: nobody hand-builds DOCX styling here, the
  reference doc only supplies page geometry.

## Two real Pandoc/Typst quirks the pipeline works around

Both were found by isolating them in minimal test files before
assuming anything, not guessed at:

1. **Typst's raw-block parser won't accept a language tag starting
   with a digit.** `` ```8th `` (with no space) silently prints the
   literal text "8th" above every code block in the *PDF* output
   instead of being consumed as a language tag — confirmed specific to
   Typst 0.15.1's raw-block parsing (`` ```eighth `` works fine,
   `` ```8th `` doesn't), and specific to the PDF/Typst path only — the
   HTML, EPUB, Markdown, and DOCX writers all handle `[source,8th]`
   correctly with no such issue. Fixed at PDF-build time only, via
   `tools/fix-8th-lang.lua` (a Pandoc Lua filter, applied via
   `--lua-filter`) — the `.adoc` *source* correctly keeps
   `[source,8th]` throughout; only the Typst-rendered PDF substitutes
   a safe stand-in language tag internally.
2. **Pandoc's AsciiDoc reader can't correctly round-trip a literal
   backslash or `--` inside a single-backtick inline code span** — a
   backslash was being silently dropped, and `--` was being
   typographically substituted into an em dash, corrupting this book's
   SED notation (`` `\ n -- m` ``) and inline string-escape references
   (`` `\n` ``) wherever they appeared outside a fenced code block.
   This affects every output format equally, since all five read the
   same AsciiDoc source through the same reader — so it's fixed once,
   in the source, using Asciidoctor's standard "monospace, no
   substitutions" idiom, `` `+content+` `` (backtick-plus). The
   one-time migration script that applied this fix across the whole
   manuscript, `tools/fix-inline-code.js`, is kept in `tools/` for the
   record; it isn't part of the ongoing build.

## Verification

Every format was built and inspected for: normal prose/headings/TOC,
all 12 kept illustrations (with captions), the Chapter 2 rate table
and the Chapter 5 SED-abbreviation table, inline `` `n:*` ``/backslash/
`--` code spans, multi-line fenced code blocks, the Chapter 8 state
diagrams (fig7-3/fig7-5), and the epilogue through the final page —
confirmed against each format's real content (HTML source, unzipped
EPUB XHTML, unzipped DOCX `word/document.xml`, the generated Markdown
itself), not against a lossy plain-text re-export, which produces
false alarms by rendering embedded images as bracketed alt-text
instead of showing they're actually present.

One real defect was found and fixed during this verification: the
generated Markdown's illustration links (written in the `.adoc` source
as `illustrations/fig1-7.png`, correct relative to `manuscript/`,
where the images actually live) didn't resolve from the generated
file's own location in `proof/`. Fixed in `tools/build.js`'s
`buildMarkdown()` step by rewriting those links to
`../manuscript/illustrations/...` as a post-processing pass; the
rewritten paths were confirmed to resolve on disk. The equivalent
`code/chNN/...` links needed no such fix, since `manuscript/` and
`proof/` are siblings at the same depth and the `../code/...` form
already written in the source resolves correctly from both.

**Not validated:** the EPUB output has not been run through the
official `epubcheck` validator (it requires a Java runtime, which
isn't part of this toolchain). Structural inspection — a valid
`nav.xhtml` and `toc.ncx`, correct XHTML content, images and captions
present — found nothing wrong, but that is a weaker guarantee than
formal EPUB validation, particularly before relying on the file for
KDP or another strict ingestion path. Run `epubcheck` against
`proof/Thinking-8th.epub` before submitting it anywhere that requires
that guarantee.
