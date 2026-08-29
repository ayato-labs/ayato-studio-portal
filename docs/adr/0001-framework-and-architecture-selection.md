# ADR 0001: WebフレームワークおよびIT基盤アーキテクチャの選定

## 1. 状態 (Status)
提案中 (Proposed)

## 2. 背景・文脈 (Context)
個人専用のIT基盤の構築、自作システムの公開プラットフォーム化、および保有する `.ai` ドメインの有効活用にあたり、従来の商用利用可能なOSSフルスタックフレームワーク（Django, FuelPHP, Laravel等）の採用要否、および現行のモダン・サーバーレスアーキテクチャ（Next.js + Supabase + Cloudflare + Python 3.12）との比較評価を行う。

## 3. 決定事項 (Decision)
**現行の「Next.js (SSG/Edge) + Supabase (BaaS) + Cloudflare (Edge) + Python 3.12 (AI/バッチ/API)」スタックを主軸として維持・活用する。**
Django や FuelPHP などの伝統的モノリシック・フルスタックフレームワークは採用しない。

## 4. 採用理由 (Why)
1. **運用コストと保守の極小化（減算の美学）**:
   - 常時稼働するWebサーバー（VPSやEC2等）を持たず、Cloudflare Pages（エッジ配信）と Supabase（マネージドPostgreSQL/Auth）、GCP Cloud Run（オンデマンド実行）を組み合わせることで、**固定費ほぼ0円・OS/ミドルウェア保守ゼロ** を実現できる。
2. **AIエコシステムとの直接親和性（.aiドメインの価値最大化）**:
   - バッチ・収集・AI推論は Python 3.12（`ayato_reporter`）でGemini APIや最新LLMツールを直接制御し、UIはNext.jsで最先端のWebアプリとして提供できる。
3. **自作システムの迅速な公開性（サブドメイン展開）**:
   - 新しい自作ツールやWebアプリを開発した際、Cloudflare Pages / Workers を通じて数分でサブドメイン（`tools.*`, `app.*`, `api.*`）に独立公開できる。
4. **耐障害性とセキュリティ**:
   - 静的配信（SSG）と Cloudflare WAF/DDoS防御により、個人サイトに対する外部攻撃やサーバーダウンのリスクを構造的に排除できる。

## 5. 不採用理由 (Why Not)

### 1. Django (Python) を採用しない理由
- **サーバー管理負担**: 常時稼働サーバー（Gunicorn/Uvicorn + Nginx + OS）のセキュリティパッチ適用や死活監視が必要になり、個人運用の運用負債が増加する。
- **配信速度と耐障害性**: サーバーサイドレンダリング（SSR）が基本となるため、Cloudflare Pagesのようなグローバルエッジでの即時静的配信（SSG）に比べてレイテンシや負荷耐性が劣る。
- **役割の重複**: Django AdminやORMが提供する機能（DB管理、認証、API生成）は、Supabase（PostgreSQL + PostgREST + Auth）がマネージドかつ高機能に提供しているため、コードの重複と肥大化を招く。

### 2. FuelPHP / Laravel (PHP) を採用しない理由
- **AIエコシステムからの乖離**:
  - LLM、Gemini API、LangChain、MCP（Model Context Protocol）、データ分析等の主要ライブラリはPythonおよびTypeScriptが中心であり、PHPでこれらを扱うのは非効率。
  - AI処理のために別個でPythonサーバーを立てる必要が生じ、言語と基盤の二重管理が発生する。
- **FuelPHPの技術的衰退**:
  - FuelPHPはフレームワーク自体の更新・コミュニティ活動が停滞しており、長期的な個人基盤としての採用は技術的負債のリスクが高い。

## 6. 結果・影響 (Consequences)
- **メリット (Positive)**:
  - サーバーの常時維持コスト・死活監視工数が不要。
  - コード行数を最小限に抑え、自作ツールの開発と公開に集中できる。
  - 商用利用に関しても、Next.js (MIT)、Supabase (Apache 2.0/PostgreSQL)、Python (PSF) ともに完全フリーで制限なし。
- **トレードオフ / 注意点 (Negative / Risks)**:
  - 単一のフレームワークですべてを完結させるモノリスとは異なり、「フロント（Next.js）」「データ/認証（Supabase）」「AIバッチ（Python）」の役割分担を意識する必要がある（ただし疎結合であるため、一部の障害が全体に波及しないメリットがある）。
