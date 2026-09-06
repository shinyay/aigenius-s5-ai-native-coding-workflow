# Exercise 04 -- Iterate via PR Comments

English | [日本語](README.ja.md)

## Goal

Refine Copilot's work through PR comments rather than starting from scratch.

## The Mental Model

Think of Copilot as a junior developer who is incredibly fast, very literal, and needs clear direction. You are not discarding their work and rewriting it yourself -- you are giving feedback and letting them improve it.

This is collaborative iteration. You don't start over. You refine.

---

## Your Task

### Step 1 -- Review Your Comment from Exercise 03

Go back to the draft PR you reviewed in Exercise 03. Find the comment you left requesting a change and confirm that it contains:

1. The problem you observed in the current code
2. The behavior you expect instead
3. A test or reproduction that proves the fix

If any part is missing, add a follow-up comment that makes the acceptance condition explicit.

### Step 2 -- Watch Copilot Respond

When a pull request was created by Copilot, Copilot responds after review comments from a user with write access are submitted. If you have several findings, batch them into one review before submitting it. For a later, targeted follow-up, a user with write access can explicitly mention Copilot to request another session, for example:

> `@copilot Please address this feedback and add the related tests.`

The GitHub Copilot app may also offer **Fix** on some comments, but **Fix** is not available for every comment.

#### Choose the correct comment action

The buttons in a line-comment box have different effects:

| Button | Use it when | What happens |
|---|---|---|
| **Add single comment** | You have one new line comment and want to post it immediately | The comment is published immediately. On a Copilot PR, this can start work before you finish reviewing other files. |
| **Start a review** | This is the first of several findings you want to submit together | The comment remains pending and visible only to you until you submit the review. |
| **Add review comment** | A review is already pending and you want to add another finding | The new comment joins the same pending review. |
| **Reply** | You are responding inside an existing review thread | The reply is posted in that thread. An `@copilot` mention from a user with write access requests another Copilot session; confirm that the session actually starts. |
| **Resolve conversation** | You have verified that the concern is fully addressed | The thread is marked resolved. This does not submit a review, dismiss `Changes requested`, or mark the PR ready. |

When reviewing several files, prefer **Start a review** and **Add review comment**, then submit the review once. This prevents Copilot from starting separate sessions for individual comments before your review is complete.

After submitting the review or an `@copilot` follow-up, confirm that GitHub shows the 👀 reaction or a timeline event that Copilot started work. Then open **View session** or the repository's **Agents** tab, confirm the session is **working**, and observe:

- how Copilot interprets the feedback
- which files it changes
- whether it updates tests as well as implementation
- which test commands it runs and their results
- whether it replies to the review thread

Do not accept a “fixed” notification as completion. Re-review the diff and the recorded evidence.

### Step 3 -- Re-review

Once Copilot has responded, review the updated diff:

- Did it fix the root cause rather than only the example?
- Would the new test fail on the previous implementation?
- Did the fix break another input or existing command?
- Did it add unrelated changes?
- Do the session log, Copilot's reply, and the actual diff agree?

Re-open previously reviewed files when the fix can affect them. A one-line change can alter validation, persistence, or output elsewhere.

### Step 4 -- Leave Another Round of Feedback (Optional)

If the changes need further refinement, leave another specific comment and mention `@copilot` again. If **Fix** is available, you may use it instead.

Examples of effective iteration comments:

> "`@copilot` The validation you added rejects empty strings, but it does not trim whitespace first. A task name of '   ' (spaces only) should also be rejected."

> "`@copilot` Can you move the CSV export logic into its own function? The current implementation mixes I/O and formatting in a way that will be hard to test."

> "`@copilot` The error message on line 42 says 'invalid input' but doesn't tell the user what valid input looks like. Can you improve it?"

### Step 5 -- Resolve every review thread

Do not treat a reply or a new commit as proof that the feedback is resolved.

1. Open **Files changed**.
2. Open the **Conversations** menu to see unresolved, resolved, and outdated threads.
3. Open each unresolved or outdated thread.
4. Read Copilot's reply, inspect the updated diff, and rerun the relevant reproduction or tests.
5. Use the thread's reply field to record the evidence you used to accept the fix. In the UI observed during this workshop, the buttons were **Cancel**, **Reply**, and **Start a review**; choose **Reply** to post in the existing thread. UI labels can change.
6. Click **Resolve conversation** only after the concern is fully addressed.
7. Repeat until the **Conversations** menu shows no unresolved threads.

Replying does not automatically resolve a thread. Marking the pull request ready for review does not resolve threads either.

You can resolve a conversation if you opened the pull request or have write access to the repository. If **Resolve conversation** is missing, confirm that you are viewing the thread from **Files changed**, use the **Conversations** menu to reopen it, and check your repository permission. If you are not eligible, ask the pull request opener or a maintainer with write access to resolve it.

<details>
<summary><strong>Copy-ready verified-resolution reply</strong></summary>

```markdown
I reran the reproduction and the full test suite, confirmed the original text is preserved and the expected spans are present, and found no regression. I have verified the fix and am resolving this conversation.
```

</details>

### Step 6 -- Mark the PR Ready for Review

Use **Ready for review** only after:

- every review conversation is resolved
- the final diff and complete Copilot session have been re-reviewed
- relevant local or session tests are successful
- no unexplained or unrelated changes remain

1. Open the **Conversation** tab.
2. Find the pull request's merge box. Its position can vary with the page layout.
3. If **Approve and run workflows** appears, inspect the entire PR—especially `.github/workflows/`—then approve the run. By default, workflows do not run automatically after Copilot pushes changes.
4. Wait for any required checks on the latest PR commit to complete successfully. Do not rely on green checks from an earlier commit. If the repository has no required checks, continue.
5. Click **Ready for review**.
6. Confirm the Draft indicator disappears.

This action only changes the pull request from Draft to Ready for Review and may request reviews from code owners. It does not approve the pull request, dismiss a `Changes requested` review, resolve conversations, or merge the pull request.

### Step 7 -- Check review and repository requirements

These states are independent:

| State | What it tells you |
|---|---|
| Review thread: resolved or unresolved | Whether one specific conversation still needs action |
| Submitted review: comment, approve, or request changes | The decision recorded when a review is submitted |
| Pull request stage: draft or ready | Whether the PR is presented as ready for final review |
| Merge requirements | Whether checks, approvals, branch rules, conflicts, or a merge queue permit merging |

Resolving every conversation does not automatically clear an earlier `Changes requested` review. A separate approval from another reviewer may satisfy an approval count, but it does not remove the original blocking request for changes.

- If you submitted **Request changes**, open **Files changed**, click **Review changes**, choose **Approve**, and submit the review after verifying the fix. This supersedes your own blocking review and clears your `Changes requested` decision.
- Clearing your own review decision is separate from satisfying the repository's required approval count. Your own approval of a Copilot PR does not count toward that total. Only when the repository requires approvals, separately ask an eligible independent reviewer.
- If the original blocking review is obsolete and cannot be cleared normally, an eligible repository administrator or user with write access can open **Conversation**, expand the review summary, open the review's `...` menu, choose **Dismiss review**, enter a reason, and confirm. Repository settings can restrict dismissal to specific people or teams.
- Dismissing a review changes it to a review comment and records the dismissal reason in the PR conversation. Do not dismiss reviews merely to bypass repository policy.
- If no rule requires approval and the standard merge button is enabled, you may proceed with the manual merge while the historical `Changes requested` review remains as audit history.

### Step 8 -- Merge manually from the Conversation tab

This workshop assumes that the base branch does not require a merge queue. It does not use Copilot App **Agent Merge**, GitHub auto-merge, or a merge queue. A human performs the final merge.

1. Open the pull request's **Conversation** tab.
2. Confirm all conversations are resolved, required reviews and checks for the latest commit are satisfied, and there are no merge conflicts.
3. Scroll to the merge box near the bottom of the pull request.
4. Choose the repository-approved merge method. If the desired method is not the current button label, open the adjacent merge dropdown and select it:
   - **Merge pull request**
   - **Squash and merge**
   - **Rebase and merge**
5. Click the selected merge button.
6. Review the final commit message, then click **Confirm merge**, **Confirm squash and merge**, or **Confirm rebase and merge**.
7. Confirm the pull request displays `Merged`.
8. If the PR description contains `Fixes #...`, confirm the linked issue is closed.

Public GitHub documentation calls the Copilot App automation **Agent Merge**. During this workshop's dry run, the app displayed a top-level **Merge when ready** control; UI labels can change. Do not enable Agent Merge in this exercise. Open the PR on github.com and use the standard merge box.

On github.com, **Merge when ready** is also the official action for a required merge queue. If the merge box shows **Merge when ready** and **Confirm merge when ready**, the repository does not match this exercise's no-merge-queue assumption. Follow the repository's queue policy or use the workshop repository configuration instead of searching for **Merge pull request**.

---

## Troubleshooting the final review and merge

<details>
<summary><strong>Resolve conversation is not visible</strong></summary>

1. Open **Files changed** rather than relying only on the **Conversation** timeline.
2. Open the **Conversations** menu and select the unresolved or outdated thread.
3. If you are replying to an existing thread, click **Reply**, not **Start a review**.
4. After posting the evidence, look for **Resolve conversation** in the same thread.
5. Confirm that you opened the PR or have write access. Otherwise, ask an eligible maintainer to resolve it.

Do not use **Ready for review** as a substitute for resolving conversations.

</details>

<details>
<summary><strong>Merge when ready is visible instead of Merge pull request</strong></summary>

First identify which surface you are using:

- **GitHub Copilot App:** Public documentation calls its automation **Agent Merge**. Open the PR on github.com instead; this workshop does not use Agent Merge.
- **github.com merge box:** **Merge when ready** means the base branch requires a merge queue. This is a supported GitHub flow, not a bypass, but it is outside this exercise's assumptions. Follow the repository's queue policy or use a branch without a required queue.

</details>

<details>
<summary><strong>Changes requested remains after every thread is resolved</strong></summary>

Thread resolution and review decisions are separate. Another review does not remove the original request for changes.

- If you requested changes, submit a new **Approve** review after verifying the fix to supersede your own blocking review and clear your `Changes requested` decision.
- Clearing your own review decision is separate from satisfying a required approval count. Only when the repository requires approvals, separately obtain the required approval from an eligible reviewer. Your own approval of a Copilot PR does not count toward that required total.
- When normal clearance is unavailable, an eligible administrator or user with write access may dismiss an obsolete review with a reason, unless dismissal is restricted by repository settings.
- If approval is not required and the standard merge button is enabled, you may merge while preserving the review history.

</details>

<details>
<summary><strong>The standard merge button is missing or disabled</strong></summary>

Read the message in the merge box. Common causes include:

- the PR is still Draft
- required checks are pending or failing
- required reviews or code-owner approvals are missing
- review conversations must be resolved by repository rule
- the branch has merge conflicts or must be updated
- the base branch requires a merge queue, in which case github.com shows **Merge when ready** instead
- your account lacks merge permission

Resolve the stated requirement. Do not switch to **Merge when ready** to bypass it.
Do not click **Enable auto-merge** either; satisfy the stated requirement and perform the manual merge.

</details>

---

## GitHub documentation used

- [Commenting on a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/commenting-on-a-pull-request)
- [Reviewing proposed changes in a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request)
- [Resolving reviews](https://docs.github.com/en/pull-requests/concepts/resolving-reviews)
- [Changing the stage of a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request)
- [Dismissing a pull request review](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/dismissing-a-pull-request-review)
- [Merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request)
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request)
- [Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)
- [Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github)
- [Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews)
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Merging with a merge queue](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request-with-a-merge-queue)
- [Managing pull requests with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests)

---

## Final merge checklist

- [ ] Every issue acceptance criterion has evidence in the diff or tests
- [ ] The final diff and complete Copilot session have been re-reviewed
- [ ] New and existing tests, required checks, and relevant security checks are successful
- [ ] Required checks are for the latest PR commit, not an earlier Copilot push
- [ ] Every review conversation is resolved
- [ ] Any blocking `Request changes` review is cleared or legitimately dismissed according to repository policy
- [ ] Required reviews and code-owner approvals are satisfied
- [ ] If approval is required, an eligible independent reviewer approved the Copilot PR
- [ ] Workflow changes were inspected before using **Approve and run workflows**
- [ ] The PR is Ready for Review, not Draft
- [ ] The standard github.com merge box shows an enabled merge method
- [ ] Agent Merge and auto-merge were not used; if a required merge queue was encountered, the workshop stopped or the repository's queue policy was followed explicitly
- [ ] The final change can be explained in your own words
- [ ] After merging, the PR displays `Merged` and the linked issue is closed when applicable

---

## Reflection Questions

- How many rounds of iteration did it take to get a result you were happy with?
- How did the precision of your comments affect the quality of Copilot's updates?
- What would you do differently in the original issue to reduce the number of iterations needed?

---

## Congratulations

You have completed the full AI-native development loop:

```
Write Issue  ─►  Assign to Copilot  ─►  Review PR  ─►  Iterate  ─►  Merge
```

You operated as the tech lead. You defined what to build and why. Copilot handled the implementation. You verified the result and guided it to completion.

That is AI-native development.

---

## What Next?

- Continue to [Exercise 05 -- Azure + AI: The Cloud-Native Extension](../05-azure-and-ai/README.md)
- Explore the [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- Try the [Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli): run `copilot`, then ask `Revert the last commit, leaving the changes unstaged.`
- Write a `copilot-instructions.md` for one of your own projects
