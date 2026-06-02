# Section 1: JavaScript & TypeScript — Correct Answers

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
