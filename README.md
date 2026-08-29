# Ayato Studio Monorepo

> **AI-Native Intelligence Systems & Autonomous Workflow Studio**  
> 減算の美学に基づく自律型AIエージェント・エッジファーストなシステム構築の統合リポジトリ。

---

## 1. モノリポ構造 (Repository Architecture)

```
ayato-studio/
├── apps/
│   ├── web/            # Next.js 16 (App Router) ポータル (https://ayato-studio.ai)
│   └── reporter/       # Python 3.12 自律型AI収集・キュレーションバッチ (GCP Cloud Run)
├── docs/               # ADR (設計意思決定記録), SQLマイグレーション, 戦略書
├── .secrets/           # 認証情報・サービスアカウント鍵 (ローカル隔離)
└── .gitignore          # モノリポ共通除外設定
```

---

## 2. 各アプリケーションの概要

### A. `apps/web` (Portal & SaaS Hub)
- **技術スタック**: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Supabase Auth/DB, Stripe Subscriptions
- **デプロイ先**: Cloudflare Pages (`ayato-studio.ai`)
- **起動・ビルド**:
  ```bash
  cd apps/web
  npm install
  npm run dev     # 開発サーバー
  npm run build   # 本番ビルド検証
  ```

### B. `apps/reporter` (Autonomous Intelligence Engine)
- **技術スタック**: Python 3.12, Google AI Studio (Gemini 2.0 Flash / Gemma), Loguru, Supabase REST
- **デプロイ先**: GCP Cloud Run Job (`ayato-reporter`)
- **起動・テスト**:
  ```bash
  cd apps/reporter
  uv sync
  uv run pytest   # 単体テスト
  uv run python -m src.main  # ローカルバッチ実行
  ```

---

## 3. 開発・運用ガイドライン

- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **ADR プロトコル**: コア設計の変更前に `docs/adr/` 配下に意思決定記録を保存。
- **データベース管理**: スキーマ変更は `docs/migrations/` 配下に SQL を追加して Supabase で適用。
