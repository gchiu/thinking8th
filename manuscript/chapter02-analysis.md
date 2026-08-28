# Chapter 2: Analysis

Nobody agrees on how many phases software development has. Brodie counted
nine, from discovering requirements down to maintenance, and then spent the
rest of his second chapter demonstrating that Forth programmers routinely
ignore the ordering. The same is true of 8th, for the same underlying
reason: a language where you can write one word, test it in the running
system, and move on doesn't force analysis, design, and implementation into
separate, sequential phases. It lets them interleave.

That's a genuine advantage, not an excuse to skip thinking. This chapter is
about what to think about before — and while — you write 8th code that
matters.

## Iteration Beats Prediction

Brodie interviewed working Forth programmers throughout the 1980s, and a
pattern emerged that had nothing to do with Forth specifically: the
programmers who did the best work were not the ones who planned the most,
or the ones who planned the least, but the ones who treated their early
code as a question rather than an answer. Build the smallest thing that
tells you something true about the problem, show it to the people who'll
actually use it, and let what you learn reshape the next version. Planning
still matters — nobody plans nothing on a project worth doing — but it has
diminishing, and eventually negative, returns. Past a certain point,
planning is a way of avoiding the discovery that your plan was wrong.

8th's whole design leans into this. There's no build step standing between
"I changed the code" and "I can see what it does now." A word you're
unsure about can be defined with a placeholder body — print its own name,
return a fixed value, do nothing — and wired into the rest of the program
immediately, so that the shape of the whole system is testable from the
very first day, long before every part of it is real. Later chapters
return to this technique in more depth; this chapter is about how to decide
*what* those words should be before you write any of them.

## What Analysis Actually Produces

Whatever you call the phase, analysis has to answer three questions before
serious implementation starts:

1. What does the system actually need to do, and what constraints (time,
   memory, an existing device it has to talk to, a deadline) bound the
   answer?
2. What's the simplest model of a solution that satisfies those needs?
3. Roughly, what will it cost — in time, and in the resources the target
   system actually has — to build that model?

The rest of this chapter is about the second question, because it's the
one a language can actually help with.

## Sketching Interfaces in Words, Not Diagrams

A common technique for the first question is the data-flow diagram: circles
for operations, arrows for the data moving between them. It's a useful tool
for explaining a design to someone who doesn't read code. But if the person
you're explaining it to *does* read code, a word-based language can often
skip the diagram and go straight to something almost as readable, and far
more useful, because you can run it:

```8th
false var, garage-full?

: space-available?  garage-full? @ not ;
: let-in    "Welcome -- take a ticket.\n" . ;
: turn-away "Sorry, we're full.\n" . ;

: admit-car  \ --
  space-available? if let-in else turn-away then ;
```

This is a complete, if trivial, working sketch of a parking garage's entry
policy — not pseudocode dressed up to look like 8th, but real, runnable 8th
in which the interesting decision (`space-available?`) is separated from
the actions it chooses between (`let-in`, `turn-away`), and the top-level
word (`admit-car`) reads as a flat sentence describing the policy. Nothing
here commits you to how a car's arrival is actually detected, how a ticket
is actually printed, or how `garage-full?` actually gets set — those are
implementation details you can fill in underneath this sketch, one word at
a time, without changing `admit-car` at all. Run it and it behaves exactly
as the words suggest:

```8th
admit-car
true garage-full? !
admit-car
```

prints

```text
Welcome -- take a ticket.
Sorry, we're full.
```

That's the whole point. A design sketch you can execute catches a
misunderstanding immediately — try the phrase, watch what happens — instead
of after the diagram has been approved and handed off for
implementation.

## Defining the Rules: From Prose to a Decision Table

Interfaces are usually the bulk of an analysis. Occasionally, though, an
application has genuine *rules* — logic complicated enough that a sentence
of English doesn't capture it safely. Suppose our garage's exit fee
depends on when you parked (weekday daytime, weekday evening, or weekend),
how many hours you stayed, and whether you used valet service. Written as a
paragraph, the rate schedule reads about as well as a tax form: "During
weekday daytime hours the charge is $4.00 for the first hour and $2.00 for
each additional hour... on weekday evenings, $2.00 for the first hour and
$1.00 for each additional hour... on weekends, a flat $1.00 per hour...
valet service adds a flat $5.00 regardless of the hour or day." It's not
wrong, it's just hard to check for gaps or contradictions by eye.

Turning the same rule into nested conditionals doesn't help much — you'd
get a wall of `if`/`else` three or four levels deep, repeating the
"additional hour" logic inside every branch of the "which tier" decision,
which obscures the one fact that actually matters for simplifying the
problem: **the per-hour rates depend only on which tier you're in, and
nothing else.** A **decision table** — tier along one axis, first-hour and
additional-hour rates along the other — makes that fact visible at a
glance, in a way prose and nested conditionals both bury.

|          | first hour | additional hour |
|----------|-----------:|-----------------:|
| weekday day     | $4.00 | $2.00 |
| weekday evening | $2.00 | $1.00 |
| weekend         | $1.00 | $1.00 |

Once the rule is a table, 8th lets you implement it as an actual table,
looked up by index, rather than as a chain of comparisons pretending to be
one. 8th's `caseof` takes a container and an index (or a string key, for a
map) and returns whatever is stored there — a number, a string, or, if it's
a word, the *result of calling it*. Read as "look this up," a decision
table and a `caseof` array are the same idea:

```8th
0 constant DAY
1 constant EVENING
2 constant WEEKEND

0 var, tier
false var, valet?

: set-day      DAY tier ! ;
: set-evening  EVENING tier ! ;
: set-weekend  WEEKEND tier ! ;
: valet-on     true valet? ! ;

[ 400 , 200 , 100 ] constant first-hour-rates   \ cents
[ 200 , 100 , 100 ] constant addl-hour-rates    \ cents

: first-hour-rate   \ -- cents
  first-hour-rates tier @ caseof ;

: addl-hour-rate    \ -- cents
  addl-hour-rates tier @ caseof ;
```

The valet surcharge isn't part of the table at all — it doesn't depend on
the tier or the hour, so tying it to either would be exactly the kind of
false coupling Chapter 1 warned about. It's its own small word:

```8th
: valet-surcharge   \ cents -- cents
  valet? @ if 500 n:+ then ;
```

And the whole fee is a composition of these three pieces, matching the
shape of the table instead of hiding it:

```8th
: parking-fee  \ hours -- cents
  1 n:-  addl-hour-rate n:*
  first-hour-rate n:+
  valet-surcharge ;
```

This is [`code/ch02/parking-fee.8th`](../code/ch02/parking-fee.8th),
executed and checked against hand-calculated expectations:

```8th
set-day       3 parking-fee . cr    \ => 800   (400 + 2*200)
set-evening   3 parking-fee . cr    \ => 400   (200 + 2*100)
set-weekend   5 parking-fee . cr    \ => 500   (100 + 4*100)
valet-on
set-day       1 parking-fee . cr    \ => 900   (400 + 0 + 500)
```

Notice what happened to the `+` in the table: in the paragraph-of-prose
version it appeared nine times, once per cell. In the factored version it
appears exactly twice — once combining the two rate components, once
adding the surcharge — because the table stopped being nine separate facts
and became one small idea (a per-tier rate) applied uniformly. That
collapse from nine cases to one idea *is* the analysis. The 8th code is
just where the analysis stops being deniable: if the factoring is wrong,
`parking-fee` gives you the wrong number, immediately, rather than a
diagram nobody double-checked.

## Data Structures and the Limits of Generality

Sometimes analysis has a third job: deciding what to remember, not just
what to do. A parking garage that only ever admits and charges one car at
a time doesn't need much of a data structure. One that needs to know which
of its two hundred spaces are occupied, by which ticket number, since what
time, is a different problem — and *that* decision (one record per space?
one growing log of entries and exits?) belongs in analysis, before any
code commits you to it, because it's exactly the kind of thing Chapter 1
called "likely to change": today it's spaces in a garage, next year it
might be spaces in three garages, or hourly and monthly permit-holders
sharing the same lot.

The temptation, faced with that uncertainty, is to generalize: build a
data structure that could handle any garage configuration anyone might ever
want. Resist it. A solution sized for problems you don't have yet is
usually harder to understand, harder to verify, and — because
generalization multiplies the number of cases that interact with each
other — no easier to change than one sized for the problem you actually
have, built so that the parts likely to change are hidden behind a small
lexicon of words, the way `tier`, `first-hour-rate`, and `valet?` hide the
rate structure above. Simple and changeable beats general, almost every
time.

## Summary

Analysis, in 8th as in Forth, isn't a document you produce before coding
starts — it's the activity of finding the smallest accurate model of the
problem, however long that takes, and 8th's short feedback loop makes it
cheap to test that model as you refine it rather than only after it's
finished. Interfaces are usually best expressed directly as words with
placeholder bodies, executable from day one. Genuinely complicated rules
are best captured as decision tables, and 8th's `caseof` lets a decision
table survive into the running program as an actual table instead of
dissolving into a maze of conditionals. And whatever data structures the
problem needs should be sized to the problem you have, not the one you can
imagine — because the parts you can't predict are exactly the parts you'll
want to have hidden behind a word, ready to change.
