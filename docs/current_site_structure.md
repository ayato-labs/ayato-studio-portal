# Ayato Studio: 現状のサイト構造 & ルーティング一覧

## 1. 全体アーキテクチャ概要

```mermaid
graph TD
    Domain[ayato-studio.ai] --> MainPortal[メインポータル (main-web-tech-ai)]
    Domain --> SubFinance[finance.ayato-studio.ai (sub-web-finance-ai)]
    Domain --> SubGame[game.ayato-studio.ai (sub-web-game-ai)]
    Domain --> HQ[hq.ayato-studio.ai (ayato_intelligence_hq)]

    subgraph MainPortal_Pages [メインポータル主要ページ]
        Home["/ (トップページ)"]
        Reports["/reports (AI・テック速報)"]
        Insights["/insights (技術ブログ)"]
        Academy["/academy (理論・学習)"]
        Stats["/stats (LLM性能比較)"]
        Services["/services (ソリューション紹介)"]
        Apps["/apps (自作Webツール群)"]
    end

    MainPortal --> MainPortal_Pages
```

---

## 2. メインポータル (`main-web-tech-ai`) の全ルーティング一覧

### A. コンテンツ & インテリジェンス層
| パス | ページ名 | データソース | 内容・役割 |
| :--- | :--- | :--- | :--- |
| `/` | トップページ | 静的 + Supabase | サービス概要、最新記事・速報、CTA導線 |
| `/reports` | News / Reports | Supabase DB (`generated_reports`) | `ayato_reporter` が自動収集・要約した最新AI論文・ニュース |
| `/reports/[id]` | レポート詳細 | Supabase DB | 個別ニュース・論文の日本語要約・解説 |
| `/insights` (`/blog`) | Insights / Blog | ローカル Markdown (`src/content/blog/`) | 技術実践、MCP、AIツール活用などの深掘り記事 |
| `/insights/[slug]` | 記事詳細 | ローカル Markdown | 個別ブログ記事 + Note(有料記事)への誘導CTA |
| `/academy` | Academy | ローカル Markdown (`src/content/academy/`) | 数学・AI基礎理論の教育コンテンツ |
| `/stats` | LLM Stats | ローカル JSON (`llm-stats.json`) | 主要LLMモデルのスペック・コスト比較表 |

### B. 自作システム・プロダクト層 (Showcase / Apps)
| パス | ページ名 | 状態 | 内容・役割 |
| :--- | :--- | :--- | :--- |
| `/services` | Services | 稼働中 | 提供ソリューション・自作システムのカタログ |
| `/services/movie-to-text` | MovieToText | 稼働中 | 動画音声文字起こしツールの紹介・導線 |
| `/services/logichive` | LogicHive | 稼働中 | コード資産再利用・エンジニアリングソリューション |
| `/services/ripen` | Ripen | 稼働中 | 長期記憶・コンテキスト保持ソリューション |
| `/apps` | Applications | 稼働中 | 自作Webツール・ミニアプリ一覧 |
| `/apps/gmail-protector` | Gmail Protector | 稼働中 | メール誤送信・情報漏洩防止ツール |
| `/apps/meeting-burn-rate` | Meeting Burn Rate | 稼働中 | 会議の人件費コストをリアルタイム可視化 |
| `/apps/site-downloader` | Site Downloader | 稼働中 | Webサイト一括保存・分析ツール |

### C. 認証・決済・共通基盤
| パス | 機能 | 技術 |
| :--- | :--- | :--- |
| `/auth/callback` | ユーザー認証コールバック | Supabase Auth |
| `/actions/stripe-checkout` | 有料決済・サブスクリプション | Stripe API |

### D. 法的・情報ページ
| パス | ページ名 |
| :--- | :--- |
| `/about` | 運営者情報・理念 |
| `/contact` | お問い合わせフォーム |
| `/support` | サポート案内 |
| `/privacy` | プライバシーポリシー |
| `/terms` | 利用規約 |
| `/tokutei` | 特定商取引法に基づく表記 |
| `/sitemap.xml` | 検索エンジン用サイトマップ (自動生成) |
| `/robots.txt` | クローラー制御 |

---

## 3. サブプロジェクトの構成

1. **`sub-web-finance-ai` (`finance.ayato-studio.ai` 想定)**
   - 金融・EDINET・適時開示データの特化ポータル
2. **`sub-web-game-ai` (`game.ayato-studio.ai` 想定)**
   - ゲーム開発・エンタメAI特化ポータル
3. **`ayato_intelligence_hq` (`hq.ayato-studio.ai` / ローカル)**
   - システム稼働監視・データ集約ダッシュボード (自分専用)
4. **`ayato_reporter` (GCP Cloud Run Job)**
   - 外部データクローリング・Gemini要約・Supabase自動登録バッチ
