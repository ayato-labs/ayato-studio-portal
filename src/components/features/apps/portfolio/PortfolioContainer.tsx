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
import {
  RefreshCcw,
  ArrowRight,
  LayoutGrid,
  PieChart as PieIcon,
  Settings as SettingsIcon,
} from 'lucide-react';

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
    resetData,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'input' | 'result' | 'settings'>('input');

  if (!isHydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categoryKeys = Object.keys(categoryConfigs) as CategoryKey[];
  const totalRatio = categoryKeys.reduce((sum, key) => sum + categoryConfigs[key].ratio, 0);

  return (
    <div className="space-y-12">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all ${activeTab === 'input' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Assets
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all ${activeTab === 'settings' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <SettingsIcon className="h-3.5 w-3.5" />
            Strategy
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all ${activeTab === 'result' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            Result
          </button>
        </div>
      </div>

      {activeTab === 'input' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
              Current Portfolio
            </h3>
            <button
              onClick={resetData}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase transition-colors hover:text-red-500"
            >
              <RefreshCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {categoryKeys.map((key) => (
              <AssetInputGroup
                key={key}
                categoryKey={key}
                categoryLabel={categoryConfigs[key].label}
                color={categoryConfigs[key].color}
                assets={assets.filter((a) => a.category === key)}
                onUpdateAmount={updateAssetAmount}
                onAddAsset={addAsset}
                onRemoveAsset={removeAsset}
              />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setActiveTab('settings')}
              className="group flex items-center gap-4 rounded-full bg-blue-600 px-10 py-5 font-black tracking-[0.2em] text-white uppercase transition-all duration-500 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30"
            >
              Set Target Ratios
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-2xl duration-700">
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm">
            <h3 className="mb-10 text-center text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
              Target Allocation Settings
            </h3>

            <div className="space-y-10">
              {categoryKeys.map((key) => (
                <div key={key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: categoryConfigs[key].color }}
                      />
                      <span className="text-xs font-black tracking-widest text-gray-800 uppercase">
                        {categoryConfigs[key].label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(categoryConfigs[key].ratio * 100)}
                        onChange={(e) =>
                          updateTargetRatio(key, parseInt(e.target.value || '0') / 100)
                        }
                        className="w-16 rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-center text-sm font-black text-blue-600 transition-all focus:border-blue-500 focus:outline-none"
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
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  Total Allocation
                </p>
                <p
                  className={`text-2xl font-black ${Math.abs(totalRatio - 1) < 0.001 ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {Math.round(totalRatio * 100)}%
                </p>
              </div>
              <button
                onClick={() => setActiveTab('result')}
                disabled={Math.abs(totalRatio - 1) > 0.01}
                className="flex items-center gap-4 rounded-full bg-gray-900 px-8 py-4 font-black tracking-widest text-white uppercase transition-all hover:bg-black disabled:opacity-20"
              >
                Simulate Strategy
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {Math.abs(totalRatio - 1) > 0.01 && (
              <p className="mt-4 text-center text-[10px] font-bold tracking-widest text-red-400 uppercase">
                Total allocation must be exactly 100% to proceed.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'result' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
          {result && (
            <>
              <AllocationCharts
                categoryResults={result.categoryResults}
                portfolioTotal={result.portfolioTotal}
              />
              <RebalanceAdvice plan={result.rebalancePlan} portfolioTotal={result.portfolioTotal} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
