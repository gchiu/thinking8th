-- Pandoc Lua filter: rewrite the "8th" code-block language class to "forth"
-- before handing off to the typst PDF engine.
--
-- The .adoc source files correctly say [source,8th] -- that's the honest,
-- readable tag for a contributor reading the source. But Typst's raw-block
-- syntax (`` ```lang ``) only recognizes a language tag that starts with a
-- letter; since "8th" starts with a digit, Typst 0.15.1 silently treats it
-- as literal first-line content instead of a language tag, and "8th" leaks
-- into the rendered PDF above every code block. Confirmed by isolating the
-- exact behavior with a minimal .typ file -- not a pandoc bug, a Typst
-- raw-block parser limitation. "forth" is a reasonable, non-buggy stand-in:
-- 8th is Forth-descended, and unlike "8th" it survives Typst's parser.
function CodeBlock(el)
  if el.classes[1] == "8th" then
    el.classes[1] = "forth"
  end
  return el
end
