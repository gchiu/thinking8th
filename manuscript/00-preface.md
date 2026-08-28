# Preface

*Thinking 8th* is an attempt to do for [8th](https://8th-dev.com/) what Leo
Brodie's *Thinking Forth* (1984) did for Forth: teach not the syntax of a
language, but the way of thinking that makes it worth learning. Brodie's book
is not a manual. It is an argument about how to design software — when to
factor, what to name, how to hide the parts of a program most likely to
change — illustrated with a language that makes those decisions unusually
visible.

8th is a good language for the same kind of book, and a different one.
It descends from Forth by way of Ron Aaron's Reva Forth, and it keeps the
things that made Brodie's argument possible: words instead of functions,
a data stack instead of named parameters, an interactive interpreter instead
of a batch compiler. A reader who has never seen Forth will still recognize
the shape of the ideas here. But 8th is not a 1980s Forth wearing new syntax.
It has real namespaces instead of a naming convention. Its "variables" are
one of several built-in container types, reference-counted and garbage
collected, not raw addresses into memory you manage yourself. It runs the
same source file on a desktop, a phone, and a server. Where those
differences change the lesson, this book says so, instead of pretending
8th is Forth in disguise.

This is **not** a mechanical translation of *Thinking Forth*. Each chapter
starts from what Brodie was actually trying to teach, separates that lesson
from the Forth-specific mechanics he used to teach it, and then asks how the
same lesson is naturally expressed in idiomatic 8th. Sometimes the answer is
"almost exactly the same code, different words." Sometimes it is "8th
already has a real feature for the thing Forth programmers had to
improvise." Occasionally the honest answer is "this particular Forth
technique doesn't have a natural 8th analogue, and here's why." All three
answers show up in this book.

*Thinking Forth* is available at
[the Thinking Forth SourceForge project](https://sourceforge.net/projects/thinking-forth/)
under a Creative Commons Attribution-NonCommercial-ShareAlike 2.0 license,
and a copy of its original LaTeX source is kept in this repository, under
`thinking-forth-1.0/`, as reference material. This book is an original
adaptation: original prose and original, independently verified 8th code,
inspired by Brodie's structure and spirit rather than copied from his text.
It carries the same non-commercial, share-alike spirit forward.

Every code example in this book that can be run has been run, against the
8th distribution it was written against, and its actual output is shown
alongside it. Where an example can't reasonably be executed — because it
needs a GUI, a network, hardware, or some other environment this book
doesn't assume — that is said plainly, rather than guessed at.

Read the next two short sections before Chapter 1: "Getting 8th and
Running Your First Program," which gets 8th installed and running on
your own machine, and "A Note on Notation," which explains a handful of
things about how 8th source code is written in this book that will save
you from misreading the very first examples.
