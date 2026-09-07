# AI Genius Episode 1: Workshop Repo

English | [日本語](README.ja.md)

![TitlePage](./assets/AI-Genius-Ep1.png)


## "Code with AI: GitHub Copilot for AI-Native Coding Workflows"

Welcome! This is the hands-on workshop repo for **AI Genius Episode 1**. You'll work through the full AI-native development loop: writing issues, delegating to Copilot, reviewing generated code, and iterating via PR comments.

---

## What You Will Learn

- What "AI Native" actually means for developers
- How to write issues that give Copilot the context it needs
- How to assign work to Copilot and observe it in action
- How to review Copilot-generated PRs like a senior developer
- How to iterate via PR comments instead of starting from scratch
- Best practices for collaborating with AI throughout the coding process
- In the optional exercise, how to review changes involving cloud SDKs and credentials with safety in mind

---

## The AI-Native Workflow Loop

```
IDEA
  └─► GitHub Issue  (describe the work)
        └─► Assign to Copilot  (Copilot agent picks it up)
              └─► Work runs in a restricted temporary environment
                    │   (effective access depends on configuration)
                    └─► Draft PR is opened  (summary + View session)
                          └─► Human reviews and iterates via PR comments
                                └─► Merge and ship
```

You are the **tech lead** in this workflow. Copilot handles the *how*. You define the *what* and *why*.

---

## Setup Instructions

### Prerequisites

- A GitHub account with access to GitHub Copilot
- [GitHub Copilot App](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) installed and signed in
- Python 3.10+ installed locally (for the starter app)
- Git installed

### Get Started

1. **Fork this repo** to your own GitHub account (top-right corner of this page).

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/aigenius-s5-ai-native-coding-workflow.git
   cd aigenius-s5-ai-native-coding-workflow
   ```

3. **Run the starter app**:
   ```bash
   cd starter-app
   pip install -r requirements.txt
   python app.py add "Deploy the API" --priority high --due 2025-12-31 --tag work
   python app.py add "Buy coffee" --priority low --tag personal
   python app.py list
   python app.py stats
   ```

4. **Open the GitHub Copilot App** and connect it to your forked repo.

5. Complete core Exercises 01–04 in order, starting with [`exercises/01-write-an-issue`](./exercises/01-write-an-issue/README.md). After completing the core workflow, optionally continue to [Optional Exercise 05](./exercises/05-azure-and-ai/README.md) for Azure and AI practice.

---

## Present the Slides in GitHub Copilot App

The repository includes a project Canvas extension that presents the AI Genius S5E1 slide images without switching to PowerPoint.

1. Open this repository in GitHub Copilot App.
2. Start a session after project extensions have loaded.
3. Ask Copilot: `Open the AI Genius Slide Presenter canvas.`
4. Use the on-screen controls, thumbnails, or keyboard shortcuts to present.

The viewer supports previous/next navigation, direct thumbnail selection, slide numbers, and fullscreen. If the host does not allow the browser Fullscreen API, it uses an in-Canvas presentation mode instead.

See [`presentation/ai-genius-s5e1`](./presentation/ai-genius-s5e1/README.md) for controls and slide update instructions.

## Explore the Copilot App Developer Experience

The [Japanese HTML DX guide](./presentation/copilot-app-dx/README.md) explains the central message, six changes in developer experience, product roles, and a review-and-iteration framework for making acceptance decisions. It is a self-contained, scroll-based artifact that can be opened locally or in a **Browser Canvas**, independently of the slide presenter.

---

## Exercise Flow

| Track | Exercise | What you will learn |
|---|---|---|
| Core | [Exercise 01](./exercises/01-write-an-issue/README.md) | Write a problem statement, desired behavior, acceptance criteria, constraints, and Definition of Done that an agent can implement |
| Core | [Exercise 02](./exercises/02-assign-to-copilot/README.md) | Delegate an issue to Copilot and observe its investigation, implementation, and testing |
| Core | [Exercise 03](./exercises/03-review-a-pr/README.md) | Review a generated PR for correctness, quality, security, dependencies, and test effectiveness |
| Core | [Exercise 04](./exercises/04-iterate/README.md) | Request improvements through precise PR comments, re-review the result, and merge manually |
| Optional | [Optional Exercise 05](./exercises/05-azure-and-ai/README.md) | Extend the completed workflow to Azure Table Storage and Azure OpenAI scenarios |

Completing Exercises 01–04 completes the workshop's core learning path. Optional Exercise 05 is an additional cloud-and-AI challenge for learners who want to continue.

Exercise 01 includes Azure-based Options A and B. Choose Option C or D for a core path that does not require Azure access; Options A and B require an appropriate Azure environment and can be deferred to Optional Exercise 05.

---

## Repo Structure

```
📁 aigenius-s5-ai-native-coding-workflow/
  ├── README.md / README.ja.md         # English and Japanese workshop guides
  ├── .github/
  │   ├── copilot-instructions.md      # Canonical Copilot context
  │   ├── copilot-instructions.ja.md   # Japanese contributor reference
  │   ├── extensions/
  │   │   └── ai-genius-presenter/     # GitHub Copilot App slide Canvas
  │   └── ISSUE_TEMPLATE/
  │       ├── feature-request.md       # English feature template
  │       └── feature-request-ja.md    # Japanese feature template
  ├── exercises/
  │   ├── 01-write-an-issue/           # Task: write a well-formed issue (cloud/AI options)
  │   ├── 02-assign-to-copilot/        # Task: assign + observe
  │   ├── 03-review-a-pr/              # Task: review and comment on a PR
  │   ├── 04-iterate/                  # Task: iterate via PR comments
  │   └── 05-azure-and-ai/             # Optional: Azure + OpenAI extension
  ├── presentation/
  │   ├── ai-genius-s5e1/              # Slide manifest, images, and update guide
  │   └── copilot-app-dx/              # Self-contained Japanese HTML DX guide
  └── starter-app/                     # Python CLI task manager to extend
      ├── app.py                       # CLI: add, list, complete, edit, delete, stats
      ├── requirements.txt             # click, rich, pytest
      └── tests/
          ├── conftest.py              # Shared fixtures (isolated task file)
          └── test_tasks.py            # 41 tests covering all commands + edge cases
```

---

## The 5 Golden Rules of AI-Native Coding

1. **Write better issues** -- your issue IS your prompt. Be specific.
2. **Review like a senior dev** -- AI generates fast, humans verify smart.
3. **Use `copilot-instructions.md`** -- give Copilot standing context about your project.
4. **Iterate, don't regenerate** -- guide via comments rather than starting from scratch.
5. **Stay in the loop** -- check the session log, understand what Copilot did and why.

---

## Speaker

**Shinya Yanagihara** -- Global Black Belt, Microsoft Corporation

Shinya works across Microsoft's developer tooling with GitHub at the centre, helping teams adopt AI-native development practices and driving the organisational culture change that makes them stick.
