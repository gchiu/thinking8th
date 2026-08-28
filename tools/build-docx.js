// Build manuscript/Thinking-8th.docx from the markdown source files.
// Deliberately a small hand-rolled markdown->docx converter (no pandoc
// available in this environment) tailored to the specific, consistent
// subset of markdown this project's manuscript actually uses:
// # / ## headings, plain paragraphs, fenced code blocks, '-'/'1.' lists,
// pipe tables, and inline **bold** / *italic* / `code` / [text](url).

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  TableOfContents, ExternalHyperlink, LevelFormat, PageBreak,
} = require("docx");

const REPO = path.resolve(__dirname, "..");
const MANUSCRIPT_DIR = path.join(REPO, "manuscript");
const OUT_PATH = path.join(MANUSCRIPT_DIR, "Thinking-8th.docx");

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
  // Tokenize left to right; each branch consumes and advances `i`.
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
              children: [
                new TextRun({ text: label, style: "Hyperlink" }),
              ],
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

    // fenced code block
    if (/^```/.test(line)) {
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", lines: codeLines });
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

function codeParagraphs(codeLines, style) {
  if (codeLines.length === 0) {
    return [new Paragraph({ style, children: [new TextRun({ text: " " })] })];
  }
  return codeLines.map(
    (l) =>
      new Paragraph({
        style,
        children: [new TextRun({ text: l.length ? l : " " })],
      })
  );
}

function parseTable(tableLines) {
  // header, separator, body...
  const rows = tableLines.filter((l) => !/^\|[\s:|-]+\|$/.test(l));
  const cellsOf = (l) =>
    l
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  const headerCells = cellsOf(rows[0]);
  const bodyRows = rows.slice(1).map(cellsOf);
  const colCount = headerCells.length;
  const colWidth = Math.floor(9360 / colCount); // fits inside 1" margins on Letter

  function makeRow(cells, isHeader) {
    return new TableRow({
      tableHeader: isHeader,
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
    width: { size: 9360, type: WidthType.DXA },
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
      nodes.push(...codeParagraphs(b.lines, "Code"));
    } else if (b.type === "quote") {
      nodes.push(new Paragraph({ style: "BlockQuotation", children: parseInline(b.text) }));
    } else if (b.type === "bullets") {
      for (const item of b.items) {
        nodes.push(
          new Paragraph({
            bullet: { level: 0 },
            children: parseInline(item),
          })
        );
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

const styles = {
  default: {
    document: {
      run: { font: "Cambria", size: 22 },
      paragraph: { spacing: { after: 160, line: 276, lineRule: "auto" } },
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
      },
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 27, bold: true, color: "1A1A1A" },
      paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 },
    },
    {
      id: "Heading3",
      name: "Heading 3",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Cambria", size: 23, bold: true, italics: true },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
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
      },
    },
    {
      id: "CodeOutput",
      name: "Code Output",
      basedOn: "Code",
      next: "CodeOutput",
      quickFormat: true,
      run: { font: "Consolas", size: 19, color: "444444" },
      paragraph: {
        shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
        border: {
          left: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 4 },
        },
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
      },
    },
  ],
};

// ---------- assemble document ----------

const bodyChildren = [];

// Title page
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
        text: "Editable manuscript master \u2014 work in progress",
        italics: true,
        color: "666666",
      }),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// Table of contents
bodyChildren.push(
  new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Contents" }),
  new TableOfContents("Contents", {
    hyperlink: true,
    headingStyleRange: "1-3",
  }),
  new Paragraph({ children: [new PageBreak()] })
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
          size: { width: 12240, height: 15840 }, // US Letter
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      children: bodyChildren,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT_PATH, buffer);
  console.log("Wrote", OUT_PATH, buffer.length, "bytes");
});
