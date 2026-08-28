# Chapter 1: The Philosophy of 8th

8th is a language, a runtime, and — like the language that inspired it — an
implied argument about how software ought to be built. Nobody wrote that
argument down as a manifesto. It shows up instead in the shape of the
language itself: what's easy to say, what's hard to say, and what the
language simply refuses to let you say. Before looking at 8th code, it's
worth asking where that shape came from, and what problem it was built to
solve.

## A Short History of Trying to Make Software Manageable

Early programs were bit patterns entered by hand — correct-or-not was the
only question anyone asked. As machines and budgets grew, a second question
appeared alongside correctness: could the program be *changed* without
breaking it? Decades of language design have really been one long answer to
that second question.

Assemblers gave instructions names instead of bit patterns. Macro
assemblers gave repeated sequences of instructions names too. High-level
languages broke the one-to-one link between what you typed and what the
machine did, so `X = Y * (456/A) - 2` could stand for a dozen machine
instructions at once. Structured programming broke large problems into
modules with one entrance and one exit, so a reader could reason about a
piece of a program without holding the whole thing in their head.

Each of these was a real advance, and each one eventually ran into the same
wall: a program decomposed by what it *does* — read the record, edit the
record, write the record — falls apart the moment something about *how* it
does it changes. Change the record's layout and you're back in all three
modules at once, because all three modules knew that layout.

In 1972 David Parnas proposed a different criterion for drawing module
boundaries: not sequence, not control flow, but **what is likely to
change**. A module's job, in this view, is to hide one such
likely-to-change thing — a data layout, an algorithm, a piece of hardware —
behind a small set of routines that the rest of the program uses instead of
touching the thing directly. Get the boundary right, and a change stays
inside the module that owns it. Barbara Liskov and Stephen Zilles gave the
same idea a name a few years later: *data abstraction*. Their example was a
stack: routines to push, pop, and test for empty, with the actual
representation hidden behind them.

This is the idea 8th — like Forth before it — makes unusually natural to
follow: not a design pattern you have to remember to apply, but close to
the default shape of an 8th program. Build out of small, named words with
data passed implicitly between them, and you are already most of the way
toward decomposing by what might change, whether you set out to or not.

## Words Are the Unit, Not Functions or Modules

Here is a complete, if small, 8th program:

```8th
true var, hurried

: hurried?  hurried @ ;
: cereal    "cereal\n" . ;
: eggs      "eggs and bacon\n" . ;
: clean     "wash up\n" . ;

: breakfast
  hurried? if cereal else eggs then clean ;

breakfast
```

Running it (see [`code/ch01/breakfast.8th`](../code/ch01/breakfast.8th))
prints:

```text
cereal
wash up
```

`breakfast` isn't a subroutine call away from `hurried?`, `cereal`, `eggs`,
and `clean` — it's *built out of* them, the same way a sentence is built out
of words rather than referring to them from a distance. 8th's own manual
defines its basic unit of execution this way: "the same as a function,
procedure, or routine in other languages" — but that undersells the
difference in practice. There is no separate mechanism for defining a
subroutine, declaring a variable, or writing the main program. A variable
declaration (`true var, hurried`), a word that reads it (`hurried?`), and
the word that ties them together (`breakfast`) are all just words, invoked
the same way, by name. There is no `main()` that is structurally different
from the functions it calls.

Two things about 8th make this possible, and Leo Brodie identified both of
them in Forth forty years ago: calls are implicit, and so is data passing.

**Calls are implicit.** You don't write `call cereal`; you write `cereal`.
Every name 8th finds — a word, a variable, a constant — carries its own
instructions for what to do when invoked. There is exactly one way to
invoke anything: say its name.

**Data passing is implicit.** `hurried?` doesn't take `hurried` as an
argument in the conventional sense; it fetches the value and leaves it
where the next word, `if`, expects to find it — on top of the data stack.
`breakfast` never mentions the stack at all. It reads as a flat sequence of
decisions: *are we hurried? if so, cereal, otherwise eggs; either way,
clean up afterward.* The stack is the plumbing that makes this reads-like-
a-sentence quality possible, and once you trust it, you stop thinking about
it, the same way you stop thinking about which register a value sits in
when you write `a + b` in almost any other language.

Because arguments travel on a shared stack instead of being named and
declared, any word can be built out of any other words without either one
knowing about the other's internals. That's what lets `breakfast` read as a
single, flat idea instead of a nested tree of calls — and it's also
*exactly* Parnas's information-hiding, arrived at as a side effect of how
the language passes data around, rather than as a discipline layered on
top.

## Namespaces: A Lexicon You Don't Have to Invent

Brodie's book coins a term for a set of words that together hide one
component's details from the rest of an application: a **lexicon** — "your
interface with the component from the outside." In classic Forth this is
purely a design convention; nothing in the language enforces it or even
knows it exists. A word belonging to a "stack" lexicon and a word belonging
to a "queue" lexicon live in exactly the same flat dictionary, distinguished
only by whatever naming discipline the programmer imposes.

8th takes the same idea and builds it into the language as a real feature:
the **namespace**. Its own manual defines a namespace as "a vocabulary of
(usually) related words" — which is Brodie's definition of "lexicon,"
independently arrived at, formalized, and enforced by the interpreter
rather than left to convention. Every built-in word that operates on
numbers lives in the `n:` namespace (`n:+`, `n:-`, `n:1-`, `n:+!` — you
used two of these already, in the variable example above). Strings live in
`s:`, arrays in `a:`, maps in `m:`, and so on. When you write your own
component, you can give its words their own namespace prefix the same way,
and 8th's `with:` / `;with` lets you temporarily bring a namespace's words
into scope unprefixed, for readability, without ever losing the boundary
between components.

This is the one place in this chapter where "the natural 8th approach" is
genuinely, structurally different from Forth's, rather than a change of
spelling: what Brodie has to argue readers *into* doing — decompose your
program into small lexicons with clean boundaries — 8th's own standard
library already does, pervasively, as ordinary practice you'd have to work
to avoid.

## Hiding the Construction of a Data Structure

Brodie's central example of information-hiding is a variable called
`APPLES`, used to tally apples, that later needs to become two variables —
one for red apples, one for green — without changing a single line of code
that already uses `APPLES`. The trick works in 8th exactly the way it works
in Forth, for the same underlying reason: a variable's *name* and the
*value it produces when read* are two different things, so the second can
be redefined without disturbing the first.

Start with a plain variable:

```8th
0 var, apples

20 apples !
apples @ . cr                  \ => 20

1 apples n:+!
apples @ . cr                  \ => 21
```

Now suppose, after code elsewhere already depends on `apples`, you
discover you need two tallies — red and green — selected by which color is
"current":

```8th
0 var, color                   \ which color is "current"?
0 var, reds
0 var, greens

: red    reds color ! ;
: green  greens color ! ;

: apples  color @ ;
```

`apples` is no longer a variable at all — it's a *word* that returns
whichever variable is currently selected. But because `apples @`, `apples
!`, and `apples n:+!` all still work exactly as before, nothing that used
`apples` needs to change:

```8th
red
20 apples !
apples @ . cr                  \ => 20

green
5 apples !
apples @ . cr                  \ => 5

1 apples n:+!
apples @ . cr                  \ => 6

red
apples @ . cr                  \ => 20   (still there, untouched)
```

This is [`code/ch01/apples.8th`](../code/ch01/apples.8th), run and
verified against the actual output shown above. One detail worth knowing
about, because it's genuinely useful rather than merely cosmetic: when the
file redefines `apples` from a variable into a word, 8th prints a warning
to the console —

```text
Redefining: user:apples
```

— and then proceeds. This is 8th telling you, out loud, exactly the thing
this example is about: you have replaced an existing name with a new
meaning. In a large program, that warning is a safety net; here, it's
confirmation that the trick worked.

What made this possible is the same pair of features from the last
section, applied to *nouns* instead of *verbs*: `apples` is a word, so
calling it is implicit; and it produces a reference on the stack rather
than a name in the source text, so `@`, `!`, and `n:+!` don't need to know
or care whether that reference came from a plain variable or from three
lines of logic. 8th, like Forth, doesn't force you to distinguish between
"a thing" and "an action that produces a thing" — a word can play either
role, and nothing about how you invoke it gives away which one it's
playing today.

## Is 8th a High-Level Language?

By the standard measure — does it hide the correspondence between source
code and machine operations — 8th is unambiguously high-level; it runs on
top of 8th's own interpreter engine, not on a specific processor's
instruction set, and the same source file runs unmodified on a desktop, a
phone, or a server. By another standard measure — strict syntax checking that catches
your mistakes before you run the program — 8th, again like Forth, does
almost none. Write `apples red` where you meant `red apples` and 8th won't
stop you; it will simply do what you said, which is not what you meant.

The trade this makes is the same one Brodie described in 1984: in exchange
for very little static protection, you get a language with no fixed grammar
to fight. Adding a new *kind* of word — a new control-flow construct, a new
way of defining something — is not a special, harder kind of programming in
8th; it's what the words `if`, `var`, and `:` themselves are, examples of
an extension mechanism available to you as much as it was available to
whoever wrote those particular words. There is no wall between "the
language" and "code you wrote."

8th also leans further into interactivity than most languages that came
after Forth. There's no edit-compile-link-test cycle; you type a phrase and
the interpreter answers immediately, whether that phrase is a whole
program or three words you're checking the behavior of. This turns
"design" and "test" into the same activity rather than sequential phases —
you can write the outermost, most abstract word of an application first
and give its supporting words trivial, placeholder definitions, running the
whole thing end-to-end from day one, then replace the placeholders one at a
time as the real implementation gets built underneath them. This isn't a
workaround for the absence of a proper design phase; it *is* a design
method, and it depends on exactly the same word-at-a-time, implicit-calls,
implicit-data-passing properties this chapter has been describing.

## Performance and Portability

Brodie spent several pages of the original chapter arguing that Forth,
despite its unusual appearance, was competitive with assembly language in
size and speed, thanks to a compilation technique called threaded code.
That argument doesn't carry over to 8th unchanged, and it would be
dishonest to pretend otherwise: by 8th's own documentation, compiling a
word packs what it needs into an internal code cache rather than emitting
native machine instructions (an earlier version of 8th could generate
native code, but that path was dropped because of restrictions on the iOS
platform) — and, by explicit design choice, 8th performs no optimization
on your code at all, apart from tail-call elimination. The reasoning given is not "we haven't gotten to it
yet"; it's that an optimizer can silently change a program's behavior, and
that the most effective optimization available is still a programmer
choosing a better algorithm.

What 8th trades raw execution speed for is something Forth in 1984 could
not offer: the same source file, unmodified, targets desktop operating
systems, mobile platforms, and embedded devices from one implementation.
Where Brodie's Forth achieved portability across hardware by being small
enough to reimplement on each new target, 8th achieves it by being one
implementation that already runs everywhere. Different eras, different
scarce resource, same underlying value — write the logic once, in a
language that gets out of the way.

## Summary

Strip away the unfamiliar punctuation, and 8th is making the same wager
Forth made: that a program built entirely out of small, named, freely
composable words — with data flowing between them implicitly, on a stack,
rather than declared and passed by hand — makes Parnas's kind of
change-driven decomposition unusually natural to fall into, rather than
something you have to impose on top of subroutines, modules, or objects
with explicit interfaces. Where Forth left the discipline of grouping those
words into coherent components ("lexicons," in Brodie's term) up to the
programmer, 8th builds a formal version of the same idea into the language
as namespaces. Where Forth achieved portability by being small and easy to
port, 8th achieves it by being one implementation that already runs
everywhere you're likely to want to deploy.

None of this is free. You give up static type-checking, a fixed grammar to
lean on, and — compared to hand-tuned native code — raw speed. What you get
in exchange is a language with almost nothing between your intent and the
running program: no ceremony for declaring a subroutine, no boilerplate for
passing arguments, no separate compile step standing between a change and
seeing it run. The rest of this book is about what that trade lets you
build, and how to build it well.
