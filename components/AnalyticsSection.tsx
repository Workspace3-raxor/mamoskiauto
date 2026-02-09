
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, BarChart3, Clock, CheckCircle, Database, Loader2, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserUpload, Language } from '../types';
import { SOCIAL_PLATFORMS } from '../constants';
import { translations } from '../translations';

interface AnalyticsSectionProps {
  lang: Language;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ lang }) => {
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMonth: 0,
    totalAllTime: 0,
    platformData: [] as any[]
  });

  const t = translations[lang].analytics;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      if (data) {
        setUploads(data);
        processStats(data);
      }
    } catch (err) {
      console.error('Telemetry Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processStats = (data: UserUpload[]) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthUploads = data.filter(u => new Date(u.uploaded_at) >= monthStart).length;
    
    const platformCounts: Record<string, number> = {};
    data.forEach(upload => {
      upload.platforms.forEach(p => {
        platformCounts[p] = (platformCounts[p] || 0) + 1;
      });
    });

    const chartData = SOCIAL_PLATFORMS.map(p => ({
      name: p.label,
      count: platformCounts[p.id] || 0,
      color: p.color
    })).filter(d => d.count > 0);

    setStats({
      totalMonth: monthUploads,
      totalAllTime: data.length,
      platformData: chartData
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-400 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] uppercase tracking-[0.3em] font-black">{t.syncingTelemetry}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-[0.4em] mb-1">
            {t.systemTelemetry}
          </div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase leading-none italic">{t.intelBrief}</h2>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">{t.subtitle}</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t.currentCycle, val: stats.totalMonth, icon: Calendar, color: 'text-blue-600' },
          { label: t.allTimeRelay, val: stats.totalAllTime, icon: Database, color: 'text-zinc-900' },
          { label: t.integrity, val: '100%', icon: CheckCircle, color: 'text-emerald-600' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-xl space-y-3 group hover:border-blue-200 transition-colors">
            <div className={`flex items-center justify-between ${item.color}`}>
              <item.icon size={18} />
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-black text-zinc-900 tracking-tighter mono">{item.val}</div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-zinc-200 p-8 rounded-2xl space-y-8">
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-blue-600" />
            <h3 className="text-sm font-black text-zinc-900 tracking-widest uppercase">{t.platformDist}</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="black" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="black" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '10px', color: '#18181b', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={32}>
                  {stats.platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-zinc-200 p-8 rounded-2xl space-y-8 overflow-hidden">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-zinc-400" />
            <h3 className="text-sm font-black text-zinc-900 tracking-widest uppercase">{t.liveLogs}</h3>
          </div>
          <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between border-b border-zinc-50 pb-3 group">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[10px] font-black text-zinc-800 uppercase tracking-wide truncate pr-4">
                    {upload.filename}
                  </div>
                  <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                    {new Date(upload.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • RELAY-SYNC
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex -space-x-1.5">
                    {upload.platforms.map((p, i) => (
                      <div key={i} className="w-4 h-4 rounded-full bg-zinc-100 border border-white text-[7px] font-black flex items-center justify-center text-zinc-900 uppercase">
                        {p.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${upload.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {upload.status}
                  </div>
                </div>
              </div>
            ))}
            {uploads.length === 0 && (
              <div className="py-12 text-center text-zinc-300 text-[9px] uppercase tracking-widest font-black italic">
                {t.logEmpty}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
