import React from 'react';

interface HeaderProps {
  onOpenSupport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSupport }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(44,52,55,0.03)] pt-safe">
      <div className="h-16 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="text-primary text-[20px] select-none">🌸</span>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">VISUAL JAPANESE</span>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 bg-[#FFDD00]/25 hover:bg-[#FFDD00]/40 text-amber-950 border border-[#FFDD00]/60 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
            title="Support the project & feedback"
          >
            <span className="text-[14px]">☕</span>
            <span className="hidden sm:inline">Support</span>
          </button>
          
          <div className="flex items-center gap-space-xs bg-tertiary-fixed/40 px-space-sm py-space-xs rounded-full shadow-[0_2px_8px_rgba(44,52,55,0.04)]">
            <span className="text-[14px] select-none">🔥</span>
            <span className="font-label-md text-label-md text-on-tertiary-fixed font-bold">5</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
