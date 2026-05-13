/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid
} from 'recharts';
import { CategoryResult } from '@/lib/apps/portfolio/types';

interface Props {
  categoryResults: CategoryResult[];
  portfolioTotal: number;
}

export default function AllocationCharts({ categoryResults, portfolioTotal }: Props) {
  const pieData = categoryResults
    .filter(c => c.currentTotal > 0)
    .map(c => ({
      name: c.label,
      value: c.currentTotal,
      color: c.color
    }));

  const barData = categoryResults.map(c => ({
    name: c.label,
    current: Number((c.currentRatio * 100).toFixed(1)),
    target: Number((c.targetRatio * 100).toFixed(1)),
    color: c.color
  }));

  if (portfolioTotal === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center glass rounded-[2.5rem] border-white/5">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No assets entered yet.</p>
        <p className="text-gray-700 text-[10px] uppercase tracking-widest mt-2">Charts will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Current Allocation (Pie) */}
      <div className="glass rounded-[2.5rem] p-8 border-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 text-center">Current Allocation</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target vs Current (Bar) */}
      <div className="glass rounded-[2.5rem] p-8 border-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 text-center">Target vs Current (%)</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px' }}
              />
              <Bar dataKey="current" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Current %" />
              <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
