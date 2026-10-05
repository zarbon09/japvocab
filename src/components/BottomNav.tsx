import React from 'react';

type BottomNavProps = {
  currentView: string;
  onChangeView: (view: 'home' | 'learn' | 'practise' | 'progress') => void;
};

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(44,52,55,0.04)] border-t border-surface-variant/20">
      <div className="flex justify-around items-center h-16 px-gutter max-w-lg mx-auto">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onChangeView('home'); }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] transition-all ${
            currentView === 'home'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div
            className={`w-12 h-7 rounded-full flex items-center justify-center transition-colors ${
              currentView === 'home' ? 'bg-primary-fixed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
          </div>
          <span className="font-label-sm text-[11px] tracking-wide">Home</span>
        </a>

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onChangeView('learn'); }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] transition-all ${
            currentView === 'learn'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div
            className={`w-12 h-7 rounded-full flex items-center justify-center transition-colors ${
              currentView === 'learn' ? 'bg-primary-fixed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </div>
          <span className="font-label-sm text-[11px] tracking-wide">Learn</span>
        </a>

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onChangeView('practise'); }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] transition-all ${
            currentView === 'practise'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div
            className={`w-12 h-7 rounded-full flex items-center justify-center transition-colors ${
              currentView === 'practise' ? 'bg-primary-fixed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <span className="font-label-sm text-[11px] tracking-wide">Practise</span>
        </a>

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onChangeView('progress'); }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] transition-all ${
            currentView === 'progress'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <div
            className={`w-12 h-7 rounded-full flex items-center justify-center transition-colors ${
              currentView === 'progress' ? 'bg-primary-fixed' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
          </div>
          <span className="font-label-sm text-[11px] tracking-wide">Progress</span>
        </a>
      </div>
    </nav>
  );
};

