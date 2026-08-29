# ayato_reporter 動作不良に関する調査結果レポート

## 1. 調査概要 (Executive Summary)
`ayato_reporter`（特に `tech` プラグインによる技術・arXivニュース収集システム）が正常に動作していない原因を調査しました。
結論として、**APIでニュース記事を自動スコアリングする際に使用するAIモデル（`light_task`）がすべて利用不可能（404 NOT_FOUND）になっていること**が主原因です。

また、最新の検証により、従来の `gemma-3` シリーズから `gemma-4` シリーズへの移行に伴う挙動（特に構造化JSON出力への対応可否）が明らかになりました。Gemma系モデルを継続使用する場合の制約と対策を本レポートに追記します。

---

## 2. 詳細分析 (Detailed Analysis)

### 2.1. 障害の発生プロセスとログの裏付け
直近の実行ログ（`logs/run_20260522_132655.log`）を解析した結果、以下の挙動を確認しました。

1. **フェッチフェーズ (正常)**
   - Zenn や arXiv からのニュース情報のフェッチ、および Supabase（`raw_items`）への登録は正常に行われています。
2. **スコアリングフェーズ (異常・アボートの原因)**
   - `src/plugins/tech/main.py` の `score_item` 関数において、取得した記事ごとに `container.gemini_service.call_structured_async` を呼び出し、AIスコアリング（0-100点）を行おうとします。
   - このスコアリングには `light_task` ティアのモデル群が使用されます。
   - `src/config/models.json` に設定されている `light_task` モデル群（`gemma-3-*` シリーズおよび `gemini-1.5-flash`）に対してAPIリクエストが送信されますが、**すべてのモデルが `404 NOT_FOUND` エラーを返します。**
   ```json
   // APIからのエラーレスポンス例
   404 NOT_FOUND. {'error': {'code': 404, 'message': 'models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.', 'status': 'NOT_FOUND'}}
   ```
   - `GeminiService` は設定されたモデルを順に試すフォールバック機能を備えていますが、リストの最後まで到達してもすべて 404 になるため、最終的に `ClientError` が発生します。
   - スコアリングできなかった記事は選定対象外（`None`）となるため、選定された記事が 0 件になります。
3. **レポート生成フェーズ (処理中断)**
   - 選定記事が 0 件のため、`tech/main.py` の 453行目にある以下のガード節で実行がアボートされます。
   ```python
   logger.warning("[TechPlugin] ABORT: Selection phase resulted in 0 items. No report will be generated.")
   ```
   - これにより、最終的な markdown レポートの生成、Supabase へのレポート登録、Webサイト側への反映が一切行われない状態になっています。

---

## 3. Gemma 3 / Gemma 4 の緊急検証結果

gemma-3-27b-it および新しくリリースされた gemma-4 シリーズ（gemma-4-31b-it, gemma-4-26b-a4b-it）の挙動を検証した結果、以下の事実が判明しました。

### 3.1. 検証結果サマリー
| モデル名 | 通常テキスト生成 (Test 1) | 構造化JSON出力 (Test 2) | 診断・対応状況 |
| :--- | :---: | :---: | :--- |
| **`gemma-3-27b-it`** | ❌ 404 NOT_FOUND | ❌ 404 NOT_FOUND | 完全廃止 / 利用不可。 |
| **`gemma-4-31b-it`** | 🟢 成功 | ❌ 500 INTERNAL | テキスト生成は可能ですが、JSONスキーマ（`response_schema`）を指定した構造化出力を行うと内部エラー（500）になります。スコアリング処理には直接利用できません。 |
| **`gemma-4-26b-a4b-it`**| 🟢 成功 | 🟢 成功 | テキスト生成、構造化JSON出力ともに正常に成功します。Gemma系でスコアリングを行う場合の唯一の選択肢です。 |

### 3.2. 技術的背景 (推測)
* `gemma-4-31b-it` の構造化JSON出力で `500 INTERNAL` エラーが発生する原因として、APIエンドポイント側のパラメータ制約（`response_schema` の構造解釈の不一致など）が存在する可能性が高いです。
* 一方、`gemma-4-26b-a4b-it` は構造化JSON出力をネイティブに解釈できているため、`light_task` における自動スコアリングロジックにそのまま組み込むことが可能です。

---

## 4. 解決策 (Action Plan)

### 4.1. モデル定義の更新 (`src/config/models.json`)
最新の検証結果および Gemini 系の稼働状況を基に、`models.json` を以下のように修正することを推奨します。

Gemma系モデル（`gemma-4-26b-a4b-it`）と、高い安定性とネイティブJSONサポートを持つ最新の Gemini 2.5/3.1 Flash 系列を組み合わせることで、耐障害性の高いフォールバックチェーンを構築します。

**推奨する `models.json` 設定:**
```json
{
  "light_task": [
    "gemma-4-26b-a4b-it",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
  ],
  "heavy_task": [
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
  ]
}
```

* **`gemma-4-31b-it` について**:
  * 構造化出力時に 500 エラーが発生するため、自動スコアリングを担当する `light_task` からは除外します。
  * `heavy_task` への採用も、APIの安定性が検証されるまでは Gemini 系列（`gemini-3-flash-preview` など）を最優先とするのが安全です。

### 4.2. テスト実行と動作確認
設定変更後、以下のコマンドを実行し、実際に `tech` プラグインがエラーなく最後まで走りきり、レポートが生成されるか検証します。

```bash
cmd /c .venv\Scripts\python main.py --engine tech --debug
```

### 4.3. 最終検証結果 (2026-05-22 実行)
上記設定を `src/config/models.json` に適用し、テスト実行を行った結果、**正常に動作が完了することを確認しました。**

* **ニュース記事のスコアリング・生成**:
  * 15件のenriched itemsに対してスコアリングを行い、無事に1件の記事が基準を満たしてレポート生成対象となりました。
  * タイトル: `OpenAIが数学の未解決問題を証明、コスト100分の1で「AIミドルウェア」は死滅する`
* **データベース保存**:
  * 生成されたレポートは Supabase の `generated_reports` テーブルへ正常に保存されました（HTTP 201）。
* **外部連携の実行**:
  * はてなブログへのダイジェスト投稿（`ai-researcher.hatenablog.com`）が正常に送信されました。
  * ポータルの再ビルドイベントが GitHub リポジトリ（`Ayato-AI-for-Auto/ayato-studio-portal`）へ正常に送信されました。
* **実行サマリー**:
  * `fetched_items`: 1225
  * `filtered_items`: 60
  * `processed_items`: 1064
  * `failed_items`: 0
  * `generated_reports`: 1
  * 実行ステータス: `Run Completed Successfully.` (正常終了)

