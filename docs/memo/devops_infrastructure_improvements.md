# インフラ・DevOpsの改善案

## 課題・背景
*   Cloudflare Pages と `next-on-pages` を用いた Edge Runtime 環境で動作している。
*   Edge Runtime は Node.js のフルAPI（`fs` や `path` などのファイルシステム操作等）をサポートしていない。
*   現在、`local-content.ts` などのコードはビルド時に実行されるため問題ないが、将来的に誤ってランタイム（APIルートなど）で Node.js 依存のコードを書いてしまうと、デプロイ時または本番環境でクラッシュする潜在的なリスクがある。

## 改善策（アイデア）

### 1. Edge Compatibility (エッジ互換性) チェックの強化
*   **内容**: CI/CDパイプライン（GitHub Actions の `lint.yml` など）において、Edge Runtime と非互換の API 使用を検知する静的解析（Lint ルール）を導入する。
*   **具体例**:
    *   ESLint プラグインを用いて、ランタイムコード内での `fs`, `child_process`, `crypto` (一部) などの import を警告・エラーにする。
*   **メリット**: 開発者が気づかずに非互換コードをプッシュしてしまうヒューマンエラーを機械的に防ぎ、デプロイの安定性を担保する。
