import React, { useState } from 'react';
import { FOOD_ITEMS } from './constants';
import { Category } from './types';
import { FlashCard } from './components/FlashCard';
import { StoryTime } from './components/StoryTime';
import { MatchingGame } from './components/MatchingGame';

type View = 'learn' | 'story' | 'game';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('learn');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const categories: {id: Category | 'all', label: string, emoji: string}[] = [
    { id: 'all', label: 'All', emoji: '🍽️' },
    { id: 'staple', label: 'Staple Food', emoji: '🍞' },
    { id: 'vegetable', label: 'Veggie', emoji: '🥦' },
    { id: 'fruit', label: 'Fruit', emoji: '🍎' },
    { id: 'meat', label: 'Meat', emoji: '🥩' },
    { id: 'drink', label: 'Drink', emoji: '🧃' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? FOOD_ITEMS 
    : FOOD_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pb-32 bg-[#FFFBEB] select-none">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b-4 border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍲</span>
            <div>
                <h1 className="text-2xl font-bold text-amber-600 tracking-tight leading-none">Foodie Friends</h1>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest sm:hidden">
                    English for Kids
                </div>
            </div>
          </div>
          <div className="text-sm font-bold text-amber-400 uppercase tracking-widest hidden sm:block">
            English for Kids
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {currentView === 'learn' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6">
                 <h2 className="text-3xl font-bold text-gray-700 mb-2">
                    Let's Learn!
                </h2>
                <p className="text-gray-500">Tap a card to hear the sound 🔊</p>
            </div>

            {/* Mobile-Friendly Horizontal Scroll Categories */}
            <div className="mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-2 w-max mx-auto sm:mx-0">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`
                                flex items-center gap-1 px-5 py-3 rounded-full font-bold text-sm transition-all border-2 whitespace-nowrap
                                ${activeCategory === cat.id 
                                    ? 'bg-amber-400 text-white border-amber-400 shadow-md scale-105' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-amber-200'
                                }
                            `}
                        >
                            <span className="text-lg">{cat.emoji}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <FlashCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {currentView === 'story' && <StoryTime />}
        
        {currentView === 'game' && <MatchingGame />}
      </main>

      {/* Bottom Navigation - Mobile Optimized */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-amber-100 z-50 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2 pb-4 sm:pb-2">
            <button
              onClick={() => setCurrentView('learn')}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-2xl w-20 transition-all duration-300
                ${currentView === 'learn' 
                  ? 'text-amber-500 -translate-y-2' 
                  : 'text-gray-400 hover:text-amber-400'
                }
              `}
            >
              <div className={`
                 p-2 rounded-2xl transition-all
                 ${currentView === 'learn' ? 'bg-amber-100 shadow-sm' : 'bg-transparent'}
              `}>
                  <span className="text-2xl">📚</span>
              </div>
              <span className="text-xs font-bold">Learn</span>
            </button>
            
            <button
              onClick={() => setCurrentView('story')}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-2xl w-20 transition-all duration-300
                ${currentView === 'story' 
                  ? 'text-green-500 -translate-y-2' 
                  : 'text-gray-400 hover:text-green-400'
                }
              `}
            >
              <div className={`
                 p-2 rounded-2xl transition-all
                 ${currentView === 'story' ? 'bg-green-100 shadow-sm' : 'bg-transparent'}
              `}>
                  <span className="text-2xl">🕵️</span>
              </div>
              <span className="text-xs font-bold">Guess</span>
            </button>

            <button
              onClick={() => setCurrentView('game')}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-2xl w-20 transition-all duration-300
                ${currentView === 'game' 
                  ? 'text-purple-500 -translate-y-2' 
                  : 'text-gray-400 hover:text-purple-400'
                }
              `}
            >
               <div className={`
                 p-2 rounded-2xl transition-all
                 ${currentView === 'game' ? 'bg-purple-100 shadow-sm' : 'bg-transparent'}
              `}>
                  <span className="text-2xl">🎮</span>
              </div>
              <span className="text-xs font-bold">Play</span>
            </button>
        </div>
      </nav>
    </div>
  );
}