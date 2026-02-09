
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { UploadSection } from './components/UploadSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { DashboardTab, Language } from './types';
import { Session } from '@supabase/supabase-js';
import { translations } from './translations';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.UPLOAD);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('it');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const t = translations[lang];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 animate-pulse text-[10px] font-black tracking-widest uppercase">
            {lang === 'it' ? 'CONNESSIONE SICURA...' : 'SECURE CONNECT...'}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth lang={lang} onLangChange={setLang} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      userEmail={session.user.email}
      lang={lang}
      onLangChange={setLang}
    >
      {activeTab === DashboardTab.UPLOAD ? (
        <UploadSection lang={lang} />
      ) : (
        <AnalyticsSection lang={lang} />
      )}
    </Layout>
  );
};

export default App;
