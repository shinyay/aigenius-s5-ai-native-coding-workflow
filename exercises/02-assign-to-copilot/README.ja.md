# Exercise 02 -- IssueをCopilotへ割り当てる

[English](README.md) | 日本語

## この演習のゴール

Exercise 01で作成したIssueをCopilotへ委譲し、エージェントが要件を読み、リポジトリを調査し、実装とテストを進める過程を観察します。待ち時間にはCopilot ChatとCopilot CLIを使い、同じコードベースを別の角度から理解します。

**委譲は、放置ではありません。** 実装作業はCopilotへ任せても、目的、優先順位、品質基準、最終判断の責任は人間に残ります。この段階での役割は、先回りしてコードを書くことではなく、エージェントが正しい問題を解いているか確認できる材料を集めることです。

Copilot cloud agentは、既定では制限された一時環境で作業します。ただし、実際にアクセスできる範囲はランナー、ネットワークやファイアウォール、シークレット、MCPやその他のツール、ワークフローの権限や承認によって変わります。このワークショップでは本番環境へのアクセスを許可しません。実際のリポジトリで利用するときは、「一時環境だから安全」と決めつけず、これらの制御を確認してください。

---

## 演習

### Step 1 -- IssueをCopilotへ割り当てる

1. Exercise 01で作成したIssueを開きます。
2. 右側の **Assignees** パネルで歯車アイコンを選びます。
3. 一覧から **Copilot** を検索して選択します。
4. 表示された割り当てダイアログで、対象リポジトリとベースブランチを確認します。
5. 任意の`prompt`、`agent`、`model`、`reasoning level`が表示される場合は内容を確認し、必要な場合だけ変更します。
6. **Assign** を選びます。

👀リアクションはCopilotが割り当てを受け取った合図です。通常のIssueコメントが追加されるとは限りません。実際に作業が始まったことは、セッションの状態が **working** になっているか、**View session** を開いて確認します。

### Step 2 -- Agents / My Workでセッションを開く

1. **GitHub Copilot App** の **My Work** を開くか、リポジトリの **Agents** タブを開きます。
2. 作成したIssueに対応するセッションを探します。
3. 状態が **working** であることを確認し、**View session** を開きます。

大切なのは、Issue、セッション、Draft PRのつながりを追えることです。

### Step 3 -- エージェントの作業を観察する

すぐに介入せず、まず一連の流れを観察します。

- リポジトリを制限された一時環境へ複製する
- `copilot-instructions.md`や既存コード、テストを調査する
- Issueを作業手順へ分解する
- コードとテストを変更する
- テスト結果を確認する
- 完全な実行記録へ調査、コマンド、判断を残す
- 作業の要約を含むDraft PRを作成する

**My Workで見るポイント:**

- **Issueの理解:** 解決したい問題と受入条件を正しく要約できていますか？
- **調査の順序:** 変更前に既存実装、テスト、プロジェクトの規約を読んでいますか？
- **判断の根拠:** 採用した方法と、採用しなかった方法が実行記録から分かりますか？
- **検証:** 実行したテストコマンドと結果が記録されていますか？
- **変更範囲:** Issueと関係のないファイルまで変更していませんか？
- **状態の遷移:** 作業中、Draft PR作成、完了のどこにいるか追えますか？

作業量が多く見えることよりも、Issueに沿った調査と検証が行われていることを重視します。疑問点はメモしておき、PRの差分と完全な実行記録を読んでからフィードバックするのが効果的です。

### Step 4 -- Copilot Chatで理解を深める

エージェントがバックグラウンドで作業している間に、ローカルへ複製した`starter-app`を対象として、**VS Code** の **Copilot Chat** を開きます。必要に応じて`app.py`の関連コードを選択し、次を試します。

- `list`コマンドの実装を選択して`/explain in Japanese`を実行する
- `How does app.py store and load tasks? Answer in Japanese.`と質問する
- 必要に応じて`#project`を追加し、`What would I need to change to add a new field to a task? Answer in Japanese.`と質問する

これはタスク全体を委譲するAgent modeとは異なり、対話しながら自分の理解を深める使い方です。回答が一般論ではなく、選択したコードやリポジトリの文脈に基づいているか確認してください。

JetBrains IDEsやgithub.comでは、利用できるコマンドや文脈の付け方が異なります。他のクライアントを使う場合は、現在のUIから対象のリポジトリ、ファイル、コードを選択または添付してください。VS Codeの`/explain`や`#project`がそのまま使えるとは限りません。

### Step 5 -- Copilot CLIで調査する

[GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)がインストールされている場合は、リポジトリのルートで起動します。

```bash
copilot
```

起動後、次のプロンプトを1つずつ入力します。

CLIがコマンドを実行しようとする場合は、提案内容と対象ディレクトリを確認してから許可します。

1. 最初に、テストを実行して失敗を要約するよう依頼します。

```text
Run the starter-app tests and summarize any failures. Answer in Japanese.
```

テスト結果を確認してから次へ進みます。

2. 次に、`stats`コマンドの動作と、使われているコードパスを説明するよう依頼します。

```text
Explain what `python app.py stats` does and which code paths it uses. Answer in Japanese.
```

どちらのプロンプトでも、出力では成功・失敗の要約だけでなく、参照したファイルや実行したコマンドが妥当かを見ます。

---

## 振り返り

- Issueのどの記述をCopilotが作業計画へ反映しましたか？
- エージェントが行った判断のうち、PRで重点的に確認したいものは何ですか？
- **View session** の完全な実行記録から、実行したテストと変更理由を追跡できましたか？
- エージェント、Copilot Chat、Copilot CLIは、それぞれどの種類の作業に向いていると感じましたか？

---

## 次のステップ

Draft PRが作成されたら、[Exercise 03 -- Draft PRをレビューする](../03-review-a-pr/README.ja.md)へ進みます。
