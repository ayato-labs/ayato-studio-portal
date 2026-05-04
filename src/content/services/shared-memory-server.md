---
title: SharedMemoryServer - AI エージェントの「共通記憶」を実現する MCP サーバー
description: 複数エージェント、あるいは同一エージェントの異なるセッション間で記憶を引継ぐ。
date: 2026-03-25
category: services
image: /images/shared-memory-thumb.png
---

# SharedMemoryServer: Unified Context Memory

SharedMemoryServer は、AI エージェントに **永続的かつ構造化された記憶** を付与するための、MCP (Model Context Protocol) サーバーの実装です。

## なぜ共通記憶が必要か?
現在の多くの AI システムは、チャット・セッションが終わるたびに過去の対話やプロジェクトの文脈を「忘れて」しまいます。SharedMemoryServer を中継することで、**エージェントは過去の成功体験や失敗から学習し、プロジェクトを跨いだ改善** が可能になります。

## 実装されている 3 つの記憶
1.  **Semantic Memory (セマンティック記憶)**: ベクトル検索による、概念的な関連情報の抽出。
2.  **Graph Memory (グラフ記憶)**: エンティティ(人、場所、技術、概念)間の関係性を記述し、論理的な推論を支援。
3.  **Episodic Memory (エピソード記憶)**: 過去の「思考プロセス」を記録し、解決策への道筋を再現。

詳細: [GitHub Repository](https://github.com/Ayato-AI-for-Auto/SharedMemoryServer)