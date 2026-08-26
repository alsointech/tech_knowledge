# tech_knowledge

A personal Senior Backend Developer interview prep system powered by Claude Code. Four distinct AI modes — interviewer, mentor, and DSA coach, — each loaded by opening a specific folder.

---

## Prerequisites

- [Claude Code CLI](https://claude.ai/code) installed globally
- Node.js 18+

```bash
npm install -g @anthropic-ai/claude-code
```

No other dependencies. The repo is plain Markdown and JavaScript scratch files — nothing to `npm install`.

---

## How it works

Claude Code loads `CLAUDE.md` from the working directory when a conversation starts. Each subfolder has its own `CLAUDE.md` that overrides or extends the root, giving each mode a completely different persona.

| Working directory you open | Persona Claude loads |
|---|---|
| `tech_knowledge/` | Adversarial interviewer — devil's advocate, strict scoring |
| `tech_knowledge/mentor/` | Supportive senior coach — explains concepts, Socratic method |
| `tech_knowledge/hackerrank/` | DSA challenge coach — complexity-first, hint ladder |

---

## Folder architecture

```
tech_knowledge/
├── CLAUDE.md                    # Root: interviewer persona + session-start algorithm
├── questions-index.md           # Question bank (53 questions, 9 topics)
├── questions.md                 # Full rubrics and reference solutions (internal)
├── index.js                     # Your coding scratch file for interview questions
│
├── mentor/
│   ├── CLAUDE.md                # Mentor persona (overrides root)
│   ├── index.js                 # Your coding scratch file for mentor sessions
│   └── notes/
│       ├── 01-javascript.md     # Mastery notes per topic (filled as you learn)
│       ├── 02-react.md
│       └── ...09-ai.md
│
├── hackerrank/
│   ├── CLAUDE.md                # DSA coach persona (overrides root)
│   ├── index.js                 # Paste current problem and your attempt here
│   ├── test.js                  # Test runner scratch
│   ├── challenges.md            # Log of all problems attempted
│   └── solutions/
│       ├── easy/                # Completed solutions by difficulty
│       ├── medium/
│       └── hard/
│
└── solutions/
    ├── answers/
    │   ├── 01-javascript.md     # Scored Q&A records (auto-saved on pass)
    │   ├── 02-react.md
    │   └── ...09-ai.md
    ├── 01-javascript/           # Reference solution files (auto-saved on pass)
    │   ├── q02-destructuring.js
    │   ├── q03-template-literals.js
    │   └── ...
    ├── 02-react/
    └── ...09-ai/
```

---

## Running each mode

### Interviewer (root)

```bash
cd C:\Users\<you>\Documents\projects\tech_knowledge
claude
```

The interviewer reads your `solutions/answers/` files at session start, computes how many questions you've answered per topic, and picks up exactly where you left off in the round-robin cycle (2 questions per topic before rotating).

### Mentor

```bash
cd C:\Users\<you>\Documents\projects\tech_knowledge\mentor
claude
```

Explains concepts, uses Socratic questioning, no numeric scoring. Write your practice code in `mentor/index.js`.

### HackerRank / DSA drill

```bash
cd C:\Users\<you>\Documents\projects\tech_knowledge\hackerrank
claude
```

Paste a problem into `hackerrank/index.js` and ask Claude to coach you through it. Every solution requires a complexity comment. Completed solutions are saved to `hackerrank/solutions/{difficulty}/`.

---

## Topic cycle

The interviewer cycles through 9 topics, 2 questions at a time, in this order:

```
JavaScript → React → Node.js → Databases → AWS →
Testing → Performance → Algorithms → AI → (repeat)
```

Progress is tracked in `solutions/answers/*.md`. Each file stores scored Q&A records. A new session always reads these files first and resumes at the correct topic and question number.

---

## Example: Interviewer session

```
> claude   (from tech_knowledge/)

Counts: JS=3, React=0, Node=0, DB=0, AWS=0, Testing=0, Perf=0, Algo=0, AI=0
current_round=0, threshold=2 → JS has 3 ≥ 2, React has 0 < 2

**Topic: React — Question 1**

What are the differences between functional and class components?
When would you still reach for a class component today?

Code challenge: convert this class component to a functional component with hooks...
```

After answering, the feedback format is:

```
Assessment: Solid conversion — all lifecycle methods correctly mapped to useEffect.

Critical Issues: Cleanup function missing from useEffect. componentWillUnmount
  sets document.title = 'App' but your return () => {} is empty.

Knowledge Gaps: useEffect dependency array — you added [name] correctly but
  didn't explain why omitting it would cause an infinite loop.

Score: 7/10 — Clean code, missed the cleanup detail. Senior level is 8+.

Next: Moving to React Question 2.
```

Solutions are auto-saved to `solutions/answers/02-react.md` and `solutions/02-react/q01-functional-vs-class.js`.

---

## Example: Mentor session

```
> claude   (from tech_knowledge/mentor/)

User: I don't understand closures. Can you explain?

Mentor: Before I explain — what do you think happens to a function's local
  variables after the function returns? Take a guess.

User: They get garbage collected?

Mentor: Usually yes. But what if another function still holds a reference
  to them? Try this in mentor/index.js:

    function makeCounter() {
      let count = 0;
      return () => ++count;
    }

  Run it. What do you expect counter() to print the second time you call it?
```

When the concept lands, the mentor logs it to `mentor/notes/01-javascript.md`:

```markdown
## Closures
**Concept:** Inner function retains access to outer scope variables even after outer function returns
**Where it clicked:** makeCounter example — count persisted across calls because the returned arrow function closed over it
**Readiness:** solid
```

---

## Example: HackerRank session

Paste a problem into `hackerrank/index.js`:

```javascript
// Problem: Two Sum
// Given an array of integers and a target, return indices of two numbers that add up to target.
// Input: nums = [2, 7, 11, 15], target = 9
// Output: [0, 1]

function twoSum(nums, target) {
  // your attempt here
}
```

Then open the session:

```
> claude   (from tech_knowledge/hackerrank/)

Coach: Good start. What's the brute-force approach and its complexity?

User: Nested loop, check every pair. O(n²).

Coach: Correct. Now — what data structure lets you check "have I seen
  this number before?" in O(1)?

User: A hash map?

Coach: Exactly. What would you store as the key, and what as the value?
```

Final solution saved to `hackerrank/solutions/easy/two-sum.js` with required complexity comment:

```javascript
// Time: O(n) — single pass with hash map lookup
// Space: O(n) — hash map stores up to n entries
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
}
```

---

## Progress files

| File | What it stores | Created by |
|---|---|---|
| `solutions/answers/{n}-{topic}.md` | Scored Q&A records | Interviewer on pass |
| `solutions/{n}-{topic}/q{N}-{slug}.js` | Reference solution code | Interviewer on pass |
| `mentor/notes/{n}-{topic}.md` | Concept mastery notes | Mentor on understanding |
| `hackerrank/challenges.md` | Problem log with pattern and status | DSA coach on completion |

All files persist across sessions. They are your long-term progress record regardless of which conversation created them.

---

## Practical session workflow

1. **Don't understand a concept** → open `mentor/`, new conversation → `"explain closures"`
2. **Ready to test yourself** → open `tech_knowledge/`, new conversation → picks up where you left off
3. **Want to drill an algorithm** → open `hackerrank/`, new conversation → paste problem into `index.js`
