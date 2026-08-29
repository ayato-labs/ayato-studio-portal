/**
 * Ayato Studio SaaS Products & Subscription Plans Catalog
 */

export interface PricingPlan {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number; // in JPY
  interval: 'month' | 'year' | 'one_time';
  stripePriceId?: string; // Fill with actual Stripe Price ID (price_...)
  features: string[];
  recommended?: boolean;
}

export const PRODUCTS_CATALOG = {
  SUPPORTER: 'supporter',
  MOVIE_TO_TEXT: 'movie-to-text',
  PROJECT_CODE_MAP: 'project-code-map',
  TENK_ORBIT: 'tenk-orbit',
  INTRINSIC_VALUE: 'intrinsic-value',
  HOSTED_MCP: 'hosted-mcp',
} as const;

export const PRICING_PLANS: PricingPlan[] = [
  // 1. Ayato Studio Supporter Tiers
  {
    id: 'supporter-basic',
    productId: PRODUCTS_CATALOG.SUPPORTER,
    name: 'Supporter Tier (Coffee)',
    description: 'Ayato Studio の研究開発・サーバー運用を応援する基本プラン',
    price: 500,
    interval: 'month',
    features: ['全記事・レポートの先行閲覧', 'コミュニティDiscord招待', 'スポンサー一覧にお名前掲載'],
  },
  {
    id: 'supporter-pro',
    productId: PRODUCTS_CATALOG.SUPPORTER,
    name: 'Pro Supporter (Backer)',
    description: '全AIサービスへの優先アクセス権付きスポンサープラン',
    price: 2980,
    interval: 'month',
    recommended: true,
    features: [
      '全WebツールのPro機能使い放題',
      '限定リサーチレポート・論文解説の閲覧',
      '新機能のベータテスト優先参加権',
      'スポンサー一覧にリンク付き掲載',
    ],
  },

  // 2. MovieToText (AI文字起こし & 議事録)
  {
    id: 'mtt-free',
    productId: PRODUCTS_CATALOG.MOVIE_TO_TEXT,
    name: 'Free Starter (無料枠)',
    description: '1ファイル最大10分までの完全オフライン文字起こし',
    price: 0,
    interval: 'one_time',
    features: [
      '1ファイル最大10分までの文字起こし',
      '完全オフライン・0バイト外部送信',
      '話者分離 (CAM++) 対応',
      'テキスト/SRT書き出し',
    ],
  },
  {
    id: 'mtt-pro-monthly',
    productId: PRODUCTS_CATALOG.MOVIE_TO_TEXT,
    name: 'MovieToText Pro (月額)',
    description: '時間無制限 & 全会議横断AIナレッジ検索',
    price: 1480,
    interval: 'month',
    recommended: true,
    features: [
      '時間無制限の完全オフライン文字起こし',
      '過去全会議の横断AI検索 (Non-Embedding RAG)',
      '複数ファイル一括バッチ処理',
      'オフライン暗号署名ライセンスキー発行',
      '優先アップデート ＆ サポート',
    ],
  },
  {
    id: 'mtt-lifetime',
    productId: PRODUCTS_CATALOG.MOVIE_TO_TEXT,
    name: 'MovieToText Lifetime (買切)',
    description: '一度の購入で永久に全機能使い放題の買切ライセンス',
    price: 9800,
    interval: 'one_time',
    features: [
      '永久無期限の Pro 機能アンロック',
      '時間無制限の完全オフライン文字起こし',
      '過去全会議の横断AI検索 (Non-Embedding RAG)',
      '複数ファイル一括バッチ処理',
      '永久オフライン暗号署名ライセンスキー発行',
    ],
  },

  // 3. ProjectCodeMap Web (AI開発コンテキスト最適化)
  {
    id: 'pcm-pro',
    productId: PRODUCTS_CATALOG.PROJECT_CODE_MAP,
    name: 'ProjectCodeMap Pro',
    description: 'リポジトリAST解析 & AI最適化プロンプト生成',
    price: 980,
    interval: 'month',
    features: [
      '無制限のリポジトリWeb解析',
      'GitHubプライベートリポジトリ連携',
      'Cursor / Claude / Cline 向けXMLワンクリック出力',
      'AST依存関係マップ図のエクスポート',
    ],
  },

  // 4. TenKOrbit Cloud (1万時間AI伴走コーチ)
  {
    id: 'tenk-pro-sub',
    productId: PRODUCTS_CATALOG.TENK_ORBIT,
    name: 'TenKOrbit Pro Cloud',
    description: 'クラウド同期 & 手書きノートAI指導',
    price: 980,
    interval: 'month',
    features: [
      'マルチデバイス (Web / Android / Desktop) クラウド自動同期',
      '手書きノート写真からのAI弱点分析レポート',
      '難関資格別 合格マイルストーンテンプレート',
    ],
  },
  {
    id: 'tenk-lifetime',
    productId: PRODUCTS_CATALOG.TENK_ORBIT,
    name: 'TenKOrbit Lifetime License',
    description: 'デスクトップ＆Android版 永久ライセンス（買い切り）',
    price: 4980,
    interval: 'one_time',
    features: [
      'Windows / macOS / Android APK 永久利用ライセンス',
      '完全ローカル・オフライン動作（外部送信ゼロ）',
      '手書きノートOCR & ローカルAI伴走機能',
      '将来の全アップデート無制限',
    ],
  },

  // 5. Intrinsic Value Radar (AI適正株価・バリュエーション)
  {
    id: 'iv-pro',
    productId: PRODUCTS_CATALOG.INTRINSIC_VALUE,
    name: 'Intrinsic Value Pro',
    description: '1万社AI適正価格検索 & 割安度ランキング',
    price: 2980,
    interval: 'month',
    recommended: true,
    features: [
      '日本株・米国株 全銘柄のAI適正価格 (DCF) 検索',
      'ウォーレン・バフェット流 割安度ランキングTOP100',
      '四半期決算後の適正価格・モートスコア自動更新',
      '割安シグナル発生時の即時アラート通知',
    ],
  },
];
