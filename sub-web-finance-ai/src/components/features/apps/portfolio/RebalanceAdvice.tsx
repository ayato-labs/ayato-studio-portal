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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Summary Card */}
        <div className="flex-1 rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-xl backdrop-blur-sm">
          <h4 className="mb-6 text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">
            Strategy Simulation
          </h4>
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-gray-500 uppercase">
                Total Current Assets
              </p>
              <p className="text-4xl font-black text-white">
                ¥{portfolioTotal.toLocaleString()}
              </p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-blue-400 uppercase">
                New Capital Required
              </p>
              <p className="text-4xl font-black text-blue-400">
                ¥{plan.newCapitalRequired.toLocaleString()}
              </p>
              {plan.fundedByCash > 0 && (
                <p className="mt-2 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  + ¥{plan.fundedByCash.toLocaleString()} funded by existing cash
                </p>
              )}
              <p className="mt-2 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                Simulated new total: ¥{plan.targetTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Description */}
        <div className="flex-1 rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-xl backdrop-blur-sm">
          <h4 className="mb-6 text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">
            Simulation Logic
          </h4>
          <p className="text-sm leading-relaxed font-medium text-gray-400">
            設定された目標配分に基づき、現在の保有額との「乖離」を算出しています。
            このシミュレーションは売却を行わず、新規資金の投入のみで理想のポートフォリオに近づくための計算モデルです。
          </p>
          <div className="mt-8 flex items-center gap-4 text-blue-400">
            <div className="rounded-full bg-blue-500/10 p-2">
              <Info className="h-5 w-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">
              Self-Managed Strategy Support
            </span>
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] shadow-xl backdrop-blur-sm">
        <div className="border-b border-white/10 bg-white/[0.04] p-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-white uppercase">
            Calculated Strategy Alignment
          </h4>
        </div>

        {!hasActions ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
            <p className="font-black tracking-widest text-white uppercase">
              Aligned with Strategy
            </p>
            <p className="mt-2 text-xs tracking-widest text-gray-500 uppercase">
              Current allocation matches your target thresholds.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {plan.buyActions.map((action, i) => (
              <div
                key={action.category}
                className="group p-8 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                        Priority {i + 1}
                      </span>
                      <h5 className="text-xl font-black tracking-tight text-white uppercase">
                        {action.label}
                      </h5>
                    </div>

                    <div className="space-y-4">
                      {/* Hide specific assets for sensitive categories to avoid investment advice appearance */}
                      {['INDEX', 'CRYPTO'].includes(action.category) ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4">
                          <p className="text-sm font-medium text-gray-400 italic">
                            目標比率を達成するために、このカテゴリ全体で合計金額分の調整が必要です。
                          </p>
                        </div>
                      ) : (
                        action.assetBreakdown.map((asset) => (
                          <div
                            key={asset.id}
                            className="group/item flex items-center justify-between"
                          >
                            <span className="text-sm font-semibold text-gray-400 transition-colors group-hover/item:text-white">
                              {asset.label}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">
                                {(asset.ratio * 100).toFixed(1)}% (Cat. Share)
                              </span>
                              <span className="text-sm font-black text-white">
                                ¥{Math.round(asset.amount).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="hidden flex-col items-end md:flex">
                    <div className="mb-2 text-right">
                      <p className="mb-1 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                        Gap Amount
                      </p>
                      <p className="text-2xl font-black text-blue-400">
                        ¥{Math.round(action.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="py-4 text-center text-[10px] tracking-widest text-gray-500 uppercase">
        * This is a mathematical simulation based on user-defined inputs. Not financial advice.
      </p>
    </div>
  );
}
