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

  // 2. MovieToText Web (AI文字起こし & 議事録)
  {
    id: 'mtt-free',
    productId: PRODUCTS_CATALOG.MOVIE_TO_TEXT,
    name: 'Free Starter',
    description: 'お試し文字起こし',
    price: 0,
    interval: 'one_time',
    features: ['月15分までの音声・動画文字起こし', 'ローカル書き出し (TXT/SRT)'],
  },
  {
    id: 'mtt-pro',
    productId: PRODUCTS_CATALOG.MOVIE_TO_TEXT,
    name: 'MovieToText Pro',
    description: 'クラウド無制限 & AI議事録生成',
    price: 1480,
    interval: 'month',
    recommended: true,
    features: [
      '月10時間までのクラウド高速文字起こし',
      '高精度な話者分離 (Diarization)',
      'AI自動議事録・要約生成',
      'ワンクリック社内共有URL発行',
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
