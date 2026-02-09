
import React, { useState } from 'react';
import { LogOut, Upload as UploadIcon, BarChart2, Radio, Activity, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DashboardTab, Language } from '../types';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  userEmail?: string;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userEmail, lang, onLangChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = translations[lang].nav;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f0]">
      <aside className={`transition-all duration-300 ease-in-out flex flex-col bg-white border-r border-black/5 z-30 sticky top-0 md:h-screen overflow-hidden ${isCollapsed ? 'w-full md:w-14' : 'w-full md:w-52'}`}>
        <div className="p-3 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="shrink-0 w-7 h-7 bg-blue-600 rounded flex items-center justify-center shadow-sm">
                <Radio className="text-white" size={14} />
              </div>
              {!isCollapsed && (
                <h1 className="text-[10px] font-black text-zinc-900 tracking-tighter uppercase leading-none truncate">
                  Stream<span className="text-blue-600">Hub</span>
                </h1>
              )}
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1 rounded hover:bg-zinc-100 text-zinc-400 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
            </button>
          </div>

          <nav className="flex-1 space-y-0.5">
            <button
              onClick={() => onTabChange(DashboardTab.UPLOAD)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded transition-all group
                ${activeTab === DashboardTab.UPLOAD 
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 border border-transparent'}
              `}
            >
              <UploadIcon size={14} />
              {!isCollapsed && <span className="text-[10px] uppercase tracking-wide">{t.deployment}</span>}
            </button>

            <button
              onClick={() => onTabChange(DashboardTab.ANALYTICS)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded transition-all group
                ${activeTab === DashboardTab.ANALYTICS 
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-100' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 border border-transparent'}
              `}
            >
              <BarChart2 size={14} />
              {!isCollapsed && <span className="text-[10px] uppercase tracking-wide">{t.telemetry}</span>}
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t border-zinc-100 space-y-4">
            {/* Language Switcher */}
            <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col' : 'px-1'}`}>
               <button 
                onClick={() => onLangChange('it')}
                className={`text-[9px] font-black p-1 rounded transition-colors ${lang === 'it' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                 IT
               </button>
               <button 
                onClick={() => onLangChange('en')}
                className={`text-[9px] font-black p-1 rounded transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
               >
                 EN
               </button>
            </div>

            {!isCollapsed && (
              <div className="px-1">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                  <Activity size={8} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{t.activeRelay}</span>
                </div>
                <p className="text-[9px] font-bold text-zinc-400 truncate">{userEmail}</p>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={14} />
              {!isCollapsed && <span className="text-[10px] uppercase font-bold">{t.signOut}</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
