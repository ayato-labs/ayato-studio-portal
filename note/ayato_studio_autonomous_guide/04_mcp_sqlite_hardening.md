# MCPサーバー開発で「DB Lock」と「存在しないテーブル」に3時間溶かした話:SQLite非同期初期化の完全防壁

---
💰 **販売予定価格:500円**  
🎁 **お得な3本マガジンセット:1,480円**
---

![SQLite非同期初期化の戦い](file:///C:/Users/saiha/.gemini/antigravity/brain/85df9d64-d9d9-4598-9885-4805bb4c1aaf/mcp_db_lock_article_thumbnail_1776071026272.png)

### 👤 執筆者について:Ayato
「AIによる人間の作業からの解放」を掲げ、AIエージェントと共に日々数千行のコードをデプロイし続けるAI駆動型エンジニア。  
自律型情報配信システム『Ayato Studio.ai』の開発者であり、MCP(Model Context Protocol)サーバーの設計から GitHub Actions を用いた完全無人デプロイまで、人間を「設定やデバッグ」というルーチン作業から解放し、真に創造的な活動へ戻すためのアーキテクチャ設計を専門としています。

本記事では、SharedMemoryServer の開発過程で直面した**SQLiteの非同期初期化にまつわる致命的な競合と、それを完全に制圧した技術的アプローチ**を共有します。

### 💡 この記事で得られること
- **asyncio環境下でのSQLite初期化タイミング競合のデバッグ手法**
- **テスト環境でのDBクリーンアップと「強制再初期化」のベストプラクティス**
- **`uv` と `Ruff` を活用した、モダンで堅牢なPython開発環境の構築法**

---

## 1. 導入:なぜあなたのMCPサーバーは「時々」壊れるのか

AIエージェントと対話するためのMCP(Model Context Protocol)サーバーを開発していると、ローカルのSQLiteデータベースが不意に牙を向くことがあります。

「さっきまで動いていたのに、テストを走らせると `no such table: search_stats` が出る」  
「GitHub Actions上だけで、なぜかデータベースが初期化されない」

こうした不具合の多くは、実は**非同期処理(asyncio)下での初期化タイミングの競合**に起因しています。本記事では、SharedMemoryServerの開発過程で直面したこれらの「毒」をデバッグし、完全に無効化した記録を共有します。

---

## 2. 2026年版:Pythonプロジェクトの三種の神器

堅牢なサーバーを作るには、まず道具を揃える必要があります。今回、私は以下の構成への移行を決断しました。

- **uv**: pipに代わる超高速パッケージマネージャー。CI環境の構築を数秒に。
- **Ruff**: 爆速のLinter/Formatter。39件のコード規約違反を一撃で修正。
- **pytest-asyncio**: 非同期ツールの品質を担保するための必須プラグイン。

特に `uv` への移行は、CI/CDの安定性を劇的に向上させました。

---

## 3. 失敗談:pip install と GitHub Actions の「パスの罠」

当初のCI環境は `pip install .` で構築していましたが、GitHub ActionsのUbuntu環境ではカレントディレクトリの認識が微妙に異なり、「モジュールが見つからない」というエラーが頻発しました。

また、非同期で走るテストスイートにおいて、SQLiteのDBファイルが生成される前にクエリが飛んでしまい、テーブルが存在しないと怒られる事態に。DBの初期化フラグをグローバル変数で管理していたことが、テストスイート内での「隔離された状態」を破壊していたのです。

---

🚀 **ここから先は「有料エリア」です**

> [!TIP]
> **【SNSプロモーション割引実施中!】**  
> この記事の下部にある共有ボタンから X(Twitter) でこの記事をシェアしていただくと、**特別割引価格** でご購入いただけます。ぜひご活用ください!

---

## 4. 解決策:競合を物理的に潰す「強制再初期化」パターン

テストごとにクリーンなDBを用意するため、初期化ロジックに `force` パラメータを導入しました。

### 正解のコード例

```python
# src/shared_memory/database.py
_DB_INITIALIZED = False

async def init_db(force=False):
    global _DB_INITIALIZED
    # テスト環境では force=True を渡すことで、
    # グローバルな初期化済みフラグをバイパスしてテーブル確認を走らせる
    if _DB_INITIALIZED and not force:
        return

    db_path = get_db_path()
    async with await _async_get_connection_raw(db_path) as conn:
        await conn.execute("CREATE TABLE IF NOT EXISTS search_stats (...)")
        await conn.commit()
    
    _DB_INITIALIZED = True
```

そして、`tests/conftest.py` のフィクスチャでこれを呼び出します。

```python
@pytest.fixture(autouse=True)
async def setup_teardown_db():
    # 各テストの開始前に確実にテーブルが存在することを保証
    await init_db(force=True)
    yield
    # テスト後の後処理...
```

これにより、並列で走るテスト同士が干渉し、片方のテストが「初期化済みだ」と思い込んでテーブル作成をスキップする事故を防げます。

---

## 5. 応用:GitHub Actions を 100% 安定させるテンプレート

`uv` を使った、WindowsとUbuntu両対応の最強CI設定ファイルがこちらです。

```yaml
- name: Setup uv
  uses: astral-sh/setup-uv@v5
  with:
    enable-cache: true

- name: Create venv & Install deps
  run: |
    # 仮想環境が既存なら使い回し、なければ作成
    if [ ! -d ".venv" ]; then uv venv; fi
    uv pip install -e .[test]
```

ポイントは `uv pip install -e .` を使うこと。これにより、ソースコードへの変更が即座に仮想環境内に反映され(editable install)、開発効率が最大化されます。

---

## 6. チェックリスト:明日から使える確認項目

あなたのMCPサーバーをプロダクション品質にするための10項目です:

1. [ ] DB接続を取得する「蛇口」関数で、Lazy初期化を呼んでいるか?
2. [ ] 初期化フラグはテスト環境でリセット可能か?
3. [ ] `aiosqlite` の `Connection` はコンテキストマネージャで確実に閉じているか?
4. [ ] `ruff check .` で Lint エラーは 0 か?
5. [ ] GitHub Actions で `uv` のキャッシュを有効化しているか?
6. [ ] `uv pip install -e .` で開発環境とCIのパス認識を統一しているか?
7. [ ] テスト実行時に `MEMORY_DB_PATH` を動的に変更し、本番DBを汚染していないか?
8. [ ] Ruff のインポート順序(I001)を自動修正し、コードの美しさを保っているか?
9. [ ] CI失敗時に artifacts を使ってログを回収する仕組みがあるか?
10. [ ] `pyproject.toml` にテスト用の extras([test])が正しく定義されているか?

---

## あとがき

技術的なハマりポイントは、一度解決してしまえば貴重な資産になります。この記事が、あなたの開発時間を数時間節約するきっかけになれば幸いです。
