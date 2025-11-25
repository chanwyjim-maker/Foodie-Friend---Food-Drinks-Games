import React, { useState, useEffect } from 'react';
import { FoodItem, RiddleState } from '../types';
import { FOOD_ITEMS } from '../constants';
import { generateRiddle, speakText } from '../services/geminiService';

export const RiddleGame: React.FC = () => {
  const [gameState, setGameState] = useState<RiddleState>({
    question: '',
    answerId: '',
    options: [],
    isLoading: true,
    feedback: 'idle',
  });

  const setupNewRound = async () => {
    setGameState(prev => ({ ...prev, isLoading: true, feedback: 'idle', question: '' }));
    
    // Pick random food as answer
    const answer = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
    
    // Pick 2 other random foods (unique)
    const options = [answer];
    while (options.length < 3) {
      const random = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
      if (!options.find(o => o.id === random.id)) {
        options.push(random);
      }
    }
    
    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    // Generate riddle
    const riddle = await generateRiddle(answer.name);

    setGameState({
      question: riddle,
      answerId: answer.id,
      options: shuffledOptions,
      isLoading: false,
      feedback: 'idle',
    });

    // Read the riddle automatically
    speakText(riddle);
  };

  useEffect(() => {
    setupNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = (food: FoodItem) => {
    if (gameState.feedback !== 'idle') return;

    if (food.id === gameState.answerId) {
      setGameState(prev => ({ ...prev, feedback: 'correct' }));
      speakText("Correct! Good job!");
    } else {
      setGameState(prev => ({ ...prev, feedback: 'incorrect' }));
      speakText("Oops, try again!");
      // Reset feedback after a moment to allow retrying
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedback: 'idle' }));
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
       <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-2">
        <span className="text-4xl">🕵️‍♀️</span> Mystery Food
      </h2>

      {gameState.isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin text-5xl mb-4">🌀</div>
          <p className="text-xl font-bold text-gray-500">Thinking of a riddle...</p>
        </div>
      ) : (
        <div className="w-full">
          {/* Riddle Box */}
          <div className="bg-white border-4 border-purple-200 p-8 rounded-3xl shadow-lg mb-8 relative">
             <button 
               onClick={() => speakText(gameState.question)}
               className="absolute top-4 right-4 bg-purple-100 hover:bg-purple-200 p-2 rounded-full text-purple-600 transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
             </button>
             <p className="text-2xl text-center font-medium text-gray-700 leading-relaxed">
               {gameState.question}
             </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {gameState.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleGuess(option)}
                disabled={gameState.feedback === 'correct'}
                className={`
                  flex flex-col items-center p-6 rounded-3xl transition-all duration-300 transform
                  ${gameState.feedback === 'correct' && option.id === gameState.answerId 
                    ? 'bg-green-400 scale-110 shadow-[0_0_20px_rgba(74,222,128,0.6)]' 
                    : gameState.feedback === 'incorrect' 
                      ? 'bg-gray-100 opacity-50' 
                      : 'bg-white hover:bg-purple-50 shadow-md hover:scale-105 hover:shadow-xl'
                  }
                `}
              >
                <span className="text-6xl mb-3 drop-shadow-sm">{option.emoji}</span>
                <span className="text-xl font-bold text-gray-700">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Next Button / Feedback */}
          <div className="h-24 flex items-center justify-center mt-6">
            {gameState.feedback === 'correct' && (
              <div className="text-center animate-bounce">
                <p className="text-2xl font-bold text-green-600 mb-2">🎉 YAY! You got it! 🎉</p>
                <button
                  onClick={setupNewRound}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-colors"
                >
                  Next Puzzle ➡️
                </button>
              </div>
            )}
            {gameState.feedback === 'incorrect' && (
               <p className="text-xl font-bold text-red-500">Not that one... Try again!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
