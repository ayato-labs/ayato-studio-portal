# Ayato Intelligence Engine

LLMを活用した次世代型インテリジェンス・レポート生成システム。
情報の洪水から価値ある洞察を抽出し、AIによる「フロー型（速報・分析）」コンテンツを生成します。

---

## Content Layers (Flow vs Stock)

本エンジンは、情報の速度（Velocity）と密度（Density）に合わせて以下のレポートを生成します。

### 1. Market Reports (Daily / Flow)
**目的**: 日々のノイズを排除し、クリティカルな変化のみを抽出する「点」の情報。
- **AI Tech (`tech`)**: arXiv 論文の技術動向とテックフィードの統合。
- **Energy (`energy`)**: 地政学的な供給構造と市場インパクトの分析。
- **Money Supply (`finance`)**: マクロ流動性とマーケットシナリオの予測。

### 2. Strategy Review (Weekly / Deep Analysis)
**目的**: 1週間の「点」の情報を繋ぎ合わせ、中長期的な「線」のシナリオを提示。
- **Weekly Review (`weekly`)**: 過去7日間の高スコアレポートを統合分析し、戦術から戦略レイヤーへの昇華を行います。
- **出力**: 3000〜5000文字規模の高密度コラムを Supabase へ配信し、ポータルの「Blog」セクションで公開されます。

---

## Engine Structure

```
ayato_reporter/
  core/            # 分析基盤（AIエンジン, プロンプト管理）
  plugins/         # ドメイン別ロジック
    weekly_review/ # 週刊統合分析プラグイン (New)
    tech, energy, finance # 各種速報プラグイン
  data/config/     # フィード定義
  main.py          # 統合エントリーポイント
```

## Running the Engine

```bash
# 1. 日次速報（個別実行）
uv run python main.py --engine tech

# 2. 週刊インテリジェンス・レビュー（統合実行）
# 過去1週間のデータを取得し、戦略コラムを生成します
uv run python main.py --engine weekly
```

---

## System Evolution: Hybrid Intelligence
本エンジンが生成するコンテンツは、`ayato_studio_portal` における **AI駆動の自動知性層** を構成します。これを人間が執筆する **ローカル Markdown（静的資産）** と組み合わせることで、情報の「鮮度」と「権威性」を両立したメディア体験を実現します。
