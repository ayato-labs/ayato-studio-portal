# ADR 0005: Web MCP (Remote Model Context Protocol) エンドポイントの採用

## 1. 状態 (Status)
承認 (Accepted)

## 2. 背景・文脈 (Context)
- AIエージェント（Cursor, Claude, Claude Code, ChatGPT, 自律型LLM）の急速な普及に伴い、Webサイトの情報を「人間がブラウザで閲覧する」だけでなく、「AIエージェントがプログラムからツール（Tool）として直接呼び出す」需要が爆発的に高まっている。
- 従来の `llms.txt`（静的テキスト）による情報提供に加え、Model Context Protocol (MCP) に準拠したリモートエンドポイント（Web MCP）を公開することで、AIエージェントが Ayato Studio の最新データ（AIレポート、プロダクト仕様、技術知見）を動的に検索・実行できるようにする。

## 3. 決定事項 (Decision)
1. **Next.js App Router によるサーバーレス Web MCP の新設**:
   - `https://ayato-studio.ai/api/mcp` に JSON-RPC 2.0 準拠の MCP エンドポイントを配備する。
2. **提供する MCP ツール群 (Tools)**:
   - `search_ai_reports`: データベース（Supabase）内のAIインテリジェンスレポートを自然言語/キーワード検索。
   - `get_product_catalog`: `Transform_MovieToText` や `ProjectCodeMap` 等の製品スペック、動作環境、料金プラン、導入方法を取得。
   - `get_technical_insights`: 最新の一次技術記事一覧と要約を取得。
3. **`llms.txt` との連携（Auto-Discovery）**:
   - `llms.txt` 内に MCP エンドポイント情報を明記し、AIエージェントが自律的にツールを検知・利用できるようにする。

## 4. 採用理由 (Why)
- **GEO / AI SEO における圧倒的な引用優位性**:
  - 単なるWebテキストではなく、「実行可能な公式MCPツール」として登録されることで、AIモデルの回答生成時における信頼性スコアと直接引用率が最大化する。
- **追加コスト0円（減算の美学）**:
  - 常駐のEC2や外部コンテナを立てず、既存の Next.js Route Handler（Cloudflare Pages 上で動作）内に実装することで、インフラ維持費0円を維持する。
- **将来の Agentic Economy（B2Agent）課金への布石**:
  - AIエージェントからのアクセス基盤を整えておくことで、将来的な API / MCP 従量課金やトークン決済への移行が容易になる。

## 5. 不採用理由 (Why Not)
- **[独立した常駐 WebSocket / Python MCP サーバーの常時稼働]**:
  - 却下理由: サーバー維持費（月数千円〜）と監視工数が常時発生し、「ドメイン代以外の固定費ゼロ」の原則に反するため。HTTP POST / JSON-RPC によるステートレスな Route Handler で十分に対応可能。
- **[認証を前提とした閉域限定公開]**:
  - 却下理由: 公開ツールとしての発見可能性（Discoverability）とGEO効果を最大化するため、基本参照ツールは認証不要で誰でも（AIエージェントも）即座に呼び出せるオープン仕様とする。

## 6. 結果・影響 (Consequences)
- **メリット (Positive)**:
  - 世界中の Cursor、Claude、自律型エージェントが、設定ファイル（`.cursor/mcp.json` 等）に `https://ayato-studio.ai/api/mcp` を追加するだけで Ayato Studio のデータとツールを即座に利用可能になる。
  - AI検索エンジン（Perplexity 等）がリアルタイムに正確な製品スペックとレポートを引用できるようになる。
- **トレードオフ / 注意点 (Negative / Risks)**:
  - 悪意ある大量リクエストによる負荷を避けるため、適切なレートリミットおよびクエリサニタイズを施す必要がある。
