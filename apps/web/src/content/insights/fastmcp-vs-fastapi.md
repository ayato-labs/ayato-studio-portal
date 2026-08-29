---
title: "ローカルMCPサーバー構築入門(Python) ― FastMCPはなぜFastAPIやFlaskでは代替できないのか"
description: "LLMエージェント開発に必須となる「Model Context Protocol (MCP)」。PythonでMCPサーバーを構築する際に、なぜ既存のWebフレームワーク(FastAPI/Flask)ではなく「FastMCP」を使うべきなのか、そのアーキテクチャの違いと本質を解説します。"
date: 2026-04-09
category: insights
---

# ローカルMCPサーバー構築入門(Python) ― FastMCPはなぜFastAPIやFlaskでは代替できないのか

近年、LLM(大規模言語モデル)を単なるチャットボットとしてではなく、**外部ツール・データ・業務ロジックと結合した「エージェント」**として活用するケースが急速に増えています。

しかし、自作のAPIをLLMに繋ごうとして、プロンプトによるAPIの仕様説明(JSONスキーマ等)の長さに絶望した経験はないでしょうか?

その解決策となる中核技術が **Model Context Protocol(MCP)** です。本記事では、ローカル環境でMCPサーバーを構築したいPythonエンジニア向けに、「FastMCP」とは何か、そして**「なぜFastAPIやFlaskでは不十分なのか」**を技術的に整理します。

---

## 1. MCP(Model Context Protocol)とは何か?

MCPは、LLMと外部システムを接続するための標準化されたプロトコルです。
従来の「REST APIを作ってLLMから叩かせる」という構成とは異なり、以下の概念を明示的に定義します。

- **Tool**: LLMが自律的に呼び出せる関数(副作用を持つ処理・アクション)
- **Resource**: LLMが参照できるデータ(副作用なし・読み取り専用)
- **Prompt**: 再利用可能なプロンプト定義

重要なのは、MCPが単なる「HTTP APIの集合」ではなく、**「LLMが自分自身で理解・探索・利用できる能力のカタログ」**として設計されている点です。

---

## 2. FastMCPとは何か?

[FastMCP](https://github.com/jlowin/fastmcp) は、このMCPをPythonで最短距離で実装するためのフレームワークです。

誤解されがちですが、**FastMCPの本質は「Webフレームワーク」ではありません。**
「MCPサーバーを正しく、安全に、そして人間が読み書きしやすい形で実装するにはどうすればよいか?」という問いに対する明確な答えを提供する**「MCP専用のDSL(ドメイン特化言語)」**だと捉えると理解しやすいでしょう。

### FastMCPの特徴
- MCPの `Tool` / `Resource` / `Prompt` を `@decorator` で明示的に定義
- MCPプロトコルに準拠した入出力(JSON-RPCメッセージ等)を自動生成
- ASGIベース(内部はStarlette)で高速・非同期に動作
- FastAPIとの統合も公式サポート

例えば「社内DBからデータを検索するツール」なら、わずか3分で実装し、Claude Desktopなどのクライアントから即座に呼び出すことが可能です。

---

## 3. FastAPI / Flask ではなぜ不十分なのか?

これまでAPI構築の定番であったFastAPIやFlaskでMCP互換サーバーを作ろうとすると、どのような問題が起きるのでしょうか。

### 3.1 FastAPI の限界

FastAPIは非常に優秀なASGIフレームワークであり、型安全・高速・自動ドキュメント生成(Swagger UI)といった利点があります。
しかし、FastAPIが解決する問題は**「HTTP APIを人間(や従来のクライアント)にどう設計・提供するか」**です。

一方、MCPが解決するのは以下の領域です:
- LLMがどんな能力を持つのかをどう宣言するか(自己記述性)
- その能力をLLMがどう安全に呼び出すか
- ツール探索をどう担保するか

これらをFastAPIだけでフルスクラッチ実装しようとすると、次のような**構造的な負債**が発生します。
- JSON-RPCベースであるMCP仕様の手動ルーティング実装
- Toolメタデータ(LLMに渡すスキーマ)と関数定義の二重管理
- LLM向け仕様と人間向けAPIの激しい乖離

### 3.2 Flask の限界

Flaskは軽量で学習コストが低い一方、現代のエージェント開発においては以下の特性が足枷になります。

- WSGIベース(非ASGI)であるため非同期処理に弱い
- ストリーミングやセッション管理の仕組みが弱い
- MCPの接続モデル(SSEや標準入出力を介した持続的通信)と相性が悪い

MCPのように「LLMと長寿命・構造化された通信を行う」用途において、Flaskを選ぶ合理的理由は現在ほぼありません。

---

## 4. 比較表:FastMCP vs FastAPI vs Flask

| 観点 | FastMCP | FastAPI | Flask |
| :--- | :--- | :--- | :--- |
| **MCP対応** | **ネイティブ(標準対応)** | 手動実装が必要 | 非現実的 |
| **通信モデル** | ASGI (SSE / stdio) | ASGI (HTTP) | WSGI (HTTP) |
| **Tool / Resource抽象** | **標準装備** | なし | なし |
| **LLM最適化** | **非常に高い** | 低い(人間向けAPI) | 極めて低い |

---

## 5. 最小構成の FastMCP ローカルサーバー例

論より証拠。FastMCPを使えば、これだけのコードでLLMエージェントが利用できるツールとリソースを定義できます。

```python
from fastmcp import FastMCP

# サーバーの初期化
mcp = FastMCP("local-mcp")

# Toolの定義:LLMが実行できる計算ツール
@mcp.tool()
def add(a: int, b: int) -> int:
    """数値を加算します"""
    return a + b

# Resourceの定義:LLMが読み取れる環境情報
@mcp.resource("env://info")
def info() -> str:
    return '{"env": "local", "version": "0.1"}'

if __name__ == "__main__":
    # サーバーの起動
    mcp.run(port=8001)
```

このコードだけで、「MCP準拠の通信基盤」「Tool / Resource のスキーマ宣言」「LLMから探索可能な能力定義」が**すべて揃います**。FastAPIやFlaskで同等のことを行う場合、JSON-RPCハンドラの自作やJSON Schemaの生成構築など、数倍のコード量と仕様理解が必要になります。

---

## 6. 結論:FastMCPは「代替」ではなく「専用品」である

**FastMCPはFastAPIやFlaskの競合ではありません。**

FastAPIやFlaskが「人間やフロントエンドに向けたAPI基盤」であるなら、FastMCPは**「LLMに向けた能力定義フレームワーク」**です。役割が全く異なります。

ローカルMCPサーバーを構築するのであれば、
- MCPのプロトコル仕様を正しく実装したい
- 将来のLLM進化やMCP仕様アップデートに追従したい
- ツール定義を仕様としてスマートに管理したい

という要件を満たすために、車輪の再発明を避けて素直に **FastMCP を選ぶのが必然**と言えるでしょう。
