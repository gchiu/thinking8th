# Overnight Notes

Working log for the *Thinking 8th* project. Concise, not a transcript.
Update this file at the start/end of future sessions rather than replacing
it wholesale.

## Session 2026-08-28

### Starting state

The repo contained only `README.md` and the untouched *Thinking Forth*
LaTeX source (`thinking-forth-1.0/`). No 8th adaptation existed yet — this
was a greenfield start, not a resume of prior conversion work.

### What was done

- Established the manuscript structure: `manuscript/` (prose, Markdown),
  `code/` (standalone, runnable `.8th` files, one subdir per chapter),
  `docs/OVERNIGHT-NOTES.md` (this file).
- Wrote `manuscript/00-preface.md` — what this book is and isn't (not a
  mechanical Forth→8th translation), licensing note for the Brodie source.
- Wrote `manuscript/01-notation.md` — up front, because it prevents a
  specific, immediate misreading: **`( ... )` is not a comment in 8th**.
  It compiles an anonymous word. Comments are `\` or `--` (line) and
  `(* ... *)` (nesting, multi-line). This is the single biggest syntactic
  trap for anyone arriving with Forth reflexes and had to be dealt with
  before showing any code.
- Wrote `manuscript/chapter01-philosophy.md`, adapting Brodie's Chapter 1
  ("The Philosophy of Forth"). Kept his pedagogical arc (elegance history →
  Parnas/information-hiding → words as the atom of the language → implicit
  calls/implicit data passing → lexicons → hiding data-structure
  construction → is it high-level → design language → performance) but
  rewrote all of it in original prose, condensed the generic CS-history
  material substantially (it isn't Forth-specific and Brodie spends ~700
  lines on it), and rewrote the Forth-specific back half around actual 8th
  behavior rather than adjusting terminology only.

### Verified 8th technical findings (executed, not guessed)

All run against `D:\8th\bin\win64\8th.exe`, an unmodified install.

- **`( ... )` really does mean "anonymous word," not "comment."** Confirmed
  in `docs/md/03_syntax.md`. Comments are `\`, `--` (both line, per
  `docs/help.sql` word entries), and `(* ... *)` (nesting block comment).
  `SED:` also exists as a stack-effect-diagram comment word, intended to be
  overridden by `debug/sed` for runtime-checked stack effects — worth a
  callout in a later chapter on testing/documentation, not used yet.
- **`var` / `var,` / `@` / `!` / `n:+!`** work exactly as Brodie's
  `VARIABLE` / `@` / `!` / `+!`, including the "name is a reference, not
  the value" semantics. Verified with
  [`code/ch01/apples.8th`](../code/ch01/apples.8th) — output is exactly
  `20 21 20 5 6 20` on stdout.
- **Redefining a name from a `var` to a `:` word is legal** and prints
  `Redefining: user:apples` **to stderr** (confirmed by redirecting stdout
  and stderr separately) — it does not corrupt stdout output or program
  behavior. This is 8th's own built-in redefinition warning, analogous to
  a Forth system's "isn't unique" message, and is used in the book as a
  teaching point rather than something to suppress.
- **`if / else / then`** compile-only conditionals confirmed identical in
  spirit to Forth's, verified with
  [`code/ch01/breakfast.8th`](../code/ch01/breakfast.8th) — output
  `cereal / wash up` then (after flipping the `hurried` var to `false`)
  `eggs and bacon / wash up`.
- **Namespaces (`n:`, `s:`, `a:`, `m:`, ...) are a real, enforced language
  feature**, not a naming convention — confirmed in
  `docs/md/02_introduction.md` ("namespace: a vocabulary of (usually)
  related words," which is functionally identical to Brodie's own
  definition of "lexicon"). `with: n ... ;with` (bringing a namespace into
  unprefixed scope) confirmed in `samples/tutorials/02-numbers.8th`.
- **8th's actual execution model**, per `docs/md/02_introduction.md`: word
  compilation packs into an internal "code cache," *not* native machine
  code (an earlier version could generate native code; dropped due to iOS
  platform restrictions). 8th performs **no code optimization at all
  except tail-call elimination**, by explicit design choice (stated
  rationale: optimizers can silently change behavior; algorithm choice
  matters more than instruction selection). Brodie's "Forth is nearly as
  fast as assembler, via threaded code" argument does **not** transfer to
  8th and the chapter says so explicitly rather than forcing the analogy —
  the honest 8th story is portability (one implementation, many platforms)
  rather than raw speed.

### Inherited material found wrong / not applicable

N/A this session — there was no prior 8th conversion to audit; this is the
first chapter written from scratch.

### Unresolved questions / things to check before relying on them later

- Have not yet exercised `SED:` / `debug/sed` (runtime-checked stack
  effects) — flagged above as a good fit for a later chapter on testing,
  not verified.
- Have not yet looked at 8th's `w:@` / `w:!` word-local variables (used to
  replace what Forth would do with locals inside a definition) — will
  matter once the book reaches factoring/recursion territory
  (Brodie chapter 2-3 material).
- Have not yet investigated 8th's object system (`o:` namespace) or
  `structs`, which will matter for the "data structures" chapters later in
  Brodie's book (chapters 6-7). Not needed for chapter 1.
- Did not run `bin/setup.8th` (it writes `docs/help.db` inside `D:\8th`,
  which is out of scope per the read-only constraint on that directory).
  All word documentation used tonight came from `docs/md/*.md` and direct
  `grep` of `docs/help.sql` instead of the live `help`/`apropos` words.
  Future sessions should keep doing it this way rather than running setup.

### Correction to the note above

Brodie's actual Chapter 2 is **"Analysis"** (the programming cycle,
iterative development, defining interfaces/rules/data structures) — not
"A Dozen Easy Pieces" (that title belongs to a different, unrelated Forth
book, *Starting Forth*). Corrected after actually reading
`thinking-forth-1.0/chapter2.tex`.

### Chapter 2 ("Analysis") — done this session

Wrote `manuscript/chapter02-analysis.md`. Chapter 2 is mostly
language-agnostic project-management wisdom delivered through Brodie's
1980s interviews with working Forth programmers. Those interviews are
Brodie's own copyrighted material (real people, real quotes) and were
**not** paraphrased-to-the-point-of-reproduction or attributed as if
original to this book; the chapter instead extracts the underlying lesson
(iterate, don't over-plan, prototype) in fully original prose and cites
Brodie/the interviews only in general terms.

Where Brodie's own examples were genuinely reusable (the REQUEST/NEED
"interface pseudocode" idea; the phone-bill "decision table" idea), this
session deliberately built **original, differently-scenarios** rather than
copying Brodie's specific invented numbers/domain, per the project's
originality requirement — both new examples teach the identical lesson:

- **Interfaces as executable sketches**: an `admit-car` / `space-available?`
  parking-garage entry policy, in place of Brodie's warehouse
  REQUEST/REORDER example. Verified,
  [`code/ch02/admit-car.8th`](../code/ch02/admit-car.8th).
- **Decision tables**: a three-tier (day/evening/weekend) parking fee with
  a first-hour/additional-hour rate and a flat valet surcharge, in place of
  Brodie's phone-bill rate schedule. Verified,
  [`code/ch02/parking-fee.8th`](../code/ch02/parking-fee.8th) — output
  `800 / 400 / 500 / 900`, matches hand-calculated expectations exactly.

### New verified 8th technical finding

- **`caseof` is a real table-lookup, not sugar for `if`/`else` chains.**
  Confirmed by running `[ 400 , 200 , 100 ] constant first-hour-rates
  first-hour-rates tier @ caseof`: with a numeric array, `caseof` pushes
  the item at the given index (rather than executing it — that only
  happens when the stored item is itself a word). This makes Brodie's
  "decision table" idea implementable as an *actual* table in 8th, which
  is a genuinely better fit than anything available in the Forth Brodie
  was writing about in 1984, and was called out in the chapter as such.
- `not` is a plain, unprefixed global word (confirmed working on a `var`
  fetched with `@`), unlike most other operators which live in a
  namespace (`n:`, `s:`, etc.).

### Next logical place to continue

Brodie's Chapter 3 is "Problem Solving" (or check the actual title before
assuming — Chapter 1's title was correctly guessed, Chapter 2's was not).
Read `thinking-forth-1.0/chapter3.tex` first before writing anything.
General process for future chapters, unchanged from last session:

1. Read the relevant `thinking-forth-1.0/chapterN.tex` fully (or in large
   sections) before deciding what's language-specific vs. general wisdom.
2. For genuinely Forth-specific code examples, verify the 8th idiom by
   execution before writing prose.
3. For Brodie's own invented example scenarios (not core language
   features), prefer inventing an original scenario that teaches the same
   lesson over reproducing his specific numbers/domain — for copyright
   cleanliness, per this project's originality requirement.
4. Do not reproduce or closely paraphrase Brodie's interview subjects'
   quotes; extract the lesson in original prose and cite generally.

No uncommitted junk, temp files, or generated binaries were left in the
repository; scratch test files used to verify examples before finalizing
them live only in the session scratchpad, outside the repo.
