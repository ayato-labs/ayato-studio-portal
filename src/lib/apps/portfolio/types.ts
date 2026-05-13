/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

export type CategoryKey = 'INDEX' | 'STOCK' | 'BOND' | 'GOLD' | 'CASH' | 'CRYPTO';

export type Currency = 'JPY' | 'USD';

export interface PortfolioAsset {
  id: string;
  label: string;
  amount: number; // In base currency
  category: CategoryKey;
}

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  color: string;
  ratio: number; // Target ratio (0.0 to 1.0)
}

export interface AssetResult extends PortfolioAsset {
  valueInBase: number;
}

export interface CategoryResult {
  key: CategoryKey;
  label: string;
  color: string;
  currentTotal: number;
  targetTotal: number;
  targetRatio: number;
  currentRatio: number;
  deviation: number;
  deviationRatio: number;
  status: 'OVER' | 'UNDER' | 'OK';
  assets: AssetResult[];
}

export interface AssetBreakdown {
  id: string;
  label: string;
  amount: number;
  ratio: number;
}

export interface RebalanceAction {
  category: CategoryKey;
  label: string;
  amount: number;
  assetBreakdown: AssetBreakdown[];
}

export interface RebalancePlan {
  currentTotal: number;
  targetTotal: number;
  requiredInvestment: number;
  buyActions: RebalanceAction[];
}

export interface CalculationResult {
  assetResults: AssetResult[];
  categoryResults: CategoryResult[];
  rebalancePlan: RebalancePlan;
  portfolioTotal: number;
}
