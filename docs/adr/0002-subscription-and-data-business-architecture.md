# ADR 0002: サブスクリプション課金・データ提供・自作アプリSaaS化アーキテクチャ

## 1. 状態 (Status)
提案中 (Proposed)

## 2. 背景・文脈 (Context)
将来構想として以下の2大ビジネス・サービス展開を計画している。
1. **データ提供事業 (edinetdb.jp モデル)**: EDINET・適時開示・財務データの収集・構造化・APIおよびWebポータルでの無料/有料データ配信。
2. **自作アプリのSaaS化 & サブスク課金 (Trancform_MovieToText 等)**: 動画文字起こし・AI分析などの自作アプリにWeb版/チーム共有機能を持たせ、Stripe課金による無料/有料プラン（サブスクリプション）を提供。

## 3. 決定事項 (Decision)
**現行基盤（Next.js + Supabase Auth/DB/Storage + Stripe + GCP Cloud Run）を拡張してサブスクリプション・データSaaS基盤を構築する。**

```mermaid
graph TD
    User[ユーザー / 企業] -->|1. 閲覧 / 登録| Web[Next.js ポータル (ayato-studio.ai / finance.*)]
    User -->|2. サブスク決済| Stripe[Stripe Checkout / Customer Portal]
    Stripe -->|3. Webhook (契約ステータス同期)| EdgeWorker[Next.js API / Cloudflare Worker]
    EdgeWorker -->|4. プラン更新| SupaDB[(Supabase DB: Users / Subscriptions)]

    subgraph Data_SaaS [データ提供事業 (EDINET等)]
        Collector[ayato_reporter (GCP Run)] -->|定期データ収集| SupaDB
        Web -->|RLSでプラン別制限 (Free vs Pro)| SupaDB
        API[api.ayato-studio.ai] -->|APIキー検証 & レート制限| SupaDB
    end

    subgraph App_SaaS [自作アプリ (MovieToText等)]
        AppUser[Web / デスクトップアプリ] -->|Supabase Authでログイン| Web
        AppUser -->|動画・音声アップロード| SupaStorage[Supabase Storage]
        SupaStorage -->|文字起こし・AI処理| Compute[GCP Cloud Run (Whisper / Gemini)]
        Compute -->|結果保存・社内共有| SupaDB
    end
```

## 4. 採用理由 (Why)
1. **Supabase Row Level Security (RLS) による強固なプラン別アクセス制御**:
   - 無料ユーザー（Free）と有料ユーザー（Pro）のデータ参照範囲（例: 無料は直近データのみ、有料は全期間データ・高精度API）をDBレイヤーで安全に制御可能。
2. **Stripe + Supabase の標準エコシステム**:
   - すでに `main-web-tech-ai` 内に Stripe 連携の基礎コードが存在し、Customer Portal や Webhook との接続工数が極小。
3. **重い処理（動画音声変換・データ集計）と配信（SSG/Edge）の完全分離**:
   - Web表示はCloudflare Pages/Next.jsで超高速。重いバッチや動画変換処理はオンデマンドの GCP Cloud Run で実行するため、サーバーダウンのリスクがなくコスト効率が最大化される。

## 5. 不採用理由 (Why Not)
- **外部SaaSプラットフォーム（Shopify, note等）への完全依存**:
  - 手数料が高い（10〜20%以上）、API連携や自作アプリとのシームレスなログイン共有・社内チーム管理が困難。
- **専用の決済サーバーを独自運用**:
  - PCI DSS（クレジットカード業界セキュリティ基準）の準拠負担が膨大。Stripe Checkout / Elements を活用することで、セキュアかつ最小工数でサブスクリプションを実装可能。

## 6. 結果・影響 (Consequences)
- **メリット (Positive)**:
  - 1つの統合基盤（Ayato Studio）で、自作アプリのSaaS展開、金融データ販売、API提供、ブログ集客がすべてシームレスに繋がる。
  - 個人運用の限界を超えて、B2B/B2C双方に向けた収益化が可能になる。
- **注意点 (Risks)**:
  - 動画・音声などの大容量データ処理（Whisper等）にはGPU/CPUコストがかかるため、無料プランには明確な容量・時間制限（例: 月15分まで）を設ける設計が必要。
