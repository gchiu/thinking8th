# Chapter 3: Preliminary Design and Decomposition

Analysis tells you what a program has to do. Preliminary design is the next
step: deciding what pieces it should be built from. Get this step right and
implementation is a series of small, well-defined problems. Get it wrong,
and you spend implementation discovering the right decomposition anyway —
the hard way, by fighting code that doesn't want to bend the way the
requirements just bent.

Brodie describes two ways to divide a program into pieces. This chapter
works through both, with one running example, in 8th.

## Two Ways to Cut Up a Problem

The first way is **decomposition by component**: group words by the thing
they know about — a data structure, a device, a rule — regardless of when
in the program's execution that knowledge gets used. This is the approach
Chapter 1 already argued for: components as Parnas-style
likely-to-change boundaries, given a name (a namespace, in 8th) and a small
set of words as their public face.

The second is **decomposition by sequential complexity**: since a word has
to exist before anything can call it, a program built word by word tends to
arrange itself from simplest to most capable, the way a textbook moves from
basic facts to advanced ones. This isn't really a design choice — it's a
consequence of writing in a word-based language at all — but it has
implications worth understanding, including one genuine wrinkle: sometimes
a foundational word needs to call something that, by the "simplest first"
ordering, hasn't been written yet.

Both approaches show up in the example below.

## Decomposition by Component: A Thermostat

Suppose the problem is a thermostat: read a temperature, decide whether to
heat, cool, or do nothing, and let a person override the decision manually.
Before writing any of that, ask what a *component* boundary looks like
here. One candidate jumps out immediately: whatever "the current mode" is
and how it gets changed is exactly the kind of thing likely to grow more
rules later (a minimum-run timer, a "don't switch modes twice in five
minutes" guard) — so it belongs behind its own small set of words, not
scattered through whatever code happens to decide when to heat or cool.

```
0 constant IDLE
1 constant HEATING
2 constant COOLING

IDLE var, mode

: mode@      \ -- mode
  mode @ ;

: set-mode   \ new-mode --
  dup mode@ n:= not if
    dup mode !
  else
    drop
  then ;
```

`set-mode` isn't just "store a number in a variable" dressed up. Look at
what it's already doing: it's the one place in the whole program that ever
sees *both* the old mode and the new one at the same moment, because it's
the one place any code goes through to change the mode at all. Nothing
outside this handful of words ever touches the `mode` variable directly —
not even to read it, which is what `mode@` is for. That discipline is worth
naming, because it's what Chapter 1 called an interface component:
whatever data two or more other parts of the program need to share should
live behind its own words, not be reached into directly, precisely so that
a rule about *how* it's shared (like "only change it if it's actually
different") has exactly one place to live.

Now the two things that actually want to change the mode. The automatic
decision:

```
: decide-mode  \ degrees -- new-mode
  dup 68 n:< if
    drop HEATING
  else
    76 n:> if COOLING else IDLE then
  then ;
```

And a person overriding it by hand:

```
: heat        HEATING set-mode ;
: cool        COOLING set-mode ;
: hvac-idle   IDLE    set-mode ;
```

Notice that `heat`, `cool`, and `hvac-idle` don't touch `mode` at all —
each is just a name for "call `set-mode` with a particular constant." That
wasn't planned in advance; it fell out once `set-mode` existed as its own
word, because writing "what changes the mode" three different ways (once
automatically, three times manually) would have meant deciding, three
separate times, whether the change was worth acting on. One shared word
underneath both the automatic and the manual path means that decision gets
made once. This is the same move Brodie's book makes with an editor whose
`INSERT` command turns out to be nothing more than "make room, then
overwrite" — a word that already existed, doing a job nobody had thought to
name yet. It's not something you plan for up front so much as something
you notice once you've written the pieces down and looked at what they
have in common.

## A Change in Plan

Here's where a component-based design earns its keep. Suppose the
requirement changes: instead of announcing the mode every cycle, the
thermostat should only speak up when the mode actually *changes* — nobody
wants a log line every ten seconds saying "still heating."

Because `set-mode` already sees both the old mode and the new one, it
already *has* the information this change needs. Adding it costs one line:

```
[ "idle" , "heating" , "cooling" ] constant mode-names

: mode-name  \ mode -- s
  mode-names swap caseof ;

: set-mode   \ new-mode --
  dup mode@ n:= not if
    dup mode !
    mode-name "now %s\n" s:strfmt .    \ <-- the new line
  else
    drop
  then ;
```

Nothing else in the program changes. `heat`, `cool`, `hvac-idle`, and
`decide-mode` are untouched, and every one of them picks up the new,
quieter logging behavior automatically, because every one of them was
already going through `set-mode`.

Compare that to what would have happened if the mode had been changed
directly wherever it was decided — three lines in the manual-override
words, one more inside whatever called `decide-mode` — with a "print the
mode" step tacked on after each one, the way a flowchart-driven design
naturally accumulates: one box for "decide," a separate box for "report,"
wired together by the arrows between them. Adding "only report when it
changed" to *that* design means the "did it change" check either gets
duplicated at every call site, or the previous mode has to be threaded
through the control flow as extra state so the reporting step can compare
against it — extra plumbing whose only job is to reconnect two things that
a shared word would have kept connected for free. The component version
didn't dodge that problem by being cleverer. It dodged it by already having
exactly one place where the answer to "did the mode change?" was knowable
without asking around.

[`code/ch03/thermostat.8th`](../code/ch03/thermostat.8th) exercises this
with a run of temperature readings. Reading the code rather than running it
first: `60`, then `61`, then `72` should produce two mode changes and one
silent repeat —

- `60` → HEATING (a change: `set-mode` logs `now heating`)
- `61` → HEATING again (no change: silent)
- `72` → IDLE (a change: `set-mode` logs `now idle`)

which is exactly what the actual run confirms further below, alongside a
fourth reading this chapter isn't ready to explain yet.

## Decomposition by Sequential Complexity, and Its One Wrinkle

The thermostat's words, read top to bottom, go from simplest to most
capable: constants, then the mode variable, then `set-mode`, then the
words built on top of it. That ordering isn't a style choice — 8th, like
Forth, requires a word to be defined before anything can refer to it, so a
program built up word by word naturally reads like a textbook, elementary
material first.

Occasionally that ordering fights you. Suppose the sensor component needs
to flag an implausible reading — a wildly out-of-range number that
suggests a wiring fault — but the code that actually knows how to *handle*
that situation (log it, alert someone, whatever a future diagnostics
component decides to do) doesn't exist yet, and arguably shouldn't be
designed until there's a real diagnostics story to design it around. The
foundational sensor code is written first; the advanced response to it
comes later. But the sensor code still needs to call *something* when it
sees a bad reading, today, before that something has been written.

8th's answer to this is `defer:` — a word declared now, whose body is
supplied later:

```
defer: on-bad-reading   \ degrees --

: plausible?  \ degrees -- flag
  dup -20 n:> swap 120 n:< and ;

0 var, sensor-temp

: read-temp  \ -- degrees
  sensor-temp @
  dup plausible? not if dup on-bad-reading then ;
```

Until something is attached to it, `on-bad-reading` is silently a no-op —
`read-temp` compiles and runs correctly with no diagnostics component in
sight. Later, once that component is designed, it attaches itself with
`w:is`:

```
: report-bad-reading  \ degrees --
  "sensor reading %d looks implausible -- check wiring\n" s:strfmt . ;

' report-bad-reading w:is on-bad-reading
```

From this point on, every call to `read-temp` that sees an implausible
value invokes `report-bad-reading` — without `read-temp` having been
touched, and without the sensor component needing to know, when it was
written, what "diagnosing a bad reading" would eventually mean. Running the
same reading (`999`, well outside a plausible range) before and after this
assignment shows the difference directly:

```
\ before the diagnostics component is wired in:
999 sensor-temp ! auto-cycle
\ => "now cooling"   (mode genuinely changes; no diagnostic — the hook
\    is still a no-op)

\ after ' report-bad-reading w:is on-bad-reading :
999 sensor-temp ! auto-cycle
\ => "sensor reading 999 looks implausible -- check wiring"
\    (mode is already "cooling", so no "now ..." log this time --
\    only the diagnostic fires)
```

This is [`code/ch03/thermostat.8th`](../code/ch03/thermostat.8th) in full;
running it start to finish prints exactly:

```
now heating
now idle
now cooling
sensor reading 999 looks implausible -- check wiring
final mode: cooling
```

`defer:` is a narrow tool for a narrow problem — a genuine forward
reference, not a general substitute for planning ahead — but it means the
order you'd naturally *write* a program (foundations first) doesn't have to
match the order in which every dependency becomes known.

## The Limits of "Level" Thinking

It's tempting, once a program is split into "foundational" and "advanced"
pieces, to treat that split as a hierarchy you must climb in order — design
the bottom first, then the middle, then the top. Nothing about component
decomposition requires that. The thermostat example above was written
`mode`/`set-mode` first only because that made the clearest starting point
for this chapter — but `decide-mode` could just as easily have been written
and tested first, standing on nothing but plain numbers on the stack, long
before `read-temp` or `sensor-temp` existed:

```
60 decide-mode .   \ works today, no sensor required
```

Pick whichever piece gives you the most useful feedback fastest — the part
you're least sure about, the part a stakeholder most needs to see working,
the part whose difficulty will tell you whether the rest of the project is
easy or hard. "Foundational" and "advanced" describe where a word ends up
in the finished dependency graph, not the order you're obligated to design
them in.

A related trap is building an interface too narrow to reach the thing
behind it. If a component exposes only the three or four operations its
first caller happened to need, and hides everything else — including
information a *later* caller turns out to need but the component's author
never anticipated — the later caller is stuck. It can't extend the
component's own tools, because it doesn't have access to them; it can only
work around the outside of a boundary that was drawn too tight. The fix
isn't to expose everything (that defeats the point of having a boundary at
all) — it's to expose the tools the component is built from, not just the
one function that happened to be needed first, so a future caller with a
slightly different need can compose those tools instead of reimplementing
them from scratch outside the boundary. `mode@` above is a small instance
of this: it costs one line to expose, and it means a future component that
only needs to *read* the mode — a display, a log, a scheduler — never has
reason to reach past `set-mode` and touch the variable directly.

Brodie's own version of this chapter, writing in 1984, extends the point
into a broader argument against "objects" — meaning, in his usage, a
single word that takes a selector parameter and internally dispatches to
one of several behaviors, the way an old COM or CORBA object might. His
concern was narrow and specific even though the term he used for it is
broad: such a word has to contain its own internal decision structure to
figure out which behavior you meant, and it can't be extended by adding a
new named word the way a namespace of many small words can — you have to
modify the dispatcher itself. That's a real, fair comparison between *that
specific shape* (one name, an internal switch) and 8th's usual shape (many
names, no switch needed because the name already picked the behavior). It
is not a fair comparison between 8th and object-oriented programming in
general — most OOP languages built after 1984 don't work by internal
selector-dispatch either, and later editions of Brodie's own book say as
much. The lesson worth keeping is narrower than "objects are bad": a word
that has to ask "which of my several jobs am I doing this time?" is doing
work that a well-factored set of separately named words doesn't have to
do — regardless of what you call the wider style it's part of.

## Summary

Preliminary design means deciding what pieces a program needs before
writing them. 8th supports two ways of arriving at those pieces: grouping
by what a piece knows (decomposition by component, which is where the real
design work happens) and the ordering a word-based language imposes anyway
(decomposition by sequential complexity, which `defer:` lets you escape
when a foundational piece genuinely needs to call something that isn't
written yet). The thermostat example showed both at once: a shared `mode`
component discovered by noticing that several separate callers wanted the
same underlying action, an interface disciplined enough (`mode@`,
`set-mode`) that a real requirement change cost one line instead of a
redesign, and a forward-referenced hook that let a foundational word call
forward into a component that didn't exist yet. None of this required
planning the whole dependency graph before writing any code — only writing
each piece where its boundary was actually the right one to draw.
