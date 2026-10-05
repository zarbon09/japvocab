import React, { useState, useEffect } from 'react';
import { getBmacUrl, setBmacUrl, DEFAULT_BMAC_URL, SUPPORT_EMAIL } from '../utils/supportConfig';
import { getSupporters, saveSupporter, Supporter } from '../utils/supportersStorage';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'support' | 'hall-of-fame' | 'feedback';
}

export const SupportModal: React.FC<SupportModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'support'
}) => {
  const [activeTab, setActiveTab] = useState<'support' | 'hall-of-fame' | 'feedback'>(initialTab);
  const [bmacUrl, setLocalBmacUrl] = useState(DEFAULT_BMAC_URL);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(DEFAULT_BMAC_URL);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');

  // Supporter Wall state
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [showAddBackerForm, setShowAddBackerForm] = useState(false);
  const [backerName, setBackerName] = useState('');
  const [backerMessage, setBackerMessage] = useState('');
  const [backerTier, setBackerTier] = useState<'backer' | 'patron' | 'founding'>('backer');
  const [justAddedBacker, setJustAddedBacker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      const current = getBmacUrl();
      setLocalBmacUrl(current);
      setUrlInput(current);
      setCopiedEmail(false);
      setIsEditingUrl(false);
      setSupporters(getSupporters());
      setShowAddBackerForm(false);
      setJustAddedBacker(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = urlInput.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('buymeacoffee.com')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = `https://buymeacoffee.com/${finalUrl.replace('@', '')}`;
      }
    }
    setBmacUrl(finalUrl);
    setLocalBmacUrl(finalUrl);
    setUrlInput(finalUrl);
    setIsEditingUrl(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendFeedbackEmail = () => {
    const subject = encodeURIComponent('Visual Japanese - Feedback & Suggestions');
    const body = encodeURIComponent(feedbackNote || 'Hi! Here are my suggestions for Visual Japanese:\n\n');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleAddBacker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!backerName.trim()) return;

    let tierLabel = 'Milestone Backer';
    let badgeIcon = '⚡';
    if (backerTier === 'patron') {
      tierLabel = 'Matcha Patron';
      badgeIcon = '🍵';
    } else if (backerTier === 'founding') {
      tierLabel = 'N4 Pioneer';
      badgeIcon = '🌸';
    }

    const updated = saveSupporter({
      name: backerName.trim(),
      tier: backerTier,
      tierLabel,
      badgeIcon,
      message: backerMessage.trim() || 'Excited for the complete JLPT N4 visual deck!',
    });

    setSupporters(updated);
    setBackerName('');
    setBackerMessage('');
    setShowAddBackerForm(false);
    setJustAddedBacker(true);
    setTimeout(() => setJustAddedBacker(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-surface-variant/20 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-[#FFDD00] to-yellow-400 p-5 sm:p-6 text-neutral-900 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-neutral-900"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/95 shadow-md flex items-center justify-center text-2xl select-none shrink-0">
              {activeTab === 'hall-of-fame' ? '🏆' : '☕'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950/80 block">
                Free Education Initiative
              </span>
              <h2 className="text-xl font-bold font-headline-sm text-neutral-950 leading-tight">
                {activeTab === 'hall-of-fame' ? 'Hall of Fame & Backers' : 'Support Visual Japanese'}
              </h2>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-neutral-900 leading-relaxed max-w-md">
            This app is 100% free and ad-free. Our next mission is bringing the complete JLPT N4 curriculum (1,500+ illustrated flashcards, native audio, and mnemonics). Help us hit the $1,000 milestone to fund the development and keep it free for all learners forever!
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-black/10 rounded-2xl">
            <button
              onClick={() => setActiveTab('support')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'support' 
                  ? 'bg-white text-neutral-900 shadow-xs' 
                  : 'text-neutral-900/80 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              <span>☕</span>
              <span>Support Goal</span>
            </button>
            <button
              onClick={() => setActiveTab('hall-of-fame')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'hall-of-fame' 
                  ? 'bg-white text-neutral-900 shadow-xs' 
                  : 'text-neutral-900/80 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              <span>🏆</span>
              <span>Hall of Fame</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-600/20 text-neutral-950 rounded-full font-bold">
                {supporters.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'feedback' 
                  ? 'bg-white text-neutral-900 shadow-xs' 
                  : 'text-neutral-900/80 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              <span>📬</span>
              <span>Feedback</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* ================= TAB 1: SUPPORT & GOAL ================= */}
          {activeTab === 'support' && (
            <>
              {/* Main Action: Buy Me a Coffee */}
              <div className="text-center p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <h3 className="font-bold text-on-surface text-base mb-1">
                  Fuel the Project with a Coffee or Matcha 🍵
                </h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Every contribution goes directly towards server costs and developing the N4 deck.
                </p>
                
                <a
                  href={bmacUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-[#FFDD00] hover:bg-[#ffe338] text-neutral-900 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <span className="text-lg">☕</span>
                  <span>Support on Buy Me a Coffee</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>

                {/* Backer perk callout */}
                <div className="mt-3.5 pt-3 border-t border-amber-500/15 flex items-center justify-center gap-1.5 text-xs text-amber-900 dark:text-amber-300 font-semibold">
                  <span>⭐️</span>
                  <span>All contributors get permanently honored on our Supporter Wall!</span>
                </div>

                {/* Configurable URL */}
                <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-on-surface-variant">
                  <span>Destination:</span>
                  <span className="font-mono text-primary truncate max-w-[180px]">{bmacUrl}</span>
                  <button
                    onClick={() => setIsEditingUrl(!isEditingUrl)}
                    className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                    <span>{isEditingUrl ? 'Cancel' : 'Change'}</span>
                  </button>
                </div>

                {isEditingUrl && (
                  <form onSubmit={handleSaveUrl} className="mt-3 p-3 bg-surface rounded-xl border border-surface-variant/30 flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://buymeacoffee.com/yourname"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-surface-variant bg-surface text-on-surface focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-xs hover:bg-primary-container"
                    >
                      Save
                    </button>
                  </form>
                )}
              </div>

              {/* $1,000 Milestone: JLPT N4 Deck */}
              <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span className="font-bold text-sm text-on-surface">Community Milestone Goal</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    $1,000 Target
                  </span>
                </div>
                
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                  This app is 100% free and ad-free. Our next mission is bringing the complete JLPT N4 curriculum (1,500+ illustrated flashcards, native audio, and mnemonics). Help us hit the $1,000 milestone to fund the development and keep it free for all learners forever!
                </p>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden mb-1.5">
                  <div 
                    className="bg-gradient-to-r from-primary to-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: '12%' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                  <span>Community Funded</span>
                  <span>Goal: $1,000</span>
                </div>
              </div>

              {/* Supporter Wall Teaser */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Hall of Fame / Backers Wall</h4>
                    <p className="text-[11px] text-on-surface-variant">{supporters.length} milestone champions listed</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('hall-of-fame')}
                  className="py-1.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>View Wall</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </>
          )}

          {/* ================= TAB 2: HALL OF FAME / SUPPORTER WALL ================= */}
          {activeTab === 'hall-of-fame' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>Milestone Backers Wall</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Special gratitude to our community heroes helping bring JLPT N4 to life!
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBackerForm(!showAddBackerForm)}
                  className="py-1.5 px-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>{showAddBackerForm ? 'Cancel' : 'Add Backer'}</span>
                </button>
              </div>

              {justAddedBacker && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Welcome to the Hall of Fame! Your backer card is now live on the wall! 🎉</span>
                </div>
              )}

              {/* Add Backer Form */}
              {showAddBackerForm && (
                <form onSubmit={handleAddBacker} className="p-4 rounded-2xl bg-surface-container-low border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">Record Backer / Claim Your Spot</span>
                    <span className="text-[10px] text-on-surface-variant">Donated on Buy Me a Coffee</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                      Your Name or Nickname *
                    </label>
                    <input
                      type="text"
                      required
                      value={backerName}
                      onChange={(e) => setBackerName(e.target.value)}
                      placeholder="e.g. Kenji_Study or Anonymous Patron"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                      Tier / Badge Style
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBackerTier('backer')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          backerTier === 'backer'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200'
                            : 'bg-surface border-surface-variant/30 text-on-surface-variant'
                        }`}
                      >
                        ⚡ Backer
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackerTier('patron')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          backerTier === 'patron'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200'
                            : 'bg-surface border-surface-variant/30 text-on-surface-variant'
                        }`}
                      >
                        🍵 Patron
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackerTier('founding')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          backerTier === 'founding'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200'
                            : 'bg-surface border-surface-variant/30 text-on-surface-variant'
                        }`}
                      >
                        🌸 Pioneer
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                      Optional Cheerful Message or Study Wish
                    </label>
                    <input
                      type="text"
                      value={backerMessage}
                      onChange={(e) => setBackerMessage(e.target.value)}
                      placeholder="e.g. Rooting for the $1,000 N4 deck! Gambatte!"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all"
                    >
                      Enshrine on Wall 🏆
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddBackerForm(false)}
                      className="px-3 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Supporters List */}
              <div className="space-y-2.5">
                {supporters.map((backer) => (
                  <div 
                    key={backer.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      backer.isCreator
                        ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-surface-container border-amber-500/40 shadow-xs'
                        : backer.tier === 'founding' || backer.tier === 'patron'
                        ? 'bg-surface-container-lowest border-amber-500/25 shadow-xs'
                        : 'bg-surface-container-lowest border-surface-variant/20'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl shrink-0 shadow-xs">
                      {backer.badgeIcon}
                    </div>

                    {/* Backer Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-xs text-on-surface truncate">
                            {backer.name}
                          </span>
                          {backer.isCreator && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/30 text-amber-950 dark:text-amber-200 px-1.5 py-0.5 rounded-md">
                              Creator
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-medium shrink-0">
                          {backer.date}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 block">
                        {backer.tierLabel}
                      </span>

                      {backer.message && (
                        <p className="text-xs text-on-surface-variant/90 italic mt-1 leading-relaxed">
                          "{backer.message}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action at bottom of wall */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center mt-3">
                <span className="text-xl block mb-1">🍵</span>
                <h4 className="font-bold text-xs text-on-surface">Want to see your name on the wall?</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 mb-2.5">
                  Buy a coffee or matcha to support our $1,000 N4 goal, and claim your place in the Hall of Fame!
                </p>
                <a
                  href={bmacUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#FFDD00] text-neutral-900 font-bold text-xs shadow-xs hover:bg-[#ffe338] transition-transform active:scale-95"
                >
                  <span>☕ Support on Buy Me a Coffee</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          )}

          {/* ================= TAB 3: FEEDBACK & CONTACT ================= */}
          {activeTab === 'feedback' && (
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📬</span>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">
                    Feedback, Suggestions & Complaints
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    We review every message personally to improve cards and audio!
                  </p>
                </div>
              </div>

              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="What would you like to see improved or added? (e.g. card corrections, new categories, study modes)"
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:border-primary resize-none"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleSendFeedbackEmail}
                  className="flex-1 py-2 px-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Send via Email</span>
                </button>
                
                <button
                  onClick={handleCopyEmail}
                  className="py-2 px-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy developer email"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedEmail ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-variant/15 flex items-center justify-between text-xs text-on-surface-variant shrink-0">
          <div className="flex items-center gap-2">
            <span>🌸</span>
            <span className="font-medium">Visual Japanese · 100% Free Forever</span>
            <span className="text-outline">·</span>
            <a 
              href="/api/download-zip" 
              download="visual-japanese-n5.zip"
              className="text-primary hover:underline font-bold inline-flex items-center gap-1"
              title="Download source code ZIP"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>Export ZIP</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
