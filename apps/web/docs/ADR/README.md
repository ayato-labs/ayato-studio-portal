# Architecture Decision Records (ADR)

このディレクトリは、Ayato Studio Portal における重要なアーキテクチャ・設計上の意思決定（ADR）を記録・管理する場所です。
設計の背景、決定内容、および決定によって生じる影響（Consequences）を記述し、プロジェクトの履歴として保存します。

## ライフサイクルと運用ルール

1. **記録対象**:
   - 新規フレームワーク・ライブラリの採用
   - アーキテクチャパターンの変更
   - インフラ構成やデプロイプロセスの変更
   - セキュリティ方針やアクセス制御（RLS等）の変更
   - 外部API・決済サービスの選定またはピボット
   - データスキーマの破壊的変更

2. **命名規則**:
   - `ADR-NNNN-<slug>.md` （`NNNN` は0001から始まる4桁の連番、`slug` はkebab-case）

3. **Statusの遷移**:
   - `Proposed` (提案中) -> `Accepted` (承認済) -> `Deprecated` (廃止) または `Superseded by ADR-NNNN` (新ADRにより上書き)
   - 一度作成されたADRは削除せず、Statusの更新によって履歴を維持します。

## 目次 (Index)

- **[ADR-0001: AIエージェント統合スタジオとしてのリブランディングとルーティング・コンテンツのクリーンアップ](file:///c:/Users/saiha/My_Service/programing/ayato-studio/main-web-tech-ai/docs/ADR/ADR-0001-brand-positioning-and-refactoring.md)** (Status: Accepted)
- **[ADR-0002: LLMベンチマーク＆コストダッシュボードの動的自動更新化とベンチマーク性能の動的推定ロジックの導入](file:///c:/Users/saiha/My_Service/programing/ayato-studio/main-web-tech-ai/docs/ADR/ADR-0002-dynamic-llm-benchmark-dashboard.md)** (Status: Accepted)
