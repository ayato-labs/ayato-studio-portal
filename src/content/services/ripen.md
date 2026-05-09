---
title: Ripen - The Shared Memory Hub for AI Teams
description: "Cross-PC, cross-account, and cross-tool knowledge sharing. Connect N agents to 1 centralized hub to end AI 'Multi-Personality Disorder'."
date: 2026-05-09
category: services
image: /images/ripen-thumb.png
---

# Ripen: End the "AI Multi-Personality Disorder"

**Ripen** is a high-performance, centralized memory infrastructure designed for the multi-agent era. By acting as an **SSE Hub**, Ripen enables seamless knowledge sharing across different AI tools (Cursor, Claude Code, Antigravity, Gemini CLI), different accounts, and even different physical machines within a team.

---

## 1. 概要: AI 駆動開発の「多重人格障害」を治す

AI 駆動開発が加速する一方で、新たな問題が発生しています。それは、**「AI ツール間、およびチームメンバー間での知識の断絶」**です。

- **Cursor** で決めた設計方針を、ターミナルの **Gemini CLI** は知りません。
- **開発者 A** が解決したバグの知見を、**開発者 B** の AI エージェントは参照できません。

Ripen は、チームのどこかで常駐する「共有黒板」として機能し、すべての AI エージェントが同一の知識ベースを読み書きできるようにすることで、このサイロ化を根本から解決します。

## 2. 核心的な差別化：stdio (1:1) から SSE Hub (N:1) へ

一般的な MCP メモリサーバーの多くは `stdio` トランスポートを使用しており、**1つの IDE と 1つのサーバーが 1:1 で接続される**限定的な構造です。

Ripen は **SSE (Server-Sent Events) ハブ** として動作します。

- **N:1 接続**: 複数の IDE、複数のユーザーが、同一の知識ベース（Single Source of Truth）に同時かつ自動的に接続します。
- **クロスプラットフォーム・クロスアカウント**: 物理的に異なる PC や、異なるアカウントで稼働する AI エージェント同士でも、プロトコル層（MCP over SSE）を通じて知識を同期できます。

## 3. 3つの記憶レイヤーと知識の「熟成」

Ripen は単なるベクター検索ツールではありません。AI が「文脈」を理解し、自己組織化するための多層構造を持っています。

### Logic Graph (構造化記憶 / 形式知)
AI 自身がエンティティ（技術、人、概念）とその関係性を抽出し、ネットワークとして記録します。単なる検索ではなく「論理的な推論」を支援します。

### Memory Bank (静的記憶 / 深い文脈)
Markdown ベースの技術仕様書やルールを管理します。人間による直接編集や Git での差分管理が可能で、AI がプロジェクトの「憲法」として参照します。

### Thought Log (推論プロセス / 思考の蒸留)
AI の「Sequential Thinking（逐次思考）」をすべて記録します。セッション終了後、AI は自らの思考を振り返り、将来役立つ知見だけをグラフへ「蒸留（Distillation）」します。

### 知識のライフサイクル管理
知識は保存されて終わりではありません。Ripen は、知識の **成熟（Ripening）** と **減衰（Decay）** を管理します。頻繁に使われる知識は強化され、古くなった情報は自動的にアーカイブされることで、常に新鮮なコンテキストを維持します。

## 4. テクニカル・ハイライト (Plan A Strategy)

「複雑さよりも信頼性」を優先し、極限まで実用性を高めた設計です。

- **超低レイテンシ**: SQLite + FAISS (Local-first) により、検索レスポンス **12ms 以下** を実現。
- **ゼロコンフィグ & Graceful Degradation**: LLM (Ollama/Gemini) が未設定の状態でも、基本機能（ベクトル検索、グラフ操作）は完全に動作します。
- **ローカルファースト・プライバシー**: 埋め込みエンジンに **FastEmbed** を採用。データは 100% 手元の環境で完結し、外部 SaaS への依存を最小限に抑えます。
- **監査とアカウンタビリティ**: `audit_logs` により、「どの AI が、いつ、どの知識を参照/変更したか」を完全に追跡可能です。

## 5. クイックスタート

`uvx` を利用すれば、Python 環境の構築すら不要で 3 分以内に導入可能です。

```bash
# 1. 親機 (Hub) の起動
uvx ripen --sse

# 2. 初期設定 (モードで 'hub' を選択)
uvx ripen-init

# 3. 子機 (Client) の登録 (Hub URL を入力するだけ)
uvx ripen-register --hub-url http://<hub-ip>:8377
```

---

> **"Every MCP memory server is 1:1. Ripen is N:1."**
>
> ツールを問わず、アカウントを問わず、チーム全員の AI が同じ「記憶」を共有する。それが Ripen が提供する、次世代の AI 駆動開発インフラです。

[GitHub Repository (OSS)](https://github.com/ayato-labs/ripen)
