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

Go back to the draft PR you reviewed in Exercise 03. Find the comment you left requesting a change.

### Step 2 -- Watch Copilot Respond

An ordinary review comment does not necessarily start another Copilot session. A user with write access should explicitly mention Copilot, for example:

> `@copilot Please address this feedback and add the related tests.`

The GitHub Copilot app may also offer **Fix** on some comments, but **Fix** is not available for every comment. After requesting the change, use **View session** or the repository's **Agents** tab to confirm the session is **working**. Then watch Copilot:

- Interpret your feedback
- Make the requested changes
- Push the updated code to the same PR

### Step 3 -- Re-review

Once Copilot has responded, review the updated diff:

- Did it address your feedback correctly?
- Did it introduce any new issues?
- Is the PR ready to merge?

### Step 4 -- Leave Another Round of Feedback (Optional)

If the changes need further refinement, leave another specific comment and mention `@copilot` again. If **Fix** is available, you may use it instead.

Examples of effective iteration comments:

> "`@copilot` The validation you added rejects empty strings, but it does not trim whitespace first. A task name of '   ' (spaces only) should also be rejected."

> "`@copilot` Can you move the CSV export logic into its own function? The current implementation mixes I/O and formatting in a way that will be hard to test."

> "`@copilot` The error message on line 42 says 'invalid input' but doesn't tell the user what valid input looks like. Can you improve it?"

### Step 5 -- Approve and Merge

When you are satisfied with the PR:

1. Change the PR from **Draft** to **Ready for Review**.
2. Inspect any workflow changes before approving an Actions run. By default, workflows triggered by Copilot cloud-agent PR updates may wait for **Approve and run workflows** unless an administrator has disabled that requirement.
3. Confirm required checks pass.
4. Obtain the required approval. The person who assigned the related Issue to Copilot cannot provide the required approval for that Copilot PR. If branch protection or rulesets require approval, ask an independent authorized reviewer.
5. Merge the PR yourself according to the repository's merge policy.

The GitHub Copilot app supports Agent Merge, but this workshop does not use Agent Merge or automatic merge. A human reviews the final result and performs the merge as workshop policy. The human remains the final gate.

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
