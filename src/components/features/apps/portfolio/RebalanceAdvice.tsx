/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React from 'react';
import { RebalancePlan } from '@/lib/apps/portfolio/types';
import { ArrowRight, ShoppingCart, CheckCircle2 } from 'lucide-react';

interface Props {
  plan: RebalancePlan;
  portfolioTotal: number;
}

export default function RebalanceAdvice({ plan, portfolioTotal }: Props) {
  if (portfolioTotal === 0) return null;

  const hasActions = plan.buyActions.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Summary Card */}
        <div className="flex-1 glass rounded-[2.5rem] p-8 border-white/5 bg-blue-500/[0.02]">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-6">Strategic Summary</h4>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Current Assets</p>
              <p className="text-4xl font-black text-white">¥{portfolioTotal.toLocaleString()}</p>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-1">Required New Investment</p>
              <p className="text-4xl font-black text-blue-400">¥{plan.requiredInvestment.toLocaleString()}</p>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-2">
                Targeting new total: ¥{plan.targetTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Description */}
        <div className="flex-1 glass rounded-[2.5rem] p-8 border-white/5">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">No-Sell Strategy</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            このプランは、現在保有している資産を一切売却せず、追加投資のみで目標アセットアロケーションを達成するためのものです。
            課税イベントを発生させず、長期的な資産形成を効率化します。
          </p>
          <div className="mt-8 flex items-center gap-4 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Tax-Efficient Path Active</span>
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="glass rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="p-8 bg-white/[0.02] border-b border-white/5">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Execution Steps</h4>
        </div>
        
        {!hasActions ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white font-black uppercase tracking-widest">Portfolio is balanced</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">No buy actions required at current threshold.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {plan.buyActions.map((action, i) => (
              <div key={action.category} className="p-8 group hover:bg-white/[0.01] transition-colors">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 uppercase tracking-widest">
                        Step {i + 1}
                      </span>
                      <h5 className="text-xl font-black text-white uppercase tracking-tight">{action.label}</h5>
                    </div>
                    
                    <div className="space-y-4">
                      {action.assetBreakdown.map(asset => (
                        <div key={asset.id} className="flex items-center justify-between group/item">
                          <span className="text-sm text-gray-500 font-medium group-hover/item:text-gray-300 transition-colors">
                            {asset.label}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                              {(asset.ratio * 100).toFixed(1)}%
                            </span>
                            <span className="text-sm font-black text-white">
                              ¥{Math.round(asset.amount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end">
                    <div className="text-right mb-2">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Buy</p>
                      <p className="text-2xl font-black text-blue-500">¥{Math.round(action.amount).toLocaleString()}</p>
                    </div>
                    <ShoppingCart className="w-5 h-5 text-gray-800 group-hover:text-blue-500/50 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
