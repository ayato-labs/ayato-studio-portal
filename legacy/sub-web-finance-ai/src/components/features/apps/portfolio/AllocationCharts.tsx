/**
 * Ayato Studio Portal - Portfolio Strategist
 * Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>
 */

'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CategoryResult } from '@/lib/apps/portfolio/types';

interface Props {
  categoryResults: CategoryResult[];
  portfolioTotal: number;
}

export default function AllocationCharts({ categoryResults, portfolioTotal }: Props) {
  const pieData = categoryResults
    .filter((c) => c.currentTotal > 0)
    .map((c) => ({
      name: c.label,
      value: c.currentTotal,
      color: c.color,
    }));

  const barData = categoryResults.map((c) => ({
    name: c.label,
    current: Number((c.currentRatio * 100).toFixed(1)),
    target: Number((c.targetRatio * 100).toFixed(1)),
    color: c.color,
  }));

  if (portfolioTotal === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/[0.02] shadow-xl backdrop-blur-sm">
        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          No assets entered yet.
        </p>
        <p className="mt-2 text-[10px] tracking-widest text-gray-600 uppercase">
          Charts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Current Allocation (Pie) */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-xl backdrop-blur-sm">
        <h4 className="mb-8 text-center text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">
          Current Allocation
        </h4>
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
                contentStyle={{
                  backgroundColor: '#0c0c0c',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target vs Current (Bar) */}
      <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 shadow-xl backdrop-blur-sm">
        <h4 className="mb-8 text-center text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">
          Target vs Current (%)
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: '#999', fontSize: 10, fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                contentStyle={{
                  backgroundColor: '#0c0c0c',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Bar dataKey="current" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Current %" />
              <Bar dataKey="target" fill="rgba(255, 255, 255, 0.1)" radius={[0, 4, 4, 0]} name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
