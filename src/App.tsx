/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { PractiseView } from './components/PractiseView';
import { ProgressDashboardView } from './components/ProgressDashboardView';
import { SupportModal } from './components/SupportModal';
import { DeckFilter } from './utils/categories';

type ViewState = 'home' | 'learn' | 'practise' | 'progress';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [learnWordIndex, setLearnWordIndex] = useState<number | undefined>(undefined);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportModalTab, setSupportModalTab] = useState<'support' | 'hall-of-fame' | 'feedback'>('support');
  const [activeDeck, setActiveDeck] = useState<DeckFilter>({
    type: 'all',
    title: 'All 824 Words'
  });

  const handleOpenSupport = (tab: 'support' | 'hall-of-fame' | 'feedback' = 'support') => {
    setSupportModalTab(tab);
    setIsSupportModalOpen(true);
  };

  const handleNavigate = (view: ViewState | string, wordIndex?: number, deck?: DeckFilter) => {
    if (deck) {
      setActiveDeck(deck);
    }
    if (wordIndex !== undefined) {
      setLearnWordIndex(wordIndex);
    }
    setCurrentView(view as ViewState);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md flex flex-col min-h-screen antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header onOpenSupport={() => handleOpenSupport('support')} />
      
      <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
        {currentView === 'home' && (
          <HomeView 
            onChangeView={handleNavigate}
            activeDeck={activeDeck}
            onSelectDeck={setActiveDeck}
            onOpenSupport={handleOpenSupport}
          />
        )}
        {currentView === 'learn' && (
          <LearnView 
            initialIndex={learnWordIndex}
            activeDeck={activeDeck}
            onSelectDeck={setActiveDeck}
            onQuizDeck={(deck) => handleNavigate('practise', undefined, deck)}
          />
        )}
        {currentView === 'practise' && (
          <PractiseView 
            activeDeck={activeDeck}
            onSelectDeck={setActiveDeck}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'progress' && (
          <ProgressDashboardView
            onNavigate={handleNavigate}
            onSelectDeck={setActiveDeck}
            onOpenSupport={handleOpenSupport}
          />
        )}
      </main>

      <BottomNav currentView={currentView} onChangeView={handleNavigate} />

      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
        initialTab={supportModalTab}
      />
    </div>
  );
}

