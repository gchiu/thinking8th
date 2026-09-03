// Minimal, self-contained Typst template for Thinking 8th.
// Written from scratch (not extending pandoc's default typst template)
// because that default imports a packaged conf() function whose page
// setup only accepts named paper presets ("us-letter" etc.), not the
// custom 6.8125in x 9.125in trim this book has used since the DOCX-based
// pipeline (Brodie's own original Thinking Forth trim). Full control
// here is simpler than patching an opaque imported package.

#set page(
  width: 6.8125in,
  height: 9.125in,
  margin: (top: 0.7in, bottom: 0.85in, left: 0.7in, right: 0.65in),
  numbering: "1",
  number-align: center,
)
#set text(font: "New Computer Modern", size: 11pt, lang: "en")
#set par(justify: true, leading: 0.65em)
#set heading(numbering: none)

#show heading.where(level: 1): it => {
  v(0.3em)
  block(text(size: 20pt, weight: "bold", it.body))
  v(0.6em)
  line(length: 100%, stroke: 0.5pt + gray)
  v(0.6em)
}
#show heading.where(level: 2): it => {
  v(1em, weak: true)
  block(text(size: 14pt, weight: "bold", it.body))
  v(0.4em)
}
#show heading.where(level: 3): it => {
  v(0.8em, weak: true)
  block(text(size: 12pt, weight: "bold", style: "italic", it.body))
  v(0.3em)
}

#show raw.where(block: true): it => block(
  fill: rgb("#f2f2f2"),
  inset: 8pt,
  radius: 2pt,
  width: 100%,
  text(font: "DejaVu Sans Mono", size: 9pt, it),
)
#show raw.where(block: false): it => text(font: "DejaVu Sans Mono", size: 10pt, it)

#show figure: it => block(above: 1.2em, below: 1.2em, it)
#show figure.caption: it => text(size: 9.5pt, style: "italic", fill: rgb("#444444"), it)

#show link: it => text(fill: rgb("#1a4fa0"), it)

$if(title)$
#align(center)[
  #v(2in)
  #text(size: 28pt, weight: "bold")[$title$]
$if(subtitle)$
  #v(0.5em)
  #text(size: 14pt, style: "italic", fill: rgb("#444444"))[$subtitle$]
$endif$
]
#pagebreak()
$endif$

$if(toc)$
#heading(level: 1, outlined: false, numbering: none)[Contents]
#outline(title: none, depth: 2)
#pagebreak()
$endif$

$highlighting-definitions$

$body$
