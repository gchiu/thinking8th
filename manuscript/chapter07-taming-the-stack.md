# Chapter 7: Taming the Stack

Every example so far has passed arguments to words the same way: on the
stack, implicitly, the way a pronoun stands in for a noun already
mentioned. It works because most words need only one or two things at
once. This chapter is about what happens when that stops being true —
when a calculation genuinely needs more values in play than the stack
comfortably carries — and about the handful of tools 8th gives you for
that situation, several of which don't exist in the form Forth
programmers had to make do with.

## How Deep Is Too Deep?

Two or three items on the stack is about as much as a reader can track
in a single definition without losing the thread — which of the three
is which, and in what order they arrived. Brodie's original chapter
made this point using `ROT`, `PICK`, and `ROLL`, Forth's tools for
reaching below the top couple of stack items, and warned against
leaning on them: needing to reach that deep is usually a sign that the
values in question aren't really "the stack's business" anymore. 8th's
own documentation makes almost the identical point, independently, about
its own `pick` and `roll`: *"If you have so many elements on the stack
that you need `pick`, those elements should be in an array instead."*
That's not a coincidence — it's the same judgment, arrived at twice,
about what a stack is actually for.

8th makes that array conversion a one-word operation. `a:close` takes a
count and that many items already on the stack, and bundles them into
an array in one step:

```8th
10 20 30 40 4 a:close . cr    \ => [10,20,30,40]
```

This is
[`code/ch07/collapse-array.8th`](../code/ch07/collapse-array.8th), run
and verified. Once several values are travelling together as one array
instead of as separate stack items, they're subject to everything
Chapter 6 already covered — indexed by `caseof`, mutated with `a:!` —
without any custom bookkeeping to get there.

The same native-array habit answers a question Brodie spent a whole
section on: how do you build yourself an auxiliary stack, separate
from the one built into the language, for values that need genuinely
stack-like (last-in-first-out) handling of their own? In Forth this
took a hand-rolled `CREATE`/`ALLOT` block with manual pointer
arithmetic. In 8th, an array already behaves this way — `a:push` adds
to the top, `a:pop` removes from it:

```8th
[ ] var, mystack

mystack @ 1 a:push mystack !
mystack @ 2 a:push mystack !
mystack @ 3 a:push mystack !

mystack @ a:pop swap mystack ! . cr    \ => 3
mystack @ a:pop swap mystack ! . cr    \ => 2
```

This is [`code/ch07/mini-stack.8th`](../code/ch07/mini-stack.8th), run
and verified. The `swap` before each `mystack !` is worth noticing:
`a:pop` leaves the shrunken array *underneath* the value it removed, so
storing the array back requires bringing it to the top first — a small,
real example of exactly the kind of stack bookkeeping this chapter is
about escaping wherever it isn't strictly necessary.

## Escaping the Stack: Word-Local Variables

Some values genuinely don't fit the "mention once, refer to as it"
pattern — they're needed more than once, by name, spread across a
whole calculation. Brodie's example was a box-drawing word taking four
coordinates, each needed twice (once per corner it touches). His fix
was ordinary Forth variables, used carefully within one definition —
which worked, but only by convention: a Forth `VARIABLE` is always
global, so nothing stopped some other word from reading or clobbering
it, whether or not that was ever intended.

8th has a mechanism Forth didn't: variables genuinely scoped to one
word. Prefix the definition with `locals:`, and inside it, `w:!` and
`w:@` set and fetch a named slot that exists only for the duration of
that call:

```8th
locals:
: midpoint  \ x1 y1 x2 y2 -- xm ym
  "y2" w:!  "x2" w:!  "y1" w:!  "x1" w:!
  "x1" w:@ "x2" w:@ n:+ 2 n:/
  "y1" w:@ "y2" w:@ n:+ 2 n:/ ;

0 0 10 20 midpoint . cr . cr    \ => 10, then 5
```

This is [`code/ch07/midpoint.8th`](../code/ch07/midpoint.8th), run and
verified. `midpoint` unloads all four arguments into named slots up
front — `w:!` takes the value and then the name, so the four lines
above read bottom-to-top as "y2, then x2, then y1, then x1," unloading
the stack in reverse of how the arguments arrived — and the two
`n:+`/`n:/` lines that follow read exactly like the arithmetic they are,
each coordinate referred to by name instead of by stack position.

The word `locals:` is doing real work in that snippet — it isn't
decoration. Leave it off and `w:@`/`w:!` have no scope to work in.
Unlike a `var,`, which creates exactly one storage location no matter
how many words end up calling it, each word that opts in with
`locals:` gets its own private set of named slots, invisible to any
other word — including one of the same name declared elsewhere. There
is no dictionary entry to pollute, no risk of the "Redefining" warning
Chapter 1's `apples` example triggered, because nothing named `x1` or
`y2` exists once `midpoint` returns.

## An Auxiliary Stack for One Temporary Value

Occasionally a value needs to be set aside for a moment — saved,
overridden, then put back — without cluttering a variable that has to
be declared somewhere far from where it's used. Forth's answer was the
*return* stack: the same stack the language uses to remember where a
word should resume after a call returns, borrowed for a second,
unrelated purpose via `>R` and `R>`. Brodie's chapter spends several
pages on the discipline this demands, because the borrowing is real —
push one temporary value without popping it before the word ends, and
you've corrupted the address the system needs to get back to its
caller. Every `>R` needs a matching `R>` on every possible path through
the word, including paths that don't look obvious at a glance.

8th sidesteps the entire hazard. `>r`, `r>`, and `r@` do give you a
place to stash a value — but it's a separate stack from the one
managing actual calls and returns, kept apart precisely so a mismatched
push or pop can't corrupt control flow. The old discipline (balance
your pushes and pops) still matters for keeping *your own* values
straight, but the worst-case consequence Brodie warns about — silently
scrambling the entire program's flow of control hours after the bug was
introduced — isn't possible here by design.

```8th
true var, verbose?

: log  \ s --
  verbose? @ if . cr else drop then ;

: quietly  \ --
  verbose? @ >r
  false verbose? !
  "should not print" log
  r> verbose? ! ;

true verbose? !
"before" log     \ => before
quietly
"after" log      \ => after
verbose? @ . cr  \ => true
```

```text
before
after
true
```

This is [`code/ch07/quietly.8th`](../code/ch07/quietly.8th), run and
verified. `quietly` saves whatever `verbose?` was — not necessarily
`true` — forces it off for one call, then restores exactly what it
found. Whatever the setting was before, it's the setting again
afterward.

## When a Save/Restore Turns Out to Be Bad Factoring

Not every "save the old value, then restore it later" urge is actually
solving the right problem. Sometimes it's a symptom of a word that
shouldn't have been touching shared state to begin with.

Suppose a global tracks how many holes the *current* game is — nine for
a short round, eighteen for a long one — and a word called `game` reads
that global and plays that many holes, however "playing a hole" is
actually implemented.

Later, a second need shows up: play some *specific* number of holes,
without disturbing whatever `#holes` is currently set to for the game
in progress. The tempting fix saves the old value, sets the new one,
runs the game, and restores what was there — more `>r`-style bookkeeping
solving a problem that arguably shouldn't exist. The word that actually
needs fixing is the one that hard-codes a dependency on the global in
the first place:

```8th
: play-hole  \ index --
  "playing hole " . . cr ;

locals:
: holes  \ n --
  "n" w:!
  ' play-hole  0  "n" w:@ n:1-  loop ;

0 var, #holes
: long   18 #holes ! ;
: short  9 #holes ! ;
: game   #holes @ holes ;

short
game
```

```text
playing hole 0
playing hole 1
playing hole 2
playing hole 3
playing hole 4
playing hole 5
playing hole 6
playing hole 7
playing hole 8
```

This is [`code/ch07/holes.8th`](../code/ch07/holes.8th), run and
verified. `holes` takes its count as an ordinary argument and never
reads `#holes` at all — it's `game`, and only `game`, that reads the
current setting and hands it along. Playing an arbitrary number of
holes needs no save, no restore, and no new machinery: `5 holes` just
works, because `holes` was never entangled with "the current game" to
begin with. When a save/restore feels necessary, it's worth asking
first whether the word doing the saving even needed to touch the shared
value directly.

## Sharing One Component for Two Purposes

Sometimes reusing the same piece of machinery for two different jobs
is the right call — a single "am I in quiet mode?" check, say, guarding
output that two unrelated parts of a program both need to suppress at
different times. Brodie's rule for when this is safe is a genuinely
portable one: reuse a component for a second purpose only if every use
is mutually exclusive, and each one restores exactly what it found when
it's done — which is precisely what the earlier `quietly` example did
for a single, non-overlapping case.

The harder case is when the *uses themselves can nest*. A plain
on/off flag breaks the moment two callers overlap: the inner one
finishes, flips the flag back to "visible," and silently un-suppresses
output that the outer caller still needed suppressed. A counter, not a
flag, is what makes nesting safe — each caller adds one on the way in
and removes one on the way out, and only reaching zero means every
caller has actually finished:

```8th
0 var, quiet-depth

: log  \ s --
  quiet-depth @ 0 n:= if . cr else drop then ;

: quiet!    1 quiet-depth n:+! ;
: unquiet!  -1 quiet-depth n:+! ;

"a" log
quiet!
  "b" log
  quiet!
    "c" log
  unquiet!
  "d" log
unquiet!
"e" log
```

```text
a
e
```

This is [`code/ch07/quiet-depth.8th`](../code/ch07/quiet-depth.8th),
run and verified. `"b"`, `"c"`, and `"d"` are all suppressed — the
inner `quiet!` raises the depth to `2`, and the matching `unquiet!`
only brings it back to `1`, so `log` stays silent through `"d"` as
well, correctly reflecting that the outer caller was never done. Only
the final `unquiet!`, bringing the depth back to `0`, lets `log` speak
again.

## Summary

The stack is the right tool for arguments a word uses once and passes
along, the way a pronoun stands in for something just mentioned — but
it stops being the right tool the moment values need to be referred to
by name, held onto across a calculation, or shared safely between
unrelated pieces of code. 8th gives you more ways out of a crowded
stack than Forth did: `a:close` and native array push/pop for grouping
values that travel together, word-local variables (`locals:`, `w:@`,
`w:!`) for values that need real names scoped to exactly one word, and
an auxiliary `>r`/`r>` stack that borrows the shape of Forth's classic
trick without its classic danger, since it isn't the same stack the
language uses to find its way home. None of this replaces judgment: a
save-and-restore is sometimes the right move, and sometimes a sign that
a word is reaching for shared state it never needed to touch, and a
component shared for two purposes is safe exactly as far as its uses
stay mutually exclusive, or — if they can nest — as far as a counter,
not a flag, is tracking how many of them are still in flight.
