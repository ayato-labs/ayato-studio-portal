'use client';

import { useEffect, useState } from 'react';
import { supabase, SNSPostLog } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

export default function SNSAuditPage() {
  const [logs, setLogs] = useState<SNSPostLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('sns_post_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center p-24">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="glass-card p-6 flex gap-6 items-start transition-transform hover:translate-x-2"
              >
                {/* Platform Icon Dummy */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                  log.platform === 'x' ? 'bg-slate-900 border border-slate-700' : 'bg-blue-600'
                }`}>
                  {log.platform === 'x' ? '𝕏' : '🦋'}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase ${
                      log.status === 'success' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap italic">
                    "{log.content}"
                  </p>

                  <div className="pt-2 flex gap-4 text-[10px] text-slate-500 border-t border-slate-800/50 mt-2">
                    <span>Model: <span className="text-indigo-400 font-mono px-1.5 py-0.5 rounded bg-indigo-400/10">{log.ai_model}</span></span>
                    <span>Source ID: <span className="text-slate-400">{log.source_item_id}</span></span>
                  </div>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-24 glass-card">
                <p className="text-slate-500 italic">No SNS logs found in Supabase.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
