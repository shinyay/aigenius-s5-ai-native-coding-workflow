# Copilot App Developer Experience Guide

English | [日本語](README.ja.md)

[Open the HTML source](index.html) for the Japanese, scroll-based audience guide to GitHub Copilot App. The core message is not faster code generation alone, but delegating work, inspecting evidence, and retaining human judgment.

## Contents

- A central thesis and the task-based development loop
- Six changes in developer experience, each with an example, a speaking line, and a caveat
- The different roles of the app, cloud agent, Codespaces, Chat, CLI, and github.com
- A reusable review-and-iteration framework based on acceptance criteria, edge cases, invariants, and evidence-backed feedback
- Boundaries, practical takeaways, and public sources

`index.html` is the maintained source and the distributable artifact. It contains its own CSS and JavaScript and requires no build, package installation, CDN, external font, authentication, or API connection.

## View the guide

After cloning the repository, open `presentation\copilot-app-dx\index.html` in a browser. GitHub's file viewer displays source; it is not a hosted preview of the HTML.

In GitHub Copilot App, ask:

```text
Open presentation\copilot-app-dx\index.html in a Browser Canvas.
```

Use the existing **Browser** canvas, not the **AI Genius Slide Presenter** canvas. This guide is not a new Canvas extension and does not modify the slide deck.

If the host cannot open local files, serve only this directory on loopback. From the repository root in PowerShell:

```powershell
uv run --no-project python -m http.server 8765 --bind 127.0.0.1 --directory ".\presentation\copilot-app-dx"
```

Then open `http://127.0.0.1:8765/` in Browser Canvas. If port 8765 is already in use, choose another unused port; do not stop an unrelated process. Keep the server attached to the terminal and press Ctrl+C when finished. No GitHub Pages or public deployment is needed.

## Reading controls

- The table of contents follows the page on wide screens and collapses on narrower screens.
- Supplementary explanations and speaking lines use native disclosure controls.
- Copy buttons copy speaking lines and prompts. If the Clipboard API is unavailable, the guide selects the text and explains how to copy manually.
- The page follows the OS theme unless `?scoutTheme=light` or `?scoutTheme=dark` is supplied. The theme button changes the current view without writing browser storage.
- Printing expands supplementary content and removes navigation controls.
- All main content remains readable with JavaScript disabled.

The design uses a GitHub-inspired information hierarchy with the shared Clawpilot light/dark theme tokens and a restrained rose accent. It is not an exact reproduction of GitHub's official palette or an official GitHub publication.

## Update safely

Edit `index.html` directly. Keep all runtime dependencies inside the file. Use `var(--cp-*)` color tokens for component styling, preserve accessible names and heading order, and ensure disclosure and copy controls continue to work with keyboard navigation.

Label product behavior, workshop instructions, and presentation recommendations separately. Update the source links and reference date when product claims change. Keep review guidance reusable: connect acceptance criteria, evidence, expected behavior, and a reproduction or test instead of documenting one execution history.

Do not embed private repository URLs, tokens, local absolute paths, or live GitHub operations. Public source links open only when a reader follows them; reading and basic interactions work offline.

After editing, inspect light and dark themes, wide and narrow layouts, navigation, copying (including the manual fallback), and print output in the browser. The existing Python starter app and slide presenter are outside this artifact's scope.
