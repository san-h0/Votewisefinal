import React from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingMitraWidgetProps {
  onClick: () => void;
}

export const FloatingMitraWidget: React.FC<FloatingMitraWidgetProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      id="floating-ask-mitra-btn"
      onClick={onClick}
      aria-label="Open Mitra AI Civic Assistant"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-2xl hover:shadow-emerald-500/25 border border-emerald-400/40 cursor-pointer transition-all duration-200 active:scale-95 group focus-visible:ring-2 focus-visible:ring-emerald-400 outline-hidden"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-white text-emerald-700 font-extrabold text-sm flex items-center justify-center shadow-xs">
          M
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse"></span>
      </div>
      <div className="text-left leading-tight pr-1">
        <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
          <span>Ask Mitra</span>
          <Sparkles className="w-3 h-3 text-amber-300 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="text-[10px] text-emerald-100 font-medium">AI Civic Assistant</div>
      </div>
    </button>
  );
};
