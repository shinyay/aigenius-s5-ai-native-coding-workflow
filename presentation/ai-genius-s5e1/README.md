# AI Genius S5E1 Slide Deck

English | [日本語](README.ja.md)

This directory is the repository-managed source for the slide deck used during the AI Genius S5E1 demonstration.

The deck is intentionally stored as images so it can be presented directly inside the GitHub Copilot App through the project Canvas extension at `.github/extensions/ai-genius-presenter/`.

## Contents

```text
presentation/ai-genius-s5e1/
  ├── README.md
  ├── README.ja.md
  ├── deck.json
  └── slides/
      ├── slide-01.jpg
      ├── ...
      └── slide-10.jpg
```

- `deck.json` is the source of truth for slide order and display titles.
- `slides/` contains the 1280×720 JPEG exports.
- `sourceFile` records the original PowerPoint export filename.
- `sha256` records the expected checksum of each repository image.

The Canvas does not read the original OneDrive directory at runtime.

## Presenting in GitHub Copilot App

1. Open this repository as a project in GitHub Copilot App.
2. Start or resume a session after the project extension has loaded.
3. Ask Copilot: `Open the AI Genius Slide Presenter canvas.`
4. Present from the Canvas using the controls or keyboard shortcuts below.

You can also ask Copilot to move the presentation, for example:

- `Go to slide 5 in the AI Genius presentation.`
- `Advance the presentation to the next slide.`
- `Return to the first slide.`

## Controls

| Input | Action |
|---|---|
| `ArrowRight`, `PageDown`, `Space` | Next slide |
| `ArrowLeft`, `PageUp` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `T` | Toggle thumbnails |
| `F` | Enter fullscreen or Canvas presentation mode |
| `Escape` | Exit fullscreen or presentation mode |

The fullscreen control first requests the browser Fullscreen API. If the host does not allow it, the viewer falls back to a Canvas presentation mode that hides the thumbnail rail and persistent controls.

## Updating the Deck

1. Export replacement slides as 1280×720 JPEG files.
2. Replace the corresponding normalized files in `slides/`.
3. Update the title or original filename in `deck.json` when needed.
4. Recalculate the SHA-256 value and update `deck.json`.
5. Reload the extension and open the Canvas to verify navigation and image quality.

PowerShell checksum example:

```powershell
(Get-FileHash -Algorithm SHA256 .\slides\slide-01.jpg).Hash.ToLowerInvariant()
```

Keep slide numbers contiguous and starting at 1. The presentation order comes from `deck.json`, not directory enumeration.
