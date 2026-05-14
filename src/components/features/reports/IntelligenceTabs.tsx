'use client';

import * as React from 'react';
import { Report } from '@/lib/types';
import ReportCard from './ReportCard';

interface IntelligenceTabsProps {
  stockReports: Report[];
  flowReports: Report[];
}

export function IntelligenceTabs({ stockReports, flowReports }: IntelligenceTabsProps) {
  const [activeTab, setActiveTab] = React.useState<'stock' | 'flow'>(
    stockReports.length > 0 ? 'stock' : 'flow'
  );

  return (
    <div className="space-y-12">
      {/* Tab Headers */}
      <div className="flex items-center justify-center gap-8 border-b border-white/5">
        <button
          onClick={() => setActiveTab('stock')}
          className={`relative pb-4 text-[10px] font-black tracking-[0.4em] uppercase transition-all ${
            activeTab === 'stock' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Strategic Insights
          {activeTab === 'stock' && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`relative pb-4 text-[10px] font-black tracking-[0.4em] uppercase transition-all ${
            activeTab === 'flow' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Market Flow (News)
          {activeTab === 'flow' && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'stock' ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stockReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
            {stockReports.length === 0 && (
              <div className="col-span-3 py-20 text-center text-xs font-bold tracking-widest text-gray-700 uppercase">
                No strategic insights found.
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {flowReports.map((report) => (
              <ReportCard key={report.id} report={report} variant="minimal" />
            ))}
            {flowReports.length === 0 && (
              <div className="py-20 text-center text-xs font-bold tracking-widest text-gray-700 uppercase">
                No news flow found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
