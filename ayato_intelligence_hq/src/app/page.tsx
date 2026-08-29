import DashboardLayout from '@/components/DashboardLayout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-indigo-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Total SNS Posts</h3>
          <p className="text-4xl font-bold text-white font-mono tracking-tight">-</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-emerald-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Avg AI Token / Post</h3>
          <p className="text-4xl font-bold text-white font-mono tracking-tight">-</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-amber-500">
          <h3 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Engine Status</h3>
          <p className="text-4xl font-bold text-white font-mono tracking-tight underline decoration-amber-500/30">Active</p>
        </div>
      </div>
      
      <div className="mt-12 glass-card p-12 text-center border-dashed border-2 border-slate-800">
        <h2 className="text-xl text-slate-300 font-light mb-4">Ayato Intelligence Headquarters</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
          The central hub for auditing AI curator behavior and system metrics. 
          Use the sidebar to explore SNS distribution quality and intelligence lake health.
        </p>
      </div>
    </DashboardLayout>
  );
}
