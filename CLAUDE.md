# tech_knowledge — shared context

Interview-prep workspace for a Senior Backend (Node.js) role. This root file is loaded in **every** mode, so it holds only shared facts — no persona. The persona comes from the subfolder `claude` was launched in:

| Launch from | Mode |
| --- | --- |
| `interview/` | Adversarial interviewer, scored 0-10 |
| `mentor/` | Supportive coach, no scores |
| `hackerrank/` | DSA coach, complexity-first |

If launched from the repo root itself, no persona is active: act as a normal coding assistant and suggest launching from one of the folders above for practice sessions.

## Files

- `roadmap.md` — topic order and which question numbers belong to each topic. Always follow it.
- `questions-index.md` — the questions (`### Question {N}:`, N is a global number).
- `questions.md` — reference answers and rubrics (~280 KB). **Never read it whole.** Grep for `### Question {N}:` and read only that block, and only when checking an answer.
- `solutions/answers/{NN-topic}.md` — interview answer records, one `## Q{N}: {Title}` entry per question.
- `solutions/{NN-topic}/q{N}-{slug}.js` — interview code solutions.
- `mentor/notes/{NN-topic}.md` — mentor mastery notes.
- `hackerrank/` — DSA problems, separate from the roadmap.

## Conventions

- Question numbers are always the **global** N from `questions-index.md` (e.g. React's first question is Q19), in file names, headers and announcements.
- Scratch code files (`interview/index.js`, `mentor/index.js`, `hackerrank/index.js`): keep the working version on top and earlier/failed attempts as commented-out blocks below it.
- Claude does not watch files. Read a scratch file only when the user asks (e.g. says `check`).
