/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React, { useState } from 'react';
import { CategoryKey, PortfolioAsset } from '@/lib/apps/portfolio/types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  categoryLabel: string;
  categoryKey: CategoryKey;
  assets: PortfolioAsset[];
  color: string;
  onUpdateAmount: (id: string, amount: number) => void;
  onAddAsset: (label: string, category: CategoryKey) => void;
  onRemoveAsset: (id: string) => void;
}

export default function AssetInputGroup({
  categoryLabel,
  categoryKey,
  assets,
  color,
  onUpdateAmount,
  onAddAsset,
  onRemoveAsset
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newAssetName, setNewAssetName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;
    onAddAsset(newAssetName.trim(), categoryKey);
    setNewAssetName('');
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-md hover:border-gray-200">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800">{categoryLabel}</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{assets.length} items</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="group flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    {asset.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={asset.amount || ''}
                      onChange={(e) => onUpdateAmount(asset.id, Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 tracking-widest">JPY</span>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveAsset(asset.id)}
                  className="mt-5 p-2.5 rounded-xl bg-red-50/0 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all group-hover:opacity-100 md:opacity-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} className="mt-6 flex gap-2">
            <input
              type="text"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Add Asset Name (e.g. BTC, Gold)"
              className="flex-1 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-500 focus:outline-none focus:border-blue-400 transition-all"
            />
            <button 
              type="submit"
              disabled={!newAssetName.trim()}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-blue-600 text-gray-500 hover:text-white disabled:opacity-30 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
