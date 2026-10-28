# Roadmap

Single source of truth for topic order. Both `interview/` and `mentor/` follow it **linearly**: finish every question in a topic before starting the next one. No rotation.

`Q{N}` = the global question number in `questions-index.md` (`### Question {N}:`).

## Phase 1 — months 1-3

| # | Topic | Questions | Progress files |
| --- | --- | --- | --- |
| 01 | JavaScript | Q1–Q15, Q57–Q61, Q75 | `01-javascript` |
| 02 | Node.js | Q29–Q37, Q62–Q68, Q76–Q79 | `02-nodejs` |
| 03 | TypeScript | Q16–Q18 | `03-typescript` |
| 04 | Databases (PostgreSQL, MySQL, Redis) | Q38–Q41, Q54–Q56, Q69, Q70, Q80 | `04-databases` |

## Phase 2 — months 4-6

| # | Topic | Questions | Progress files |
| --- | --- | --- | --- |
| 05 | AI | — | `05-ai` |
| 06 | Docker + Kubernetes | Q44, Q71, Q72, Q81 | `06-docker-kubernetes` |
| 07 | CI/CD | Q47, Q73, Q74, Q82, Q83 | `07-cicd` |
| 08 | React | Q19–Q28 | `08-react` |
| 09 | AWS | Q42, Q43, Q45, Q46, Q48–Q53 | `09-aws` |
| 10 | Design Patterns & Architecture | Q84–Q89 | `10-design-patterns` |

## TODO — question bank gaps

- **05 AI:** no questions yet (LLM API integration, prompt design, RAG, vector DBs, streaming).
- **07 CI/CD:** still missing a dedicated pipeline design question (environments/promotions, rollback strategy). Q47 covers part of it.

Next free question number: **Q90**. Update this when you add one. How to add or change questions and topics: see "Editing the study plan" in `README.md`.

## Progress files per topic

- Interview answers: `solutions/answers/{NN-topic}.md`
- Interview code: `solutions/{NN-topic}/q{N}-{slug}.js`
- Mentor notes: `mentor/notes/{NN-topic}.md`
