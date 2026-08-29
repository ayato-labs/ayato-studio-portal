/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import { CategoryKey, CategoryConfig } from './types';

export const DEFAULT_CATEGORIES: Record<CategoryKey, CategoryConfig> = {
  INDEX: { key: 'INDEX', label: 'インデックス投信', color: '#3B82F6', ratio: 0.5 },
  STOCK: { key: 'STOCK', label: '個別株/ETF', color: '#10B981', ratio: 0.2 },
  BOND: { key: 'BOND', label: '債券', color: '#8B5CF6', ratio: 0.1 },
  GOLD: { key: 'GOLD', label: '金 (Gold)', color: '#EAB308', ratio: 0.05 },
  CASH: { key: 'CASH', label: '現金・MMF', color: '#F59E0B', ratio: 0.1 },
  CRYPTO: { key: 'CRYPTO', label: '暗号資産', color: '#F97316', ratio: 0.05 },
};

export const PRESET_ASSETS = [
  // Index Funds
  { id: 'orkan', label: 'オルカン', category: 'INDEX' as CategoryKey },
  { id: 'sp500', label: 'S&P500', category: 'INDEX' as CategoryKey },
  { id: 'nikkei', label: '日経225', category: 'INDEX' as CategoryKey },

  // Stocks Total
  { id: 'stock_jp', label: '日本銘柄 (総額)', category: 'STOCK' as CategoryKey },
  { id: 'stock_us', label: '米国銘柄 (総額)', category: 'STOCK' as CategoryKey },

  // Bonds
  { id: 'bond_jp', label: '日本国債 (総額)', category: 'BOND' as CategoryKey },
  { id: 'bond_us', label: '米ドル債 (総額)', category: 'BOND' as CategoryKey },

  // Gold
  { id: 'gold_total', label: '金 (総額)', category: 'GOLD' as CategoryKey },

  // Cash & MMF
  { id: 'jpy_cash', label: '日本円 (預金)', category: 'CASH' as CategoryKey },
  { id: 'usd_cash', label: '米ドル現金 / ドルMMF', category: 'CASH' as CategoryKey },

  // Crypto
  { id: 'btc', label: 'BTC (ビットコイン)', category: 'CRYPTO' as CategoryKey },
];

export const STORAGE_KEYS = {
  ASSETS: 'ayato_portfolio_assets',
  CONFIG: 'ayato_portfolio_config',
  SETTINGS: 'ayato_portfolio_settings',
};
