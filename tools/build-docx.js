// Build manuscript/Thinking-8th.docx from the markdown source files.
// Deliberately a small hand-rolled markdown->docx converter (no pandoc
// available in this environment) tailored to the specific, consistent
// subset of markdown this project's manuscript actually uses:
// # / ## headings, plain paragraphs, fenced code blocks (tagged ```8th
// for source or ```text for program output), '-'/'1.' lists, pipe
// tables, and inline **bold** / *italic* / `code` / [text](url).
//
// Page size is selectable via the PAGE_PROFILE env var:
//   PAGE_PROFILE=letter node build-docx.js   (default; the real master)
//   PAGE_PROFILE=a5     node build-docx.js   (exploratory trim-size test;
//                                             writes to proof/, not manuscript/)

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TableOfContents, ExternalHyperlink, LevelFormat,
  Header, Footer, PageNumber,
} = require("docx");

const REPO = path.resolve(__dirname, "..");
const MANUSCRIPT_DIR = path.join(REPO, "manuscript");
const PROOF_DIR = path.join(REPO, "proof");

const PROFILE_NAME = (process.env.PAGE_PROFILE || "brodie").toLowerCase();

const PROFILES = {
  // Decided trim size: Leo Brodie's own original Thinking Forth trim
  // (tf.sty's \oldgeometry: paperwidth=6.8125in, paperheight=9.125in).
  // This is now the publication master.
  brodie: {
    label: "6.8125\" x 9.125\" (Brodie's original Thinking Forth trim)",
    width: 9810,
    height: 13140,
    margin: { top: 864, bottom: 1008, left: 864, right: 792 },
    outPath: path.join(MANUSCRIPT_DIR, "Thinking-8th.docx"),
  },
  // Reference / historical only -- no longer the master.
  letter: {
    label: "US Letter (reference only)",
    width: 12240,
    height: 15840,
    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
    outPath: path.join(PROOF_DIR, "Thinking-8th-letter-reference.docx"),
  },
  // Exploratory only -- tested and rejected (see docs/OVERNIGHT-NOTES.md):
  // code wrapping at this width was judged worse than the smaller page
  // count was worth, for a programming book.
  a5: {
    label: "A5 (exploratory test, rejected)",
    width: 8391,
    height: 11906,
    margin: { top: 1008, bottom: 1080, left: 864, right: 864 },
    outPath: path.join(PROOF_DIR, "Thinking-8th-A5-test.docx"),
  },
};

const PROFILE = PROFILES[PROFILE_NAME];
if (!PROFILE) {
  console.error("Unknown PAGE_PROFILE:", PROFILE_NAME, "-- expected brodie, letter, or a5");
  process.exit(1);
}
const OUT_PATH = PROFILE.outPath;

// Reading order comes from filename sort: 00-preface, 01-notation, then
// chapter01-*, chapter02-*, ... -- so a new chapterNN-*.md is picked up
// automatically. Keep that naming convention when adding chapters.
const FILES = fs
  .readdirSync(MANUSCRIPT_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => ({ file: f }));

// ---------- inline markdown ----------

// Returns an array of TextRun / ExternalHyperlink for one line/paragraph
// of inline markdown: `code`, **bold**, *italic*, [text](url).
function parseInline(text, opts) {
  const forceBold = !!(opts && opts.forceBold);
  const runs = [];
  let i = 0;
  const n = text.length;
  let buf = "";

  function flushPlain() {
    if (buf.length) {
      runs.push(new TextRun({ text: buf, bold: forceBold || undefined }));
      buf = "";
    }
  }

  while (i < n) {
    // inline code `...`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flushPlain();
        runs.push(
          new TextRun({
            text: text.slice(i + 1, end),
            font: "Consolas",
            size: 20,
            bold: forceBold || undefined,
          })
        );
        i = end + 1;
        continue;
      }
    }
    // bold **...**
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flushPlain();
        runs.push(new TextRun({ text: text.slice(i + 2, end), bold: true }));
        i = end + 2;
        continue;
      }
    }
    // italic *...*  (single asterisk, not adjacent to another asterisk)
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1) {
        flushPlain();
        runs.push(
          new TextRun({
            text: text.slice(i + 1, end),
            italics: true,
            bold: forceBold || undefined,
          })
        );
        i = end + 1;
        continue;
      }
    }
    // link [text](url)
    if (text[i] === "[") {
      const close = text.indexOf("]", i + 1);
      if (close !== -1 && text[close + 1] === "(") {
        const urlEnd = text.indexOf(")", close + 2);
        if (urlEnd !== -1) {
          flushPlain();
          const label = text.slice(i + 1, close);
          const url = text.slice(close + 2, urlEnd);
          runs.push(
            new ExternalHyperlink({
              link: url,
              children: [new TextRun({ text: label, style: "Hyperlink" })],
            })
          );
          i = urlEnd + 1;
          continue;
        }
      }
    }
    buf += text[i];
    i++;
  }
  flushPlain();
  return runs;
}

// ---------- block-level markdown ----------

function parseMarkdown(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    // heading
    let m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) {
      blocks.push({ type: "heading", level: m[1].length, text: m[2].trim() });
      i++;
      continue;
    }

    // fenced code block -- ```8th (source) or ```text (program output)
    let fence = /^```(\w*)/.exec(line);
    if (fence) {
      const lang = fence[1] || "8th";
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", lang, lines: codeLines });
      continue;
    }

    // pipe table
    if (/^\|/.test(line.trim())) {
      const tableLines = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: "table", lines: tableLines });
      continue;
    }

    // bullet list
    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ""));
        i++;
      }
      blocks.push({ type: "bullets", items });
      continue;
    }

    // numbered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "numbered", items });
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const qLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        qLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: qLines.join(" ") });
      continue;
    }

    // plain paragraph: gather contiguous non-blank, non-special lines
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^\|/.test(lines[i].trim()) &&
      !/^-\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "para", text: paraLines.join(" ") });
  }

  return blocks;
}

function headingStyleFor(level) {
  // My markdown only uses H1 (chapter/front-matter title) and H2
  // (section, Brodie's \section). H3 is reserved for future \subsection.
  if (level === 1) return HeadingLevel.HEADING_1;
  if (level === 2) return HeadingLevel.HEADING_2;
  return HeadingLevel.HEADING_3;
}

// One Paragraph per source line, chained with keepNext so the whole
// block stays on one page whenever it can fit -- Word will still break
// a block that's genuinely longer than a page, but won't split a short
// one just because it happens to straddle where a page would end.
function codeParagraphs(codeLines, style) {
  const lines = codeLines.length ? codeLines : [" "];
  return lines.map(
    (l, idx) =>
      new Paragraph({
        style,
        keepNext: idx < lines.length - 1 ? true : undefined,
        keepLines: true,
        children: [new TextRun({ text: l.length ? l : " " })],
      })
  );
}

function parseTable(tableLines) {
  const rows = tableLines.filter((l) => !/^\|[\s:|-]+\|$/.test(l));
  const cellsOf = (l) =>
    l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  const headerCells = cellsOf(rows[0]);
  const bodyRows = rows.slice(1).map(cellsOf);
  const colCount = headerCells.length;
  const usableWidth = PROFILE.width - PROFILE.margin.left - PROFILE.margin.right;
  const colWidth = Math.floor(usableWidth / colCount);

  function makeRow(cells, isHeader) {
    return new TableRow({
      tableHeader: isHeader,
      cantSplit: true,
      children: cells.map(
        (c) =>
          new TableCell({
            width: { size: colWidth, type: WidthType.DXA },
            shading: isHeader
              ? { type: ShadingType.CLEAR, fill: "E8E8E8" }
              : undefined,
            children: [
              new Paragraph({
                style: "TableText",
                children: parseInline(c, { forceBold: isHeader }),
              }),
            ],
          })
      ),
    });
  }

  return new Table({
    width: { size: usableWidth, type: WidthType.DXA },
    columnWidths: Array(colCount).fill(colWidth),
    rows: [makeRow(headerCells, true), ...bodyRows.map((r) => makeRow(r, false))],
  });
}

function blocksToDocxNodes(blocks) {
  const nodes = [];
  for (const b of blocks) {
    if (b.type === "heading") {
      nodes.push(
        new Paragraph({
          heading: headingStyleFor(b.level),
          children: parseInline(b.text),
        })
      );
    } else if (b.type === "para") {
      nodes.push(new Paragraph({ style: "Normal", children: parseInline(b.text) }));
    } else if (b.type === "code") {
      const style = b.lang === "text" ? "CodeOutput" : "Code";
      nodes.push(...codeParagraphs(b.lines, style));
    } else if (b.type === "quote") {
      nodes.push(new Paragraph({ style: "BlockQuotation", children: parseInline(b.text) }));
    } else if (b.type === "bullets") {
      for (const item of b.items) {
        nodes.push(new Paragraph({ bullet: { level: 0 }, children: parseInline(item) }));
      }
    } else if (b.type === "numbered") {
      for (const item of b.items) {
        nodes.push(
          new Paragraph({
            numbering: { reference: "book-numbering", level: 0 },
            children: parseInline(item),
          })
        );
      }
    } else if (b.type === "table") {
      nodes.push(parseTable(b.lines));
      nodes.push(new Paragraph({ text: "" }));
    }
  }
  return nodes;
}

// ---------- styles ----------

const HEADING_KEEP = { keepNext: true, widowControl: true };

const styles = {
  default: {
    document: {
      run: { font: "Cambria", size: 22 },
      paragraph: { spacing: { after: 160, line: 276, lineRule: "auto" }, widowControl: true },
    },
  },
  paragraphStyles: [
    {
      id: "Normal",
      name: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 22 },
      paragraph: {
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 160, line: 276, lineRule: "auto" },
        widowControl: true,
      },
    },
    {
      id: "Title",
      name: "Title",
      basedOn: "Normal",
      next: "Normal",
      run: { font: "Cambria", size: 60, bold: true },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { before: 2400, after: 240 },
      },
    },
    {
      id: "Subtitle",
      name: "Subtitle",
      basedOn: "Normal",
      next: "Normal",
      run: { font: "Cambria", size: 28, italics: true, color: "444444" },
      paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 240 } },
    },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 40, bold: true, color: "1A1A1A" },
      paragraph: {
        pageBreakBefore: true,
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 360 },
        outlineLevel: 0,
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 8 },
        },
        ...HEADING_KEEP,
      },
    },
    // Same look as Heading 1 (chapter-title style) but NOT an outline
    // heading, so it doesn't get swept into the auto-generated TOC. Used
    // only for the "Contents" label itself.
    {
      id: "TOCHeading",
      name: "TOC Heading",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 40, bold: true, color: "1A1A1A" },
      paragraph: {
        pageBreakBefore: true,
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 360 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 8 },
        },
      },
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 27, bold: true, color: "1A1A1A" },
      paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1, ...HEADING_KEEP },
    },
    {
      id: "Heading3",
      name: "Heading 3",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 23, bold: true, italics: true },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2, ...HEADING_KEEP },
    },
    {
      id: "Code",
      name: "Code",
      basedOn: "Normal",
      next: "Code",
      quickFormat: true,
      run: { font: "Consolas", size: 19 },
      paragraph: {
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 0, line: 240, lineRule: "auto" },
        indent: { left: 360 },
        shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
        widowControl: true,
      },
    },
    {
      id: "CodeOutput",
      name: "Code Output",
      basedOn: "Code",
      next: "CodeOutput",
      quickFormat: true,
      run: { font: "Consolas", size: 19, color: "3A3A3A", italics: true },
      paragraph: {
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
        border: {
          left: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 4 },
        },
        widowControl: true,
      },
    },
    {
      id: "BlockQuotation",
      name: "Block Quotation",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { italics: true },
      paragraph: {
        indent: { left: 720, right: 720 },
        spacing: { before: 120, after: 120 },
        widowControl: true,
      },
    },
    {
      id: "Caption",
      name: "Caption",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { italics: true, size: 18, color: "555555" },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 240 },
      },
    },
    {
      id: "TableText",
      name: "Table Text",
      basedOn: "Normal",
      next: "TableText",
      quickFormat: true,
      run: { size: 20 },
      paragraph: {
        alignment: AlignmentType.LEFT,
        spacing: { before: 20, after: 20 },
      },
    },
    {
      id: "Note",
      name: "Note",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { italics: true, size: 20 },
      paragraph: {
        indent: { left: 360 },
        border: {
          left: { style: BorderStyle.SINGLE, size: 12, color: "666666", space: 8 },
        },
        spacing: { before: 120, after: 120 },
        widowControl: true,
      },
    },
  ],
};

// ---------- headers / footers ----------

const footerDefault = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ children: [PageNumber.CURRENT], color: "666666", size: 18 }),
      ],
    }),
  ],
});
const footerFirst = new Footer({ children: [new Paragraph({ text: "" })] });

const headerDefault = new Header({
  children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: "Thinking 8th", italics: true, color: "999999", size: 18 }),
      ],
    }),
  ],
});
const headerFirst = new Header({ children: [new Paragraph({ text: "" })] });

// ---------- assemble document ----------

const bodyChildren = [];

// Title page (no header/footer content here -- see titlePage/first below)
bodyChildren.push(
  new Paragraph({ style: "Title", text: "Thinking 8th" }),
  new Paragraph({
    style: "Subtitle",
    text: "An original adaptation of Leo Brodie's Thinking Forth, for the 8th language",
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Editable manuscript master — work in progress",
        italics: true,
        color: "666666",
      }),
    ],
  })
);

// Table of contents. Uses the TOCHeading style (looks like a chapter
// title, page-break-before included) rather than a real Heading 1, so
// "Contents" doesn't list itself. The field's own heading sweep is
// levels 1-3, i.e. the real Heading1/2/3 styles used everywhere else.
bodyChildren.push(
  new Paragraph({ style: "TOCHeading", text: "Contents" }),
  new TableOfContents("Contents", {
    hyperlink: true,
    headingStyleRange: "1-3",
  })
);

for (const { file } of FILES) {
  const text = fs.readFileSync(path.join(MANUSCRIPT_DIR, file), "utf8");
  const blocks = parseMarkdown(text);
  bodyChildren.push(...blocksToDocxNodes(blocks));
}

const doc = new Document({
  styles,
  numbering: {
    config: [
      {
        reference: "book-numbering",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PROFILE.width, height: PROFILE.height },
          margin: PROFILE.margin,
        },
        titlePage: true, // lets the first page use its own (blank) header/footer
      },
      headers: { default: headerDefault, first: headerFirst },
      footers: { default: footerDefault, first: footerFirst },
      children: bodyChildren,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, buffer);
  console.log("Wrote", OUT_PATH, buffer.length, "bytes", `[${PROFILE.label}]`);
});
