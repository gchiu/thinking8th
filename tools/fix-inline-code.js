// Post-process pandoc's markdown->asciidoc conversion output.
//
// Pandoc's asciidoc reader has a real bug (confirmed by isolating it with
// minimal test files, not assumed): a literal backslash inside a
// backtick-delimited inline code span gets silently swallowed instead of
// preserved, and a literal "--" inside one gets typographically
// substituted into an em dash. Both are constant in this book -- every
// SED ("\ n -- m") and every "\n" string-escape reference. Pandoc's own
// writer already knows the first symptom (it wraps a literal "*" or "\"
// in "++...++" passthrough when *writing* .adoc from markdown) but its
// *reader* doesn't parse that "++...++" form back out correctly inside a
// code span, so a round trip still corrupts the content.
//
// The one form that survives round-trip cleanly (verified directly): the
// standard Asciidoctor "monospace, no substitutions" idiom, `+content+`
// (backtick, plus, content, plus, backtick). This script finds every
// single-backtick inline code span containing a backslash, "--", or a
// pandoc-inserted "++...++" escape, strips any "++...++" wrapper back to
// plain literal characters, and re-wraps the result as `+content+`.
//
// Deliberately does not touch fenced/listing code *blocks* ([source,...]
// ... ---- ... ----) -- those are a different AsciiDoc construct and were
// confirmed (by full-chapter render) to already survive the round trip
// verbatim, no substitution applied inside them.

const fs = require("fs");
const path = require("path");

const MANUSCRIPT_DIR = path.join(__dirname, "..", "manuscript");

function fixLine(line, inBlock) {
  if (inBlock) return line; // never touch content inside ---- blocks

  return line.replace(/`([^`\n]*)`/g, (whole, inner) => {
    const hasEscape = inner.includes("++");
    const hasBackslash = inner.includes("\\");
    const hasDoubleDash = inner.includes("--");
    if (!hasEscape && !hasBackslash && !hasDoubleDash) return whole;

    // Strip pandoc's "++X++" passthrough wrapper back to plain "X".
    const cleaned = inner.replace(/\+\+(.*?)\+\+/g, "$1");
    return "`+" + cleaned + "+`";
  });
}

let totalFixed = 0;
for (const file of fs.readdirSync(MANUSCRIPT_DIR)) {
  if (!file.endsWith(".adoc") || file === "book.adoc") continue;
  const filePath = path.join(MANUSCRIPT_DIR, file);
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  let inBlock = false;
  let fixedInFile = 0;
  const out = lines.map((line) => {
    if (/^----\s*$/.test(line)) {
      inBlock = !inBlock;
      return line;
    }
    const fixed = fixLine(line, inBlock);
    if (fixed !== line) fixedInFile++;
    return fixed;
  });
  if (fixedInFile > 0) {
    fs.writeFileSync(filePath, out.join("\n"));
    console.log(file + ": " + fixedInFile + " line(s) fixed");
    totalFixed += fixedInFile;
  }
}
console.log("Total: " + totalFixed + " line(s) fixed");
