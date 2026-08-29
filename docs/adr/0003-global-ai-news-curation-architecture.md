# ADR 0003: [新規機能追加] 全世界AIニュース・キュレーションフィード (Gemma判定 & 原文リンク)

## 1. 状態 (Status)
提案中 (Proposed)

## 2. 背景・文脈 (Context)
既存の日本語要約レポート機能（`/reports`）とは別に、**「全世界からAI関連ニュースを収集し、Gemini AI Studio API (Gemma) で採用・不採用を判定した上で、原文タイトルと元記事リンクを時系列で表示し続ける独立した新規機能」** を追加する。
既存のシステムやデータ構造には一切手を加えず、純粋な機能追加（Additive Architecture）として実装する。

## 3. 決定事項 (Decision)
1. **完全な独立機能追加（Non-breaking Extension）**:
   - 既存の `/reports` や `generated_reports` テーブルはそのまま維持。
   - 新規テーブル `ai_news`、新規プラグイン `ayato_reporter/src/plugins/global_news/`、新規ページ `main-web-tech-ai/src/app/news/` を独立して新設する。
2. **Gemma / Gemini による採用判定**:
   - 収集した記事候補に対し、Gemma / Gemini Flash で重要度と採用可否（`adopt: true/false`）を高速バッチ判定。
3. **翻訳なし・原文リンク配信**:
   - 翻訳・要約は行わず、原文タイトル、元記事URL、ソース名、公開日時、カテゴリをそのまま配信。

```mermaid
graph TD
    subgraph New_Feature [新規追加機能: Global AI News]
        RSS[全世界のAI RSS/Atom] --> Collector[新プラグイン: global_news]
        Collector -->|採用判定要求| Gemma[Gemini AI Studio (Gemma)]
        Gemma -->|判定結果(Yes/No)| Collector
        Collector -->|採用記事のみ保存| NewDB[(新規テーブル: ai_news)]
        NewDB --> NewPage[新規ページ: /news]
        NewPage --> User[ユーザー (ブラウザ翻訳利用)]
    end

    subgraph Existing_Feature [既存機能 (無変更・維持)]
        TechRSS[Tech RSS] --> TechPlugin[既存: tech プラグイン]
        TechPlugin --> OldDB[(既存テーブル: generated_reports)]
        OldDB --> OldPage[既存ページ: /reports]
    end
```

## 4. 採用理由 (Why)
- **安全性の最大化 (Safety > Implementation)**: 既存の動作中システムに影響を与えず、安全に新しい価値（全世界ニュースフィード）をプラグイン型で追加できる。
- **超低コスト・高速性**: 翻訳・要約処理を行わないため、APIトークン消費と処理時間を最小化できる。

## 5. 結果・影響 (Consequences)
- **メリット**: 既存の日本語レポート（`/reports`）と、全世界の速報原文リンク（`/news`）の双方が揃い、メディアとしての網羅性が飛躍的に向上する。
- **注意点**: 新規テーブルの作成と新規ルートの追加のみで完結させるため、既存コードへの侵襲的変更はナビゲーションリンク追加のみに限定する。
