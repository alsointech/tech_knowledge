# tech_knowledge

A personal Senior Backend Developer interview prep system powered by Claude Code. Four modes (interviewer, mentor, DSA coach, question curator), each chosen by the folder you launch `claude` from.

---

## Prerequisites

- [Claude Code CLI](https://claude.ai/code) installed
- Node.js 18+

No other dependencies. The repo is plain Markdown and JavaScript scratch files, so there's nothing to `npm install`.

---

## How it works

Claude Code loads the `CLAUDE.md` in the folder you launch from **and every `CLAUDE.md` in the folders above it**. Files are combined, not overridden. So the root `CLAUDE.md` holds only shared, persona-free context, and each mode's persona lives in its own subfolder:

| Launch `claude` from | Persona |
| --- | --- |
| `tech_knowledge/interview/` | Adversarial interviewer: devil's advocate, scored 0-10 |
| `tech_knowledge/mentor/` | Supportive senior coach: explains concepts, Socratic method |
| `tech_knowledge/hackerrank/` | DSA challenge coach: complexity-first, hint ladder |
| `tech_knowledge/curator/` | Question bank intake: paste questions, it files them into roadmap topics |

Run `/memory` inside a session to see which CLAUDE.md files were loaded. Start a new session (or a new terminal) when switching modes.

---

## Folder architecture

```
tech_knowledge/
├── CLAUDE.md                    # Shared context only (no persona)
├── roadmap.md                   # Topic order + question mapping (linear)
├── questions-index.md           # Question sheet: questions + code challenges, no answers (Q1–Q56)
├── questions.md                 # Answer key: expected answers, solutions, rubrics (read per question, never whole)
│
├── interview/
│   ├── CLAUDE.md                # Interviewer persona
│   └── index.js                 # Your scratch file for interview code challenges
│
├── mentor/
│   ├── CLAUDE.md                # Mentor persona
│   ├── index.js                 # Your scratch file for mentor sessions
│   └── notes/{NN-topic}.md      # Mastery notes per roadmap topic
│
├── curator/
│   └── CLAUDE.md                # Question bank intake
│
├── hackerrank/
│   ├── CLAUDE.md                # DSA coach persona
│   ├── index.js                 # Paste current problem and your attempt here
│   ├── test.js                  # Test runner scratch
│   ├── challenges.md            # Log of all problems attempted
│   └── solutions/{easy,medium,hard}/
│
└── solutions/
    ├── answers/{NN-topic}.md    # Scored interview answers (passed and failed)
    └── {NN-topic}/q{N}-{slug}.js
```

`{NN-topic}` is one of `01-javascript`, `02-nodejs`, `03-typescript`, `04-databases`, `05-ai`, `06-docker-kubernetes`, `07-cicd`, `08-react`, `09-aws`.

---

## Running each mode

Open one VS Code terminal per mode (WSL):

```bash
cd ~/projects/tech_knowledge/interview && claude    # interviewer
cd ~/projects/tech_knowledge/mentor && claude       # mentor
cd ~/projects/tech_knowledge/hackerrank && claude   # DSA drill
cd ~/projects/tech_knowledge/curator && claude      # add questions
```

Use the terminal for this. The Claude Code chat panel in VS Code starts in the workspace folder (`tech_knowledge/`), which has no persona. To use the panel instead, open the mode's subfolder as the VS Code workspace.

Claude doesn't speak first. After launching, send a first message such as `start` to make it read your progress and ask the next question.

### What to type

| Mode | Message | What happens |
| --- | --- | --- |
| Interviewer | `start` | Reads `roadmap.md` + `solutions/answers/`, asks the first unanswered question |
| Interviewer | `check` | Reads `interview/index.js` and reviews your code |
| Interviewer | `retry Q{N}` | Re-asks a failed question; the newest entry counts |
| Mentor | `start` | Reads `roadmap.md` + `mentor/notes/`, offers to resume where you left off |
| Mentor | `explain {concept}` | Jumps to any concept, out of order |
| Curator | paste one or more questions | Classifies each into a roadmap topic (splitting multi-topic ones), shows a table, writes after you approve |
| HackerRank | paste a problem into `hackerrank/index.js`, then `check` | Coaching via the hint ladder; every solution needs a complexity comment |

---

## Roadmap (linear)

Topics are done one at a time, in order. A topic is finished when every question mapped to it has an entry in its answers file, passed or failed. A question closes after at most 2 follow-ups, so you never get stuck; failed ones show up with **Review later** notes and can be retried. See `roadmap.md` for the question numbers.

```
Phase 1 (months 1-3): JavaScript → Node.js → TypeScript → Databases (PostgreSQL, MySQL, Redis)
Phase 2 (months 4-6): AI → Docker + Kubernetes → CI/CD → React → AWS
```

Gaps still to write: AI (no questions), Docker/Kubernetes and CI/CD (one question each). The interviewer stops and tells you when it reaches a topic with no questions.

---

## Example: Interviewer session

```
> claude   (from tech_knowledge/interview/)

You: start

**Topic 01: JavaScript — Question 4 of 15 (#4)**

Explain the differences between forEach(), map(), filter(), reduce(), and find().
When would you use each one?

Code challenge: write it in interview/index.js and type `check` when ready...
```

After you answer (and type `check` for the code), the feedback looks like:

```
Assessment: Correct tasks 1-4. Grouping works but mutates the accumulator
  with a push inside reduce without explaining why that's acceptable.

Critical Issues: Task 2 uses filter + indexOf for uniqueness — O(n²).

Knowledge Gaps: Set-based dedupe; Object.groupBy (ES2024).

Follow-up: Why does forEach ignore an async callback's returned promise?

Score: 6/10 — Correct output, but O(n²) dedupe and a shallow explanation of
  when to choose reduce over a loop. Senior level is 8+.

Next: Waiting for your follow-up answer.
```

When the question closes (passed or failed), it's saved to `solutions/answers/01-javascript.md` as `## Q4: Array Methods`, and your code goes to `solutions/01-javascript/q04-array-methods.js`.

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
## Q11: Closures
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

## Editing the study plan

How the pieces connect:

- `roadmap.md`: the row order is the study order. The `Questions` column lists the global question numbers in each topic, and the `Progress files` column names its files.
- Saved answers are matched by question number. A question counts as answered when its topic's answer file has a `## QN:` entry.
- Claude finds a question by searching for `### Question N: Title`, so that header must be identical in `questions-index.md` and `questions.md`.
- The `# SECTION` headings in the question files are cosmetic. Nothing reads them.

| To... | Do this |
| --- | --- |
| **Add a question** | Use the next free number (check the TODO list in `roadmap.md`), and never reuse or renumber one. Add `### Question N: Title` with the question and code challenge to `questions-index.md`. Add the same header with the expected answer, solution and evaluation criteria to `questions.md`. Add `QN` to the topic's row in `roadmap.md`. |
| **Change a question** | Edit it in both files, keeping the same number and header. If you already answered it, type `retry QN` in `interview/` to redo it. |
| **Add a topic** | Add a row to `roadmap.md` with a new id such as `10-graphql`. Create `solutions/answers/10-graphql.md` and `mentor/notes/10-graphql.md` (one title line each) and `solutions/10-graphql/.gitkeep`. |
| **Reorder topics** | Move rows in `roadmap.md`. The number prefix is only an id, so don't rename files. |
| **Move a question to another topic** | Move `QN` between rows in `roadmap.md`. If it's already answered, also move its `## QN:` entry and its `qNN-*.js` file into the new topic's files, or it will be asked again. |
| **Remove a topic or question** | Delete it from `roadmap.md`. Keep its answer files as history. |

Shortcut: use the curator mode (`cd curator && claude`) and paste your questions. It applies these rules for you. A question that mixes topics is split if its parts are independent, or placed in the latest roadmap topic it depends on if it's one combined problem.

---

## Progress files

| File | What it stores | Created by |
| --- | --- | --- |
| `solutions/answers/{NN-topic}.md` | Scored Q&A records (passed + failed) | Interviewer when a question closes |
| `solutions/{NN-topic}/q{N}-{slug}.js` | Your solution code | Interviewer when a question closes |
| `mentor/notes/{NN-topic}.md` | Concept mastery notes | Mentor on understanding |
| `hackerrank/challenges.md` | Problem log with pattern and status | DSA coach on completion |

All files persist across sessions. They are your long-term progress record regardless of which conversation created them.

---

## Practical session workflow

1. **Don't understand a concept** → `cd mentor && claude` → `explain closures`
2. **Ready to test yourself** → `cd interview && claude` → `start` (picks up where you left off)
3. **Have new questions to study** → `cd curator && claude` → paste them
4. **Want to drill an algorithm** → `cd hackerrank && claude` → paste the problem into `index.js`, then `check`

Don't switch modes inside a running session: exit (`/exit`) and launch `claude` again from the other folder, so the old persona doesn't carry over.
