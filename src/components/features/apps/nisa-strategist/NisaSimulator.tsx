'use client';

import { useMemo } from 'react';
import { useNisaStorage } from '@/hooks/nisa-strategist/useNisaStorage';
import { calculateNisa } from '@/lib/apps/nisa-strategist/calculator';
import SimulationChart from './SimulationChart';
import { UtilityFeedback } from '@/components/features/vqe/UtilityFeedback';

export default function NisaSimulator() {
  const { investment, setInvestment, returnRate, setReturnRate, duration, setDuration } = useNisaStorage();
  
  const results = useMemo(() => {
    return calculateNisa(investment, returnRate, duration);
  }, [investment, returnRate, duration]);

  const finalResult = results[results.length - 1] || { principal: 0, total: 0 };

  return (
    <div className="space-y-12 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:p-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase tracking-widest">毎月積立額 (円)</label>
            <input 
              type="number" 
              value={investment} 
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white font-bold"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase tracking-widest">想定年利 (%)</label>
            <input 
              type="number" 
              step="0.01"
              value={Number((returnRate * 100).toFixed(2))} 
              onChange={(e) => setReturnRate(Number(e.target.value) / 100)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white font-bold"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase tracking-widest">運用期間 (年)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white font-bold"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">最終元本</p>
              <p className="text-2xl font-black text-white">{Math.round(finalResult.principal / 10000)}万円</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">最終資産額</p>
              <p className="text-2xl font-black text-white">{Math.round(finalResult.total / 10000)}万円</p>
            </div>
          </div>
          <SimulationChart data={results} />
        </div>
      </div>
      
      <div className="pt-12 border-t border-white/10">
        <UtilityFeedback id="nisa-strategist-v1" title="NISA Strategist" contentType="App" />
      </div>
    </div>
  );
}
