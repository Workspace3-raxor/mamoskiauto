
import React, { useState } from 'react';
import { Mail, Lock, Radio, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Language } from '../types';
import { translations } from '../translations';

interface AuthProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Auth: React.FC<AuthProps> = ({ lang, onLangChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang].auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        alert(t.verificationSent);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <Radio className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">
              {t.title}
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Mail size={12} /> {t.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-zinc-900 outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                placeholder="operator@nexus.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Lock size={12} /> {t.passLabel}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-zinc-900 outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[11px] font-bold text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-3.5 text-sm uppercase tracking-widest font-black" isLoading={isLoading}>
              {isLogin ? t.loginBtn : t.registerBtn} <ArrowRight size={16} className="ml-1" />
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-100 flex flex-col items-center gap-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-zinc-400 hover:text-blue-600 transition-colors text-[11px] font-bold uppercase tracking-wider"
            >
              {isLogin ? t.requestAccess : t.existingNode}
            </button>

            <div className="flex gap-2">
               <button 
                onClick={() => onLangChange('it')}
                className={`text-[9px] font-black px-2 py-1 rounded transition-colors ${lang === 'it' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
               >
                 ITALIANO
               </button>
               <button 
                onClick={() => onLangChange('en')}
                className={`text-[9px] font-black px-2 py-1 rounded transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
               >
                 ENGLISH
               </button>
            </div>
          </div>
        </div>

        <p className="text-center text-zinc-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-10">
          {t.footer}
        </p>
      </div>
    </div>
  );
};
