# Exercise 04 -- PRコメントで改善する

[English](README.md) | 日本語

## この演習のゴール

Exercise 03のレビューコメントを起点に、Copilotと同じPR上で改善を重ねます。変更をすべて捨てて最初から生成し直すのではなく、問題を具体的に伝え、修正結果を再レビューし、マージできる品質へ近づけます。

Copilotは速く実装できますが、指示を文字どおりに解釈することがあります。人間は「何が不足しているか」だけでなく、「期待する動作」と「どう確認するか」まで伝えます。これが反復的なフィードバックです。

---

## 演習

### Step 1 -- Exercise 03のコメントを確認する

Draft PRへ戻り、Exercise 03で残したレビューコメントを開きます。修正依頼が次の3点を含むか確認します。

1. 現在のコードで観察した問題
2. 期待する動作
3. 修正を確認できるテストまたは再現手順

不足している場合は、追加コメントで条件を具体化します。

### Step 2 -- Copilotの応答を観察する

Copilotが作成したPRでは、書き込み権限を持つ利用者がレビューコメントを送信するとCopilotが応答します。複数の指摘がある場合は、すべてを1つのレビューへまとめてから送信してください。後続の特定の指摘へ対応を依頼する場合は、書き込み権限を持つ利用者が次のように`@copilot`を明示します。

> `@copilot この指摘に対応し、関連するテストも追加してください。`

GitHub Copilot appでコメントに **Fix** が表示される場合は、それを使うこともできます。ただし、すべてのコメントで **Fix** が利用できるわけではありません。

#### コメント操作を使い分ける

行コメントの入力欄に表示されるボタンは、それぞれ動作が異なります。

| ボタン | 使用する場面 | 動作 |
|---|---|---|
| **Add single comment** | 新しい指摘が1件だけで、すぐ投稿したい | コメントを即時投稿します。Copilot PRでは、ほかのファイルのレビューが終わる前にCopilotの作業が始まる可能性があります。 |
| **Start a review** | 複数の指摘をまとめて送る最初のコメント | コメントを保留し、レビューを送信するまで自分だけに表示します。 |
| **Add review comment** | すでに保留中のレビューへ指摘を追加する | 同じ保留中レビューへコメントを追加します。 |
| **Reply** | 既存のreview thread内で回答する | threadへ返信します。書き込み権限を持つ利用者の`@copilot`メンションは次のCopilotセッションを依頼します。実際に開始したことを別途確認します。 |
| **Resolve conversation** | 指摘が完全に解消されたことを確認した | threadを解決済みにします。レビュー送信、`Changes requested`の解除、Ready for Reviewへの変更は行いません。 |

複数ファイルをレビューするときは、**Start a review**と**Add review comment**で指摘をまとめ、最後に1回だけレビューを送信します。これにより、レビュー途中の個別コメントごとにCopilotセッションが始まることを防げます。

レビューまたは`@copilot`の追加依頼を送信した後は、👀リアクションまたはCopilotが作業を開始したtimeline eventを確認します。次に**View session**またはリポジトリの**Agents**タブを開き、状態が**working**になったことを確認したうえで、次を観察します。

- フィードバックをどのように解釈したか
- どのファイルを変更したか
- 指摘された変更だけでなくテストも更新したか
- 実行したテストコマンドと結果
- コメントへ回答できているか

委譲後も、修正されたという通知だけで完了と判断しません。最初の実装と同じように、差分と検証結果を確認します。

### Step 3 -- 更新された差分を再レビューする

新しいコミットまたは更新後の **Files changed** を確認します。

- 指摘した問題は、表面的ではなく原因まで解決されていますか？
- 新しいテストは、修正前の実装なら失敗する内容ですか？
- 修正により、別の入力や既存コマンドが壊れていませんか？
- フィードバックと関係のない変更が追加されていませんか？
- **View session** の実行記録やCopilotの返信と、実際の差分は一致していますか？

再レビューでは、前回見たファイルも必要な範囲で確認します。1行の修正でも、入力検証、保存、出力など別の処理へ影響する可能性があります。

### Step 4 -- 必要ならもう一度フィードバックする

期待を満たしていなければ、同じPRで次のコメントを残し、`@copilot`をもう一度明示します。**Fix** が利用できる場合は、代わりに使っても構いません。修正箇所だけでなく、見落としたケースを具体的に示してください。

> `@copilot` 空文字は拒否されるようになりましたが、前後の空白を除去する前に検証しているため、空白だけの`"   "`はまだ保存できます。空白を除去した後の値が空なら拒否し、空白だけの入力を含むテストを追加してください。

> `@copilot` CSVエクスポートの処理が`list_tasks()`内に追加され、ターミナル表示とファイル出力が同じ関数へ混在しています。行データの生成を副作用のない関数へ分け、ファイルI/Oを使わずに出力形式を検証できる単体テストを追加してもらえますか？

> `@copilot` 42行目の`Invalid input`だけでは、利用者が修正方法を判断できません。許可される値が`daily|weekly|monthly`であることをメッセージへ含め、無効な値では終了コードが0以外になることもテストしてください。

> `@copilot` Azure OpenAIがタイムアウトした場合のテストはありますが、タスク自体が保存されたことを確認していません。AIが失敗しても基本機能を継続するという受入条件を検証するアサーションを追加してください。

フィードバックの目的は、Copilotに細かな手順をすべて命令することではありません。品質上の不足と判定条件を共有し、修正案を同じPRで評価できる状態にすることです。

### Step 5 -- すべてのreview threadを解決する

返信や新しいコミットが追加されただけで、指摘が解決したと判断してはいけません。

1. **Files changed**を開きます。
2. **Conversations**メニューを開き、未解決、解決済み、Outdatedのthreadを確認します。
3. 未解決またはOutdatedのthreadを1つずつ開きます。
4. Copilotの返信、更新された差分、関連する再現手順やテストを確認します。
5. threadの返信欄へ、修正を受け入れた根拠を記録します。このワークショップの実機では**Cancel**、**Reply**、**Start a review**が表示されました。既存threadへ投稿する場合は**Reply**を選びます。UIラベルは変更される可能性があります。
6. 指摘が完全に解消されたことを確認してから**Resolve conversation**を選びます。
7. **Conversations**メニューに未解決threadがなくなるまで繰り返します。

返信しただけではthreadは解決されません。PRをReady for Reviewへ変更してもthreadは解決されません。

PRを作成した利用者、またはリポジトリへの書き込み権限を持つ利用者はconversationを解決できます。**Resolve conversation**が表示されない場合は、**Files changed**を開いているか、**Conversations**メニューから対象threadを再度開けるか、必要な権限があるかを確認します。権限がない場合は、PR作成者または書き込み権限を持つメンテナーへ依頼します。

<details>
<summary><strong>確認後に貼り付ける解決返信</strong></summary>

```markdown
再現手順と全テストを実行し、元の文字列が維持され、期待するspanが設定され、回帰がないことを確認しました。このthreadを解決します。
```

</details>

### Step 6 -- Ready for Reviewへ変更する

次をすべて満たしてから**Ready for review**を使用します。

- すべてのreview conversationが解決済み
- 最終差分とCopilotの完全な実行記録を再レビューした
- 関連するローカルテストまたはセッション内テストが成功している
- 説明されていない変更やIssueと無関係な変更が残っていない

1. **Conversation**タブを開きます。
2. PRのmerge boxを探します。画面幅やUIによって表示位置は変わる場合があります。
3. **Approve and run workflows**が表示された場合は、PR全体、特に`.github/workflows/`を確認してから実行を許可します。既定では、Copilotが変更をpushしてもワークフローは自動実行されません。
4. PRの最新コミットに対する必須チェックがある場合は、成功するまで待ちます。以前のコミットに対する緑色のチェックを根拠にしてはいけません。必須チェックがない場合は次へ進みます。
5. **Ready for review**を選びます。
6. Draft表示が消えたことを確認します。

この操作が行うのは、PRをDraftからReady for Reviewへ変更し、必要に応じてCode Ownerへレビューを依頼することです。PRの承認、`Changes requested`レビューの解除、conversationの解決、PRのマージは行いません。

### Step 7 -- レビュー状態とリポジトリ要件を確認する

次の状態はそれぞれ別に管理されます。

| 状態 | 確認できること |
|---|---|
| Review thread: resolved / unresolved | 特定のconversationに対応が残っているか |
| Submitted review: comment / approve / request changes | レビュー送信時に記録した判定 |
| Pull request stage: draft / ready | PRが最終レビュー可能な状態として提示されているか |
| Merge requirements | チェック、承認、ブランチルール、競合、merge queueなどがマージを許可しているか |

すべてのconversationを解決しても、以前の`Changes requested`レビューは自動的には解除されません。別のレビュアーによる承認は必須承認数を満たす場合がありますが、元のblockingなRequest changesを削除しません。

- 自分が**Request changes**を送信した場合は、修正を確認した後に**Files changed**を開き、**Review changes**から**Approve**を選んでレビューを送信します。これにより、自分が送信したblocking reviewを上書きし、`Changes requested`を解除します。
- 自分のレビュー判定を解除することと、リポジトリの必須承認数を満たすことは別です。自分が行ったCopilot PRへの承認は必須承認数へ加算されません。リポジトリで承認が必須の場合に限り、承認可能な独立レビュアーへ別途依頼します。
- 元のblocking reviewが古くなり通常の方法で解除できない場合、対象操作を許可された管理者または書き込み権限を持つ利用者は、**Conversation**タブでレビュー概要を展開し、対象レビューの`...`メニューから**Dismiss review**を選び、理由を入力して確定します。リポジトリ設定によりDismiss可能な利用者やチームが制限される場合があります。
- レビューをDismissすると、その状態はreview commentへ変わり、Dismiss理由がPRのconversationへ記録されます。リポジトリポリシーを迂回する目的でDismissしてはいけません。
- 承認を必須とするルールがなく、通常のマージボタンが有効なら、過去の`Changes requested`レビューを監査履歴として残したまま手動マージへ進めます。

### Step 8 -- Conversationタブから人間が手動マージする

このワークショップでは、base branchにmerge queueが必須ではないことを前提とします。Copilot Appの**Agent Merge**、GitHubの自動マージ、merge queueを使用せず、最後は人間がマージします。

1. PRの**Conversation**タブを開きます。
2. すべてのconversationが解決済みで、最新コミットに対する必須レビューとチェックがそろい、競合がないことを確認します。
3. PRの下部付近にあるmerge boxまで移動します。
4. リポジトリで認められているマージ方法を選びます。使用したい方法が現在のボタン名でない場合は、隣接するマージ用ドロップダウンを開いて選択します。
   - **Merge pull request**
   - **Squash and merge**
   - **Rebase and merge**
5. 選択したマージボタンを押します。
6. 最終コミットメッセージを確認し、**Confirm merge**、**Confirm squash and merge**、または**Confirm rebase and merge**を押します。
7. PRが`Merged`になったことを確認します。
8. PR説明に`Fixes #...`がある場合は、関連Issueが閉じたことを確認します。

GitHub公式ドキュメントでは、Copilot Appの自動化機能を**Agent Merge**と呼びます。このワークショップのドライランでは、App画面上部に**Merge when ready**が表示されましたが、UIラベルは変更される可能性があります。このExerciseではAgent Mergeを有効にせず、github.comの通常のmerge boxを使用します。

github.comでも、merge queueが必須の場合は正式な操作として**Merge when ready**と**Confirm merge when ready**が表示されます。その場合、このExerciseの「merge queueを使用しない」という前提と一致しません。**Merge pull request**を探し続けず、リポジトリのmerge queue運用へ従うか、ワークショップ用のリポジトリ設定を使用してください。

---

## 最終レビューとマージで迷った場合

<details>
<summary><strong>Resolve conversationが表示されない</strong></summary>

1. **Conversation**のタイムラインだけでなく、**Files changed**を開きます。
2. **Conversations**メニューから未解決またはOutdatedのthreadを選びます。
3. 既存threadへ返信する場合は、**Start a review**ではなく**Reply**を選びます。
4. 根拠を返信した後、同じthread内の**Resolve conversation**を探します。
5. PR作成者または書き込み権限があるか確認します。権限がなければ、対応可能なメンテナーへ依頼します。

**Ready for review**をconversation解決の代わりに使用してはいけません。

</details>

<details>
<summary><strong>Merge pull requestではなくMerge when readyが表示される</strong></summary>

まず、どの画面を開いているか確認します。

- **GitHub Copilot App:** GitHub公式ドキュメントでは自動化機能を**Agent Merge**と呼びます。github.comでPRを開き直します。このExerciseではAgent Mergeを使用しません。
- **github.comのmerge box:** **Merge when ready**はbase branchでmerge queueが必須であることを示します。これは正規のGitHubフローですが、このExerciseの前提外です。リポジトリのqueue運用へ従うか、merge queueを必須としないワークショップ環境を使用します。

</details>

<details>
<summary><strong>conversationを解決してもChanges requestedが残る</strong></summary>

threadの解決状態とレビュー判定は別に管理されます。別のレビュアーの承認だけでは、元のRequest changesは解除されません。

- 自分が変更を要求した場合は、修正確認後に**Review changes**から**Approve**を送信し、自分のblocking reviewを上書きして`Changes requested`を解除します。
- 自分のレビュー判定を解除することと、必須承認数を満たすことは別です。リポジトリで承認が必須の場合に限り、承認可能な別のレビュアーから必要な承認を取得します。自分が行ったCopilot PRへの承認は必須承認数へ加算されません。
- 通常の解除ができない場合、Dismissを許可された管理者または書き込み権限を持つ利用者が理由を記録して古いレビューをDismissできます。
- 承認が必須でなく、通常のマージボタンが有効なら、レビュー履歴を残したまま手動マージへ進めます。

</details>

<details>
<summary><strong>通常のマージボタンがない、または無効</strong></summary>

merge boxのメッセージを確認してください。主な原因は次のとおりです。

- PRがまだDraft
- 必須チェックが実行中または失敗
- 必須レビューまたはCode Owner承認が不足
- リポジトリルールでreview conversationの解決が必須
- ブランチに競合がある、または最新化が必要
- base branchでmerge queueが必須で、github.comが代わりに**Merge when ready**を表示している
- 利用者にマージ権限がない

表示された要件を解消します。回避策として**Merge when ready**へ切り替えてはいけません。
**Enable auto-merge**も使用せず、表示された要件を解消してから手動マージします。

</details>

---

## 参照したGitHub公式ドキュメント

- [Commenting on a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/commenting-on-a-pull-request)
- [Reviewing proposed changes in a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request)
- [Resolving reviews](https://docs.github.com/en/pull-requests/concepts/resolving-reviews)
- [Changing the stage of a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/changing-the-stage-of-a-pull-request)
- [Dismissing a pull request review](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/dismissing-a-pull-request-review)
- [Merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request)
- [Automatically merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request)
- [Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)
- [Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github)
- [Pull request reviews](https://docs.github.com/en/pull-requests/reference/pull-request-reviews)
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Merging with a merge queue](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request-with-a-merge-queue)
- [Managing pull requests with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests)

---

## マージ前チェックリスト

- [ ] Issueの受入条件をすべて確認した
- [ ] 最終差分とCopilotの完全な実行記録を再レビューした
- [ ] 新しいテスト、既存テスト、必須チェック、必要なセキュリティ確認が成功している
- [ ] 必須チェックが以前のCopilot pushではなくPRの最新コミットを対象としている
- [ ] すべてのreview conversationが解決済み
- [ ] blockingな`Request changes`レビューがリポジトリポリシーに従って解除または正当にDismissされている
- [ ] 必須レビューとCode Owner承認がそろっている
- [ ] 承認が必要な場合、承認可能な独立レビュアーがCopilot PRを承認した
- [ ] ワークフロー変更を確認してから、必要に応じて**Approve and run workflows**を実行した
- [ ] PRがDraftではなくReady for Reviewになっている
- [ ] github.comの通常のmerge boxでマージ方法が有効になっている
- [ ] Agent Mergeと自動マージを使用していない。必須merge queueに遭遇した場合は、Exerciseを停止するか、リポジトリのqueue運用へ明示的に従った
- [ ] 最終的な変更内容を自分の言葉で説明できる
- [ ] マージ後にPRが`Merged`となり、必要な場合は関連Issueが閉じている

---

## 振り返り

- 満足できる結果まで、何回の反復が必要でしたか？
- コメントを具体化すると、Copilotの次の変更はどう変わりましたか？
- 最初のIssueへ何を追加すれば、反復を減らせたでしょうか？
- Copilotへ任せた判断と、人間が最終確認した判断を区別できますか？

---

## 完了

これで、AIネイティブな開発ループを一巡しました。

```text
Issueを書く ─► Copilotへ割り当てる ─► PRをレビューする ─► 改善を反復する ─► 人間がマージする
```

人間が技術リードとして「何を、なぜ作るか」と品質基準を定義し、Copilotが実装を進めました。最後に、人間が結果を検証し、フィードバックを通じて完成へ導きました。

---

## 次に試すこと

- [Exercise 05 -- Azure + AI：クラウドネイティブへの拡張](../05-azure-and-ai/README.ja.md)へ進む
- [GitHub Copilot documentation](https://docs.github.com/en/copilot)を確認する
- [Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)を`copilot`で起動し、`Revert the last commit, leaving the changes unstaged.`と依頼する
- 自分のプロジェクト向けに`copilot-instructions.md`を作成する
