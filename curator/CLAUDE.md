# Curator Mode — Question Bank Intake

You maintain the question bank. The user pastes interview questions (which are also study topics), and you file each one into the right roadmap topic. No quizzing, no teaching, no scoring.

## SESSION START

1. Read `../roadmap.md`: the topics in order, the questions mapped to each, and the next free question number.
2. Read **all** of `../questions-index.md` (~27 KB: every question's text and code challenge, no answers). The duplicate check needs the full text, not just the titles.
3. Never read `../questions.md` whole (~280 KB). Grep for a specific `### Question {N}:` only when you need to see what an existing answer covers.
4. Tell the user you're ready for questions.

## INTAKE

The user may paste questions in any format or language. Write them into the bank in English, in the same style as existing entries.

For each pasted question:

1. **Normalize.** Write a one-line English summary of the concept the question tests. Do this whatever language it was pasted in (Spanish, English or mixed). All matching below uses this summary, never the original wording.
2. **Duplicate check, by meaning, not by keywords.** Compare the summary against every existing question's text **and** code challenge (a concept may be covered inside another question even when its title doesn't mention it). Also compare it against the other questions in the same paste. Give one verdict:
   - **duplicate: Q{N}**: already covered. Don't add it; say which part of Q{N} covers it. If it duplicates another question in the same paste, mark it `duplicate of row #`.
   - **partial: Q{N}**: Q{N} covers part of it. Add only the uncovered part, either as a new question or by extending Q{N} (see WRITE).
   - **new**: not covered anywhere.

   Only `partial` and `new` questions continue to the steps below.
3. **Classify** it into one roadmap topic.
4. **Multi-topic questions:**
   - If the parts are independent, **split** them into separate questions, one per topic.
   - If it's one integrated problem (e.g. "Node API with a Redis cache"), put it in the **latest topic in roadmap order** that it depends on, so the prerequisites are studied first.
   - Never map one question number to two topics. It would be asked twice.
5. **No fitting topic:** propose a new roadmap row (id `NN-slug`, name, phase).

## CONFIRM BEFORE WRITING

Show one table covering every pasted question, duplicates included, and wait for approval or edits:

| # | Original (as pasted) | English summary | Overlap | Title | Topic | Reason (split / placement) |
| --- | --- | --- | --- | --- | --- | --- |

- `Overlap` is `duplicate: Q29`, `partial: Q56`, `duplicate of row 2` or `new`.
- Number only the rows that will be added (`new`, and `partial` rows that become new questions), starting at the roadmap's next free number. Duplicates and extensions get `—`.

Write nothing until the user approves.

## WRITE (after approval)

1. **`../questions-index.md`** (the question sheet, no answers). Append under a cosmetic heading `# SECTION {next}: Added — {YYYY-MM-DD}`:

   ````
   ### Question N: Title
   **Question:** ...
   **Code Challenge:**
   ```javascript
   // numbered tasks
   ```
   ````

   Leave out the code challenge for theory-only questions.

2. **`../questions.md`** (the answer key). Append under the same heading, with the exact same `### Question N: Title` header:
   - `**Question:**` (same text as in the index)
   - `**Expected Answer:**`: senior-level bullet points
   - `**Code Challenge:**` + `**Expected Solution:**` (if there is a challenge)
   - `**Evaluation Criteria:**`

   Match the depth of existing entries (e.g. Q54–Q56).

3. **`../roadmap.md`:**
   - Add each N to its topic's `Questions` cell.
   - Update the "Next free question number" line.
   - Update the TODO gaps list (remove a gap once it has enough questions).

4. **New topic:** add the roadmap row, then create files with headers in the existing format:
   - `../solutions/answers/NN-slug.md`: `# Topic NN: Name — Interview Answers`, a blank line, then `---`
   - `../mentor/notes/NN-slug.md`: `# Topic NN: Name — Mastery Notes`
   - `../solutions/NN-slug/.gitkeep`

5. **Extending an existing question** (a `partial` row the user approved as an extension): edit the existing `Q{N}` block in **both** question files in place. Add the missing part to the question/code challenge in the index, and to the expected answer, solution and criteria in the answer key. Keep its number, title header and topic. If `../solutions/answers/` already has a `## Q{N}:` entry, tell the user to type `retry Q{N}` in `interview/` to be tested on the new part.

6. **Check:** `grep -n "^### Question N:" ../questions-index.md ../questions.md` returns one match per file for every new N.

7. **Finish:** summarize what was added per topic, which questions were extended, and which were skipped as duplicates. Then offer to commit.

## NEVER

- Renumber, reuse or delete existing question numbers. Saved answers are matched by number.
- Edit `../solutions/answers/` or `../mentor/notes/` content (only create new topic files).
- Quiz, score or teach. That's what the other modes are for.
