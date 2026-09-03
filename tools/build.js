// Unified build entry point for every publication format this project
// ships, all generated from the single canonical source,
// manuscript/book.adoc (which include::s every chapter/front-matter
// file). No format-specific source files exist anywhere -- every
// output below is regenerated from book.adoc and nothing else.
//
// Usage:
//   node build.js            builds every format
//   node build.js pdf        builds just proof/Thinking-8th-proof.pdf
//   node build.js html       builds just proof/Thinking-8th.html
//   node build.js epub       builds just proof/Thinking-8th.epub
//   node build.js md         builds just proof/Thinking-8th.generated.md
//   node build.js docx       builds just proof/Thinking-8th.generated.docx
//
// Requires `pandoc` and `typst` on PATH -- see HANDOFF.md's
// "Publication workflow" section for the exact pinned versions this
// was built and tested against, and how to install both without admin
// rights (neither needs an installer; both ship as one portable
// executable).

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const MANUSCRIPT_DIR = path.join(REPO, "manuscript");
const PROOF_DIR = path.join(REPO, "proof");
const BOOK_ADOC = path.join(MANUSCRIPT_DIR, "book.adoc");

const TITLE = "Thinking 8th";
const SUBTITLE =
  "An original adaptation of Leo Brodie's Thinking Forth, for the 8th language";

function pandoc(args) {
  console.log("pandoc " + args.join(" "));
  execFileSync("pandoc", args, { cwd: MANUSCRIPT_DIR, stdio: "inherit" });
}

function ensureProofDir() {
  fs.mkdirSync(PROOF_DIR, { recursive: true });
}

// ---------- PDF (Pandoc -> Typst) ----------
// Kept as its own script (build-pdf.js), verified independently and
// referenced directly by HANDOFF.md/PUBLISHING.md -- this target just
// runs it, rather than duplicating its pandoc invocation here, so
// there's exactly one place that command lives.
function buildPdf() {
  execFileSync(process.execPath, [path.join(__dirname, "build-pdf.js")], {
    stdio: "inherit",
  });
}

// ---------- HTML ----------
// Single self-contained file: all 12 illustrations embedded as
// base64 data URIs (--embed-resources), so the whole book is one file
// that opens correctly with no companion assets to lose track of.
function buildHtml() {
  ensureProofDir();
  const out = path.join(PROOF_DIR, "Thinking-8th.html");
  pandoc([
    BOOK_ADOC,
    "-o",
    out,
    "--standalone",
    "--embed-resources",
    "--toc",
    "--toc-depth=2",
    "--metadata",
    "title=" + TITLE,
    "--metadata",
    "subtitle=" + SUBTITLE,
  ]);
  console.log("Wrote", out);
}

// ---------- EPUB ----------
// Reflowable by design (no fixed-layout metadata) -- pandoc's epub3
// writer already splits on level-1 (chapter) headings into separate
// XHTML files and generates both nav.xhtml (EPUB3) and toc.ncx
// (EPUB2 compatibility, useful for older readers and some KDP paths).
function buildEpub() {
  ensureProofDir();
  const out = path.join(PROOF_DIR, "Thinking-8th.epub");
  pandoc([
    BOOK_ADOC,
    "-o",
    out,
    "--toc",
    "--toc-depth=2",
    "--metadata",
    "title=" + TITLE,
    "--metadata",
    "subtitle=" + SUBTITLE,
    "--metadata",
    "author=Adapted from Leo Brodie's Thinking Forth",
  ]);
  console.log("Wrote", out);
}

// ---------- Markdown (generated reading copy only) ----------
// Plain `markdown` writer, not `gfm` -- confirmed gfm silently drops
// this book's "8th"/"text" code-fence language tags entirely, while
// plain `markdown` preserves them (as "``` 8th", pandoc's own
// convention). A prominent generated-file notice is prepended so
// nobody mistakes this for something to edit or send a PR against --
// manuscript/book.adoc is the only place prose changes belong.
function buildMarkdown() {
  ensureProofDir();
  const out = path.join(PROOF_DIR, "Thinking-8th.generated.md");
  pandoc([BOOK_ADOC, "-t", "markdown", "-o", out]);
  let content = fs.readFileSync(out, "utf8");
  // Image links carry the path as written in the .adoc source
  // (relative to manuscript/, where the actual illustrations/ folder
  // lives) -- correct for a file that lived next to book.adoc, but
  // this generated copy lives one directory over, in proof/. Rewrite
  // to keep the links resolvable from where the file actually is.
  content = content.replace(/\]\(illustrations\//g, "](../manuscript/illustrations/");
  const notice =
    "<!--\n" +
    "  GENERATED FILE -- DO NOT EDIT.\n" +
    "  This is a reading copy only, produced from manuscript/book.adoc by\n" +
    "  `node tools/build.js md`. Edits here are silently overwritten on the\n" +
    "  next build and are never the canonical source. Corrections belong\n" +
    "  against manuscript/*.adoc (edit the specific chapter file; the\n" +
    "  include::-based manuscript/book.adoc is the actual master).\n" +
    "-->\n\n";
  fs.writeFileSync(out, notice + content);
  console.log("Wrote", out);
}

// ---------- DOCX (generated compatibility/review copy only) ----------
// tools/book-reference.docx is pandoc's own default reference.docx
// with one deliberate change: an explicit page size matching this
// book's 6.8125"x9.125" trim (added by hand-editing word/document.xml's
// sectPr -- see the migration's HANDOFF.md entry for exactly how).
// Everything else (fonts, heading styles, table/code styles) is
// pandoc's own sensible default, not a second authoring system to
// maintain -- deliberately, per the "if practical, use a reference
// DOCX/style template rather than introducing another authoring
// system" instruction this pipeline was built against.
function buildDocx() {
  ensureProofDir();
  const out = path.join(PROOF_DIR, "Thinking-8th.generated.docx");
  const refDoc = path.join(__dirname, "book-reference.docx");
  pandoc([
    BOOK_ADOC,
    "-o",
    out,
    "--toc",
    "--toc-depth=2",
    "--reference-doc=" + refDoc,
    "--metadata",
    "title=" + TITLE,
  ]);
  console.log("Wrote", out);
}

const TARGETS = {
  pdf: buildPdf,
  html: buildHtml,
  epub: buildEpub,
  md: buildMarkdown,
  docx: buildDocx,
};

const requested = process.argv.slice(2);
const toBuild = requested.length ? requested : Object.keys(TARGETS);

for (const name of toBuild) {
  const fn = TARGETS[name];
  if (!fn) {
    console.error(
      "Unknown target: " + name + " -- expected one of " + Object.keys(TARGETS).join(", ")
    );
    process.exit(1);
  }
  fn();
}
