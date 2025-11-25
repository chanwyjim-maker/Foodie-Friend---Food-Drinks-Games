import React, { useState, useEffect } from 'react';
import { FoodItem, MysteryState } from '../types';
import { FOOD_ITEMS } from '../constants';
import { generateMysteryClue, speakText } from '../services/geminiService';

export const StoryTime: React.FC = () => {
  const [gameState, setGameState] = useState<MysteryState>({
    clue: '',
    targetItem: null,
    options: [],
    isLoading: true,
    hasGuessedCorrectly: false,
    wrongGuessId: null,
  });

  const startNewGame = async () => {
    setGameState(prev => ({
      ...prev,
      isLoading: true,
      hasGuessedCorrectly: false,
      wrongGuessId: null,
      clue: ''
    }));

    // 1. Pick a random target
    const target = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];

    // 2. Pick 2 unique distractors
    const otherItems = FOOD_ITEMS.filter(i => i.id !== target.id);
    const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, 2);

    // 3. Shuffle options
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    // 4. Generate Clue
    const clue = await generateMysteryClue(target.name);

    setGameState({
      targetItem: target,
      options: options,
      clue: clue,
      isLoading: false,
      hasGuessedCorrectly: false,
      wrongGuessId: null,
    });

    // Auto-read the clue
    speakText(clue, 'Puck');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = (item: FoodItem) => {
    if (gameState.hasGuessedCorrectly || gameState.isLoading) return;

    if (item.id === gameState.targetItem?.id) {
      setGameState(prev => ({ ...prev, hasGuessedCorrectly: true, wrongGuessId: null }));
      speakText("Correct! Good job!");
    } else {
      setGameState(prev => ({ ...prev, wrongGuessId: item.id }));
      speakText("Try again!");
      setTimeout(() => {
        setGameState(prev => ({ ...prev, wrongGuessId: null }));
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-amber-600 mb-6 flex items-center gap-2">
        <span className="text-4xl">🕵️</span> Mystery Guess
      </h2>

      {gameState.isLoading ? (
        <div className="flex flex-col items-center p-12 bg-white rounded-3xl shadow-xl w-full max-w-lg border-4 border-amber-100">
          <div className="animate-spin text-6xl mb-4">🌀</div>
          <p className="text-xl font-bold text-gray-500 animate-pulse">Writing a clue...</p>
        </div>
      ) : (
        <div className="w-full">
          {/* Clue Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.1)] border-4 border-amber-200 p-6 sm:p-8 mb-6 relative group">
            <button 
               onClick={() => speakText(gameState.clue, 'Puck')}
               className="absolute -top-3 -right-3 bg-amber-400 hover:bg-amber-500 p-3 rounded-full text-white shadow-md transition-all active:scale-95"
               aria-label="Read clue"
             >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
            </button>
            <p className="text-xl sm:text-2xl text-center font-medium text-gray-700 leading-relaxed font-['Fredoka']">
              "{gameState.clue}"
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4">
            {gameState.options.map((item) => {
              const isWrong = gameState.wrongGuessId === item.id;
              const isCorrect = gameState.hasGuessedCorrectly && gameState.targetItem?.id === item.id;
              const isDisabled = gameState.hasGuessedCorrectly;

              return (
                <button
                  key={item.id}
                  onClick={() => handleGuess(item)}
                  disabled={isDisabled}
                  className={`
                    flex flex-row items-center justify-start p-4 px-6 rounded-3xl transition-all duration-300 transform
                    ${isCorrect 
                      ? 'bg-green-400 scale-105 shadow-[0_0_20px_rgba(74,222,128,0.6)] z-10' 
                      : isWrong 
                        ? 'bg-red-200 translate-x-1' 
                        : 'bg-white hover:bg-amber-50 shadow-md active:scale-95'
                    }
                    ${isDisabled && !isCorrect ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-4xl sm:text-5xl mr-6">{item.emoji}</span>
                  <span className={`text-xl font-bold ${isCorrect ? 'text-white' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Success / Next Button */}
          {gameState.hasGuessedCorrectly && (
            <div className="mt-8 text-center animate-bounce">
              <p className="text-2xl font-bold text-green-600 mb-4">You found me!</p>
              <button
                onClick={startNewGame}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg transition-colors"
              >
                Next Mystery ➡️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};