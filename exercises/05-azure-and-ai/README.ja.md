# オプション Exercise 05 -- Azure + AI：クラウドネイティブへの拡張

[English](README.md) | 日本語

> [!NOTE]
> **このExerciseは、Exercises 01〜04を完了した人向けのオプション課題です。** Exercises 01〜04までで、ワークショップの中核となるAIネイティブ開発ループは完了します。Exercise 05はワークショップ修了の必須条件ではありません。クラウドSDK、外部AIサービス、秘密情報、障害時の動作、モックテストをさらに練習したい場合に取り組んでください。目的と利用できるAzure環境に応じて、どちらか一方のOptionだけでも、両方でも実施できます。

## この演習のゴール

実際のクラウドSDKと生成AI APIを含む変更をCopilotへ委譲し、**動いたかどうかだけでなく、安全性、障害時の動作、テスト方法までレビューできるようになること**がゴールです。

前の演習までの変更は、ローカルで完結するPythonアプリが中心でした。この演習では、次の要素が加わります。

- `azure-data-tables`を使ったAzure Table Storageへの保存
- `openai.AzureOpenAI`を使った実行時のAI機能
- 環境変数による認証情報の管理
- 外部サービスを実際には呼び出さないモックテスト
- 接続失敗、設定不足、タイムアウト時の扱い

クラウドやAIのコードは、正常系だけを見ると簡単に動いているように見えます。だからこそ、Issueで失敗時の期待動作まで指定し、PRでは秘密情報と例外処理を重点的に確認します。

---

## Option 1：保存先をAzure Table Storageへ拡張する

### 目指すアーキテクチャ

```text
CLI (app.py)
    └─► storage.py  （新しい抽象化レイヤー）
            ├─► LocalStorage      （現在のJSON、既定値）
            └─► AzureTableStorage （環境変数がある場合に使用）
```

`AZURE_STORAGE_CONNECTION_STRING`が設定されている場合はAzure Table Storageを使い、設定されていない場合はこれまでどおりローカルJSONを使います。

重要なのは、保存先が変わっても利用者が使うCLIを変えないことです。`add`や`list`などのコマンドは、どちらの保存先でも同じように動作する必要があります。

### Issueとして使用できる仕様

Exercise 01ですでにOption Aを実装した場合、このOptionは完了済みです。さらにAIを練習したい場合だけOption 2を選んでください。それ以外でOption 1を選ぶ場合は、次の内容で新しいIssueを作成します。

---

**Title:** タスクの保存先をAzure Table Storageへ拡張する

**解決したい問題:**

現在、タスクはローカルの`tasks.json`へ保存されています。そのため、別の端末から同じタスクを利用できず、実行環境が変わるとデータを引き継げません。既存のローカル保存を維持しながら、クラウドへ保存できる選択肢を追加します。

**期待する動作:**

- `AZURE_STORAGE_CONNECTION_STRING`が設定されている場合、`tasks`という名前のAzure Table Storageテーブルからタスクを読み書きする
- 環境変数が設定されていない場合、既存のローカルJSON保存を使用する
- 保存先に関係なく、`add`、`list`、`complete`、`edit`、`delete`、`stats`の操作方法と出力を維持する

**受入条件:**

- [ ] 新しい`storage.py`に、`load() -> list[dict]`と`save(tasks: list[dict]) -> None`を持つ`TaskStorage` protocolが定義されている
- [ ] `LocalStorage`が既存のJSON保存を実装している
- [ ] `AzureTableStorage`が`azure-data-tables`を使ってAzure保存を実装している
- [ ] `app.py`は保存処理を直接選ばず、`get_storage()`から利用する実装を取得する
- [ ] `python-dotenv`を使用し、`.env`が存在する場合は`AZURE_STORAGE_CONNECTION_STRING`を読み込む
- [ ] 環境変数が設定されているのにAzureへ接続できない場合、利用者が対応できるエラーメッセージを表示して終了コード1で終了する
- [ ] `requirements.txt`に`azure-data-tables`と`python-dotenv`が追加されている
- [ ] `LocalStorage`と`AzureTableStorage`の両方にテストがある
- [ ] Azure SDKの呼び出しは`unittest.mock`で置き換え、テストから実際のAzureへ接続しない
- [ ] ソースコードやテストデータに接続文字列、アカウントキー、その他の秘密情報が含まれていない

**制約:**

- `azure-storage-table`ではなく`azure-data-tables`を使用する
- Azureのエンティティでは`PartitionKey = "tasks"`、`RowKey = str(task["id"])`を使用する
- CLIのインターフェースと既存のタスクスキーマを変更しない

**完了条件:**

- [ ] 実際のAzure Storageアカウントを設定した環境で、`python app.py add "Test" && python app.py list`が動作する
- [ ] 環境変数がない状態でも、従来のローカル保存が動作する
- [ ] 既存のテストがすべて成功する
- [ ] `AzureTableStorage`の正常系とエラー系がモックテストで確認されている

---

### PRで重点的に確認すること

- **認証情報が埋め込まれていないか**

  接続文字列やキーがコード、テスト、ログへ含まれていた場合は、マージしてはいけません。

- **保存処理が本当に分離されているか**

  Azure固有の処理が`app.py`へ混在していないか、`LocalStorage`と`AzureTableStorage`を同じ契約で扱えているかを確認します。

- **接続に失敗したとき、利用者が次の行動を判断できるか**

  Pythonの生のstack traceだけではなく、設定すべき環境変数や失敗した処理が分かる必要があります。

- **モックが正しい境界に置かれているか**

  「テストが成功した」だけでなく、Azure SDKが実際に呼び出されていないことを確認します。

- **既存のローカル利用者を壊していないか**

  Azureを使わない利用者に新しい設定を強制していないかを確認します。

---

## Option 2：Azure OpenAIでタグを提案する

### 目指す動作

```text
python app.py add "Renew SSL certificate"
    └─► Azure OpenAI: "Suggest a category for: Renew SSL certificate"
            └─► returns: "devops"
                    └─► task saved with tags: ["devops"]
```

この機能は、AIをアプリの必須要件にするものではありません。必要な設定がそろい、利用者がタグを指定しておらず、`--no-ai`も指定していない場合だけAIを呼び出します。

AIが利用できない場合でも、タスクの追加そのものは成功させる設計にします。

AIへ送信されるのはタスク名と説明です。業務上の機密情報が含まれる可能性があるため、IssueとPRでは「どのデータがローカル環境の外へ送信されるか」も確認します。

### Issueとして使用できる仕様

Exercise 01ですでにOption Bを実装した場合、このOptionは完了済みです。さらにクラウドを練習したい場合だけOption 1を選んでください。それ以外でOption 2を選ぶ場合は、次の内容で新しいIssueを作成します。

---

**Title:** `add`コマンドにAzure OpenAIのタグ提案を追加する

**解決したい問題:**

タスクを追加するとき、利用者がタグを付け忘れることがあります。タグが指定されていない場合に限り、Azure OpenAIから1つのカテゴリ候補を取得して自動的に設定します。

**期待する動作:**

- `AZURE_OPENAI_ENDPOINT`、`AZURE_OPENAI_API_KEY`、`AZURE_OPENAI_DEPLOYMENT`、`OPENAI_API_VERSION`がすべて設定され、利用者が`--tag`を指定していない場合だけAzure OpenAIを呼び出す
- AIが返したタグをタスクへ追加し、`[AI suggested tag: devops]`のように利用者へ知らせる
- 必要な環境変数が不足している場合、またはAI呼び出しに失敗した場合は、タグなしでタスクを保存する
- `add`コマンドに`--no-ai`を追加し、利用者がAI呼び出しを明示的に無効化できるようにする

**受入条件:**

- [ ] 新しい`ai.py`に`suggest_tag(task_name: str, description: str) -> str | None`が定義されている
- [ ] `openai.AzureOpenAI`を、環境変数から取得した認証情報と`api_version`で構築し、`AZURE_OPENAI_DEPLOYMENT`を`azure_deployment`またはリクエストの`model`へ渡している
- [ ] システムプロンプトが「小文字、単一タグ、句読点なし」という出力形式を明確に指示している
- [ ] `add`は、`--tag`がなく、かつ`--no-ai`が指定されていない場合だけ`suggest_tag`を呼び出す
- [ ] AI呼び出しに関するエラーは記録され、タスク追加処理は継続する
- [ ] `requirements.txt`に`openai`が追加されている
- [ ] OpenAIクライアントをモックした正常系、設定不足、エラー系のテストがある
- [ ] テストから実際のAzure OpenAIへ接続しない
- [ ] タイムアウトと再試行の設定を確認するテストがある

**制約:**

- 待ち時間を抑えるため、クライアントに5秒のリクエストタイムアウトを設定し、自動再試行を無効化する（`timeout=5`、`max_retries=0`）
- APIキーをログやエラーメッセージへ出力しない
- `python app.py add --help`に`--no-ai`の説明を表示する
- AIの返答をそのまま信頼せず、保存前に単一の有効なタグとして扱えることを確認する

**完了条件:**

- [ ] 環境変数を設定した状態で`python app.py add "Deploy to production"`を実行すると、AIが提案したタグが表示される
- [ ] `python app.py add "Deploy" --no-ai`ではAIを呼び出さない
- [ ] 環境変数がない場合やAIが失敗した場合でも、タスクを追加できる
- [ ] 既存のテストがすべて成功する
- [ ] `suggest_tag`の応答、設定不足、タイムアウト、エラーがモックテストで確認されている

---

### PRで重点的に確認すること

- **AI機能が本当に任意になっているか**

  Azure OpenAIの設定がないだけで、CLI全体が起動できなくなる実装は要件違反です。

- **待ち時間を制限する設定が実装されているか**

  クライアントの生成時に`timeout=5`と`max_retries=0`が渡されていることを確認します。これはネットワーク処理の待ち時間を抑える設定であり、処理全体が必ず5秒以内に終わることを保証するものではありません。

- **モデルへの指示と出力検証が十分か**

  システムプロンプトだけに依存せず、返答が想定したタグ形式か確認しているかを見ます。

- **失敗を黙って無視していないか**

  タスク追加は継続しても、調査に必要な情報は秘密情報を含めずに記録される必要があります。

- **利用者の明示的な指定を優先しているか**

  `--tag`や`--no-ai`が指定されている場合、AIを呼び出してはいけません。

- **Azure OpenAIへ送信するデータが明確か**

  タスク名と説明のどちらを送るのか確認します。プロンプトやログへAPIキーや不要な機密情報を含めてはいけません。

---

## オプション発展課題：クラウド + AIの拡張を完成させる

さらにアプリを拡張したい場合は、Exercise 01で完了したOptionに応じて次を選びます。

- Option Aを完了した場合は、Option 2（Azure OpenAI）へ進みます。
- Option Bを完了した場合は、Option 1（Azure Table Storage）へ進みます。
- Option CまたはDを完了した場合は、Option 1またはOption 2のどちらかを選びます。クラウドとAIの両方を完成させたい場合だけ、両方を実施します。

残っている各Optionについて、Issue作成、Copilotへの委譲、PRレビュー、フィードバックによる反復、リポジトリのルールに沿ったマージまでを実施します。

次のループでは、最初のIssueやレビューで不足していた情報を意識してみてください。Issueの精度が上がると、レビューで必要な修正回数がどのように変わるかも観察します。

両方のOptionを完了すると、次の要素を持つアプリの土台ができます。

- Azure Table Storageによるクラウド保存
- Azure OpenAIによる任意のタグ提案
- 外部サービスをモックしたテスト
- 環境変数による認証情報管理
- Azure OpenAIによるタグ提案が失敗しても、タスク追加を継続できる設計

---

## 参考資料

- [Azure Tables client library guide for Python](https://learn.microsoft.com/en-us/python/api/overview/azure/data-tables-readme?view=azure-python)
- [Azure OpenAI Python quickstart](https://learn.microsoft.com/en-us/azure/ai-services/openai/quickstart?pivots=programming-language-python)
- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
