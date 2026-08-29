# Ayato Studio: Stripe ダッシュボード設定 & 本番開通完全マニュアル

本ドキュメントは、Ayato Studio のコード側（Next.js）と Stripe 本番アカウントを接続し、実際にクレジットカード決済・サブスクリプション課金を受理できるようにするための設定手順書です。

---

## 1. Stripe ダッシュボード設定チェックリスト

```mermaid
graph TD
    A[1. Stripe アカウント作成・ログイン] --> B[2. APIキー (Secret / Publishable) の取得]
    B --> C[3. Webhook エンドポイントの登録]
    C --> D[4. カスタマーポータル (解約・カード変更) の有効化]
    D --> E[5. Cloudflare / .env への環境変数反映]
```

---

## 2. 具体的な設定ステップ

### ステップ 1: API キーの取得
1. [Stripe Dashboard](https://dashboard.stripe.com/) にログインします。
2. 右上のトグルで「テスト環境（Test mode）」または「本番環境（Live mode）」を選択。
3. 左メニュー **`開発者` > `APIキー`** を開きます。
4. 以下の2つのキーをコピーします：
   - **公開可能キー (Publishable key)**: `pk_test_...` または `pk_live_...`
   - **シークレットキー (Secret key)**: `sk_test_...` または `sk_live_...`

---

### ステップ 2: Webhook エンドポイントの登録
決済成功や解約の通知を Next.js で受け取るための設定です。

1. 左メニュー **`開発者` > `Webhook`** を開きます。
2. **「エンドポイントを追加 (Add endpoint)」** をクリック。
3. **エンドポイントURL**:
   - `https://ayato-studio.ai/api/webhooks/stripe`
4. **リッスンするイベント (Select events to listen to)**:
   - `checkout.session.completed` (決済・サブスク契約完了)
   - `customer.subscription.updated` (プラン変更・更新)
   - `customer.subscription.deleted` (サブスク解約)
   - `invoice.payment_succeeded` (毎月の定期支払い成功)
   - `invoice.payment_failed` (支払い失敗・カード期限切れ)
5. 作成後、**「署名シークレット (Signing secret)」** の `表示 (Reveal)` をクリックしてコピーします（`whsec_...` 形式）。

---

### ステップ 3: Stripe カスタマーポータルの有効化
ユーザーがマイページから自分でサブスクを解約したり、クレジットカードを変更できるようにする公式画面の設定です。

1. 右上歯車アイコン **`設定` > `課金` > `カスタマーポータル`** を開きます。
2. **「機能」** セクションにて：
   - 「顧客によるサブスクリプションのキャンセルを許可する」を **ON**
   - 「顧客による支払い方法の更新を許可する」を **ON**
   - 「顧客による請求書の表示を許可する」を **ON**
3. 右上の **「変更を保存」** をクリック。

---

### ステップ 4: 環境変数の設定 (Cloudflare Pages & ローカル)

取得したキーを環境変数に設定します。

#### A. ローカル開発環境 (`main-web-tech-ai/.env.local`)
```ini
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SoSqbPCeWLY3R8VHIfpVlMVQjS3jhBIeIooEQ7cYGlOWhMYp67RSsRi0UYfchCis6eGtFLbQVmXdvraQUcjcFOW004xrG1mjx
STRIPE_SECRET_KEY=sk_test_...（あなたのSecret Key）
STRIPE_WEBHOOK_SECRET=whsec_...（ステップ2で取得したWebhook Secret）
```

#### B. 本番環境 (Cloudflare Pages Dashboard)
1. Cloudflare Dashboard > `Workers & Pages` > `ayato-studio-portal` > `Settings` > `Environment variables` を開く。
2. 以下の3つの変数を追加・更新：
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY` (Encrypt / 暗号化保存)
   - `STRIPE_WEBHOOK_SECRET` (Encrypt / 暗号化保存)

---

## 3. 本番テスト決済の流れ
1. まずは Stripe の **テスト環境 (`sk_test_...`)** でテストカード（`4242 4242 4242 4242`）を使って決済をシミュレーション。
2. Supabase の `user_subscriptions` テーブルにデータが自動登録されることを確認。
3. 問題なければ **本番環境 (`sk_live_...`)** のキーに切り替えて本番ローンチ。
