'use client';

import { useMemo } from 'react';
import { useNisaStorage } from '@/hooks/nisa-strategist/useNisaStorage';
import { calculateNisa } from '@/lib/apps/nisa-strategist/calculator';
import SimulationChart from './SimulationChart';
import { UtilityFeedback } from '@/components/features/vqe/UtilityFeedback';

export default function NisaSimulator() {
  const {
    investment,
    setInvestment,
    returnRate,
    setReturnRate,
    duration,
    setDuration,
    wastedSubscription,
    setWastedSubscription,
    monthlyLivingCost,
    setMonthlyLivingCost,
  } = useNisaStorage();

  const results = useMemo(() => {
    return calculateNisa(investment, returnRate, duration);
  }, [investment, returnRate, duration]);

  const finalResult = results[results.length - 1] || { principal: 0, total: 0 };

  // Butterfly Effect Calculation: Pure compound interest without 18M limit
  const opportunityCost = useMemo(() => {
    if (wastedSubscription <= 0) return 0;
    const monthlyRate = returnRate / 12;
    const totalMonths = duration * 12;
    let balance = 0;
    for (let i = 0; i < totalMonths; i++) {
      balance += wastedSubscription;
      balance *= 1 + monthlyRate;
    }
    return Math.round(balance);
  }, [wastedSubscription, returnRate, duration]);

  // F*ck-You Money Calculation
  const survivalMonths = useMemo(() => {
    if (monthlyLivingCost <= 0) return 0;
    return Math.floor(finalResult.total / monthlyLivingCost);
  }, [finalResult.total, monthlyLivingCost]);

  const survivalYears = Math.floor(survivalMonths / 12);
  const remainingMonths = survivalMonths % 12;

  return (
    <div className="space-y-24">
      {/* --- Section 1: Baseline NISA Simulation --- */}
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:p-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-8">
            <div>
              <label className="mb-3 block text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                毎月積立額 (円)
              </label>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 font-black text-white transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="mb-3 block text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                想定年利 (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={Number((returnRate * 100).toFixed(2))}
                onChange={(e) => setReturnRate(Number(e.target.value) / 100)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 font-black text-white transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="mb-3 block text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                運用期間 (年)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 font-black text-white transition-all focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-12 grid grid-cols-2 gap-6">
              <div className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-8 backdrop-blur-sm">
                <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
                  最終元本
                </p>
                <p className="text-4xl font-black text-white">
                  {Math.round(finalResult.principal / 10000).toLocaleString()}
                  <span className="ml-2 text-sm text-gray-500">万円</span>
                </p>
              </div>
              <div className="rounded-3xl border border-indigo-500/10 bg-indigo-500/5 p-8 backdrop-blur-sm">
                <p className="mb-2 text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase">
                  最終資産額
                </p>
                <p className="text-4xl font-black text-white">
                  {Math.round(finalResult.total / 10000).toLocaleString()}
                  <span className="ml-2 text-sm text-gray-500">万円</span>
                </p>
              </div>
            </div>
            <SimulationChart data={results} />
          </div>
        </div>
      </div>

      {/* --- Section 2: The Butterfly Effect (Provocation) --- */}
      <div className="relative overflow-hidden rounded-[2rem] border border-red-500/20 bg-red-500/[0.02] p-8 md:p-12">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-red-500/5 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="max-w-xl">
            <h3 className="mb-4 text-xs font-black tracking-[0.4em] text-red-500 uppercase">
              Section 02 // The Butterfly Effect
            </h3>
            <p className="mb-6 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
              ところで、使っていないサブスクに
              <br />
              毎月いくら払っていますか？
            </p>
            <p className="text-lg font-medium text-gray-400">
              その小さな支出を、もし NISA で運用していたら。
              <br />
              あなたが失っている「真の代償」を可視化します。
            </p>
          </div>

          <div className="w-full max-w-sm space-y-8">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <label className="mb-4 block text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                月額サブスク合計 (円)
              </label>
              <input
                type="number"
                step="500"
                value={wastedSubscription}
                onChange={(e) => setWastedSubscription(Number(e.target.value))}
                placeholder="例: 1500"
                className="w-full bg-transparent text-4xl font-black text-white outline-none focus:text-red-400"
              />
            </div>

            {opportunityCost > 0 && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">
                  Opportunity Cost (機会損失)
                </p>
                <p className="text-5xl font-black text-white">
                  {Math.round(opportunityCost / 10000).toLocaleString()}
                  <span className="ml-2 text-xl text-gray-500">万円</span>
                </p>
                <p className="mt-4 text-sm font-bold leading-relaxed text-red-400/80">
                  そのサブスクを放置することは、将来の
                  {Math.round(opportunityCost / 10000).toLocaleString()}
                  万円をドブに捨てているのと同義です。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Section 3: F*ck-You Money (Empowerment) --- */}
      <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-emerald-500/[0.02] p-8 md:p-12">
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="max-w-xl">
            <h3 className="mb-4 text-xs font-black tracking-[0.4em] text-emerald-500 uppercase">
              Section 03 // Liberation Deadline
            </h3>
            <p className="mb-6 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
              明日、辞表を叩きつけたとしても。
            </p>
            <p className="text-lg font-medium text-gray-400">
              この運用資産があれば、何年何ヶ月「無職」で生きられるか。
              <br />
              あなたの知性は、すでに十分な自由を確保しています。
            </p>
          </div>

          <div className="w-full max-w-sm space-y-8">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <label className="mb-4 block text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                毎月の生活費 (円)
              </label>
              <input
                type="number"
                step="10000"
                value={monthlyLivingCost}
                onChange={(e) => setMonthlyLivingCost(Number(e.target.value))}
                className="w-full bg-transparent text-4xl font-black text-white outline-none focus:text-emerald-400"
              />
            </div>

            {survivalMonths > 0 && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                  Survival Duration (逃切り可能期間)
                </p>
                <p className="text-5xl font-black text-white">
                  {survivalYears > 0 && (
                    <>
                      {survivalYears}
                      <span className="mr-4 ml-1 text-xl text-gray-500 uppercase">Years</span>
                    </>
                  )}
                  {remainingMonths}
                  <span className="ml-1 text-xl text-gray-500 uppercase">Months</span>
                </p>
                <p className="mt-4 text-sm font-bold leading-relaxed text-emerald-400/80">
                  おめでとうございます。あなたは
                  {survivalYears > 0 ? `${survivalYears}年` : ''}
                  {remainingMonths}ヶ月間、
                  <br />
                  労働から完全に解放される権利を手にしました。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/10">
        <UtilityFeedback id="nisa-strategist-v2" title="NISA Strategist" contentType="App" />
      </div>
    </div>
  );
}
