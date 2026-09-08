# AI Genius Episode 1: Workshop Repo

[English](README.md) | 日本語

![TitlePage](./assets/AI-Genius-Ep1.png)

## 「AIとコードを書く：GitHub CopilotによるAIネイティブ開発ワークフロー」

このリポジトリは、**AI Genius Episode 1** のハンズオンワークショップで使用する教材です。

ここで学ぶのは、GitHub Copilotにコードを書かせるためのテクニックだけではありません。アイデアをIssueとして具体化し、Copilot coding agentへ実装を委譲し、生成されたPull Request（PR）を人間がレビューし、コメントを通じて改善する一連の開発ループを体験します。

AIに作業を任せても、設計や品質に対する責任まで手放すわけではありません。このワークショップでは、皆さんが**技術リード**として「何を、なぜ作るのか」「何をもって完成とするのか」を定義し、Copilotが実装を進めます。

---

## このワークショップで身につけること

- 開発者にとっての「AIネイティブ」が何を意味するか理解する
- Copilotが迷わず実装できる、具体的なIssueを書く
- IssueをCopilotへ割り当て、エージェントの作業内容を観察する
- Copilotが生成したPRを、シニアエンジニアの視点でレビューする
- 作り直しではなく、PRコメントを使って段階的に改善する
- オプション演習では、クラウドSDKや認証情報を含む変更を、安全性を意識してレビューする

---

## AIネイティブ開発の基本ループ

```text
アイデア
  └─► GitHub Issueで目的と完了条件を定義
        └─► Copilotへ割り当て
              └─► 制限された一時環境で実装とテスト
                    │   （実際のアクセス範囲は構成に依存）
                    └─► 作業要約付きのDraft PRを作成
                          │   （詳細はView sessionで確認）
                          └─► 人間がレビューし、PRコメントで改善
                                └─► 人間が最終確認し、ルールに従ってマージ
```

このループで人間が担うのは、単なる承認作業ではありません。

- **上流:** 課題、利用者、期待する動作、制約を明確にする
- **実装中:** エージェントがどのように理解し、何を変更しているか観察する
- **下流:** 正確性、セキュリティ、保守性、テストを判断する

Copilotは実装の速度を高めますが、何を作るべきか、変更を採用してよいかを判断するのは人間です。

---

## 演習で使うアプリ：Task Manager CLI

`starter-app` は、仕事や日常のToDoをターミナルから管理する、Python製のコマンドライン（CLI）アプリです。Web画面ではなく、`python app.py ...` というコマンドでタスクを操作します。

### 現在できること

| コマンド | できること |
|---|---|
| `add` | タスクを追加し、説明・優先度・タグ・期限を設定する |
| `list` | タスクを一覧表示し、完了状態・優先度・タグ・期限切れで絞り込む |
| `complete` | IDを指定してタスクを完了にする |
| `edit` | IDを指定してタスクの名前・説明・優先度・タグ・期限を変更する |
| `delete` | IDを指定してタスクを削除する |
| `stats` | 全件数・完了数・未完了数・期限切れ数と、優先度別の未完了数を表示する |

各タスクはIDと名前を持ち、説明、優先度（`low`・`medium`・`high`）、複数のタグ、期限（`YYYY-MM-DD`）、完了状態、作成日時を保存します。期限を過ぎた未完了タスクは、一覧で赤い **Overdue** として表示されます。

セットアップ後、`starter-app` ディレクトリで `python app.py --help` を実行するとコマンド一覧を、`python app.py add --help` などを実行すると各コマンドのオプションを確認できます。

### データの保存先

タスクは、`starter-app` ディレクトリの `app.py` と同じ場所にある **`tasks.json`** にJSON形式で保存されます。最初のタスク登録時にファイルが作成され、次のコマンド実行でも同じデータを読み込みます。Codespacesで動かす場合は、そのCodespace内に保存されます。

初期状態のアプリはAzureやAIサービスへ接続しません。アプリの実行にAzureリソースやAPIキーは不要で、GitHub Copilotはこのアプリを開発・改善するために使います。

### 演習での役割

このワークショップは、ゼロからアプリを生成するのではなく、**動作する既存アプリへ、今ある機能を壊さずに新しい機能を追加する**演習です。まず現在の動作を理解し、追加したい機能をIssueへ具体化します。その後、Copilotへ実装を委譲し、PRのレビューと改善を通じて変更を採用するか判断します。

---

## セットアップ

### 必要なもの

- GitHub Copilotを利用できるGitHubアカウント
- [GitHub Copilot App](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app)をインストールし、GitHubへサインイン済みであること
- Python 3.10以降
- Git

### はじめ方

1. GitHub上でこのリポジトリを自分のアカウントへ**Fork**します。

2. Forkしたリポジトリをローカルへクローンします。

   ```bash
   git clone https://github.com/YOUR-USERNAME/aigenius-s5-ai-native-coding-workflow.git
   cd aigenius-s5-ai-native-coding-workflow
   ```

3. スターターアプリで2件のタスクを登録し、一覧と統計を表示します。

   ```bash
   cd starter-app
   pip install -r requirements.txt
   python app.py add "APIをデプロイする" --priority high --due 2025-12-31 --tag work
   python app.py add "コーヒーを買う" --priority low --tag personal
   python app.py list
   python app.py stats
   ```

   タスクがない状態でこの例を1回実行すると、合計2件・未完了2件になります。実行日が `2025-12-31` より後であれば、「APIをデプロイする」は **Overdue** になります。期限切れは未完了タスクの内数なので、この場合は **Pending 2件のうちOverdue 1件**という集計です。

4. GitHub Copilot Appを開き、Forkしたリポジトリを利用できる状態にします。

5. [Exercise 01：実装につながるIssueを書く](./exercises/01-write-an-issue/README.ja.md)から、コアのExercises 01〜04を順番に進めます。中核の開発ループを完了した後、希望する場合は[オプション Exercise 05](./exercises/05-azure-and-ai/README.ja.md)でAzureとAIの課題へ進みます。

---

## 自動テスト（CI）

[Starter app testsワークフロー](./.github/workflows/tests.yml)は、Draftを含む`main`向けのPRと、`main`へのpushで実行されます。PRの更新、再オープン、Ready for reviewへの変更でも実行し、ドキュメントだけの変更も対象にします。

CIは`starter-app/requirements.txt`から依存関係を導入し、Ubuntu上の**Python 3.10と3.14**で既存のpytestテストを実行します。バージョンごとに独立したチェックを報告し、片方の失敗で他方を中止しません。テストは保存済みのタスクではなく、隔離したタスクファイルを使用します。

セットアップ後は、`starter-app`ディレクトリで同じテストを実行できます。

```bash
python -m pytest -q
```

PRの**Checks**タブ、またはリポジトリの**Actions**タブにある**Starter app tests**を開き、最新のPR変更に対する`pytest (Python 3.10)`と`pytest (Python 3.14)`の成功を確認します。PRでの実行はGitHubの一時的なマージコミットをテストするもので、`main`を更新する操作ではありません。

**Copilotのセッション内テストと、PRのチェックは別です。** エージェントの作業が成功しても、このCIの結果を確認する代わりにはなりません。

Copilotが作成したPRでは、書き込み権限を持つ利用者による**Approve and run workflows**が必要になる場合があります。ワークフローと実行対象のコードを読んでから実行を許可してください。これはPRを**Approve**する承認レビューとは別です。チェックが表示されない場合は、このワークフローが実行承認待ちになっていないかを確認します。

このワークフローは、必須チェックやブランチ保護の設定、承認レビュー、PRのマージを行いません。

---

## GitHub Copilot Appでスライドを表示する

このリポジトリには、PowerPointへ切り替えずにAI Genius S5E1のスライド画像を表示するProject Canvas extensionが含まれています。

1. GitHub Copilot Appでこのリポジトリを開きます。
2. Project extensionが読み込まれた状態でsessionを開始します。
3. Copilotへ「AI Genius Slide PresenterをCanvasで開いて」と依頼します。
4. Canvas上のボタン、サムネイル、キーボードで発表します。

前後移動、サムネイルからの直接選択、スライド番号、全画面表示に対応します。ホスト側でFullscreen APIが許可されない場合は、Canvas内presentation modeへ切り替わります。

操作方法と画像の更新手順は[`presentation/ai-genius-s5e1`](./presentation/ai-genius-s5e1/README.ja.md)を参照してください。

## Copilot AppのDeveloper Experienceを読み解く

[日英切り替え対応のHTML DXガイド](./presentation/copilot-app-dx/README.ja.md)では、伝えたい主題、6つのDeveloper Experienceの変化、製品の役割分担、採用判断につなげるレビューと反復の進め方を説明しています。**日本語 / English**で本文・図解・プロンプト・演習リンクを切り替えられます。単一ファイルのスクロール型Artifactで、既存スライドとは独立してローカルブラウザーや**Browser Canvas**で表示できます。

---

## 演習の流れ

| 区分 | 演習 | 学ぶこと |
|---|---|---|
| コア | [Exercise 01](./exercises/01-write-an-issue/README.ja.md) | エージェントが実装できる問題、期待する動作、受入条件、制約、完了条件を書く |
| コア | [Exercise 02](./exercises/02-assign-to-copilot/README.ja.md) | IssueをCopilotへ委譲し、エージェントの調査、実装、テストを観察する |
| コア | [Exercise 03](./exercises/03-review-a-pr/README.ja.md) | 生成されたPRを正確性、品質、セキュリティ、依存関係、テストの有効性から確認する |
| コア | [Exercise 04](./exercises/04-iterate/README.ja.md) | 具体的なPRコメントで改善を依頼し、再レビューして人間が手動マージする |
| オプション | [オプション Exercise 05](./exercises/05-azure-and-ai/README.ja.md) | Azure Table StorageとAzure OpenAIを題材に、中核の開発ループをクラウドとAIへ拡張する |

Exercises 01〜04を完了すると、ワークショップの中核学習は完了です。オプション Exercise 05は、さらにクラウドとAIの課題へ進みたい人向けの追加演習です。

Exercise 01にはAzureを使用するOption AとBも含まれ、後続の実装には利用可能なAzure環境が必要です。Azure環境を必要としない中核学習を進める場合はOption CまたはDを選び、Option AとBはオプション Exercise 05まで保留できます。

---

## リポジトリ構成

```text
aigenius-s5-ai-native-coding-workflow/
  ├── README.md / README.ja.md
  ├── .github/
  │   ├── copilot-instructions.md
  │   ├── copilot-instructions.ja.md
  │   ├── workflows/
  │   │   └── tests.yml           # Python 3.10と3.14でpytestを実行
  │   ├── extensions/
  │   │   └── ai-genius-presenter/
  │   └── ISSUE_TEMPLATE/
  │       ├── feature-request.md
  │       └── feature-request-ja.md
  ├── exercises/
  │   ├── 01-write-an-issue/
  │   ├── 02-assign-to-copilot/
  │   ├── 03-review-a-pr/
  │   ├── 04-iterate/
  │   └── 05-azure-and-ai/         # オプション：Azure + OpenAI拡張
  ├── presentation/
  │   ├── ai-genius-s5e1/
  │   └── copilot-app-dx/          # 日英切り替え対応の自己完結HTML DXガイド
  └── starter-app/
      ├── app.py
      ├── requirements.txt
      └── tests/
```

各演習ディレクトリには、英語版の `README.md` と日本語版の `README.ja.md` があります。

---

## AIネイティブ開発の5つの原則

1. **Issueの質を高める**

   Issueはエージェントに渡す実装仕様です。曖昧な依頼ではなく、観察可能な完了条件を書きます。

2. **シニアエンジニアの視点でレビューする**

   AIは速く生成できますが、要件との整合性やリスクを判断するのは人間です。

3. **`copilot-instructions.md`で継続的な前提を共有する**

   技術選定、コーディング規約、テスト方針、秘密情報の扱いを毎回説明せずに済むようにします。

4. **再生成せず、具体的なフィードバックで改善する**

   すべてを捨ててやり直すのではなく、PRコメントを使って意図した方向へ段階的に近づけます。

5. **人間がループに残る**

   セッションログと差分を読み、理解できない点は質問し、最終的な採用判断を行います。

---

## Speaker

**Shinya Yanagihara** -- Global Black Belt, Microsoft Corporation

Microsoftで開発者ツールとGitHubを中心に、チームがAIネイティブな開発プラクティスを導入し、それを継続できる組織文化へつなげる活動を支援しています。
