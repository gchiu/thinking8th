# A Note on Notation

If you have ever read about Forth, skip this page at your peril. 8th looks
enough like Forth that old habits will actively mislead you in a few
specific spots. This page exists so the very first code example in Chapter 1
doesn't confuse you.

## Comments: \​, not `( ... )`

In most Forths, `( n1 n2 -- n3 )` is a comment — a stack-effect diagram that
the compiler skips over. In 8th, **parentheses are not comments**. `( ... )`
compiles the words inside it into an anonymous, callable block of code and
leaves a reference to that block on the stack. This is a real, load-bearing
feature (it is how 8th builds things like loop bodies and callbacks), and it
means that a stray `( n1 n2 -- n3 )` in the middle of an 8th word will not
be silently ignored — it will try to compile `n1`, `n2`, `--`, and `n3` as
words, and fail.

8th's comment character is the backslash, `\`, which runs to the end of the
line (`--` does the same thing, in the SQL-comment style, and both can be
used interchangeably). There is also a multi-line comment, `(* ... *)`,
which nests. This book uses `\` throughout, following the convention used
in 8th's own tutorials and sample code:

```8th
\ this whole line is a comment
: greet   \ -- ; prints a greeting
  "hello" . cr ;
```

Stack-effect comments (Brodie's `( n1 n2 -- n3 )`, called an **SED**,
"stack-effect diagram," in 8th's own documentation) are written after a
backslash, in the same relative position Brodie uses them: right after the
word's name, before its body.

## Words, not functions

Brodie calls the unit of a Forth program a "word," and so does 8th's own
manual: "the same as a function, procedure, or routine in other languages."
This book uses "word" throughout, for the same reason Brodie did — because
in both languages, a defining name and an executable unit are the same
thing, and there is no separate machinery of "calling" it.

## Namespaces: `n:`, `s:`, `a:`, and friends

8th ships with a large vocabulary of built-in words, grouped into
**namespaces** — `n:` for numbers, `s:` for strings, `a:` for arrays, `m:`
for maps, and so on. `n:+` is addition on numbers; `s:+` is string
concatenation. You will see this prefix convention constantly and it is
not optional decoration — `+` by itself is not a word in 8th. Chapter 1
says more about why this matters.

## Variables: `var`, `@`, `!`

A variable in 8th is declared with `var` (initialized to `0`) or `var,`
(initialized to whatever is on top of the stack), and its contents are
read with `@` and written with `!`, exactly as in Forth:

```8th
0 var, count
5 count !
count @ .          \ prints 5
```

The one habit to unlearn: the name `count` does **not** stand for the
value stored in the variable. It stands for a reference to the variable
itself. `count @` fetches the value; bare `count` does not. Forth
programmers already know this distinction for `VARIABLE`, so this is one
of the places where prior Forth experience transfers directly.

## Booleans

8th has real `true` and `false` words, not "any nonzero value." This
book uses them rather than raw `-1`/`0` or `1`/`0`, which is also the
idiomatic style in 8th's own sample code.

With that out of the way — on to the philosophy.
