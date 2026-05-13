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
import { RefreshCcw, ArrowRight, LayoutGrid, PieChart as PieIcon, Settings as SettingsIcon } from 'lucide-react';

export default function PortfolioContainer() {
  const { 
    isHydrated, 
    assets, 
    categoryConfigs, 
    result, 
    updateAssetAmount, 
    addAsset, 
    removeAsset,
    updateTargetRatio,
    resetData
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'input' | 'result' | 'settings'>('input');

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categoryKeys = Object.keys(categoryConfigs) as CategoryKey[];
  const totalRatio = categoryKeys.reduce((sum, key) => sum + categoryConfigs[key].ratio, 0);

  return (
    <div className="space-y-12">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-white p-1 rounded-full flex gap-1 border border-gray-200 shadow-sm overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'input' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Assets
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            Strategy
          </button>
          <button 
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'result' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Result
          </button>
        </div>
      </div>

      {activeTab === 'input' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8 px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Current Portfolio</h3>
            <button 
              onClick={resetData}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
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
              onClick={() => setActiveTab('settings')}
              className="group flex items-center gap-4 px-10 py-5 rounded-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500"
            >
              Set Target Ratios
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-10 text-center">Target Allocation Settings</h3>
            
            <div className="space-y-10">
              {categoryKeys.map((key) => (
                <div key={key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryConfigs[key].color }} />
                      <span className="text-xs font-black uppercase tracking-widest text-gray-800">{categoryConfigs[key].label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(categoryConfigs[key].ratio * 100)}
                        onChange={(e) => updateTargetRatio(key, parseInt(e.target.value || '0') / 100)}
                        className="w-16 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 text-sm font-black text-blue-600 text-center focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <span className="text-[10px] font-black text-gray-400">%</span>
                    </div>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={categoryConfigs[key].ratio}
                    onChange={(e) => updateTargetRatio(key, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Allocation</p>
                <p className={`text-2xl font-black ${Math.abs(totalRatio - 1) < 0.001 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {Math.round(totalRatio * 100)}%
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('result')}
                disabled={Math.abs(totalRatio - 1) > 0.01}
                className="flex items-center gap-4 px-8 py-4 rounded-full bg-gray-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-20"
              >
                Simulate Strategy
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {Math.abs(totalRatio - 1) > 0.01 && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-4 text-center">
                Total allocation must be exactly 100% to proceed.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'result' && (
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
