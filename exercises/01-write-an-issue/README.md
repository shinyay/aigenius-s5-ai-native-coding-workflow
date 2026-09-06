# Exercise 01 -- Write a Well-Formed Issue

English | [日本語](README.ja.md)

## Goal

Learn to write GitHub Issues that give Copilot the context it needs to produce high-quality code.

## Why This Matters

In an AI-native workflow, your issue IS your prompt. The quality of Copilot's output is directly tied to the quality of the issue you write. A vague issue produces vague code. A specific, well-structured issue with clear acceptance criteria produces code that is far more likely to match your intent.

**Key insight:** You are not just describing a task for a human teammate. You are writing a specification that an AI agent will interpret and act on immediately.

---

## What Makes a Good AI-Native Issue

A well-formed issue for Copilot includes:

| Section | Purpose |
|---|---|
| **Problem statement** | What gap or pain point are you solving? |
| **Desired behaviour** | What should the user be able to do when this is done? |
| **Acceptance criteria** | A checklist of conditions that define "done" |
| **Constraints** | Libraries to use, things to avoid, performance requirements |
| **Definition of Done** | Final verification checklist |

---

## Your Task

1. Go to the **Issues** tab in this repo.
2. Click **New issue** and choose the **Feature Request (English)** template.
3. Write an issue for one of the following features:

   **Option A:** Migrate task storage to Azure Table Storage
   > The app currently stores tasks in a local JSON file. Migrate the storage layer to Azure Table Storage so tasks are persisted in the cloud. Use `azure-data-tables` and load credentials from environment variables. The CLI commands should work identically to today.

   **Option B:** Add Azure OpenAI task categorisation
   > When a user adds a task, call Azure OpenAI to automatically suggest a category (e.g. "work", "personal", "health") and set it as a tag if none are provided. The user should be able to opt out with `--no-ai`. Load credentials from environment variables.

   **Option C:** Add a `search` command
   > Users should be able to run `python app.py search "keyword"` to find tasks whose name or description contains the keyword. Results should be ranked by priority (high first) and highlight the matching text.

   Use the following copy-ready example as a starting point. Expand one section at a time and paste it into the matching field in the issue template. Review the decisions instead of treating the example as the only valid specification.

   <details>
   <summary><strong>Title</strong></summary>

   ```text
   Enable keyword task search with a search command
   ```

   </details>

   <details>
   <summary><strong>Problem statement</strong></summary>

   ```markdown
   The task manager CLI currently has no way to narrow registered tasks by keyword. As the number of tasks grows, users must visually scan the full output of `list` to find a task, which takes time when they remember only part of its name or description. Add a way to search by name or description so users can quickly reach the task they need.
   ```

   </details>

   <details>
   <summary><strong>Desired behavior</strong></summary>

   ```markdown
   - Running `python app.py search "keyword"` searches all tasks, including pending and completed tasks, and displays tasks whose name or description contains the keyword
   - Matching uses a case-insensitive substring search
   - Results are ordered by priority (`high`, `medium`, `low`), then by ascending `id` within the same priority
   - Results display at least the ID, name, description, priority, and status, and highlight matching text in the name or description with Rich bold yellow styling
   - A task with an empty or missing description is searched safely as if its description were an empty string and displays `—` for the description
   - When no tasks match, display `No tasks match your search.` and exit with status code 0
   - When the keyword is empty or contains only whitespace, display an actionable error and exit with a non-zero status code
   ```

   </details>

   <details>
   <summary><strong>Acceptance criteria</strong></summary>

   ```markdown
   - [ ] `python app.py search --help` describes the keyword argument and shows a usage example
   - [ ] A task can be found by a case-insensitive match in its name
   - [ ] A task can be found when the keyword appears only in its description
   - [ ] Pending and completed tasks are both searched, and each result displays its status
   - [ ] Multiple results are ordered by `high`, `medium`, `low`, then by ascending `id` within the same priority
   - [ ] Matching text in the name and description is highlighted in bold yellow without changing non-matching text
   - [ ] Tasks with an empty description or no description key do not raise an exception
   - [ ] A valid search with no results displays `No tasks match your search.` and exits with status code 0
   - [ ] An empty or whitespace-only keyword displays a clear error, displays no tasks, and exits with a non-zero status code
   - [ ] Automated tests cover successful matching, ordering, no results, whitespace input, missing descriptions, and highlight spans
   ```

   </details>

   <details>
   <summary><strong>Constraints and notes</strong></summary>

   ```markdown
   - Do not change the existing JSON task schema or the behavior of `add`, `list`, `complete`, `edit`, `delete`, or `stats`
   - Do not add an external search service or a new dependency; use the existing Click and Rich dependencies
   - Search must be read-only and must not modify or save tasks
   - Reuse existing helpers and constants such as `load_tasks()`, priority definitions, and color definitions instead of duplicating logic
   - Do not interpolate task names, descriptions, or the keyword into Rich markup strings; use `Text` or an equivalent safe API so user input is not interpreted as markup
   - Structure highlighting so tests can inspect the generated Rich `Text` content and style spans instead of relying only on terminal ANSI output
   - Use the existing `isolated_tasks_file` fixture so tests never access a user's real task data
   ```

   </details>

   <details>
   <summary><strong>Additional Definition of Done items</strong></summary>

   Keep the checklist already present in the issue template and append:

   ```markdown
   - [ ] `README.md` and the Usage section in `app.py` include a `search` command example
   - [ ] `python app.py search "deploy"` has been run manually to confirm the expected results, ordering, and highlighting
   ```

   </details>

   After pasting the sections, open the **Preview** tab and confirm that every acceptance criterion and Definition of Done item renders as a checkbox.

   **Option D:** Add recurring tasks
   > Users should be able to mark a task as recurring with `--repeat daily|weekly|monthly`. When a recurring task is completed, a new copy should be automatically created with the next due date calculated.

4. Fill in **every section** of the template. Do not leave any section empty.
5. Submit the issue.

---

## Reflection Questions

- How specific did you have to be to clearly describe "done"?
- What information would Copilot need that a human teammate might already know?
- Did writing the acceptance criteria help you clarify your own thinking about the feature?

---

## Next Step

Once you've written your issue, move on to [Exercise 02 -- Assign to Copilot](../02-assign-to-copilot/README.md).
