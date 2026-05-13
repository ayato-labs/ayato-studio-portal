/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import AssetInputGroup from './AssetInputGroup';
import AllocationCharts from './AllocationCharts';
import RebalanceAdvice from './RebalanceAdvice';
import { CategoryKey } from '@/lib/apps/portfolio/types';
import { RefreshCcw, Settings, ArrowRight, LayoutGrid, PieChart as PieIcon } from 'lucide-react';

export default function PortfolioContainer() {
  const { 
    isHydrated, 
    assets, 
    categoryConfigs, 
    result, 
    updateAssetAmount, 
    addAsset, 
    removeAsset,
    resetData
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categoryKeys = Object.keys(categoryConfigs) as CategoryKey[];

  return (
    <div className="space-y-12">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="glass p-1 rounded-full flex gap-1 border-white/5">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'input' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Portfolio Input
          </button>
          <button 
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'result' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Strategy Result
          </button>
        </div>
      </div>

      {activeTab === 'input' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8 px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Asset Management</h3>
            <button 
              onClick={resetData}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-red-500 transition-colors"
            >
              <RefreshCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryKeys.map((key) => (
              <AssetInputGroup
                key={key}
                categoryKey={key}
                categoryLabel={categoryConfigs[key].label}
                color={categoryConfigs[key].color}
                assets={assets.filter(a => a.category === key)}
                onUpdateAmount={updateAssetAmount}
                onAddAsset={addAsset}
                onRemoveAsset={removeAsset}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
             <button 
              onClick={() => setActiveTab('result')}
              className="group flex items-center gap-4 px-10 py-5 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all duration-500"
            >
              Generate Strategy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
          {result && (
            <>
              <AllocationCharts 
                categoryResults={result.categoryResults} 
                portfolioTotal={result.portfolioTotal} 
              />
              <RebalanceAdvice 
                plan={result.rebalancePlan} 
                portfolioTotal={result.portfolioTotal} 
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
