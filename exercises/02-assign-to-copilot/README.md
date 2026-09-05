# Exercise 02 -- Assign the Issue to Copilot

English | [日本語](README.ja.md)

## Goal

Delegate your issue to Copilot and observe it working in real time, then use Copilot Chat and the Copilot CLI to explore the codebase while you wait.

## The Mindset Shift

In the old workflow, after writing an issue you would open your IDE and start coding. In the AI-native workflow, you've just delegated this task to a team member. Your job is now to **guide and review**, not type every line yourself.

By default, the Copilot cloud agent works in a restricted, temporary environment. Its effective access still depends on the runner, network and firewall configuration, available secrets, MCP servers and other tools, and workflow permissions or approvals. This workshop does not grant the agent production access. In your own repositories, review those controls rather than assuming isolation alone removes every risk.

---

## Your Task

### Step 1 -- Assign the Issue

1. Open the issue you wrote in Exercise 01.
2. In the **Assignees** panel on the right, click the gear icon.
3. Search for and select **Copilot** from the list.
4. In the assignment dialog, confirm the target repository and base branch.
5. If the dialog shows an optional prompt, agent, model, or reasoning level, review those settings and change them only when you have a reason to do so.
6. Click **Assign**.

A 👀 reaction indicates that Copilot received the assignment. A normal issue comment is not guaranteed. Confirm that work has actually started by checking for session status **working** or opening **View session**.

### Step 2 -- Open the Agent Session

1. Open the **GitHub Copilot App** and navigate to **My Work**, or open the repository's **Agents** tab.
2. Find the session linked to your issue.
3. Confirm its status is **working**, then open **View session**.

### Step 3 -- Observe

Watch Copilot work. You will see it:

- Clone the repository into its restricted temporary environment
- Explore the codebase to understand the existing structure
- Make code changes
- Run checks and record its work in the full session
- Open a draft PR with a summary of its work

Do not intervene yet. Just observe.

### Step 4 -- Explore with Copilot Chat

While the agent session runs in the background, open **Copilot Chat in VS Code** against your local clone of `starter-app`.

Select the relevant code in `app.py` when needed, then try:

- Run `/explain` on the `list` command.
- Ask: `How does app.py store and load tasks?`
- Optionally add `#project` and ask: `What would I need to change to add a new field to a task?`

This is a different mode of working with Copilot: instead of delegating a whole task, you are having a conversation to build understanding. Check that the response is grounded in the selected code or repository context.

Copilot Chat capabilities and context controls differ across JetBrains IDEs and github.com. If you use another client, use its current UI to select or attach the relevant repository, files, or code rather than assuming that VS Code commands work there.

### Step 5 -- Explore with the Copilot CLI

If you have the [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli) installed, try it from your terminal in the repo root:

```bash
copilot
```

Then enter prompts such as:

```text
Run the starter-app tests and summarize any failures.
Explain what `python app.py stats` does and which code paths it uses.
```

---

## Next Step

Once the draft PR is ready, move on to [Exercise 03 -- Review the Draft PR](../03-review-a-pr/README.md).
