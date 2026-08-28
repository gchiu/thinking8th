# Chapter 4: Detailed Design and Problem Solving

Preliminary design tells you what components a program needs. Detailed
design is where you actually solve each one — the part most programmers
find the most fun, and the part where a chapter about *8th* has the least
to add over a chapter about anything else, because solving problems isn't
really language-specific. What *is* language-specific is what happens
once you have a solution in mind: how naturally can you say it? This
chapter covers both — a short, general toolkit for getting unstuck, and a
longer look at how 8th's own shape steers you toward particular kinds of
solutions — then puts both to work on one real problem, start to finish.

## Getting Unstuck

None of the following is specific to programming, let alone to 8th, but
it's worth stating plainly because it's easy to forget under deadline
pressure:

- **Know your goal before you start**, concretely enough to write it as a
  stack-effect comment. If you can't write the SED, you don't understand
  the problem yet.
- **Hold the whole problem in your head at once** before reaching for a
  partial solution. Fill your mind with the requirements the way you'd
  fill your lungs before diving, and see whether the shape of an answer
  appears on its own. Often it does.
- **When it doesn't, work backward.** Some problems are far easier to
  solve by assuming you've reached the end and asking what the last step
  must have been, than by pushing forward from the start. The classic
  example — measuring exactly six gallons using only a nine-gallon and a
  four-gallon container, with no markings on either — barely budges if
  you experiment forward from empty containers. Assume instead that six
  gallons is already sitting in the nine-gallon container, and ask what
  the *previous* state must have been. That question has only two
  possible answers, and one of them unravels the whole problem in a
  couple of steps.
- **Recognize the auxiliary problem.** Partway into a solution you'll
  often notice a sub-problem that doesn't quite belong to the main line
  of reasoning — a piece you clearly need but haven't solved yet. Name it,
  assume it has a solution, and keep moving on the main problem. 8th
  makes this concrete rather than aspirational: Chapter 3's `defer:`
  is exactly "assume a solution exists, wire it in by name, solve it
  later" turned into working code.
- **Step back when stuck.** Attachment to your first idea is the most
  common reason a solvable problem stays unsolved. If a problem feels
  impossible, check what constraints you've assumed that the problem
  never actually stated.
- **Don't stop at the first working answer.** Ask whether a second pass
  would be simpler, not just whether the first one works.

## Designing a Component

Once you know a component is needed (Chapter 3), designing it has a
recognizable shape:

1. Decide the names and calling syntax of the words the rest of the
   program will see — the interface.
2. Work out the algorithm(s) and data structure(s) behind that interface.
3. Notice the auxiliary words this will require, and check what's already
   available before writing new ones.
4. Sketch the algorithm in pseudocode, then implement it, generally by
   working backward from the pieces you already have toward the raw
   input.

The rest of this chapter works through the first two of these in depth,
then puts all four to use in one extended example.

## How 8th Wants to Be Written

A stack-based, postfix language doesn't have much syntax to get wrong,
but it has strong *conventions* — regularities that make code predictable
to read even when you've never seen a particular word before. None of
these are enforced by 8th; all of them are worth following anyway,
because breaking them makes your words surprising to whoever reads them
next, including you in six months.

**Numbers, and anything else a word needs, come before the word.** A word
that expects a number pulls it from the stack, so the number has to
already be there: `20 apples !`, not `apples ! 20`. This is just postfix
notation, the same rule that makes `3 4 n:+` read strangely to newcomers
and then stop feeling strange within about a day.

**A name precedes text it introduces.** `"a string"` is data sitting on
the stack, or a name being defined, and either way it's the *word before
it* that gives that text meaning — `constant`, `var,`, `:`. There's no way
for 8th to make sense of bare text on its own, so something naming it
always comes first.

**"Noun verb" beats "verb noun."** `apples !` reads as "the apples slot,
store" — a thing, then an action on it — and that ordering falls out
naturally from the stack: the reference has to be pushed before the word
that consumes it can run. Chapter 1's `apples`, `red`, `green` are all
nouns and modifiers in exactly this sense, regardless of how they're
implemented underneath.

**Definitions consume the arguments they're given, in full,** even when
that means an argument gets duplicated on the way in rather than smuggled
back out. If three internal words each need a garage level number, put
the `dup`s inside those three words, not in the word that calls all
three — so each one reads correctly on its own, and the caller doesn't
need to know how many copies its argument requires:

```8th
: with-dup   dup n:1+ . cr ;
: without    n:1+ . cr ;

5 with-dup    \ prints 6, leaves 5 on the stack for whatever's next
```

**Avoid words that look ahead at what comes next in the source.** 8th
gives you the tools to peek at the next token in the input stream and act
on it — `'` (tick) followed by `w:exec`, for instance — but a word that
depends on *specifically what* follows it in the source is fragile: call
it with the wrong thing after it, or from inside another definition where
there's no "next token" the way you expected, and it breaks in confusing
ways. Chapter 3's `defer:` / `w:is` solves the same underlying problem —
"do something not yet known at definition time" — without that fragility,
which is why it's the 8th-idiomatic answer here rather than input-stream
lookahead.

**Container indices start at zero**, and 8th's own arrays already agree
with you on this — there's no "start counting from one" convention to
fight. If a problem's natural units start at one (item #1, not item #0),
do the subtraction once, at the boundary where a person's input becomes
an internal index, rather than throughout your code.

## Calculation, Data Structure, or Logic

Given a mapping from inputs to outputs, there are exactly three ways to
build it, and they're worth trying *in this order*:

1. **Calculation** — a formula.
2. **Data structure** — a table you look up.
3. **Logic** — a chain of conditions.

Calculation wins whenever a formula actually exists, because it's the
least code and the easiest to get right. Suppose parking garage levels
need a minimum ceiling clearance, two feet taller per level up (level 1
needs 7ft, level 2 needs 9ft, and so on):

```8th
: clearance-ft  \ level -- feet
  2 n:*  5 n:+ ;

1 clearance-ft . cr    \ => 7
2 clearance-ft . cr    \ => 9
3 clearance-ft . cr    \ => 11
```

One line, and it's obviously correct for every level, not just the ones
you tested.

A data structure wins when the mapping is real but *not* formulaic — a
business decision, not a law of arithmetic. Chapter 2's parking-fee rate
table is exactly this case: nothing about weekday-evening pricing being
$2.00 rather than $2.25 follows from a formula; it's a rate someone set,
looked up by tier through `caseof`. Trying to calculate it would mean
inventing a formula that happens to fit today's numbers and will happen
to be wrong the next time the rates change.

Logic is last on purpose. It wins only when the decision genuinely
depends on a combination of conditions that isn't well described as
either a formula or a lookup — for instance, whether a level is currently
open to traffic, which might depend on the hour *and* whether there's a
maintenance flag set *and* whether a special event has reserved it:

```8th
false var, maintenance?
false var, event-reserved?

: level-open?  \ hour -- flag
  maintenance? @ if drop false ;then
  event-reserved? @ if drop false ;then
  8 n:< if false ;then
  true ;
```

*(This exercises 8th's early-return word, `;then` — an `if` that, when
true, exits the word immediately rather than falling through to the rest
of its body. It reads well for guard clauses like these three.)*

Logic isn't wrong here — some things really are conditional — but reach
for it last. A chain of `if`s is easy to write and hard to verify by
inspection once it grows past three or four branches, in a way a formula
or a table isn't.

## Solving a Problem: Roman Numerals

Time to put all of this to work on a real, complete component: a word
that turns a number into a Roman numeral.

**Interface first.** The component needs exactly one externally-visible
word. It takes a number and hands back a string:

```8th
: roman  \ n -- s
```

Everything else is internal.

**The algorithm.** Look at how Roman numerals actually work: `1994` is
`MCMXCIV` — a thousand (`M`), then nine hundred (`CM`), then ninety
(`XC`), then four (`IV`). Each of those pieces is the largest
Roman-numeral "chunk" that still fits in what's left, written down, with
its value subtracted before moving on to the next-largest chunk. That's
the whole algorithm: a descending list of (value, symbol) pairs, and a
rule of "take as many of the largest chunk as fit, then move to the next
one." This is a calculation-vs-data-structure choice in exactly the sense
of the previous section — there's no formula for Roman numerals, but
there's an obvious table:

```8th
[ 1000 , 900 , 500 , 400 , 100 , 90 , 50 , 40 , 10 , 9 , 5 , 4 , 1 ]
constant roman-values

[ "M" , "CM" , "D" , "CD" , "C" , "XC" , "L" , "XL" , "X" , "IX" , "V" , "IV" , "I" ]
constant roman-numerals
```

Thirteen chunks, largest first, each value paired by position with its
symbol — position 0 is a thousand and `"M"`, position 12 is one and
`"I"`. `900` and `"CM"` sit right after `1000`/`"M"` rather than after
`500`/`"D"`, which is what makes "nine hundred" come out as `CM` instead
of `DCCCC`: the table already encodes the special-case shortcuts, so the
algorithm on top of it doesn't need to know they're special cases at all.

**Working backward from the pieces.** The word that has to exist no
matter what is "keep taking a given chunk while it still fits":

```8th
0 var, remaining
"" var, result
0 var, tier

: value@    roman-values tier @ caseof ;
: numeral@  roman-numerals tier @ caseof ;

: append    \ s --
  result @ swap s:+ result ! ;

: due?      \ -- flag   (does this tier's value still fit in what's left?)
  remaining @ value@ n:< not ;

: consume-tier  \ --
  due? if
    repeat
      numeral@ append
      remaining @ value@ n:- remaining !
      due?
    while
    then ;
```

`tier` names *which* row of the two tables is current — the same
"current column" idea Chapter 1's `apples` example used, here selecting a
value/symbol pair instead of a red/green tally. `consume-tier` doesn't
care what tier it's operating on; it just keeps appending that tier's
symbol and subtracting that tier's value for as long as `due?` says yes,
using the pre-checked loop shape (`if` … `repeat` … `while` … `then`)
that tests *before* the first iteration, so a tier that doesn't apply at
all — `M` when only 4 is left — correctly does nothing.

**The outer word** just has to visit all thirteen tiers in order, letting
`consume-tier` decide how many symbols each one contributes:

```8th
: apply-tier  \ index --
  tier !
  consume-tier ;

: roman  \ n -- s
  remaining !
  "" result !
  ' apply-tier 0 12 loop
  result @ ;
```

Run against a spread of values, including the traditionally trickiest
ones — `1994`, and `3999`, the largest number classical Roman numerals
can represent at all:

```8th
1 roman . cr        \ => I
4 roman . cr        \ => IV
9 roman . cr        \ => IX
14 roman . cr       \ => XIV
40 roman . cr       \ => XL
49 roman . cr       \ => XLIX
90 roman . cr       \ => XC
444 roman . cr      \ => CDXLIV
1994 roman . cr     \ => MCMXCIV
3999 roman . cr     \ => MMMCMXCIX
```

```text
I
IV
IX
XIV
XL
XLIX
XC
CDXLIV
MCMXCIV
MMMCMXCIX
```

Every one matches. This is
[`code/ch04/roman.8th`](../code/ch04/roman.8th), executed exactly as
shown.

Note what didn't need to exist: no special-casing for "the 4 pattern," no
branch for thousands versus ones, no manual digit-by-digit decimal
decomposition. All of that complexity moved into the *data* — thirteen
rows instead of four decimal columns — which is a fair trade, because
data is easier to double-check by reading it than logic is. If Roman
numerals had a fourteenth irregular case, it would mean adding one row to
two arrays, not touching `consume-tier` at all.

A caller who only ever needs numbers up to 3999 doesn't need to be told
so by the code above — Roman numerals themselves don't represent anything
larger by convention. Whether `roman` should guard against `4000` and
refuse, or simply produce a very long string, is a decision about the
*interface*, made consciously, not a bug to discover later.

## Summary

Detailed design has a recognizable shape — decide the interface, then the
algorithm and data structures behind it, solving auxiliary problems by
naming and deferring them rather than solving everything at once. 8th
carries its own strong conventions for how that design should read once
written: numbers and arguments precede the words that consume them,
definitions take full responsibility for the arguments they're given, and
container indices start at zero because 8th's own containers already do.
Given a mapping to implement, try calculation first, a data structure
second, and logic last — not because logic is wrong, but because it's the
hardest of the three to verify by eye once it grows. The Roman-numeral
example put all of it to work at once: a data-structure-first algorithm,
built backward from the smallest working piece, verified against exactly
the cases most likely to expose a mistake.
