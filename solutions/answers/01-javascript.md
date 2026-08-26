# Section 1: JavaScript & TypeScript — Correct Answers

---

## Q1: Variable Declarations
**Question:** Explain the differences between `var`, `let`, and `const`. What is hoisting, and how does it affect each declaration type? Predict the output of the code challenge.
**Answer:** var is function-scoped, hoisted and initialized as undefined. let/const are block-scoped, hoisted but not initialized (TDZ) — accessing them before declaration throws ReferenceError. var loop prints 3 3 3 because all callbacks share one reference (closed over after loop ends at 3). let loop prints 0 1 2 because each iteration creates a new block-scoped binding.
**Score:** 7/10

---

## Q2: Destructuring & Spread/Rest Operators

**Question:** Explain destructuring assignment and the spread/rest operators. How do they differ, and when would you use each?

**Answer:**
- **Destructuring**: Pattern matching syntax that extracts values from arrays or objects into distinct variables. Works on both arrays (`const [a, b] = [1, 2]`) and objects (`const { name, age } = user`). Supports default values and renaming.
- **Spread (`...`)**: Expands an iterable (array, object) into individual elements. Used when calling functions, merging arrays/objects, or creating copies.
- **Rest (`...`)**: Collects remaining elements into a new array or object. Used in function parameters or destructuring to capture "everything else".
- Same `...` syntax — context determines behavior: rest **collects**, spread **expands**.

**Key distinction:**
- `function fn(...args)` → rest (collecting into array)
- `fn(...args)` → spread (expanding array into arguments)
- `const { a, ...rest } = obj` → rest in destructuring
- `const merged = { ...obj1, ...obj2 }` → spread into new object

**Score:** 7/10 — Code correct from the start. Initial verbal explanation conflated spread and rest but self-corrected under follow-up. Missing: array destructuring syntax, default values in destructuring.

---

## Q3: Template Literals & Tagged Templates
**Question:** What are template literals and tagged templates? Create a sanitize tagged template function to prevent XSS.
**Answer:** Template literals use backticks for string interpolation, multiline strings, and embedded expressions `${}`. Tagged templates pass the literal to a function — first arg is the strings array, rest are evaluated values. `strings.length === values.length + 1` always. Solution used a single-pass `.replace()` with a callback and escapeMap (`&`, `<`, `>`, `"`, `'`) — more efficient than chained replaces. `"` and `'` kept in map as forward-looking but regex targets `/[&<>]/g` since expected output doesn't require quote escaping.
**Score:** 8/10

---
