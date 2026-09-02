# ADR 0008: Flutter Web (Wasm/CanvasKit) と Private リポジトリ分離による知財完全保護アーキテクチャ

## 1. 状態 (Status)
承認 (Accepted)

## 2. 背景・文脈 (Context)
- 通常の Web サイト（JavaScript / React）や GitHub パブリックリポジトリでは、クライアントサイドロジックやプロンプト装飾、UI構造が容易に第三者から解析・コピーされてしまう。
- バックエンドサーバー（API/コンテナ）を増やさず「固定費完全0円」を維持しながら、Flutter のようにロジックの解析・リバースエンジニアリングを物理的・技術的に極限まで困難にするアーキテクチャが求められた。

## 3. 決定事項 (Decision)
1. **リポジトリのオープン／クローズド完全分離**:
   - **非公開層 (`ayato-labs/ayato-apps-core` [Private])**: アプリケーションの生ソースコード（Flutter / Dart、独自アルゴリズム）を完全隔離。
   - **公開層 (`ayato-labs/ayato-studio` [Public])**: ポータルサイト（Next.js）およびコンパイル後の静的バイナリ（Wasm / CanvasKit）のみを配置。
2. **GitHub Actions による Wasm バイナリ自動ビルド＆同期**:
   - Private リポジトリへのプッシュを契機に、CI/CD（無料枠）で `flutter build web --wasm` を実行。
   - 生成されたバイナリ成果物（`.wasm`, `canvaskit/`, `main.dart.js`）のみを Public ポータルの `apps/web/public/flutter-apps/` へ自動同期。
3. **Next.js ポータルでのハイブリッド統合**:
   - ポータル側で SEO・AdSense・利用規約を統括しつつ、アプリ画面は Wasm / CanvasKit によるピクセル直描き（DOM非公開・バイナリ実行）で配信。

## 4. 採用理由 (Why)
1. **知財・ロジックの二重防御（100%保護）**:
   - 生コードは Private リポジトリにあるため GitHub 上で閲覧不能。
   - Web 配信物は Wasm 機械語バイトコードかつ Canvas 1枚描画であるため、ブラウザ DevTools やスクレイパーでも解析・コピー不能。
2. **固定費完全 0 円の維持（減算の美学）**:
   - バックエンドサーバー・APIインスタンスの常時維持費用がゼロ。GitHub Actions（無料枠）と Cloudflare Pages（無料静的ホスティング）のみで運用可能。
3. **SEO・集客と知財保護の完全両立**:
   - ポータルと外枠は Next.js DOM を維持して Google 検索や広告配信を最大化し、中身のアプリロジックだけをブラックボックス化できる。

## 5. 不採用理由 (Why Not)
- **単一 Public リポジトリ内での JS 難読化**:
   - GitHub に生コードが公開されているため、Web 上でどれだけ難読化しても知財保護の意味をなさないため却下。
- **有料バックエンドサーバーによるロジック隠蔽**:
   - 常時稼働コストやスケール時の従量課金が発生し、「固定費ゼロ」の設計原則に反するため却下。

## 6. 結果・影響 (Consequences)
- **メリット (Positive)**:
   - 固定費ゼロのまま、最高強度の知財保護と耐リバースエンジニアリング性を実現。
   - 開発者は Private リポジトリで Dart/Flutter 開発に集中し、ビルド・公開は全自動化。
- **トレードオフ / 注意点 (Negative / Risks)**:
   - Flutter Web の初回読み込み時に数MBの Wasm/フォントのダウンロードが発生するが、スプラッシュ画面による演出で許容。
