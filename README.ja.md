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
- クラウドSDKや認証情報を含む変更を、安全性を意識してレビューする

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

3. スターターアプリを実行します。

   ```bash
   cd starter-app
   pip install -r requirements.txt
   python app.py add "APIをデプロイする" --priority high --due 2025-12-31 --tag work
   python app.py add "コーヒーを買う" --priority low --tag personal
   python app.py list
   python app.py stats
   ```

4. GitHub Copilot Appを開き、Forkしたリポジトリを利用できる状態にします。

5. [Exercise 01：実装につながるIssueを書く](./exercises/01-write-an-issue/README.ja.md)から順番に進めます。

---

## 演習の流れ

| 演習 | 学ぶこと |
|---|---|
| [Exercise 01](./exercises/01-write-an-issue/README.ja.md) | エージェントが実装できる粒度で、問題、期待する動作、受入条件を書く |
| [Exercise 02](./exercises/02-assign-to-copilot/README.ja.md) | IssueをCopilotへ委譲し、エージェントの探索と実装を観察する |
| [Exercise 03](./exercises/03-review-a-pr/README.ja.md) | 生成されたPRを正確性、品質、セキュリティ、テストの観点で確認する |
| [Exercise 04](./exercises/04-iterate/README.ja.md) | 具体的なPRコメントで改善を依頼し、再レビューしてマージする |
| [Exercise 05](./exercises/05-azure-and-ai/README.ja.md) | Azure Table StorageとAzure OpenAIを題材に、クラウドとAIの変更を安全に扱う |

---

## リポジトリ構成

```text
aigenius-s5-ai-native-coding-workflow/
  ├── README.md / README.ja.md
  ├── .github/
  │   ├── copilot-instructions.md
  │   ├── copilot-instructions.ja.md
  │   └── ISSUE_TEMPLATE/
  │       ├── feature-request.md
  │       └── feature-request-ja.md
  ├── exercises/
  │   ├── 01-write-an-issue/
  │   ├── 02-assign-to-copilot/
  │   ├── 03-review-a-pr/
  │   ├── 04-iterate/
  │   └── 05-azure-and-ai/
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
