/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

import {
  PortfolioAsset,
  AssetResult,
  CategoryResult,
  RebalancePlan,
  CategoryKey,
  RebalanceAction,
  AssetBreakdown,
  CategoryConfig,
} from './types';

/**
 * Calculate basic results for each asset.
 */
export function calcAssetResults(assets: PortfolioAsset[]): AssetResult[] {
  return assets.map((asset) => ({
    ...asset,
    valueInBase: asset.amount,
  }));
}

/**
 * Aggregate by category and calculate deviations.
 */
export function calcCategoryResults(
  assetResults: AssetResult[],
  portfolioTotal: number,
  okThreshold: number,
  categoryConfigs: Record<CategoryKey, CategoryConfig>,
): CategoryResult[] {
  const categories = Object.keys(categoryConfigs) as CategoryKey[];

  return categories.map((key) => {
    const config = categoryConfigs[key];
    const assets = assetResults.filter((a) => a.category === key);
    const currentTotal = assets.reduce((sum, a) => sum + a.valueInBase, 0);
    const targetTotal = portfolioTotal * config.ratio;
    const deviation = currentTotal - targetTotal;
    const currentRatio = portfolioTotal > 0 ? currentTotal / portfolioTotal : 0;
    const deviationRatio = currentRatio - config.ratio;

    const status: 'OVER' | 'UNDER' | 'OK' =
      Math.abs(deviationRatio) <= okThreshold ? 'OK' : deviation > 0 ? 'OVER' : 'UNDER';

    return {
      key,
      label: config.label,
      color: config.color,
      currentTotal,
      targetTotal,
      targetRatio: config.ratio,
      currentRatio,
      deviation,
      deviationRatio,
      status,
      assets,
    };
  });
}

/**
 * Breakdown how to buy assets within a category.
 */
function calcBuyBreakdown(cat: CategoryResult, totalBuy: number): AssetBreakdown[] {
  const totalCurrent = cat.assets.reduce((s, a) => s + a.valueInBase, 0);
  return cat.assets.map((asset) => {
    const ratio = totalCurrent > 0 ? asset.valueInBase / totalCurrent : 1 / cat.assets.length;
    return {
      id: asset.id,
      label: asset.label,
      ratio,
      amount: totalBuy * ratio,
    };
  });
}

/**
 * Generate rebalance plan (No-Sell Strategy).
 */
export function generateRebalancePlan(
  categoryResults: CategoryResult[],
  portfolioTotal: number,
): RebalancePlan {
  // 1. Calculate minimum required total to reach targets without selling.
  // We exclude CASH from being a "floor" trigger because it's okay to spend it.
  const requiredTotals = categoryResults
    .filter((cat) => cat.key !== 'CASH')
    .map((cat) => (cat.targetRatio > 0 ? cat.currentTotal / cat.targetRatio : 0));

  const newTotal = Math.max(...requiredTotals, portfolioTotal);
  const newCapitalRequired = Math.max(0, newTotal - portfolioTotal);

  // 2. Identify buy actions for each category.
  const buyActions: RebalanceAction[] = categoryResults
    .map((cat) => {
      const newTargetAmount = newTotal * cat.targetRatio;
      const buyAmount = Math.max(0, newTargetAmount - cat.currentTotal);

      return {
        category: cat.key,
        label: cat.label,
        amount: buyAmount,
        assetBreakdown: calcBuyBreakdown(cat, buyAmount),
      };
    })
    .filter((action) => action.amount > 0.01 && action.category !== 'CASH');

  const totalBuyAmount = buyActions.reduce((sum, a) => sum + a.amount, 0);
  const fundedByCash = Math.max(0, totalBuyAmount - newCapitalRequired);

  return {
    currentTotal: portfolioTotal,
    targetTotal: newTotal,
    newCapitalRequired,
    fundedByCash,
    buyActions,
  };
}
