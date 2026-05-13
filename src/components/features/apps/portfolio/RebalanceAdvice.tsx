/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React from 'react';
import { RebalancePlan } from '@/lib/apps/portfolio/types';
import { Info, CheckCircle2 } from 'lucide-react';

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
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Strategy Simulation</h4>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Current Assets</p>
              <p className="text-4xl font-black text-gray-900">¥{portfolioTotal.toLocaleString()}</p>
            </div>
            <div className="h-px bg-gray-100" />
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Gap to Target Strategy</p>
              <p className="text-4xl font-black text-blue-600">¥{plan.requiredInvestment.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">
                Simulated new total: ¥{plan.targetTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Description */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">Simulation Logic</h4>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            設定された目標配分に基づき、現在の保有額との「乖離」を算出しています。
            このシミュレーションは売却を行わず、新規資金の投入のみで理想のポートフォリオに近づくための計算モデルです。
          </p>
          <div className="mt-8 flex items-center gap-4 text-blue-600">
            <div className="p-2 bg-blue-50 rounded-full">
                <Info className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Self-Managed Strategy Support</span>
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Calculated Strategy Alignment</h4>
        </div>
        
        {!hasActions ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-gray-900 font-black uppercase tracking-widest">Aligned with Strategy</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Current allocation matches your target thresholds.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {plan.buyActions.map((action, i) => (
              <div key={action.category} className="p-8 group hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-100">
                        Priority {i + 1}
                      </span>
                      <h5 className="text-xl font-black text-gray-900 uppercase tracking-tight">{action.label}</h5>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Hide specific assets for sensitive categories to avoid investment advice appearance */}
                      {['INDEX', 'CRYPTO'].includes(action.category) ? (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 font-medium italic">
                                目標比率を達成するために、このカテゴリ全体で合計金額分の調整が必要です。
                            </p>
                        </div>
                      ) : (
                        action.assetBreakdown.map(asset => (
                          <div key={asset.id} className="flex items-center justify-between group/item">
                            <span className="text-sm text-gray-500 font-semibold group-hover/item:text-gray-900 transition-colors">
                              {asset.label}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                {(asset.ratio * 100).toFixed(1)}% (Cat. Share)
                              </span>
                              <span className="text-sm font-black text-gray-900">
                                ¥{Math.round(asset.amount).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end">
                    <div className="text-right mb-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gap Amount</p>
                      <p className="text-2xl font-black text-blue-600">¥{Math.round(action.amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest py-4">
        * This is a mathematical simulation based on user-defined inputs. Not financial advice.
      </p>
    </div>
  );
}
