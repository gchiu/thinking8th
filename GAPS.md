# Gaps and Uncertainties

Behavior that's confirmed but non-obvious, or genuinely unresolved, and
worth knowing before relying on it in a later chapter. Not a session log
— see individual chapter commits for how each item was found. Update this
file when something here gets resolved, or when a new one turns up.

## Confirmed (not uncertain, but easy to get wrong)

- **`while` never consumes the boolean it tests, on either the loop-back
  or the fall-through path.** Confirmed by checking `depth` before/after
  in an isolated test. A loop that recomputes its condition fresh each
  iteration (rather than reusing one carried value, as the one worked
  example in 8th's own docs does) will leak one stack value per
  iteration if it uses plain `while`. Use **`while!`** (the consuming
  variant) for this shape instead. Found and fixed in
  `code/ch04/roman.8th`; grepped the repo afterward to confirm it was
  the only occurrence.
- **No `n:<=` / `n:>=`.** Build "a >= b" as `a b n:< not`.
- **`n:<` / `n:>` operand order matches how you'd read it aloud**: `a b
  n:<` asks "is `a` less than `b`?" — confirmed by direct test, not
  assumed from a Forth convention.
- **`caseof`'s argument order is container, then index** (`array 0
  caseof`), not index-then-container. Confirmed by test; easy to get
  backward since some other languages' lookup functions take the key
  first.

## Genuinely unexplored (haven't needed them yet)

- `SED:` and the `debug/sed` library (runtime-checked stack effects,
  mentioned in `docs/help.sql`'s entry for `SED:`) — not used anywhere
  in the book yet. Would be relevant to a future chapter on testing or
  on documenting words rigorously.
- `w:@` / `w:!` (word-local variables, as opposed to the global `var`/
  `var,` used throughout so far) — not used yet. 8th's own manual notes
  you *can't* declare a `var` local to a word; this pair is presumably
  the intended alternative. Relevant once a chapter needs local state
  that shouldn't leak into the surrounding namespace.
- 8th's object system (the `o:` namespace) — not used yet. Will likely
  matter for whichever later chapter maps to Brodie's data-structure
  chapters (his chapters 6–7).
- `a:each`'s exact behavior when the array is empty, or when the
  quotation itself modifies the array mid-iteration — not tested, not
  needed yet.

## Environment-dependent / not independently verifiable here

- **The exact appearance of 8th's interactive REPL prompt** (banner
  text, prompt character) when launched with zero arguments on a real
  terminal. Piping input to `8th` with no arguments on this development
  machine hits a "help.db not created" warning and exits without
  visibly entering a REPL loop, which may just be how a non-TTY session
  behaves rather than how a real interactive terminal behaves. Worked
  around in `manuscript/01-getting-started.md` by verifying the `-e`
  flag instead (`8th -e "..." -e bye`, which *is* fully verified) and
  describing the interactive prompt only in general, documented terms
  (REPL = "read-eval-print loop," per 8th's own glossary) rather than
  showing a transcript that was never actually observed.
- `bin/setup.8th` (needed for `help`/`apropos`) was never run in this
  project, deliberately — it writes `docs/help.db` and other files
  inside the read-only `D:\8th` reference distribution. All word
  documentation used in this book comes from `D:\8th\docs\md\*.md` and
  direct inspection of `D:\8th\docs\help.sql` instead.
- Whether 8th's "no optimization except tail-call elimination" claim
  (`D:\8th\docs\md\02_introduction.md`) has changed in any 8th release
  since this project's local distribution — not checked against a
  changelog; stated as true of *this* distribution, not as a permanent
  language guarantee.
