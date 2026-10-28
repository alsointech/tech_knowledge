# Roadmap

Single source of truth for topic order. Both `interview/` and `mentor/` follow it **linearly**: finish every question in a topic before starting the next one. No rotation.

`Q{N}` = the global question number in `questions-index.md` (`### Question {N}:`).

## Phase 1 — months 1-3

| # | Topic | Questions | Progress files |
| --- | --- | --- | --- |
| 01 | JavaScript | Q1–Q15 | `01-javascript` |
| 02 | Node.js | Q29–Q37 | `02-nodejs` |
| 03 | TypeScript | Q16–Q18 | `03-typescript` |
| 04 | Databases (PostgreSQL, MySQL, Redis) | Q38–Q41, Q54–Q56 | `04-databases` |

## Phase 2 — months 4-6

| # | Topic | Questions | Progress files |
| --- | --- | --- | --- |
| 05 | AI | — | `05-ai` |
| 06 | Docker + Kubernetes | Q44 | `06-docker-kubernetes` |
| 07 | CI/CD | Q47 | `07-cicd` |
| 08 | React | Q19–Q28 | `08-react` |
| 09 | AWS | Q42, Q43, Q45, Q46, Q48–Q53 | `09-aws` |

## TODO — question bank gaps

- **05 AI:** no questions yet (LLM API integration, prompt design, RAG, vector DBs, streaming).
- **06 Docker + Kubernetes:** only Q44 (ECS/EKS). Missing: Dockerfile best practices, K8s pods/deployments/services, probes, config/secrets.
- **07 CI/CD:** only Q47. Missing: pipeline design, environments/promotions, rollback strategy.

New questions get the next free global number (currently Q57), go in both `questions-index.md` and `questions.md`, and get added to the table above.

## Progress files per topic

- Interview answers: `solutions/answers/{NN-topic}.md`
- Interview code: `solutions/{NN-topic}/q{N}-{slug}.js`
- Mentor notes: `mentor/notes/{NN-topic}.md`
