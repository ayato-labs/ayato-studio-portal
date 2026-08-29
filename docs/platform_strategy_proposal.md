# Ayato Studio: 自分専用IT基盤 & .aiドメイン有効活用戦略書

## 1. エグゼクティブサマリー
本ドキュメントは、保有する `.ai` ドメインの価値を最大化し、自作システムの公開プラットフォームおよび個人専用の統合IT基盤として `ayato-studio` を確立するための戦略・アーキテクチャ設計書です。

---

## 2. コアコンセプト: 「自作AIシステム群の母艦（Fleet Architecture）」

単一のWebサイトにとどめず、**「共通基盤（データ・認証・配信）＋ 独立した自作システム群（Apps/Tools/APIs）」** のモジュラー構成を採用します。

```mermaid
graph TD
    subgraph Public_Layer [外部公開層 (.aiドメイン活用)]
        MainPortal["メインポータル (ayato-studio.ai)<br/>ポートフォリオ / システム一覧 / 技術発信"]
        SubApp1["自作アプリ・ツール群 (app.* / tools.*)<br/>Webツール, ユーティリティ"]
        SubApp2["特化AIサービス (finance.* / game.*)<br/>データ分析・自動化成果物"]
        APIHub["公開API・MCPハブ (api.*)<br/>外部連携・エージェント用エンドポイント"]
    end

    subgraph Platform_Core [共通IT基盤 (Platform Engineering)]
        Edge["Cloudflare (DNS / CDN / WAF / Pages / Workers)"]
        AuthDB["Supabase (PostgreSQL / Auth / Storage)"]
        Compute["GCP (Cloud Run / Scheduler / Secret Manager)"]
        CI["GitHub Actions (CI/CD / 自動ビルド)"]
    end

    subgraph Private_Layer [自分専用コントロールプレーン]
        HQ["Ayato Intelligence HQ (hq.* またはローカル)<br/>個人ダッシュボード / 稼働監視 / データ集約"]
        Reporter["Ayato Reporter (バッチ処理 / AI要約 / 自動収集)"]
    end

    MainPortal --> Edge
    SubApp1 --> Edge
    SubApp2 --> Edge
    APIHub --> Edge
    Edge --> AuthDB
    Edge --> Compute
    HQ --> AuthDB
    Reporter --> AuthDB
    Reporter --> Compute
    CI --> Edge
    CI --> Compute
```

---

## 3. .ai ドメイン最大活用の4つの柱

### 柱1: 自作システム・ツールの「即時公開ショーケース」
- **目的**: 開発したWebアプリ、スクリプト、AIツールを埋もれさせず、実績として世界に公開する。
- **構成**:
  - メインポータルのトップに「Products / Lab / Tools」セクションを常設。
  - 軽量ツールはサブディレクトリ（例: `/apps/downloader`）またはサブドメイン（例: `tools.ayato-studio.ai`）で独立デプロイ。
  - Cloudflare Pages / Workers を活用することで、ホスティング費用ゼロかつ高速な配信を維持。

### 柱2: 自律型AIエージェント & データインテリジェンス基盤
- **目的**: `.ai` ドメインにふさわしい、AI駆動のデータ収集・分析システムを常時稼働。
- **構成**:
  - `ayato_reporter`（GCP Cloud Run Job + Gemini API）によるニュース・論文・市場データの自動収集と要約。
  - 蓄積データを Supabase DB に集約し、ポータルへ自動配信。

### 柱3: 公開API & MCP (Model Context Protocol) サーバーのエンドポイント
- **目的**: AI時代の次世代インターフェースとして、自作ロジックをLLMや他システムから呼び出せる形で公開。
- **構成**:
  - `api.ayato-studio.ai` を設定。
  - 自身が使うCursor/AntigravityなどのAIエージェント用MCPエンドポイントや自作APIをホスト。

### 柱4: 自分専用の統合管理コントロールプレーン (HQ)
- **目的**: 個人開発における全システム・データ・自動化バッチの統合管理。
- **構成**:
  - `ayato_intelligence_hq` を個人ダッシュボードとして運用。
  - Cloudflare Zero Trust / Supabase Auth で保護し、自分だけがアクセス可能なセキュア運用。

---

## 4. サブドメイン・ルーティング設計

| ドメイン / パス | 役割 | 技術スタック | 公開区分 |
| :--- | :--- | :--- | :--- |
| `ayato-studio.ai` | メインポータル / ポートフォリオ / 技術ハブ | Next.js (SSG) + Cloudflare Pages | パブリック |
| `ayato-studio.ai/apps/*` | 小型埋め込みツール・デモ | React / WebAssembly / Workers | パブリック |
| `finance.ayato-studio.ai` | 金融×AI特化ポータル | Next.js + Supabase | パブリック |
| `tools.ayato-studio.ai` | 独立型Webアプリケーション・SaaS | Next.js / Cloudflare Pages | パブリック |
| `api.ayato-studio.ai` | 自作API / MCPサーバー / Webhook | Cloudflare Workers / GCP Cloud Run | 一部公開/認証 |
| `hq.ayato-studio.ai` | 個人用IT基盤管理ダッシュボード | Next.js + Cloudflare Zero Trust | プライベート (自分専用) |

---

## 5. 自作システムを素早く公開するための「テンプレート・パイプライン」

新規にシステムやツールを作成した際、最小の工数で `.ai` ドメイン配下にデプロイ・公開できる共通パターンを確立します。

1. **フロントエンド型ツール**:
   - `main-web-tech-ai` 内にコンポーネントまたはサブページとして追加、または単独リポジトリから Cloudflare Pages でデプロイ。
2. **バックエンド/API型ツール**:
   - Python (FastAPI) または Cloudflare Workers で実装。
   - `api.ayato-studio.ai/<ツール名>` でルーティング。
3. **AIバッチ/定期処理**:
   - `ayato_reporter` 内に新プラグインを追加し、GCP Cloud Run Job で定期実行。

---

## 6. 実装・整備の推奨ステップ（ロードマップ）

### フェーズ 1: メインポータルの「自作システム公開ハブ」化（即効性）
- メインポータル (`main-web-tech-ai`) のナビゲーションとトップページに、自作プロダクト・システムを一覧表示する「Showcase / Apps」セクションを強化。
- 既存の自作システムへの導線とスクリーンショット・デモURLを配置。

### フェーズ 2: 共通IT基盤（DNS / 認証 / API）の共通化
- Cloudflare DNSにてサブドメイン（`tools.*`, `api.*`, `hq.*`）のルーティング基盤を整備。
- Supabase または Cloudflare Access を用いた、自分専用アクセスと公開用アクセスの境界設定。

### フェーズ 3: 新規ツールの追加と「.ai」ブランディングの確立
- 作成したシステム・APIを順次サブドメインまたはサブパスに接続。
- 技術解説や開発裏話を Blog/Academy に連動させ、ドメインのSEOおよび信頼性を向上。
