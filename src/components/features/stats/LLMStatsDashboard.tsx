'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import statsData from '@/content/llm-stats.json';

interface LLMModel {
  id: string;
  name: string;
  developer: string;
  japaneseScore: number;
  codingScore: number;
  reasoningScore: number;
  speed: number;
  costPer1MInput: number;
  costPer1MOutput: number;
}

export default function LLMStatsDashboard() {
  const [mounted, setMounted] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<keyof LLMModel>('japaneseScore');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [activeMetric, setActiveMetric] = React.useState<'japaneseScore' | 'speed' | 'costPer1MInput'>('japaneseScore');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 animate-pulse rounded-[2rem] bg-white/5 flex items-center justify-center">
        <span className="text-xs font-black tracking-widest text-gray-500 uppercase">Loading Dashboard Data...</span>
      </div>
    );
  }

  // Sort Data
  const sortedData = [...(statsData as LLMModel[])].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'string' || typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    }
    return sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const handleSort = (key: keyof LLMModel) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // Color mapping based on developer
  const getDeveloperColor = (dev: string) => {
    switch (dev.toLowerCase()) {
      case 'anthropic':
        return '#d97706'; // Amber 600
      case 'openai':
        return '#10b981'; // Emerald 500
      case 'google':
        return '#3b82f6'; // Blue 500
      case 'meta':
        return '#8b5cf6'; // Violet 500
      default:
        return '#6b7280'; // Gray 500
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'japaneseScore':
        return '日本語性能スコア (0-100)';
      case 'speed':
        return '推論速度 (Tokens/sec)';
      case 'costPer1MInput':
        return '入力コスト (USD / 1M Tokens)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-16">
      {/* Metric Selector Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-white uppercase">
            LLM Performance Benchmark
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            日本語理解、レスポンス速度、およびAPI利用コストの定量的マトリクス
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-1 self-start">
          <button
            onClick={() => setActiveMetric('japaneseScore')}
            className={`rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
              activeMetric === 'japaneseScore'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            日本語性能
          </button>
          <button
            onClick={() => setActiveMetric('speed')}
            className={`rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
              activeMetric === 'speed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            推論速度
          </button>
          <button
            onClick={() => setActiveMetric('costPer1MInput')}
            className={`rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
              activeMetric === 'costPer1MInput'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            コスト (入力)
          </button>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] p-6 md:p-8">
        <h4 className="mb-6 text-xs font-black tracking-[0.3em] text-blue-500 uppercase">
          {getMetricLabel(activeMetric)}
        </h4>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={activeMetric === 'japaneseScore' ? [0, 100] : ['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey={activeMetric} radius={[8, 8, 0, 0]}>
                {statsData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getDeveloperColor(entry.developer)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h4 className="text-xl font-black tracking-tight text-white uppercase">Model Matrix Ledger</h4>
          <p className="mt-1 text-xs text-gray-500">
            モデル名をクリックすると各指標でソートできます。
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                <th className="py-5 px-8">Model</th>
                <th className="py-5 px-6">Developer</th>
                <th
                  onClick={() => handleSort('japaneseScore')}
                  className="py-5 px-6 cursor-pointer hover:text-white transition-colors"
                >
                  日本語理解 {sortKey === 'japaneseScore' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  onClick={() => handleSort('codingScore')}
                  className="py-5 px-6 cursor-pointer hover:text-white transition-colors"
                >
                  コーディング {sortKey === 'codingScore' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  onClick={() => handleSort('speed')}
                  className="py-5 px-6 cursor-pointer hover:text-white transition-colors"
                >
                  速度 (tps) {sortKey === 'speed' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  onClick={() => handleSort('costPer1MInput')}
                  className="py-5 px-6 cursor-pointer hover:text-white transition-colors"
                >
                  入力コスト/1M {sortKey === 'costPer1MInput' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  onClick={() => handleSort('costPer1MOutput')}
                  className="py-5 px-6 cursor-pointer hover:text-white transition-colors"
                >
                  出力コスト/1M {sortKey === 'costPer1MOutput' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {sortedData.map((model) => (
                <tr
                  key={model.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-5 px-8 font-black text-white">{model.name}</td>
                  <td className="py-5 px-6">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase border"
                      style={{
                        borderColor: `${getDeveloperColor(model.developer)}33`,
                        backgroundColor: `${getDeveloperColor(model.developer)}0a`,
                        color: getDeveloperColor(model.developer),
                      }}
                    >
                      {model.developer}
                    </span>
                  </td>
                  <td className="py-5 px-6 font-bold">{model.japaneseScore}</td>
                  <td className="py-5 px-6">{model.codingScore}</td>
                  <td className="py-5 px-6">{model.speed} tps</td>
                  <td className="py-5 px-6">${model.costPer1MInput.toFixed(3)}</td>
                  <td className="py-5 px-6">${model.costPer1MOutput.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
