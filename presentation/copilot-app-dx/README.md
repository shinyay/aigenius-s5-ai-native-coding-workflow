# Copilot App Developer Experience Guide

English | [日本語](README.ja.md)

[Open the HTML source](index.html) for the Japanese/English, scroll-based audience guide to GitHub Copilot App. The core message is not faster code generation alone, but delegating work, inspecting evidence, and retaining human judgment.

## Contents

- A central thesis and the task-based development loop
- Six changes in developer experience, each with an example, a speaking line, and a caveat
- The different roles of the app, cloud agent, Codespaces, Chat, CLI, and github.com
- A reusable review-and-iteration framework based on acceptance criteria, edge cases, invariants, and evidence-backed feedback
- Three static diagrams: product roles, the review/repair loop, and independent merge prerequisites
- Boundaries, practical takeaways, and public sources

`index.html` is the maintained source and the distributable artifact. It contains its own CSS, JavaScript, and Mona Sans webfont and requires no build, package installation, CDN, externally hosted font, authentication, or API connection.

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

- Use **日本語 / English** in the header to switch the whole guide, including diagrams, controls, and accessible names. Every page load starts in Japanese; the selection lasts only until the page is reloaded. It is not stored or inferred from browser language settings.
- English mode copies English speaking lines and prompts ending in `Answer in English.` and links to the English exercise READMEs. Japanese mode restores the original text, `Answer in Japanese.`, and Japanese links.
- Switching languages preserves the theme, disclosure state, keyboard focus, and the nearby reading location. It clears old copy notifications without modifying the clipboard.
- The table of contents follows the page on wide screens and collapses on narrower screens.
- Supplementary explanations and speaking lines use native disclosure controls.
- Copy buttons copy speaking lines and prompts. If the Clipboard API is unavailable, the guide selects the text and explains how to copy manually.
- The page follows the OS theme unless `?scoutTheme=light` or `?scoutTheme=dark` is supplied. The theme button changes the current view without writing browser storage.
- Printing expands supplementary content and removes navigation controls.
- Printing uses the currently displayed language.
- With JavaScript disabled, the Japanese guide and native disclosures remain available; the language toggle is hidden.

## Updating translations

The original Japanese markup supplies the initial content and the text restored when switching back. English is embedded as JSON in `#english-translations`; there is no translation API or external catalog to load.

Each catalog entry has a stable `key`, a `selector` matching exactly one element, and translated `html`, `attributes`, or both. Initialization binds these entries to the existing elements and records their Japanese content, rather than duplicating the page. Runtime `data-i18n` attributes identify the bindings.

When updating content, edit the Japanese markup and its English entry together. Update selectors if the markup structure changes. Keep translation targets non-overlapping, preserve IDs and controls, and use only the supported inline formatting: `strong`, `code`, `br`, `span`, and `a`. The renderer validates inline attributes and links before use. Keep JSON valid and encode `<` as `\u003c` in the embedded catalog.

Dynamic interface messages use the matching keys in `japaneseUI` and the catalog's `ui` object. Maintain the English document metadata and language-specific `href` values as well. Product names, commands, font data, and the English OFL license are not translated.

The guide checks the English result in a detached DOM before enabling it. Missing text, inaccessible labels, invalid markup, ambiguous selectors, or untranslated Japanese document links disable English and show an explicit error, while leaving the Japanese guide usable.

## Copilot Theme

The visual design follows the [GitHub Brand Toolkit](https://brand.github.com/), particularly [Color / Copilot Theme](https://brand.github.com/foundations/color), [Copilot identity](https://brand.github.com/brand-identity/copilot), and [Typography](https://brand.github.com/foundations/typography). It is a workshop guide, not an official GitHub product publication or a replica of the app UI.

The page is mostly white, black, and neutral surfaces. Purple identifies Copilot-related emphasis; green maintains the connection to GitHub. The color artwork is a reference for balance, not a pixel-percentage requirement. The colors remain behind the content, rather than turning the entire page into a purple campaign.

| Role | Light | Dark |
|---|---|---|
| Main surface / text | `#FFFFFF` / `#101411` | `#101411` / `#FFFFFF` |
| Supporting surface | `#F2F5F3` | `#232925` |
| Copilot emphasis and links | Purple 3 `#8534F3` | Purple 1 `#C898FD` |
| Green text and diagram details | Green 5 `#08872B` | GitHub Green `#0FBF3E` |
| Primary action | White on Purple 3 `#8534F3` | White on Purple 3 `#8534F3` |

All component colors use the existing `--cp-*` token interface. The official swatches and derived neutral/soft colors are mapped locally in this HTML; this does not modify any other artifact's theme. GitHub Green is not used for small white-on-green text because that combination has insufficient contrast.

The opening shows the handoff between human judgment and agent work. A connected six-stage workflow and six illustrated value units replace a uniform grid of cards. Green for humans and purple for agents are this guide's diagram legend, not an official GitHub semantic rule. Labels and shapes also communicate the roles.

The product-role map, review loop, and merge-prerequisite diagram use CSS and inline SVG. Labels remain HTML text so they can reflow instead of shrinking on narrow screens. The figures explain relationships; they do not display live PR state or provide interactive controls. In particular, thread resolution, leaving draft, and satisfying repository rules are independent prerequisites, not interchangeable actions or an automatic merge sequence.

### Typography and embedded font

Latin text uses the unmodified, standard-width Mona Sans variable webfont. Japanese uses system CJK fallbacks; code retains a system monospace font. Do not substitute condensed/expanded variants, introduce decorative ligatures, or artificially track the headings.

| Font provenance | Value |
|---|---|
| Repository | [github/mona-sans](https://github.com/github/mona-sans) |
| Pinned revision | `0f7dc66ddd766605eb0e75c3f47bf9d1dd38ceca` |
| Original file | `fonts/webfonts/variable/MonaSansVF[opsz,wght].woff2` |
| Original size | 137,252 bytes |
| SHA-256 | `62e40f6e14e5bbb97132b4513a4d97319ab6aaa46996cf46c7a9f357edadb662` |
| License | SIL Open Font License 1.1; copyright The Mona Sans Project Authors |

The font is a data URL in `style#embedded-font`. Its copyright and complete OFL text are included in the guide's `#font-license` disclosure, so they travel with the single HTML file.

To update the font:

1. Retrieve the standard-width WOFF2 and OFL from the same explicit upstream revision. Record that revision, the original file size, and its SHA-256; do not silently follow upstream `main`.
2. Base64-encode the unmodified WOFF2 into `style#embedded-font` and update the complete copyright/license text in `#font-license`. Do not modify or subset the font.
3. Update the provenance in both READMEs, and keep the complete HTML under 400 KiB. Runtime font loading must remain offline.

## Update safely

Edit `index.html` directly. Keep all runtime dependencies inside the file. Use `var(--cp-*)` color tokens for component styling, preserve chapter IDs, accessible names, and heading order, and ensure disclosure and copy controls continue to work with keyboard navigation.

Label product behavior, workshop instructions, and presentation recommendations separately. Update the source links and reference date when product claims change. Keep review guidance reusable: connect acceptance criteria, evidence, expected behavior, and a reproduction or test instead of documenting one execution history.

Do not embed private repository URLs, tokens, local absolute paths, or live GitHub operations. Public source links open only when a reader follows them; reading and basic interactions work offline.

After editing, inspect light and dark themes, wide and narrow layouts, navigation, copying (including the manual fallback), and print output in the browser. The existing Python starter app and slide presenter are outside this artifact's scope.
