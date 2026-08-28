# Thinking 8th

An original book teaching [8th](https://8th-dev.com/), inspired by the
structure and spirit of Leo Brodie's *Thinking Forth* — not a mechanical
translation of it. See [`manuscript/00-preface.md`](manuscript/00-preface.md)
for what that means in practice.

- `manuscript/` — the book itself, in Markdown, chapter by chapter. Start
  with `00-preface.md` and `01-notation.md`, then `chapter01-philosophy.md`.
- `code/` — every runnable example from the book, as standalone `.8th`
  files, organized by chapter. Each has been executed against the local
  8th distribution; see the comment at the top of each file for how to
  reproduce that.
- `thinking-forth-1.0/` — the original *Thinking Forth* LaTeX source,
  pulled from <https://sourceforge.net/projects/thinking-forth/> and
  licensed CC BY-NC-SA 2.0. Kept as reference material only; nothing in
  `manuscript/` is generated from it.
