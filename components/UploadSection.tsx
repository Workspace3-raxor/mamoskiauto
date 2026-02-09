
import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, FileText, Sparkles, Send, Check, AtSign, ChevronRight, Layers, Target } from 'lucide-react';
import { Button } from './Button';
import { SOCIAL_PLATFORMS, WEBHOOK_URL, ExtendedPlatformConfig } from '../constants';
import { supabase } from '../lib/supabase';
import { Language } from '../types';
import { translations } from '../translations';

interface PlatformSelection {
  id: string;
  account?: string;
  type?: string;
}

interface UploadSectionProps {
  lang: Language;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ lang }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [captionIdeas, setCaptionIdeas] = useState('');
  const [selections, setSelections] = useState<PlatformSelection[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang].upload;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const togglePlatform = (platform: ExtendedPlatformConfig) => {
    const exists = selections.find(s => s.id === platform.id);
    if (exists) {
      setSelections(prev => prev.filter(s => s.id !== platform.id));
    } else {
      setSelections(prev => [...prev, { 
        id: platform.id, 
        account: platform.accounts?.[0] || undefined,
        type: platform.types?.[0] || undefined
      }]);
    }
  };

  const updateSelection = (id: string, field: 'account' | 'type', value: string) => {
    setSelections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || selections.length === 0) {
      setStatus({ type: 'error', message: t.statusRequired });
      return;
    }

    setIsUploading(true);
    setStatus(null);
    setUploadProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authorization required');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);
      formData.append('user_email', user.email || '');
      formData.append('notes', notes);
      formData.append('caption_ideas', captionIdeas);
      
      const detailedSelections = selections.map(sel => {
        const config = SOCIAL_PLATFORMS.find(p => p.id === sel.id);
        return {
          platform_id: sel.id,
          platform_label: config?.label,
          account: sel.account,
          post_type: sel.type
        };
      });
      formData.append('platforms', JSON.stringify(detailedSelections));

      setUploadProgress(40);
      const response = await fetch(WEBHOOK_URL, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Relay endpoint unreachable');
      
      setUploadProgress(80);
      await supabase.from('user_uploads').insert({
        user_id: user.id,
        filename: file.name,
        platforms: selections.map(s => s.id),
        notes,
        caption_ideas: captionIdeas,
        status: 'pending'
      });

      setUploadProgress(100);
      setStatus({ type: 'success', message: t.statusSuccess });
      
      setFile(null);
      setPreview(null);
      setNotes('');
      setCaptionIdeas('');
      setSelections([]);
    } catch (err: any) {
      setStatus({ type: 'error', message: t.statusError });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-full animate-in fade-in duration-200">
      {status && (
        <div className={`mb-3 px-3 py-1.5 border flex items-center justify-between text-[10px] font-bold uppercase tracking-wider
          ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}
        `}>
          <div className="flex items-center gap-2">
            {status.type === 'success' ? <Check size={12} /> : <AlertCircle size={12} />}
            {status.message}
          </div>
          <button onClick={() => setStatus(null)}><X size={10} /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* COL 1: ASSET (STICKY) */}
        <div className="lg:col-span-3 space-y-2 sticky top-0">
          <div className="flex items-center gap-2 px-1">
            <Layers size={11} className="text-zinc-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{t.mediaSource}</span>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`group relative aspect-[3/4] w-full cursor-pointer border-2 border-dashed rounded bg-white flex flex-col items-center justify-center transition-all
              ${file ? 'border-blue-500/30' : 'border-zinc-200 hover:border-blue-400 hover:bg-blue-50/20'}
            `}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            
            {preview ? (
              <div className="w-full h-full relative group">
                {file?.type.startsWith('video/') ? (
                  <video src={preview} className="w-full h-full object-cover" />
                ) : (
                  <img src={preview} alt="Asset" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">{t.replaceFile}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 opacity-40">
                <Upload size={16} />
                <span className="text-[8px] font-black uppercase tracking-widest">{t.selectFile}</span>
              </div>
            )}
          </div>
        </div>

        {/* COL 2: LOGIC (SCROLLABLE) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Target size={11} className="text-zinc-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{t.opLogic}</span>
          </div>

          <div className="space-y-2">
            <div className="bg-white border border-zinc-200 rounded p-3 space-y-2">
              <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{t.missionIntent}</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.missionPlaceholder}
                className="w-full h-40 bg-transparent border-none p-0 text-zinc-800 focus:ring-0 outline-none placeholder:text-zinc-300 text-[11px] font-medium leading-relaxed resize-none"
              />
            </div>

            <div className="bg-white border border-zinc-200 rounded p-3 space-y-2">
              <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{t.captionHooks}</label>
              <textarea 
                value={captionIdeas}
                onChange={(e) => setCaptionIdeas(e.target.value)}
                placeholder={t.captionPlaceholder}
                className="w-full h-40 bg-transparent border-none p-0 text-zinc-800 focus:ring-0 outline-none placeholder:text-zinc-300 text-[11px] font-medium leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* COL 3: DISTRIBUTION (SCROLLABLE) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Send size={11} className="text-zinc-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{t.targetGrid}</span>
          </div>

          <div className="bg-white border border-zinc-200 rounded flex flex-col min-h-[600px] shadow-sm">
            {/* Platform Selection */}
            <div className="p-2 border-b border-zinc-100 bg-zinc-50/30">
              <div className="grid grid-cols-2 gap-1">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const isSelected = selections.find(s => s.id === platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded border text-[9px] font-black uppercase tracking-wider transition-all
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'}
                      `}
                    >
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-zinc-200'}`}></div>
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Multi-Settings Stack */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {selections.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-24 opacity-20 text-zinc-900 grayscale">
                  <Send size={24} className="mb-2" />
                  <p className="text-[8px] font-black uppercase tracking-widest">{t.noTarget}</p>
                </div>
              ) : (
                selections.map(selection => {
                  const config = SOCIAL_PLATFORMS.find(p => p.id === selection.id);
                  if (!config) return null;

                  return (
                    <div key={selection.id} className="p-2.5 rounded border border-zinc-100 bg-[#fdfdfc] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between border-b border-zinc-50 pb-1.5">
                        <div className="flex items-center gap-1.5 text-zinc-900">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                          <span className="text-[9px] font-black uppercase tracking-widest">{config.label}</span>
                        </div>
                        <button onClick={() => togglePlatform(config)}><X size={10} className="text-zinc-300 hover:text-red-500" /></button>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {config.accounts && (
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t.accountTarget}</p>
                            <select 
                              value={selection.account}
                              onChange={(e) => updateSelection(selection.id, 'account', e.target.value)}
                              className="w-full bg-white border border-zinc-100 rounded py-1 px-1.5 text-[10px] font-bold text-zinc-700 outline-none"
                            >
                              {config.accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                            </select>
                          </div>
                        )}

                        {config.types && (
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t.relayFormat}</p>
                            <div className="flex gap-1">
                              {config.types.map(tFormat => (
                                <button
                                  key={tFormat}
                                  type="button"
                                  onClick={() => updateSelection(selection.id, 'type', tFormat)}
                                  className={`flex-1 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-all
                                    ${selection.type === tFormat ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-200'}
                                  `}
                                >
                                  {tFormat}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Launch Block */}
            <div className="p-3 bg-zinc-50 border-t border-zinc-100">
              {uploadProgress > 0 && (
                <div className="mb-3 space-y-1">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-blue-600 mono">
                    <span>{t.relayActive}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-0.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full py-3 text-[10px] uppercase tracking-[0.2em] font-black bg-blue-600 text-white border-blue-700 shadow-sm hover:translate-y-[-1px] transition-transform" 
                isLoading={isUploading}
                disabled={!file || selections.length === 0}
              >
                {t.executeLaunch} <ChevronRight size={12} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
