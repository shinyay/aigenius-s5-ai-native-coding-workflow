# aigenius-s5-ai-native-coding-workflow Copilot Instructions 日本語参考版

[English（正本）](copilot-instructions.md) | 日本語

> このファイルは、リポジトリの規約を日本語で理解するための参考資料です。GitHub Copilotが読み込む正本は、既存の英語版[`copilot-instructions.md`](copilot-instructions.md)です。規約を変更する場合は英語版を先に更新し、このファイルにも同じ内容を反映してください。

このリポジトリは、GitHub Copilotを使ったAIネイティブ開発ワークフローを学ぶ「AI Genius Episode 1」向けのPythonワークショッププロジェクトです。

## プロジェクト概要

`starter-app`は、Pythonで作成されたコマンドライン形式のタスク管理アプリです。タスクの追加、一覧表示、完了、編集、削除、統計表示ができます。

タスクはローカルJSONファイルへ保存され、次のスキーマを使用します。

```json
{
  "id": 1,
  "name": "Deploy to production",
  "description": "Run the release pipeline",
  "priority": "high",
  "tags": ["work", "devops"],
  "due_date": "2025-12-31",
  "done": false,
  "created_at": "2025-01-01T09:00:00"
}
```

## コーディング規約

- Python 3.10以降の機能と型ヒントを使用する
- PEP 8に従う
- 変数名と関数名は、役割が分かる具体的な名前にする
- 1つの関数が複数の責務を持たないよう、小さく保つ
- すべての公開関数とクラスにdocstringを追加する
- 文字列の組み立てにはf-stringを優先する

## プロジェクト構成

- `starter-app/app.py` -- アプリケーションのエントリーポイントとCLI
- `starter-app/requirements.txt` -- Pythonの依存関係
- `starter-app/tests/` -- pytestのテストスイート

## 依存関係

- `click` -- CLIの構築
- `rich` -- 読みやすいターミナル表示
- `pytest` -- テスト

## Azureクラウド連携

クラウドストレージやAIサービスを追加する場合は、次のライブラリとパターンを使用します。

### Azure Table Storage

タスクのクラウド保存には、Azure Table Storageを優先します。

```python
from azure.data.tables import TableServiceClient, TableClient
from azure.core.credentials import AzureNamedKeyCredential
```

- 認証情報は`AZURE_STORAGE_CONNECTION_STRING`環境変数から取得する
- 接続文字列やアカウントキーをソースコードへ直接記述しない
- `.env`を読み込む場合は`python-dotenv`を使用する: `from dotenv import load_dotenv`
- タスクのエンティティには`PartitionKey = "tasks"`と`RowKey = str(task_id)`を使用する

### Azure OpenAI

```python
from openai import AzureOpenAI
```

- `AZURE_OPENAI_ENDPOINT`、`AZURE_OPENAI_API_KEY`、`AZURE_OPENAI_DEPLOYMENT`、`OPENAI_API_VERSION`環境変数を使用する
- `AzureOpenAI`の生成時に、`OPENAI_API_VERSION`を`api_version`へ渡す
- `AZURE_OPENAI_DEPLOYMENT`を`azure_deployment`またはリクエストの`model`へ明示的に渡す。この独自環境変数はSDKから自動的には読み込まれない
- APIキーをソースコード、ログ、エラーメッセージへ直接出力しない
- 環境変数の読み込みには`python-dotenv`を使用する

### 環境変数の読み込みパターン

```python
import os
from dotenv import load_dotenv

load_dotenv()
connection_string = os.environ["AZURE_STORAGE_CONNECTION_STRING"]
```

必要な環境変数がない場合は、曖昧な既定値で処理を続けず、既存の仕様に沿って明確なエラーまたは明示的なフォールバックを提供します。

## テスト方針

- 単体テストには`pytest`を使用する
- テストファイルは`starter-app/tests/`へ配置する
- ファイル名は`test_*.py`形式にする
- 実際のタスクデータを変更しないよう、`conftest.py`の`isolated_tasks_file` fixtureを使用する
- 空のタスクリスト、存在しないID、不正な日付、環境変数不足などの境界条件を確認する
- AzureやOpenAIなどの外部サービスはモックし、テストから実際のクラウドへ接続しない

## 完了の基準

機能が完成したと判断するためには、次をすべて満たす必要があります。

- Issueに記載されたCLI操作が期待どおりに動作する
- 入力値が検証され、エラー時に利用者が対応できる情報が表示される
- 秘密情報が環境変数から読み込まれ、ソースコードへ直接記述されていない
- コードに型ヒントとdocstringがある
- 新しい動作と境界条件を確認するテストがある
- 既存の動作とテストを壊していない

## 表示とエラーに関する方針

- CLIの出力は`rich`を使って読みやすくする
- エラーメッセージには、何が問題で、利用者が次に何を確認すべきかを含める
- 成功時は終了コード0、エラー時は0以外を使用する
- 期限を過ぎた未完了タスクは、一覧で赤く強調する
