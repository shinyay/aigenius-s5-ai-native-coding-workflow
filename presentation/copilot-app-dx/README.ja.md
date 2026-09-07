# Copilot App Developer Experience ガイド

[English](README.md) | 日本語

GitHub Copilot Appの価値を、オーディエンス向けに日本語で読み解く[スクロール型HTMLガイド](index.html)です。中心に据えるのは、コード生成の速さだけでなく、仕事の委譲、根拠の確認、人間による採用判断です。

## 内容

- 伝えたい主題と、タスクを中心とした開発ループ
- 具体例、話す一言、注意点を添えた6つのDeveloper Experienceの変化
- App、cloud agent、Codespaces、Chat、CLI、github.comの役割分担
- 受入条件、境界値、不変条件、根拠付きフィードバックを使うレビューと反復の判断方法
- 過大に伝えないための境界、持ち帰る実践、公開出典

`index.html`が管理する原本であり、そのまま配布できるArtifactです。CSSとJavaScriptを内包し、ビルド、パッケージ導入、CDN、外部フォント、認証、API接続を必要としません。

## 表示方法

リポジトリをcloneした後、`presentation\copilot-app-dx\index.html`をブラウザーで開きます。GitHubのファイル閲覧画面はHTMLのソース表示であり、ホストされたプレビューではありません。

GitHub Copilot Appでは、次のように依頼します。

```text
presentation\copilot-app-dx\index.htmlをBrowser Canvasで表示してください。
```

既存の**Browser** Canvasを使います。**AI Genius Slide Presenter**用Canvasとは別で、この資料は新しいCanvas extensionではありません。既存のスライドも変更しません。

ホストがローカルファイルを開けない場合は、このディレクトリだけをloopbackで公開します。リポジトリルートのPowerShellで次を実行します。

```powershell
uv run --no-project python -m http.server 8765 --bind 127.0.0.1 --directory ".\presentation\copilot-app-dx"
```

その後、Browser Canvasで`http://127.0.0.1:8765/`を開きます。8765番ポートが使用中なら別の未使用ポートを選び、無関係のプロセスは停止しません。サーバーはターミナルに紐づけたまま使い、終了時はCtrl+Cで停止します。GitHub Pagesや外部への公開は不要です。

## 閲覧操作

- 目次は広い画面で追従し、狭い画面では折り畳みになります。
- 補足説明や話す一言は、標準の開閉操作で展開できます。
- コピーボタンで一言やプロンプトをコピーできます。Clipboard APIが使えない場合は本文を選択し、手動コピーの方法を表示します。
- OSのテーマに追従します。`?scoutTheme=light`または`?scoutTheme=dark`で指定でき、テーマボタンは表示中のページだけを切り替えます。ブラウザーの保存領域へは書き込みません。
- 印刷時は補足を展開し、ナビゲーションを非表示にします。
- JavaScriptが無効でも主要本文は読めます。

デザインはGitHub風の情報階層と、共通のClawpilot light/darkテーマ変数、控えめなローズ系アクセントを組み合わせています。GitHub公式配色の厳密な再現や、GitHub公式資料ではありません。

## 更新時の注意

`index.html`を直接編集し、実行時の依存はファイル内で完結させます。コンポーネントの色には`var(--cp-*)`を使い、操作名・見出し階層・キーボード操作を維持してください。

製品の仕様、ワークショップの手順、発表上の提案を区別します。製品説明を更新するときは出典と参照日も更新します。レビューの説明は、特定の実行履歴ではなく、受入条件、根拠、期待する動作、再現手順またはテストを結び付ける再利用可能な内容にします。

PrivateリポジトリURL、トークン、ローカル絶対パス、GitHubへの実操作は埋め込みません。公開出典へは読者がリンクを開いた場合だけ接続します。閲覧と基本操作はオフラインで使えます。

変更後はブラウザーでlight/dark、広い画面と狭い画面、目次、コピーと手動フォールバック、印刷表示を確認します。既存のPythonスターターアプリやスライドプレゼンターは変更対象外です。
