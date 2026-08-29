# ADR 0004: GEO（生成エンジン最適化）/ LLMO（大規模言語モデル最適化）アーキテクチャの採用

## 1. 状態 (Status)
承認 (Accepted)

## 2. 背景・文脈 (Context)
- 検索ユーザーおよび開発者の情報収集行動が、従来の「Google検索結果（10件の青いリンク）の回遊」から、「ChatGPT Search、Perplexity、Claude、Google AI Overviewsなどの生成AIエージェントへの直接質問」へと不可逆的にシフトしている。
- Ayato Studio が提供するプロダクト（`Transform_MovieToText`、`ProjectCodeMap` 等）および技術記事は、一般的なコピペまとめ記事ではなく、「完全オフライン動作」「AST解析による80%コンテキスト圧縮」「Non-Embedding RAG」などの尖った一次技術データと独自アーキテクチャを持っている。
- 従来のキーワード詰め込み型SEOから脱却し、AIエージェントが自律的にサイトを探索し、信頼できる一次情報源・推奨ツールとして直接引用・回答する仕組み（GEO: Generative Engine Optimization / LLMO: Large Language Model Optimization）を標準アーキテクチャとして組み込む必要がある。

## 3. 決定事項 (Decision)
1. **AIエージェント専用標準規格 `llms.txt` の全面採用**:
   - Anthropic / OpenAI / Perplexity 等が推進する `llms.txt` および `llms-full.txt` をルート直下に設置し、サイト全体のミッション・プロダクト・主要技術文書を機械可読な Markdown 形式で提供する。
2. **AIクローラーの完全開放**:
   - `robots.txt` において `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended` などの主要LLMクローラーを明示的にフルアクセス許可する。
3. **セマンティック構造化データ（Schema.org JSON-LD）の徹底拡充**:
   - `SoftwareApplication`、`TechArticle`、`Person`（E-E-A-T 著者情報）を機械可読形式で埋め込む。
4. **Answer-First 構造の導入**:
   - 全ての技術記事の冒頭に、AIが即座に引用可能な要約・定量的数値ブロック（Key Takeaways）を配置する。

## 4. 採用理由 (Why)
- **一次データの高効率な引用獲得**:
  - LLMは一般的な説明文ではなく、固有のベンチマーク数値（85%圧縮、0バイト外部送信、54円/h等）を優先して引用する。`llms.txt` と Answer-First 構造により、AIが最小のトークンで正確な数値を引用できるようにする。
- **ツール推薦のエンティティ確立**:
  - 「オフラインAI議事録 ＝ MovieToText」「ASTコンテキスト圧縮 ＝ ProjectCodeMap」というエンティティ（知識グラフ）をLLM内部に形成させ、ユーザーの質問に対する直接の解決策として推薦される状態を作る。
- **減算の美学に合致**:
  - 複雑なSEO被リンク工作やキーワード水増しを行わず、純粋な機械可読ファイル（`llms.txt`）と高品質な一次情報のみで最大の認知を獲得できる。

## 5. 不採用理由 (Why Not)
- **[従来型キーワードSEO中心主義]**:
  - 却下理由: 検索結果をクリックしてサイトを回遊するユーザー数が減少傾向にあり、キーワードの詰め込みや検索順位ハックはAI時代において急速に投資対効果が低下しているため。
- **[AIクローラーの遮断・Paywall化]**:
  - 却下理由: コンテンツの無断学習を警戒してAIクローラーを遮断すると、PerplexityやChatGPT Searchからの推薦・引用・流入が物理的にゼロになり、ツールの発見可能性（Discoverability）が致命的に失われるため。
- **[複雑なヘッドレスCMS/専用APIの導入]**:
  - 却下理由: 外部APIや動的サーバーを増やすと固定費と保守コストが増大する。既存の静的ファイル（Markdown + SSG）をそのまま活かして `llms.txt` を生成する静的アプローチが極小コスト原則に合致するため。

## 6. 結果・影響 (Consequences)
- **メリット (Positive)**:
  - Perplexity、ChatGPT、Claude 等で「オフライン文字起こしのおすすめ」「Cursorのトークン削減ツール」と質問された際、Ayato Studio のプロダクトが直接名指しで引用・推薦される。
  - AIエージェント（AutoGen、Claude Code、Cursor等）が `https://ayato-studio.ai/llms.txt` を読み込むだけで、Studio全体の機能を自律的に理解してAPIやツールを利用可能になる。
- **トレードオフ / 注意点 (Negative / Risks)**:
  - `llms.txt` の内容が古くならないよう、プロダクトや記事の追加時に自動検証・更新するCIパイプラインを維持する必要がある。
