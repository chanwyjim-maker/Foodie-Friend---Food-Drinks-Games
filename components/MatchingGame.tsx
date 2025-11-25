import React, { useState, useEffect, useCallback } from 'react';
import { FoodItem, MatchingCard, LeaderboardEntry } from '../types';
import { FOOD_ITEMS } from '../constants';
import { speakText } from '../services/geminiService';

const GAME_DURATION = 60; // seconds

export const MatchingGame: React.FC = () => {
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MatchingCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Load leaderboard on mount
  useEffect(() => {
    const saved = localStorage.getItem('foodie_leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const startGame = () => {
    // Select 6 random items
    const shuffledFood = [...FOOD_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    
    const deck: MatchingCard[] = [];
    shuffledFood.forEach(item => {
      // Create Emoji Card
      deck.push({
        uniqueId: `${item.id}-emoji`,
        foodId: item.id,
        content: item.emoji,
        type: 'emoji',
        isFlipped: false,
        isMatched: false,
        color: item.color
      });
      // Create Text Card
      deck.push({
        uniqueId: `${item.id}-text`,
        foodId: item.id,
        content: item.name,
        type: 'text',
        isFlipped: false,
        isMatched: false,
        color: 'bg-white' // Text cards are white to make it a bit harder/cleaner
      });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairs(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setIsGameOver(false);
    setScoreSubmitted(false);
    setPlayerName('');
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isPlaying && timeLeft === 0) {
      endGame();
    }
  }, [isPlaying, timeLeft, endGame]);

  // Check for win condition
  useEffect(() => {
    if (matchedPairs === 6 && isPlaying) {
      endGame();
    }
  }, [matchedPairs, isPlaying, endGame]);

  const handleCardClick = (card: MatchingCard) => {
    // Prevent clicking if game over, already matched, already flipped, or 2 cards already flipped
    if (!isPlaying || card.isMatched || card.isFlipped || flippedCards.length >= 2) return;

    // Flip the card
    const newCards = cards.map(c => 
      c.uniqueId === card.uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    // Check match if 2 cards
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      
      if (first.foodId === second.foodId) {
        // MATCH!
        speakText("Nice!");
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.foodId === first.foodId ? { ...c, isMatched: true, isFlipped: true } : c
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.uniqueId === first.uniqueId || c.uniqueId === second.uniqueId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    } else {
        // Read the content if it's the first card flipped
        if(card.type === 'text') {
             // Find original item to get pronunciation right if needed, though simple reading works
             speakText(card.content);
        }
    }
  };

  const submitScore = () => {
    if (!playerName.trim()) return;

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score: timeLeft, // Score is remaining time
      date: new Date().toLocaleDateString()
    };

    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score) // Sort descending
      .slice(0, 10); // Keep top 10

    setLeaderboard(newLeaderboard);
    localStorage.setItem('foodie_leaderboard', JSON.stringify(newLeaderboard));
    setScoreSubmitted(true);
  };

  const isHighScore = leaderboard.length < 10 || timeLeft > (leaderboard[9]?.score || 0);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-purple-100 sticky top-20 z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-600 flex items-center gap-2">
          <span>🧩</span> Match!
        </h2>
        <div className={`text-2xl sm:text-3xl font-bold font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      {!isPlaying && !isGameOver && (
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border-4 border-purple-200 w-full max-w-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready?</h3>
          <p className="text-gray-600 mb-6">Match pairs before time runs out!</p>
          <button 
            onClick={startGame}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold py-4 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
          >
            Start Game ▶️
          </button>
          
          {leaderboard.length > 0 && (
             <div className="mt-8">
                <h4 className="font-bold text-purple-500 mb-3">🏆 Hall of Fame 🏆</h4>
                <div className="bg-purple-50 rounded-xl p-4 text-left">
                    {leaderboard.map((entry, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-2 border-b border-purple-100 last:border-0">
                            <span className="font-bold text-gray-600 truncate mr-2">{idx + 1}. {entry.name}</span>
                            <span className="font-mono text-purple-600 whitespace-nowrap">{entry.score}s left</span>
                        </div>
                    ))}
                </div>
             </div>
          )}
        </div>
      )}

      {(isPlaying || (isGameOver && matchedPairs < 6)) && (
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto pb-8">
          {cards.map((card) => (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(card)}
              className={`
                aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-md transition-all duration-300 transform
                ${card.isFlipped ? 'rotate-y-180' : ''}
                ${card.isFlipped || card.isMatched ? (card.type === 'emoji' ? card.color : 'bg-white border-2 border-purple-200') : 'bg-purple-500'}
              `}
              style={{ perspective: '1000px' }}
            >
              {card.isFlipped || card.isMatched ? (
                 <span className={`${card.type === 'text' ? 'text-xs sm:text-base font-bold text-gray-700 p-1 break-words leading-tight' : 'text-4xl'}`}>
                    {card.content}
                 </span>
              ) : (
                <span className="text-2xl text-white opacity-50">?</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isGameOver && matchedPairs === 6 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
              <h2 className="text-5xl mb-2">🎉</h2>
              <h3 className="text-3xl font-bold text-green-500 mb-4">YOU WON!</h3>
              <p className="text-xl text-gray-600 mb-6">Time left: <span className="font-bold text-purple-600">{timeLeft}s</span></p>

              {isHighScore && !scoreSubmitted ? (
                <div className="bg-yellow-50 p-5 rounded-2xl mb-6 border-2 border-yellow-200">
                  <p className="font-bold text-yellow-600 mb-3">🌟 Top 10 Score! 🌟</p>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={10}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 mb-3 text-center text-lg focus:border-purple-400 outline-none bg-white"
                    autoFocus
                  />
                  <button 
                    onClick={submitScore}
                    disabled={!playerName.trim()}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
                  >
                    Save Score
                  </button>
                </div>
              ) : (
                  scoreSubmitted && <p className="text-green-600 font-bold mb-6 bg-green-50 p-2 rounded-xl">Score Saved!</p>
              )}

              <button 
                onClick={startGame}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-colors"
              >
                Play Again
              </button>
           </div>
        </div>
      )}
      
      {isGameOver && matchedPairs < 6 && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="text-6xl mb-4">⏰</div>
                <h3 className="text-2xl font-bold text-red-500 mb-4">Time's Up!</h3>
                <p className="text-gray-600 mb-6">You matched {matchedPairs} pairs.</p>
                <button 
                    onClick={startGame}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg"
                >
                    Try Again
                </button>
            </div>
         </div>
      )}
    </div>
  );
};