'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { UtilityFeedback } from '@/components/features/vqe/UtilityFeedback';
import { cn } from '@/lib/utils';

const HOURLY_WAGE = 1055; // 令和6年度 全国加重平均最低賃金

export default function BurnCounter() {
  const [participants, setParticipants] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [burnedAmount, setBurnedAmount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startMeeting = () => {
    setStartTime(Date.now());
    setIsActive(true);
  };

  const stopMeeting = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetMeeting = () => {
    stopMeeting();
    setBurnedAmount(0);
    setStartTime(null);
  };

  useEffect(() => {
    if (isActive && startTime) {
      timerRef.current = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const totalBurned = (HOURLY_WAGE * participants * elapsedSeconds) / 3600;
        setBurnedAmount(totalBurned);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, startTime, participants]);

  const comparison = useMemo(() => {
    if (burnedAmount < 500) return null;
    if (burnedAmount < 1000) return { label: '牛丼1杯分が灰になりました', icon: '🍚' };
    if (burnedAmount < 5000) return { label: '豪華なランチコースが消滅しました', icon: '🍷' };
    if (burnedAmount < 10000) return { label: '飲み会2回分が焼失しました', icon: '🍺' };
    if (burnedAmount < 50000) return { label: '高級ホテルの1泊分が燃え尽きました', icon: '🏨' };
    if (burnedAmount < 150000) return { label: '最新のiPhoneが溶けました', icon: '📱' };
    return { label: '誰かの1ヶ月分の給料が消え去りました', icon: '💸' };
  }, [burnedAmount]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      {/* Input Section */}
      {!isActive && burnedAmount === 0 && (
        <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <h2 className="text-xs font-black tracking-[0.4em] text-red-500 uppercase mb-4">
              Enter Participants
            </h2>
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-2xl font-black text-white hover:bg-white/10"
              >
                -
              </button>
              <span className="text-7xl font-black text-white">{participants}</span>
              <button 
                onClick={() => setParticipants(participants + 1)}
                className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-2xl font-black text-white hover:bg-white/10"
              >
                +
              </button>
            </div>
            <p className="mt-6 text-sm font-medium text-gray-500">
              参加人数を入力してください。
              <br />
              全国加重平均最低賃金 (¥1,055) で算出します。
            </p>
          </div>
          <button
            onClick={startMeeting}
            className="w-full rounded-2xl bg-red-600 py-6 text-xl font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-red-700 hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]"
          >
            計測（焼却）開始
          </button>
        </div>
      )}

      {/* Burning Section */}
      {(isActive || burnedAmount > 0) && (
        <div className="w-full space-y-12 text-center">
          <div className="relative inline-block">
            {/* Fire Glow Effect */}
            <div className={cn(
              "absolute inset-0 -z-10 blur-[100px] transition-all duration-1000",
              isActive ? "bg-orange-600/30 scale-150" : "bg-red-600/10"
            )} />
            
            <p className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase mb-4">
              Current Loss // 現在の損失額
            </p>
            <div className="flex items-baseline justify-center gap-4">
              <span className="text-sm font-black text-gray-600">¥</span>
              <span className="text-[12rem] font-black leading-none tracking-tighter text-white tabular-nums">
                {Math.floor(burnedAmount).toLocaleString()}
              </span>
              <span className="text-4xl font-black text-red-600 animate-pulse">
                .{Math.floor((burnedAmount % 1) * 100).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {comparison && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-700">
              <span className="text-4xl mb-4 block">{comparison.icon}</span>
              <p className="text-2xl font-black text-white uppercase tracking-tight">
                {comparison.label}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-6">
            {isActive ? (
              <button
                onClick={stopMeeting}
                className="rounded-full border border-white/10 bg-white/5 px-12 py-4 text-xs font-black tracking-widest text-white uppercase hover:bg-red-600/20 hover:border-red-500/30"
              >
                会議を終了する
              </button>
            ) : (
              <button
                onClick={resetMeeting}
                className="rounded-full border border-white/10 bg-white/5 px-12 py-4 text-xs font-black tracking-widest text-gray-500 uppercase hover:text-white"
              >
                メーターをリセット
              </button>
            )}
          </div>
        </div>
      )}

      {/* VQE Section */}
      <div className={cn(
        "w-full max-w-2xl pt-24 border-t border-white/5 transition-opacity duration-1000",
        isActive ? "opacity-20" : "opacity-100"
      )}>
        <UtilityFeedback id="meeting-burn-rate-v1" title="Meeting Burn Rate" contentType="App" />
      </div>
    </div>
  );
}
