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
  onRemoveAsset,
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
    <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:border-gray-200 hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between bg-gray-50/50 p-6 transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div className="h-6 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-black tracking-[0.2em] text-gray-800 uppercase">
            {categoryLabel}
          </h3>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {assets.length} items
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 p-6">
          <div className="space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group animate-in fade-in slide-in-from-left-2 flex items-center gap-4 duration-300"
              >
                <div className="flex-1">
                  <label className="mb-1.5 ml-1 block text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    {asset.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={asset.amount || ''}
                      onChange={(e) => onUpdateAmount(asset.id, Number(e.target.value))}
                      placeholder="0"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-900 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none"
                    />
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[10px] font-black tracking-widest text-gray-300">
                      JPY
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveAsset(asset.id)}
                  className="mt-5 rounded-xl bg-red-50/0 p-2.5 text-gray-400 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 md:opacity-0"
                >
                  <Trash2 className="h-4 w-4" />
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
              className="flex-1 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-2 text-xs text-gray-500 transition-all focus:border-blue-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newAssetName.trim()}
              className="rounded-xl bg-gray-100 p-2.5 text-gray-500 transition-all hover:bg-blue-600 hover:text-white disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
