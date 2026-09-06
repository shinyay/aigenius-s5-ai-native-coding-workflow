# AI Genius S5E1 スライドデッキ

[English](README.md) | 日本語

このディレクトリは、AI Genius S5E1のデモンストレーションで使用するスライド画像の正本です。

PowerPointとGitHub Copilot Appを切り替えずに発表できるよう、スライドを画像として管理し、`.github/extensions/ai-genius-presenter/`のProject Canvas extensionから表示します。

## ファイル構成

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

- `deck.json`がスライドの順序と表示タイトルの正本です。
- `slides/`には1280×720のJPEG画像を格納します。
- `sourceFile`にはPowerPointから書き出した元のファイル名を記録します。
- `sha256`にはリポジトリ内画像の期待するchecksumを記録します。

Canvasは実行時に元のOneDriveディレクトリを参照しません。

## GitHub Copilot Appで発表する

1. GitHub Copilot Appで、このリポジトリをProjectとして開きます。
2. Project extensionが読み込まれた状態で、sessionを開始または再開します。
3. Copilotへ「AI Genius Slide PresenterをCanvasで開いて」と依頼します。
4. Canvas上のボタンまたはキーボードでスライドを操作します。

Copilotへ次のように依頼して、スライドを操作することもできます。

- 「AI Geniusのプレゼンテーションを5枚目へ移動して」
- 「次のスライドへ進めて」
- 「最初のスライドへ戻して」

## 操作方法

| 入力 | 動作 |
|---|---|
| `ArrowRight`、`PageDown`、`Space` | 次のスライド |
| `ArrowLeft`、`PageUp` | 前のスライド |
| `Home` | 最初のスライド |
| `End` | 最後のスライド |
| `T` | サムネイルの表示切り替え |
| `F` | 全画面またはCanvas内presentation mode |
| `Escape` | 全画面またはpresentation modeを終了 |

全画面ボタンは、最初にブラウザーのFullscreen APIを要求します。ホスト側で許可されない場合は、サムネイルと常設操作を隠してCanvas領域を最大限使用するpresentation modeへ切り替わります。

## スライドを更新する

1. 差し替えるスライドを1280×720のJPEGとして書き出します。
2. `slides/`内の対応するファイルを置き換えます。
3. 必要に応じて`deck.json`のタイトルと元ファイル名を更新します。
4. SHA-256を再計算し、`deck.json`の`sha256`を更新します。
5. extensionを再読み込みし、Canvasでスライド順と画質を確認します。

PowerShellでchecksumを確認する例:

```powershell
(Get-FileHash -Algorithm SHA256 .\slides\slide-01.jpg).Hash.ToLowerInvariant()
```

スライド番号は1から始まる連番にします。表示順はディレクトリの並びではなく`deck.json`で管理します。
