# 自作システムの公開・追加ガイド (Ayato Studio Showcase)

本ドキュメントは、新しく開発した自作システム、Webツール、SaaS、APIを `ayato-studio.ai` 配下に最短工数で公開・連携するための標準手順書です。

---

## 1. 公開パターンの選択

| 公開タイプ | 例 | 推奨配置場所 | デプロイ・運用方法 |
| :--- | :--- | :--- | :--- |
| **パターン A: 埋め込みWebツール** | 小規模計算機, 変換器, チェッカー | `main-web-tech-ai/src/app/apps/<app-name>/` | Next.js 内にページ/コンポーネントを追加（SSG/クライアント動作） |
| **パターン B: 独立Webアプリ / SaaS** | `MovieToText Web`, 金融分析ダッシュボード | `tools.ayato-studio.ai` または `*.ayato-studio.ai` | 個別リポジトリ作成 → Cloudflare Pages にデプロイ |
| **パターン C: デスクトップ/CLIアプリ紹介** | `Trancform_MovieToText`, 自動化スクリプト | `main-web-tech-ai/src/app/services/<app-name>/` | アプリ紹介・機能説明・GitHub/DLリンク・有料版案内を掲載 |
| **パターン D: 公開API / MCPサーバー** | AIエージェント用API, EDINETデータAPI | `api.ayato-studio.ai/<エンドポイント>` | Cloudflare Workers または GCP Cloud Run (FastAPI) |

---

## 2. パターン別の具体的な追加手順

### パターン A: 埋め込みWebツールを追加する場合
1. `main-web-tech-ai/src/app/apps/<app-name>/page.tsx` を作成。
2. React コンポーネントとしてUIおよびロジックを実装。
3. `main-web-tech-ai/src/content/apps/<app-name>/` にドキュメントMarkdown（`overview.md` など）を配置すると、自動的に `/apps` 一覧ページにカードが表示されます。

### パターン C: 自作アプリ（例: `Trancform_MovieToText`）を紹介・配布・SaaS化する場合
1. `main-web-tech-ai/src/app/services/movie-to-text/` を確認・更新。
2. 機能説明、無料版のダウンロードリンク、将来のPro版（クラウド文字起こし・チーム共有）の予告と事前登録CTAを配置。
3. ブログ（`src/content/blog/`）に開発背景や技術スタックの解説記事を投稿し、サービスページへの相互リンクを張る。

---

## 3. サブスクリプション・有料機能の追加手順 (Stripe + Supabase)

1. **Supabase ユーザー認証の有効化**:
   - `src/app/auth/` を利用してユーザー登録/ログイン導線を設置。
2. **Stripe Checkout 連携**:
   - `src/lib/stripe/client.ts` と `src/app/actions/stripe-checkout.ts` に Stripe Price ID を設定。
3. **プラン制限（RLS / Middleware）**:
   - Supabase の `profiles.plan_tier`（`free`, `pro`, `enterprise`）に応じてアクセス権限を制御。
