// Build proof/Thinking-8th-proof.pdf from manuscript/book.adoc via pandoc,
// using Typst as the PDF engine (tools/book-template.typ controls page
// size, headings, and code-block styling -- see that file's own header
// comment for why it's a from-scratch template rather than an extension
// of pandoc's default one).
//
// Requires `pandoc` and `typst` on PATH. Neither needs admin rights to
// install -- both ship as a single portable executable; see
// HANDOFF.md's publication-workflow section for how they were installed
// in this environment (no chocolatey/system-package-manager access).
//
// tools/fix-8th-lang.lua is applied at build time, not to the source:
// see that file's header comment for the Typst raw-block parser
// limitation it works around ("8th" starts with a digit).

const { execFileSync } = require("child_process");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const MANUSCRIPT_DIR = path.join(REPO, "manuscript");
const BOOK_ADOC = path.join(MANUSCRIPT_DIR, "book.adoc");
const TEMPLATE = path.join(__dirname, "book-template.typ");
const LUA_FILTER = path.join(__dirname, "fix-8th-lang.lua");
const OUT_PDF = path.join(REPO, "proof", "Thinking-8th-proof.pdf");

const TITLE = "Thinking 8th";
const SUBTITLE =
  "An original adaptation of Leo Brodie's Thinking Forth, for the 8th language";

const args = [
  BOOK_ADOC,
  "-o",
  OUT_PDF,
  "--pdf-engine=typst",
  "--template=" + TEMPLATE,
  "--lua-filter=" + LUA_FILTER,
  "--toc",
  "-M",
  "title=" + TITLE,
  "-M",
  "subtitle=" + SUBTITLE,
];

console.log("Running: pandoc " + args.join(" "));
execFileSync("pandoc", args, { cwd: MANUSCRIPT_DIR, stdio: "inherit" });
console.log("Wrote", OUT_PDF);
