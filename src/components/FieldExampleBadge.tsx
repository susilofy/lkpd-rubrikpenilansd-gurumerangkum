import React, { useState } from 'react';
import { Sparkles, Copy, Check, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface FieldExampleBadgeProps {
  label?: string;
  exampleText: string;
  onApply?: () => void;
  accentColor?: 'blue' | 'indigo' | 'emerald';
  contextHint?: string;
}

export const FieldExampleBadge: React.FC<FieldExampleBadgeProps> = ({
  label = 'Contoh Hasil',
  exampleText,
  onApply,
  accentColor = 'blue',
  contextHint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const colorStyles = {
    blue: {
      btn: 'text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border-blue-200',
      card: 'bg-blue-50/50 border-blue-200 text-blue-950',
      accent: 'text-blue-700',
    },
    indigo: {
      btn: 'text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200',
      card: 'bg-indigo-50/50 border-indigo-200 text-indigo-950',
      accent: 'text-indigo-700',
    },
    emerald: {
      btn: 'text-emerald-600 hover:text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200',
      card: 'bg-emerald-50/50 border-emerald-200 text-emerald-950',
      accent: 'text-emerald-700',
    },
  }[accentColor];

  return (
    <div className="inline-block relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold transition-all shadow-2xs ${colorStyles.btn}`}
        title="Lihat contoh hasil generate untuk kolom ini"
      >
        <Sparkles className="w-3 h-3" />
        <span>{label}</span>
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-1.5 p-3 rounded-xl border bg-white shadow-lg text-xs z-20 space-y-2 border-slate-200 min-w-[280px] max-w-md animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${colorStyles.accent}`}>
              ✨ Contoh Hasil Generate AI
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Salin contoh"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onApply && (
                <button
                  type="button"
                  onClick={() => {
                    onApply();
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors"
                >
                  Terapkan
                </button>
              )}
            </div>
          </div>

          {contextHint && (
            <div className="text-[10px] px-2 py-1 rounded-md bg-blue-50/90 text-blue-800 border border-blue-100 flex items-center gap-1">
              <span className="font-semibold text-blue-900 shrink-0">🎯 Sesuai Isian:</span>
              <span className="truncate">{contextHint}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-800 leading-relaxed font-mono whitespace-pre-line bg-slate-50 p-2 rounded-lg border border-slate-100">
            {exampleText}
          </p>
        </div>
      )}
    </div>
  );
};
