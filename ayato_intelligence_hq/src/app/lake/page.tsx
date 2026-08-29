'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

export default function IntelligenceLakePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('generated_reports')
        .select('id, title, category, market, generated_at')
        .order('generated_at', { ascending: false })
        .limit(100);
      
      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-mono">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Market</th>
                <th className="p-4">Generated At</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300">
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-800/50 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{item.title}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">{item.category}</span></td>
                  <td className="p-4 text-slate-400">{item.market}</td>
                  <td className="p-4 text-xs font-mono">{new Date(item.generated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-12 flex justify-center text-indigo-500 animate-pulse font-mono text-sm">
              Indexing Lake Data...
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-light italic">
              The Intelligence Lake is currently empty.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
