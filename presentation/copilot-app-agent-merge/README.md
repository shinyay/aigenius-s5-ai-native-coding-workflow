# Agent Merge Companion Guide

English | [日本語](README.ja.md)

The [single-file HTML artifact](index.html) explains Copilot App's Agent Merge, its workflow, practical use cases, and the decisions people retain. Japanese is the default; an **English** toggle and URL language setting are available.

The central message is "Set the conditions. Delegate the finish." This is a standalone companion to the [Copilot App DX guide](../copilot-app-dx/README.md). It does not change the core workshop's human-operated final review and manual merge.

## Contents

- A handoff diagram separating people, the agent, and GitHub
- A conceptual loop from review, CI, and conflict work through to landing
- A schematic walkthrough from My work to the PR workspace and Agent merge
- Five fictional PR simulations
- Concrete use cases and situations where delegation through to merging is inappropriate
- Required checks, approvals, reapproval after changes, permissions, and deployment impact
- A copyable speaker takeaway, public references, and brand and font attribution

## Open the guide

After cloning the repository, open `presentation\copilot-app-agent-merge\index.html` in a browser. GitHub's file viewer shows HTML source, not a hosted preview.

In GitHub Copilot App, ask:

```text
Open presentation\copilot-app-agent-merge\index.html in a Browser Canvas.
```

Use the existing Browser Canvas. No new canvas extension or slide-presenter change is needed.

Only if the host cannot open local HTML, serve the shared `presentation` directory on loopback so both sibling guides are reachable. From the repository root in PowerShell:

```powershell
uv run --no-project python -m http.server 8765 --bind 127.0.0.1 --directory ".\presentation"
```

Open `http://127.0.0.1:8765/copilot-app-agent-merge/` for this guide or `http://127.0.0.1:8765/copilot-app-dx/` for the DX guide in Browser Canvas. Do not serve just one guide directory or the whole repository root. If the port is occupied, choose a free one without stopping unrelated processes. Keep the server attached and stop it with Ctrl+C in its terminal. GitHub Pages or another public deployment is not required.

## Moving between guides

The shared **DX guide / Agent Merge [Companion]** header links open the beginning of each guide in the same Canvas or browser tab. The underlined current-guide link returns to this page's beginning. The DX link in the workshop chapter opens its boundaries chapter; the link after the DX automation explanation returns to this companion's capabilities chapter. Browser Back and Forward remain native navigation.

With JavaScript enabled, only the fixed cross-guide links carry the displayed `lang=ja|en` and `scoutTheme=light|dark`. They update after language/theme controls or an applicable OS theme change. Unrelated query values and simulation data are not forwarded. Valid URL language settings are applied after the translation catalog is prepared; missing or invalid language defaults to Japanese, and missing or invalid theme follows the OS. If English is unavailable, the visible error remains and links carry Japanese.

Reloading uses the current URL settings, not the last control selection: the controls do not rewrite that URL. Without valid URL settings, reloading starts in Japanese with the OS theme. Reloading resets the simulation to the first scenario. No cookies, localStorage, sessionStorage, or other browser-storage writes are used. Simulation progress is not transferred between documents, and ordinary browser history restoration is not overridden.

## Reading and simulation controls

| Control | Behavior |
|---|---|
| Japanese / English | Switch content, diagram labels, controls, dynamic state, accessible labels, and metadata |
| Theme button | Change light/dark for the current page |
| Chapter navigation | Jump to a chapter; collapses on narrow screens |
| Scenario selection | Open the initial state of the selected fictional PR |
| Next step | Advance the learning model once; there is no autoplay |
| Simulate human approval | Add a fictional human approval for the current commit when appropriate |
| Reset | Reset only the selected scenario |
| Copy speaker takeaway | Copy the current language; select text and explain manual copying if clipboard access is unavailable |
| Print | Expand supporting details and print the current language without interactive controls |

Language and theme changes within the page preserve the selected scenario, its progress, and any simulated approval for the current commit.

The initial theme follows the OS unless `?scoutTheme=light` or `?scoutTheme=dark` is supplied. With JavaScript disabled, Japanese content, diagrams, relative cross-guide links, and native disclosures remain available in the default light appearance. URL display settings are not applied; language/theme/print buttons and the simulation are unavailable. The browser's own print command still works.

## The five scenario assumptions

| Scenario | Lesson |
|---|---|
| Already ready | If nothing needs fixing, landing is the main remaining action |
| Review feedback | A fix changes the commit and requires fresh CI and human approval |
| Failing CI | Repair the cause and obtain a passing result for the current commit |
| Conflict resolution | Do not reuse an earlier success as evidence for the new evaluated state |
| Required approval | Next step cannot bypass the boundary; an explicit simulated human approval is needed |

All scenarios require a passing pytest result. Ready, review, and approval-waiting scenarios also require human approval. CI and conflict scenarios explicitly demonstrate a policy without a required approving review.

Checks and approvals are associated with fictional commit identifiers. Failure, pending checks, stale evidence, unresolved feedback, conflicts, or missing required approval cannot advance the model to Merged.

**The guide does not connect to GitHub.** Its states, history, approvals, and Merged display are fictional. It does not reproduce internal product implementation, timing, or success guarantees. It never enables real Agent Merge, creates PRs, comments, approves, pushes, or merges.

## Brand and distribution

`index.html` is the maintained source. CSS, JavaScript, inline SVG, English translations, and Mona Sans are embedded. No build, CDN, external font host, authentication, or analytics is needed. Each HTML can be read alone. For reciprocal navigation, distribute `copilot-app-dx` and `copilot-app-agent-merge` as sibling folders, each containing its `index.html`. Keep this relative layout with either `file://` or the shared HTTP root above. Public reference links require a network connection.

The design references the same [GitHub Brand Toolkit Copilot Theme](https://brand.github.com/foundations/color) as the DX guide. It retains shared `--cp-*` tokens with a page-scoped brand mapping. White, black, and neutrals ground restrained green and purple accents. Text and shape communicate roles alongside color.

| Font provenance | Value |
|---|---|
| Upstream | [github/mona-sans](https://github.com/github/mona-sans) |
| Pinned revision | `0f7dc66ddd766605eb0e75c3f47bf9d1dd38ceca` |
| Source file | `fonts/webfonts/variable/MonaSansVF[opsz,wght].woff2` |
| Unmodified size | 137,252 bytes |
| SHA-256 | `62e40f6e14e5bbb97132b4513a4d97319ab6aaa46996cf46c7a9f357edadb662` |
| License | SIL Open Font License 1.1 / The Mona Sans Project Authors |

The embedded font is the same unmodified asset used by the DX guide. Preserve `style#embedded-font` together with the copyright notice and full license in `#font-license`.

## Maintenance

Static Japanese text in `data-i18n` elements is the original content. English is stored in `#english-translations` under `strings`. Accessible labels use `data-i18n-aria`. Translation targets must be text leaves; split targets when inline formatting is needed.

Update dynamic messages in both `jaUI` and the English catalog's `ui`. Missing, extra, or inconsistent keys are detected on initialization, disabling English with a visible explanation. Translations are applied as text, never executed as HTML.

Cross-guide destinations are fixed in the navigation code. Translate link text and accessible names without letting the catalog supply destinations or copying arbitrary query parameters.

The simulation is defined by `scenarios` and tracked in `state`. Preserve the `evidenceReady`, `canMerge`, and `canApprove` conditions. When changing a scenario, update its explanatory text and policy assumptions together. Never silently carry simulated approval to a different commit.

After changes, exercise all five scenarios, language round-trips, light/dark, narrow layouts, keyboard interaction, reduced motion, clipboard and manual fallback, print, and the no-JavaScript view. Keep runtime operations offline and the HTML within 400KiB, including the font and license.

Distinguish publicly documented behavior, observed UI schematics, and suggested use cases. Update source references and the consulted date with product changes. Do not guess undocumented default merge methods or execution intervals.
