'use client';

import { useState, useEffect } from 'react';

export const useNisaStorage = () => {
  const [investment, setInvestment] = useState(50000);
  const [returnRate, setReturnRate] = useState(0.05);
  const [duration, setDuration] = useState(30);
  const [wastedSubscription, setWastedSubscription] = useState(0);
  const [monthlyLivingCost, setMonthlyLivingCost] = useState(300000);

  useEffect(() => {
    const saved = localStorage.getItem('nisa-strategist-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setInvestment(parsed.investment ?? 50000);
      setReturnRate(parsed.returnRate ?? 0.05);
      setDuration(parsed.duration ?? 30);
      setWastedSubscription(parsed.wastedSubscription ?? 0);
      setMonthlyLivingCost(parsed.monthlyLivingCost ?? 300000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'nisa-strategist-data',
      JSON.stringify({ investment, returnRate, duration, wastedSubscription, monthlyLivingCost }),
    );
  }, [investment, returnRate, duration, wastedSubscription, monthlyLivingCost]);

  return {
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
  };
};
