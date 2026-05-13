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
        <div className="flex-1 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
          <h4 className="mb-6 text-[10px] font-black tracking-[0.4em] text-blue-600 uppercase">
            Strategy Simulation
          </h4>
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Total Current Assets
              </p>
              <p className="text-4xl font-black text-gray-900">
                ¥{portfolioTotal.toLocaleString()}
              </p>
            </div>
            <div className="h-px bg-gray-100" />
            <div>
              <p className="mb-1 text-xs font-bold tracking-widest text-blue-600 uppercase">
                Gap to Target Strategy
              </p>
              <p className="text-4xl font-black text-blue-600">
                ¥{plan.requiredInvestment.toLocaleString()}
              </p>
              <p className="mt-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Simulated new total: ¥{plan.targetTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Description */}
        <div className="flex-1 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
          <h4 className="mb-6 text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
            Simulation Logic
          </h4>
          <p className="text-sm leading-relaxed font-medium text-gray-500">
            設定された目標配分に基づき、現在の保有額との「乖離」を算出しています。
            このシミュレーションは売却を行わず、新規資金の投入のみで理想のポートフォリオに近づくための計算モデルです。
          </p>
          <div className="mt-8 flex items-center gap-4 text-blue-600">
            <div className="rounded-full bg-blue-50 p-2">
              <Info className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">
              Self-Managed Strategy Support
            </span>
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 p-8">
          <h4 className="text-xs font-black tracking-[0.3em] text-gray-900 uppercase">
            Calculated Strategy Alignment
          </h4>
        </div>

        {!hasActions ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
            <p className="font-black tracking-widest text-gray-900 uppercase">
              Aligned with Strategy
            </p>
            <p className="mt-2 text-xs tracking-widest text-gray-400 uppercase">
              Current allocation matches your target thresholds.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {plan.buyActions.map((action, i) => (
              <div
                key={action.category}
                className="group p-8 transition-colors hover:bg-gray-50/50"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-black tracking-widest text-blue-600 uppercase">
                        Priority {i + 1}
                      </span>
                      <h5 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                        {action.label}
                      </h5>
                    </div>

                    <div className="space-y-4">
                      {/* Hide specific assets for sensitive categories to avoid investment advice appearance */}
                      {['INDEX', 'CRYPTO'].includes(action.category) ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                          <p className="text-sm font-medium text-gray-500 italic">
                            目標比率を達成するために、このカテゴリ全体で合計金額分の調整が必要です。
                          </p>
                        </div>
                      ) : (
                        action.assetBreakdown.map((asset) => (
                          <div
                            key={asset.id}
                            className="group/item flex items-center justify-between"
                          >
                            <span className="text-sm font-semibold text-gray-500 transition-colors group-hover/item:text-gray-900">
                              {asset.label}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">
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

                  <div className="hidden flex-col items-end md:flex">
                    <div className="mb-2 text-right">
                      <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Gap Amount
                      </p>
                      <p className="text-2xl font-black text-blue-600">
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

      <p className="py-4 text-center text-[10px] tracking-widest text-gray-400 uppercase">
        * This is a mathematical simulation based on user-defined inputs. Not financial advice.
      </p>
    </div>
  );
}
