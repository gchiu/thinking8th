# A Note on Notation

This page teaches the handful of 8th words this book leans on constantly —
enough to read every example in Chapter 1 without having to guess. You
don't need to have programmed in Forth, or in any other stack-based
language, to follow it; nothing past this point assumes you have. If you
*do* know Forth, a few short asides flag exactly where 8th behaves
differently, but skip them freely — they're bonus material, not
prerequisites.

You don't need to memorize any of this either. You need to have seen each
piece once before it's used in a real example, so you can read that
example instead of puzzling over it.

## The stack

8th passes data between words using a **data stack**: a last-in,
first-out list of values that the whole running program shares. Typing a
plain number pushes it onto the top of that stack. A word that needs
input takes it from the top of the stack; a word that produces a result
leaves that result on top for whatever comes next. There's no other way
values move around in 8th — no named parameters, no `return` statement.

Code runs left to right, one word at a time, exactly in the order you
type it — no operator precedence, no evaluation order to puzzle out.
Watch what happens when three numbers are pushed and then printed one at
a time with `.` (which prints whatever is currently on top of the stack,
removing it as it does):

```8th
1 2 3
. cr
. cr
. cr
```

```text
3
2
1
```

`1 2 3` pushes three values, in that order, so `3` ends up on *top*.
`. cr` prints the top value and moves to a new line; doing that three
times empties the stack from the top down, so the values come back out
in the reverse of the order they went in. That's what "last-in,
first-out" means in practice, and it's worth watching happen once before
moving on.

## Printing text: `.` and `cr`

`.` isn't just for numbers — it prints whatever value is on top of the
stack, of any kind, and removes it. `cr` prints a newline. Text in double
quotes is a **string**, and, like a number, typing one pushes it onto the
stack:

```8th
"hello" . cr
```

```text
hello
```

`\n` inside a string is a newline character, so `"hello\n" .` prints the
same thing as `"hello" . cr` — you'll see both styles in this book.

## Reordering the stack: `dup`, `drop`, `swap`

Three small words come up constantly because so much of 8th is about
arranging values on the stack for the next word to use. `dup` copies the
top value, so there are two of it; `drop` removes the top value
entirely; `swap` exchanges the top two values:

```8th
5 dup . cr . cr        \ dup: copies 5, so two 5s print
1 2 drop . cr           \ drop: removes the 2, only 1 is left to print
1 2 swap . cr . cr       \ swap: exchanges them, so 1 prints before 2
```

```text
5
5
1
1
2
```

You'll meet these again properly, with real problems to solve, later in
the book — this is just so the names aren't a surprise when they show up.

## Comments

8th's comment character is the backslash, `\`, which runs to the end of
the line (`--` does the same thing, in the SQL-comment style, and both
can be used interchangeably). There is also a multi-line comment,
`(* ... *)`, which nests. This book uses `\` throughout, following the
convention used in 8th's own tutorials and sample code:

```8th
\ this line explains the next one
1 2 swap . cr . cr    \ prints 1, then 2
```

**If you've used Forth:** in most Forths, `( n1 n2 -- n3 )` is a comment
— a stack-effect diagram that the compiler skips over. **In 8th,
parentheses are not comments.** `( ... )` compiles the words inside it
into an anonymous, callable block of code and leaves a reference to that
block on the stack — a real, load-bearing feature (it's how 8th builds
things like loop bodies and callbacks), not something to be skipped
over. A stray `( n1 n2 -- n3 )` in the middle of an 8th word will not be
silently ignored; it will try to compile `n1`, `n2`, `--`, and `n3` as
words, and fail. This one habit is worth actively unlearning if you're
coming from Forth, because 8th won't warn you — it will just try to run
`n1` as a word and complain that no such word exists.

## Words, not functions

The unit of an 8th program — what another language would call a
function, procedure, or method — is called a **word**. This book uses
that term throughout, for a reason that will matter more once you start
writing your own: a defining name and an executable unit are the same
thing in 8th, with no separate machinery of "calling" it. `.`, `cr`, and
`dup` above are all words, exactly as much as anything you're about to
define yourself.

## Defining a word: `:` and `;`

`:` starts a new definition; the name right after it is the word being
defined; everything up to the matching `;` is that word's body. Once
defined, invoking the word by name runs its body from the top:

```8th
: greet   "hello, 8th!" . cr ;

greet
```

```text
hello, 8th!
```

Read the definition as: "define `greet`; its body is `print the string
"hello, 8th!"`, followed by `print a newline`; done defining." Then
`greet`, typed on its own, runs that body.

## Namespaces: `n:`, `s:`, `a:`, and friends

8th's built-in words are grouped into **namespaces**, written as a short
prefix before a colon — `n:` for words that work on numbers, `s:` for
strings, `a:` for arrays, `m:` for maps, and so on. Addition, for
instance, is `n:+`:

```8th
3 4 n:+ . cr
```

```text
7
```

You'll see this prefix constantly, and it's not optional decoration —
plain `+` by itself is not a word in 8th. Once you know the pattern, a
new word like `n:-` or `n:*` needs no separate introduction: same
namespace, different operation. Chapter 1 says more about why 8th is
built this way.

## Stack effects, and a shorthand for describing them

Consider a word that squares a number:

```8th
: square   dup n:* ;
```

In plain English: `square` expects to find one number sitting on the
stack, and by the time it's done, it has left one number there too —
the square of the one it started with. That's a word's **stack
effect**: what it expects to find on the stack before it runs, and what
it leaves there when it's done. Every word has one, whether or not
anyone writes it down, and reading a definition — as you just did with
`square` — is really the act of working out its stack effect.

Because a word's inputs and outputs never appear in its definition — no
named parameters, nothing to read off the `:` line the way another
language would show you — 8th programmers write that sentence down
anyway, as a comment right after the word's name, in a compressed form:

```8th
: square   \ n -- n²
  dup n:* ;
```

`\ n -- n²` is nothing more than "starts with one number, ends with one
number — specifically, its square" — squeezed down: whatever's before
the `--` is what the word expects to find, whatever's after is what it
leaves behind. Once you're used to reading it, the shorthand is faster
than the sentence, which is the only reason to use it. This convention
has a name, borrowed from Forth: a **stack-effect diagram**, or **SED**.
A word that touches the stack only invisibly — reads or writes a
variable, prints something, but doesn't itself take anything from or
leave anything on the stack — is commented `\ --`.

Nothing enforces this comment or checks it against what the word
actually does; it's purely for the reader. This book writes one only
where it actually helps a definition make sense at a glance — not as
decoration on every trivial word.

## Variables: `var`, `var,`, `@`, `!`

A **variable** is a named container holding one value at a time. `var`
declares one, initialized to `0`; `var,` declares one initialized to
whatever is currently on top of the stack — so the value you want has to
be pushed *before* `var,` runs:

```8th
0 var, count
```

Read this as: "push `0`; then define `count` as a variable, initialized
with that value." `count` alone doesn't produce the value inside it — it
produces a *reference* to the variable, which two more words act on:
`@` ("fetch") reads the value currently stored there, and `!` ("store")
writes a new one:

```8th
5 count !
count @ . cr        \ prints 5
```

Read the first line as "push `5`; store it into `count`." Read the
second as "fetch the value in `count`; print it." The habit to unlearn,
if you already know Forth's `VARIABLE`: `count` by itself is never the
value in 8th — it's always the reference that `@` and `!` act on.

## Conditionals: `if`, `else`, `then`

`if` expects a boolean on top of the stack (see below) and can only
appear inside a word's definition, between `:` and `;`. If the value is
true, it runs the words up to the matching `else` (or `then`, if there's
no `else`); if false, it skips to just after `else` and runs from there.
Either way, execution continues after `then`:

```8th
: yes-or-no   \ flag --
  if
    "yes" .
  else
    "no" .
  then
  cr ;

true yes-or-no
false yes-or-no
```

```text
yes
no
```

## Booleans

8th has real `true` and `false` words, not "any nonzero value." This
book uses them rather than raw `-1`/`0` or `1`/`0`, which is also the
idiomatic style in 8th's own sample code.

That's the whole starting vocabulary. From here, every new word this
book uses gets the same treatment — a short explanation and a small
example — at the point where you first need it, and is assumed known
afterward. On to the philosophy.
