# Chapter 6: Factoring

Chapter 3 was about decomposition *before* you write anything — cutting a
problem into components while it's still a plan. This chapter is about
the smaller, more frequent decisions that happen *while* you write, and
afterward: noticing that a piece of what you just typed deserves its own
name, and giving it one. Brodie called this factoring, borrowing the word
from arithmetic in exactly the sense you'd expect — pulling a common
piece out of an expression so it only has to be written, read, and
changed once.

A fair amount of Brodie's original chapter is about disciplines that no
longer apply for reasons Chapter 5 already covered: numbered screens are
gone, and with them a whole vocabulary of habits for deciding what
belongs on which screen. What's left, once that's set aside, is mostly
language-independent judgment — the same judgment any programmer needs,
in any language, about when a piece of code has earned its own name. A
few of Brodie's specific mechanisms don't survive the move to 8th
unchanged, and this chapter says so plainly where that happens, rather
than pretending a translation exists where it doesn't.

## Factoring Out a Calculation

The simplest kind of factoring is also the easiest to miss: an
expression that shows up more than once, or that you find yourself
describing in a comment because the code alone doesn't say what it
means. Either signal is worth acting on the same way — give the
expression a name.

Suppose a sensor channel is considered to be approaching its limit once
a reading passes two-thirds of the channel's rated maximum. Written
inline, "two-thirds of" is just an expression:

```8th
900 2 n:* 3 n:/ . cr    \ => 600
```

— which is fine once, but if it appears at every place a warning level
gets computed, both the meaning ("this is a warning threshold") and the
arithmetic itself ("multiply by two, divide by three") are being
repeated. Factor it into a word, and both problems disappear at once:

```8th
: two-thirds  \ n1 -- n2
  2 n:* 3 n:/ ;

900 two-thirds . cr    \ => 600
```

This is [`code/ch06/warning-level.8th`](../code/ch06/warning-level.8th),
run and verified against the output shown.

One thing worth knowing before you lean on `n:/` for a ratio like this:
it's true division, not the truncating integer division some other
languages default to. `1000 two-thirds` — that is, `1000 2 n:* 3 n:/` —
comes out to `666.66667`, a float, since 2000 doesn't divide evenly by
three. That's not a bug in `two-thirds`; it's `n:/` doing exactly what
it's documented to do. If a whole-number result matters, either the
inputs need to divide evenly, or an explicit rounding step belongs
after the division — `two-thirds` itself shouldn't quietly assume one
or the other.

## Don't Push a Decision Down as a Flag

A subtler version of the same idea applies to control flow, not just
arithmetic. Suppose closing up for the day means locking the register
and turning off the lights, but closing up on the last day of the week
also means filing a report in between. The tempting first draft passes
a flag into one word and lets it decide internally what to do:

```8th
: bad-checklist  \ end-of-week? --
  "lock the register\n" .
  if
    "file the weekly report\n" .
  then
  "turn off the lights\n" . ;

true bad-checklist     \ => lock, file report, turn off
false bad-checklist    \ => lock, turn off (no report)
```

This works, but every caller now has to know that a boolean controls an
internal branch inside somebody else's word — the decision about
*whether* to file a report has been separated from the code that
actually knows *when* the week ends. Factor out the part that's
genuinely shared, and let each caller supply its own extra step instead
of threading a flag through the shared word to ask for it:

```8th
: closing-checklist  \ --
  "lock the register\n" .
  "turn off the lights\n" . ;

: end-of-day
  closing-checklist ;

: end-of-week
  closing-checklist
  "file the weekly report\n" . ;

end-of-day
end-of-week
```

```text
lock the register
turn off the lights
lock the register
turn off the lights
file the weekly report
```

This is
[`code/ch06/closing-checklist.8th`](../code/ch06/closing-checklist.8th),
both versions, run and verified together. Nothing here calls
`closing-checklist` with an argument telling it what kind of day it is —
`end-of-day` and `end-of-week` each know that themselves, which is
exactly where that knowledge belongs.

## Factoring a Repeated Decision Into Data

"A Method for Design" already showed `caseof` looking a plain value up
by position — a fee, a rate, a name. The same mechanism factors out a
*decision*, not just a value, once you notice that `caseof` calls
whatever it finds if that happens to be a word rather than data. A
chain of "if the channel number is this, do that; if it's this other
one, do this other thing" is exactly the shape a growing `if`/`else`
ladder takes on as more channels are added — and exactly the shape an
array of word references replaces with one lookup:

```8th
: check-pressure     "check pressure\n" . ;
: check-temperature  "check temperature\n" . ;
: check-flow         "check flow\n" . ;

[ ' check-pressure , ' check-pressure , ' check-temperature , ' check-temperature ,
  ' check-flow , ' check-flow , ' check-flow , ' check-flow ]
constant channel-actions

: alarm!  \ channel# --
  channel-actions swap caseof ;

0 alarm!    \ => check pressure
2 alarm!    \ => check temperature
7 alarm!    \ => check flow
```

```text
check pressure
check temperature
check flow
```

This is
[`code/ch06/channel-alarms.8th`](../code/ch06/channel-alarms.8th), run
and verified. The `'` (tick) here is the same one Chapter 4's `roman`
used to hand `loop` a word to call repeatedly — a reference to a word,
rather than a call to it, so it can be stored in the array and invoked
later. Adding a ninth channel with its own action means adding one entry
to `channel-actions`, not one more branch to a chain that was already
getting hard to read.

## Factoring Out Names: A Real Array, Not Parallel Variables

Brodie's version of this problem was eight scores tracked in eight
separately-named variables — `0STS`, `1STS`, and so on — which works
until you need to look one up *by number*, at which point nothing in
the names themselves helps: you're back to an `if`/`else` chain just to
turn a channel number into the right variable. His fix was a Forth
mechanism called `CREATE...DOES>`, which builds a new *kind* of
defining word — here, one that lays out a block of memory and hands
back a word that indexes into it by number, so `ARRAY THRESHOLDS` would
create a whole family of numbered cells behind one name.

8th has no `CREATE`/`DOES>`, and no general equivalent for building a
new defining word — this isn't a gap in the language so much as a
different starting point. Forth needed that mechanism because a
`VARIABLE` is one raw memory cell with nothing indexed about it at all;
building an indexable table out of raw cells was worth a whole
technique. 8th's arrays already *are* that indexable table, as a native
value you can hold, pass, and index directly — so the problem
`CREATE...DOES>` was solving doesn't come up in the same form. What's
new here is only the second half of the picture: Chapter 2 only ever
built arrays with `constant`, to hold fixed lookup tables. A set of
thresholds that can be *changed* — set once at start-up, then adjusted
later — needs a `var`-held array instead, and a way to write into it by
index:

```8th
[ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ] var, thresholds

: threshold@   \ channel# -- n
  thresholds @ swap caseof ;

: set-threshold!  \ a channel# n --
  a:! drop ;

thresholds @ 0 100 set-threshold!
thresholds @ 3 250 set-threshold!

0 threshold@ . cr    \ => 100
3 threshold@ . cr    \ => 250
1 threshold@ . cr    \ => 0
```

```text
100
250
0
```

This is [`code/ch06/thresholds.8th`](../code/ch06/thresholds.8th), run
and verified. `threshold@` is nothing new — the same `caseof` read
Chapter 2 introduced, on an array that happens to be mutable instead of
a `constant`. `set-threshold!` introduces `a:!`, whose stack effect is
`array index value -- array`: it mutates the array in place and hands
the same array back, which is why `set-threshold!` ends with `drop` —
the caller here already holds the array in `thresholds`, so the
returned reference isn't needed. Getting the index and the value the
wrong way round (`a n x`, not `a x n`) is a real trap: `a:!` reports it
as `Expected Array but got Number`, which points at the symptom rather
than the actual mistake, so it's worth writing this word carefully once
and trusting it afterward. One array, indexed by channel number,
replaces what would otherwise be eight identical-looking variables and
whatever chain of logic picked among them.

## When to Factor

Brodie's chapter spends a long section on criteria for *when* a piece of
code has earned its own name — heuristics rather than rules, since no
mechanical test settles it. The ones that hold up regardless of language
are worth keeping, in roughly this form:

- **Factor at the point you feel unsure**, or where the logic starts to
  push past what you can hold in your head at once. That feeling is
  itself the signal — waiting for a more "objective" reason to appear
  usually means factoring later than you should have.
- **Factor where you'd otherwise want to write a comment.** A comment
  explaining what a block of code does is often a sign that the block
  wants a name of its own instead — the name replaces the comment and
  stays attached to the code through every future edit.
- **A factored word should do one thing**, describable without "and" —
  `check-pressure` reads its own sensor and reports; it doesn't also
  reset an alarm.
- **Look for repetition of pattern, not just repetition of exact code.**
  `bad-checklist`'s two call sites didn't repeat any text, but they
  repeated a *shape* — "run the shared steps, then maybe one more" —
  which was the actual thing worth factoring out.
- **Be sure you can name what you factor.** If nothing shorter and
  clearer than a restatement of the code comes to mind, that's often a
  sign the boundary is in the wrong place, not that naming is hard.
- **Factor to hide the parts most likely to change.** `channel-actions`
  isolates *what each channel does* from *how a channel gets dispatched
  to*, so a new alarm behavior never touches `alarm!` itself.
- **Don't factor for the sake of factoring.** A single three-line word
  used once, with no repeated shape and no unclear logic, doesn't need
  to become two words — that just adds a name to remember for no
  corresponding gain in clarity.
- **Make today's version work; improve it tomorrow.** Factoring is
  usually easier once the working shape of the problem exists in code,
  not before — resist the urge to guess at the "right" boundaries before
  you've written something to draw them against.

## Factoring at Compile Time

One more kind of factoring doesn't touch runtime behavior at all: 8th
reads and runs source top to bottom, so anything written as ordinary
words — arithmetic included — runs as the file loads, not later. That
means a value derived from other values can be *computed* once, by 8th
itself, instead of pre-calculated by hand and copied in as a bare
number:

```8th
8 constant wide
4 constant ave

wide 3 n:* ave 2 n:* n:+ 80 swap n:- 2 n:/ constant leftmargin

leftmargin . cr             \ => 24
```

`leftmargin` centers a row of boxes on an 80-column display: three
widths plus two gaps subtracted from 80, split in half. Writing `24`
directly would work today, but it would silently go stale the moment
`wide` or `ave` changed — nothing would connect the two. Deriving it
from `wide` and `ave` means it can never drift out of sync with the
values it depends on, at no runtime cost, since none of this arithmetic
happens again once the file has loaded.

The same idea applies to a table's own size:

```8th
[ 10 , 20 , 30 , 40 ] constant points
points a:len constant #points

#points . cr                \ => 4
```

`#points` can never disagree with `points`, because it's derived from
`points` rather than counted by hand and written down separately — the
same role Chapter 2's `caseof` tables play, one step further:
`#points` there was `points` describing its own size.

This is [`code/ch06/boxes.8th`](../code/ch06/boxes.8th), run and
verified against both outputs shown above.

## Summary

Factoring is the habit of continually asking, while writing and while
revising, whether a piece of code has earned its own name — a repeated
calculation, a repeated shape of control flow, a repeated decision, a
family of near-identical names that really wanted to be one indexed
structure. 8th inherits most of Forth's judgment about *when* to factor
unchanged; where it differs is in *what's available* to factor into.
`caseof` reused from Chapter 2, now dispatching to word references
instead of returning plain data, replaces a growing `if`/`else` chain.
A native array, mutable through `var,` and written with `a:!`, replaces
what Forth needed a whole `CREATE...DOES>` mechanism to build. And
because 8th evaluates ordinary arithmetic as the file loads, deriving
one constant from another, or a table's length from the table itself,
costs nothing at runtime while keeping values that depend on each other
from silently drifting apart. None of this is a reason to factor
everything on sight — the same chapter that gives the criteria for
factoring also gives the criterion for stopping: make it work today,
and don't factor for the sake of factoring.
