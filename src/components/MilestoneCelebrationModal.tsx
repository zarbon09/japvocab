import React, { useEffect, useState } from 'react';
import { MilestoneBadge, fireMilestoneCelebration } from '../utils/badges';

interface MilestoneCelebrationModalProps {
  badge: MilestoneBadge | null;
  onClose: () => void;
  onViewDashboard?: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  badge,
  onClose,
  onViewDashboard,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (badge) {
      fireMilestoneCelebration();
    }
  }, [badge]);

  if (!badge) return null;

  const handleShare = async () => {
    const shareText = `🇯🇵 Milestone Unlocked: ${badge.icon} ${badge.title} (${badge.kanjiTitle})!\n\n"${badge.description}"\n\nStudying 824 JLPT N5 words with Visual Japanese Flashcards 🌸`;
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.warn('Clipboard write failed', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-sm rounded-3xl bg-surface-container-lowest border border-surface-variant/30 shadow-2xl p-6 text-center overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div 
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: badge.accentColor }}
        />
        <div 
          className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: badge.accentColor }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs shadow-sm mb-3">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          <span>MILESTONE UNLOCKED!</span>
        </div>

        {/* Badge Medal Circle */}
        <div className="relative mx-auto my-3 w-28 h-28 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: badge.accentColor }}
          />
          <div 
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white/80 dark:border-surface relative z-10"
            style={{ 
              background: `radial-gradient(circle, ${badge.accentColor}25 0%, ${badge.accentColor}08 100%)`,
              borderColor: badge.accentColor
            }}
          >
            <span className="text-4xl filter drop-shadow-md select-none">{badge.icon}</span>
            <span className="text-[10px] font-bold tracking-widest text-on-surface uppercase mt-0.5 opacity-80">
              {badge.tier}
            </span>
          </div>
        </div>

        {/* Kanji & Title */}
        <div className="mt-2">
          <p className="font-bold text-xs uppercase tracking-widest text-primary">
            {badge.kanjiTitle}
          </p>
          <h2 className="text-2xl font-extrabold text-on-surface mt-0.5 tracking-tight">
            {badge.title}
          </h2>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed px-2">
            {badge.description}
          </p>
        </div>

        {/* Target Count Pill */}
        <div className="mt-4 py-2 px-3 rounded-xl bg-surface-container-low border border-surface-variant/20 inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
          <span className="text-xs font-semibold text-on-surface">
            Goal Reached: {badge.targetCount} {badge.category === 'habit' ? 'Days' : 'Words'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'share'}
            </span>
            <span>{copied ? 'Achievement Copied to Clipboard!' : 'Share Milestone'}</span>
          </button>

          <div className="flex gap-2">
            {onViewDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onViewDashboard();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                <span>Trophy Room</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-xl bg-surface-container-highest hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
