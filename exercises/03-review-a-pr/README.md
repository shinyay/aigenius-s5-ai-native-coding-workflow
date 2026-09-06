# Exercise 03 -- Review the Draft PR

English | [日本語](README.ja.md)

## Goal

Review Copilot's pull request with the critical eye of a senior developer.

## Your Most Important Skill

In an AI-native workflow, **critical review** is your highest-value activity. Copilot is very good at generating plausible code. But plausible is not the same as correct, secure, or aligned with your actual intent.

You are the quality gate. The AI generates fast. You verify smart.

---

## Your Task

### Step 1 -- Open the Draft PR

1. Go to the **Pull Requests** tab in your repo.
2. Open the draft PR that Copilot created from your issue.

### Step 2 -- Read the Full Session

The PR description contains a summary, not the complete session log. Before looking at the code diff:

1. Use **View session** from the PR or issue, or open the repository's **Agents** tab.
2. Read the complete session to see how Copilot interpreted the issue, what it inspected, which commands it ran, and what decisions it made.
3. Cross-check the PR description summary against the full session. Note missing details or inconsistencies for review.

### Step 3 -- Review the Diff

Go through the **Files changed** tab carefully. Use the checklist below as your review guide.

---

## PR Review Checklist

Use this checklist on every Copilot-generated PR:

**Correctness**
- [ ] Does the code match the acceptance criteria in the issue?
- [ ] Are edge cases handled? (empty input, invalid values, missing data)
- [ ] Does the logic make sense end-to-end?

**Code Quality**
- [ ] Is the code readable and consistent with the rest of the codebase?
- [ ] Are functions small and focused?
- [ ] Are there type hints and docstrings on new functions?

**Security**
- [ ] No hardcoded credentials, API keys, or secrets
- [ ] User input is validated before use
- [ ] No obvious injection or parsing vulnerabilities

**Dependencies**
- [ ] Are new dependencies justified and declared in `requirements.txt`?
- [ ] Are imported libraries actually used?

**Tests**
- [ ] Do existing tests still pass?
- [ ] Are there new tests for the new behaviour?

---

## Your Task (Continued)

4. Work through the checklist above.
5. Leave **at least one comment** on the PR requesting a change or asking a clarifying question. Use an inline comment when the concern belongs to a changed line. Use a top-level PR comment when behaviour is missing entirely or the concern spans multiple files.

Good comments are specific. Instead of:
> "This could be better"

Try:
> "Can you add input validation to the task name field? It should reject empty strings and names longer than 200 characters."

### Copy-ready Option C review example

The following example comes from a dry run of the Option C `search` implementation. Use it only after confirming that the generated PR has the same implementation and reproduces the same behavior. A review comment needs evidence from the actual diff, not just text copied from this guide.

<details>
<summary><strong>Reproduce the search/highlight mismatch</strong></summary>

Check out the PR branch first, for example with `gh pr checkout <PR-number>`, then run this from `starter-app`. If the PR uses a different helper name or signature, adapt the snippet to the actual diff.

```python
import json
import os
from pathlib import Path
from tempfile import TemporaryDirectory

from click.testing import CliRunner

import app
from app import highlight_matches

value = "Straße release"
keyword = "STRASSE"
os.environ["COLUMNS"] = "200"

with TemporaryDirectory() as directory:
    app.TASKS_FILE = Path(directory) / "tasks.json"
    app.TASKS_FILE.write_text(
        json.dumps(
            [
                {
                    "id": 1,
                    "name": value,
                    "description": "",
                    "priority": "high",
                    "tags": [],
                    "due_date": None,
                    "done": False,
                    "created_at": "2025-01-01T09:00:00",
                }
            ],
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    result = CliRunner().invoke(app.cli, ["search", keyword])
    print("SEARCH_EXIT=", result.exit_code)
    print("ROW_PRESENT=", value in result.output)
    print("OUTPUT=", result.output)
    print("EXCEPTION=", repr(result.exception))

highlighted = highlight_matches(value, keyword)
print("SPANS=", [(span.start, span.end, span.style) for span in highlighted.spans])
```

The observed result was `SEARCH_EXIT=0` and `ROW_PRESENT=True`, while `SPANS` was empty. The PR's search command accepted the task as a match, but its highlight helper found no matching range. This happens when search filtering uses `casefold()` but highlighting uses `re.IGNORECASE`, because they do not implement identical Unicode casing rules.

</details>

<details>
<summary><strong>Inline review comment for the implementation</strong></summary>

On the changed line that detects highlight matches, choose **Start a review** rather than **Add single comment**, then paste:

```markdown
The search filter uses `casefold()`, while highlight detection uses `re.IGNORECASE`, so they do not apply the same Unicode casing rules. I reproduced this with `value="Straße release"` and `keyword="STRASSE"`: the task matches the search, but `highlight_matches()` returns no style spans. The acceptance criteria require matching text to be highlighted. Please define one consistent case-insensitive matching contract for filtering and highlighting. You can either align both sides on a rule that does not treat `ß` as `ss`, or retain full case-fold matching and map folded ranges back to indices in the original string. In either case, every reported match must have correct original-string highlight spans, and a regression test should prove the filter and highlighter agree for this input.
```

</details>

<details>
<summary><strong>Optional inline comment for test quality</strong></summary>

Use this only when the test searches for text that also appears in the task name:

If a review is already pending, add this with **Add review comment** so it remains part of the same review.

```markdown
`test_search_matches_description_and_includes_done_tasks` searches for `unit`, but the fixture name is `Write unit tests` and its description is empty. This test can pass even if description matching is removed, so it does not independently verify the description-only acceptance criterion. Please add a dedicated task whose keyword appears only in the description, or add a separate description-only test. If this test must also cover completed tasks, make that dedicated task completed.
```

</details>

<details>
<summary><strong>Request changes review summary</strong></summary>

After adding the inline comment, open **Review changes**, select **Request changes**, and use:

```markdown
Please define one consistent case-insensitive matching contract for search filtering and highlighting. Ensure every reported match has correct spans against the original text, and add a regression test proving the filter and highlighter agree for the Unicode input described in the inline comment.
```

</details>

---

## Reflection Questions

- Did Copilot miss anything from the acceptance criteria?
- Were there any decisions in the full session you disagreed with?
- How did writing a detailed issue affect the quality of the PR?

---

## Next Step

Once you've left a review comment, move on to [Exercise 04 -- Iterate via PR Comments](../04-iterate/README.md).
