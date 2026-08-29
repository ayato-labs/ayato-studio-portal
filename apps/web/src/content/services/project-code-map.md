---
title: ProjectCodeMap - AI駆動開発のためのASTリポジトリコンテキスト最適化
description: LLMのコンテキスト制限とトークン浪費を突破する。tree-sitter AST解析により、最小トークンで最大文脈をChatGPT/Claude/Cursorに伝達する次世代コードマッパー。
date: 2026-08-29
category: services
image: /images/project-code-map-thumb.png
---

# ProjectCodeMap: Break the Context Window Barrier in AI Development

> **「AIに生コードを読ませるな、AST構造を渡せ。トークン消費を最大80%削減する開発者専用コンテキスト最適化エンジン」**

`ProjectCodeMap` は、ChatGPT、Claude、Cursor、Cline、AiderなどのAIツールにプロジェクト全体を理解させたいとき、**「LLMが最小のトークン数で最大の文脈を把握できる形式（ツリー構造 ＋ 関数シグネチャ ＋ 依存関係）」** でリポジトリを瞬時に構造化するエンジニア向けツールです。

---

## 解決する課題

| 従来のAI開発の悩み | **ProjectCodeMapでの解決** |
| :--- | :--- |
| **ツリー構造を手動コピペしてトークンを浪費する** | **トークン効率の良い構造化出力 (XML / Markdown / JSON)** でワンショット注入 |
| **関数名しか見えず、責任境界がAIに伝わらない** | **`tree-sitter` によるAST解析** でシグネチャ＋ドックストリング要約を自動抽出 |
| **`node_modules` や `__pycache__` 等のノイズ混入** | **`.gitignore` 準拠 ＋ 独自 `.pcmignore`** で高精度なノイズ完全排除 |
| **AIツールごとに設定方法がバラバラ** | **Aider / Cursor / Cline 等の標準プロトコル対応オプション** を内蔵 |

---

## 主な機能と技術的特長

### 1. `tree-sitter` による高精度 AST 解析
コードの内部実装（関数本体の何千行もの生ロジック）をそのまま渡すと、AIのコンテキストウィンドウが溢れ、肝心の文脈を見失います。
`ProjectCodeMap` は、構文木（AST）から「クラス名」「関数シグネチャ」「引数の型」「戻り値の型」「ドックストリング（要約）」だけをスマートに抽出します。

### 2. LLMが最も理解しやすい XML / Markdown 出力
Claude や GPT-4 などの先端フロンティアモデルが最も文脈を誤読しにくい XMLタグ形式（`<file path="...">`）および Markdownツリー形式で出力。
AIチャットの「カスタム指示」や、AIエージェントの初期プロンプトに貼り付けるだけで、AIの回答精度が劇的に向上します。

### 3. ワンライナーで即座に実行可能 (CLI)
インストールすら不要で、プロジェクトルートで以下のコマンドを実行するだけで使えます。

```bash
# uv を使って即実行 (インストール不要)
uvx project-code-map --format xml > context.xml
```

---

## 料金プラン & 利用方法

| プラン | 価格 | 提供形態 / 内容 |
| :--- | :--- | :--- |
| **Community CLI** | **0 円** (オープンソース) | CLI完全無料 (`uvx project-code-map`)、ローカルAST解析無制限 |
| **ProjectCodeMap Pro** | **月額 980 円** | GitHubプライベートリポジトリ連携、AST依存関係グラフ可視化、チーム共有 |
| **Hosted MCP API** | **月額 1,480 円** | Cursor/Claudeから直接呼び出せるクラウドMCPサーバー接続 |

- **GitHub Repository**: [ayato-labs/ProjectCodeMap](https://github.com/ayato-labs/ProjectCodeMap)
- **PyPI Package**: [project-code-map (PyPI)](https://pypi.org/project/project-code-map/)
