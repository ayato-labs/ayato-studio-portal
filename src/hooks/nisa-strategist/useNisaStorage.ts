'use client';

import { useState, useEffect } from 'react';

export const useNisaStorage = () => {
  const [investment, setInvestment] = useState(50000);
  const [returnRate, setReturnRate] = useState(0.05);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const saved = localStorage.getItem('nisa-strategist-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setInvestment(parsed.investment);
      setReturnRate(parsed.returnRate);
      setDuration(parsed.duration);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nisa-strategist-data', JSON.stringify({ investment, returnRate, duration }));
  }, [investment, returnRate, duration]);

  return { investment, setInvestment, returnRate, setReturnRate, duration, setDuration };
};
