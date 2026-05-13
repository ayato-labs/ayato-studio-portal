/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  PortfolioAsset, 
  CalculationResult, 
  CategoryKey,
  CategoryConfig
} from '../lib/apps/portfolio/types';
import { 
  STORAGE_KEYS, 
  DEFAULT_CATEGORIES, 
  PRESET_ASSETS 
} from '../lib/apps/portfolio/constants';
import { 
  calcAssetResults, 
  calcCategoryResults, 
  generateRebalancePlan 
} from '../lib/apps/portfolio/calculator';

export function usePortfolio() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [categoryConfigs, setCategoryConfigs] = useState<Record<CategoryKey, CategoryConfig>>(DEFAULT_CATEGORIES);
  const [okThreshold, setOkThreshold] = useState(0.02);

  // Initial hydration from localStorage
  useEffect(() => {
    const savedAssets = localStorage.getItem(STORAGE_KEYS.ASSETS);
    const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedAssets) setAssets(JSON.parse(savedAssets));
    else {
      // Initialize with presets if empty
      setAssets(PRESET_ASSETS.map(p => ({ ...p, amount: 0 })));
    }

    if (savedConfig) setCategoryConfigs(JSON.parse(savedConfig));
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.okThreshold) setOkThreshold(settings.okThreshold);
    }

    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(categoryConfigs));
  }, [categoryConfigs, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ okThreshold }));
  }, [okThreshold, isHydrated]);

  // Main calculation
  const result = useMemo<CalculationResult | null>(() => {
    if (!isHydrated) return null;
    
    const assetResults = calcAssetResults(assets);
    const portfolioTotal = assetResults.reduce((sum, a) => sum + a.valueInBase, 0);
    
    // Calculate even if total is 0 to show target targets
    const categoryResults = calcCategoryResults(assetResults, portfolioTotal, okThreshold, categoryConfigs);
    const rebalancePlan = generateRebalancePlan(categoryResults, portfolioTotal);

    return { assetResults, categoryResults, rebalancePlan, portfolioTotal };
  }, [assets, categoryConfigs, okThreshold, isHydrated]);

  // Actions
  const updateAssetAmount = useCallback((id: string, amount: number) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, amount } : a));
  }, []);

  const addAsset = useCallback((label: string, category: CategoryKey) => {
    const newAsset: PortfolioAsset = {
      id: `custom-${Date.now()}`,
      label,
      amount: 0,
      category,
    };
    setAssets(prev => [...prev, newAsset]);
  }, []);

  const removeAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const updateTargetRatio = useCallback((key: CategoryKey, ratio: number) => {
    setCategoryConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], ratio }
    }));
  }, []);

  const resetData = useCallback(() => {
    setAssets(PRESET_ASSETS.map(p => ({ ...p, amount: 0 })));
    setCategoryConfigs(DEFAULT_CATEGORIES);
    setOkThreshold(0.02);
  }, []);

  return {
    isHydrated,
    assets,
    categoryConfigs,
    okThreshold,
    result,
    updateAssetAmount,
    addAsset,
    removeAsset,
    updateTargetRatio,
    setOkThreshold,
    resetData,
  };
}
