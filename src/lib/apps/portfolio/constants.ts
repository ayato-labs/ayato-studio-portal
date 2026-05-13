/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import { CategoryKey, CategoryConfig } from './types';

export const DEFAULT_CATEGORIES: Record<CategoryKey, CategoryConfig> = {
  INDEX:  { key: 'INDEX',  label: 'インデックス', color: '#3B82F6', ratio: 0.60 },
  STOCK:  { key: 'STOCK',  label: '個別株/ETF',   color: '#10B981', ratio: 0.25 },
  BOND:   { key: 'BOND',   label: '債券',        color: '#8B5CF6', ratio: 0.00 },
  GOLD:   { key: 'GOLD',   label: '金 (Gold)',   color: '#EAB308', ratio: 0.00 },
  CASH:   { key: 'CASH',   label: '現金・MMF',    color: '#F59E0B', ratio: 0.10 },
  CRYPTO: { key: 'CRYPTO', label: '暗号資産',     color: '#F97316', ratio: 0.05 },
};

export const PRESET_ASSETS = [
  { id: 'sp500', label: 'S&P500', category: 'INDEX' as CategoryKey },
  { id: 'orkan', label: 'オルカン', category: 'INDEX' as CategoryKey },
  { id: 'jpy_cash', label: '日本円', category: 'CASH' as CategoryKey },
];

export const STORAGE_KEYS = {
  ASSETS: 'ayato_portfolio_assets',
  CONFIG: 'ayato_portfolio_config',
  SETTINGS: 'ayato_portfolio_settings',
};
