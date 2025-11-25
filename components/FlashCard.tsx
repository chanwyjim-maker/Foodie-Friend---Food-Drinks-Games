import React, { useState } from 'react';
import { FoodItem } from '../types';
import { speakText } from '../services/geminiService';

interface FlashCardProps {
  item: FoodItem;
}

export const FlashCard: React.FC<FlashCardProps> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    // Visual feedback immediately
    await speakText(item.name);
    setTimeout(() => setIsPlaying(false), 1000); // Reset visual state after rough duration
  };

  return (
    <div 
      onClick={handlePlay}
      className={`
        relative group cursor-pointer 
        flex flex-col items-center justify-center 
        p-4 rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.15)] 
        transition-all duration-150 transform active:translate-y-2 active:shadow-none hover:scale-105
        ${item.color}
      `}
    >
      <div className="text-6xl mb-2 drop-shadow-md transition-transform duration-300 group-hover:rotate-12">
        {item.emoji}
      </div>
      <h3 className="text-xl font-bold text-white drop-shadow-sm font-['Fredoka'] tracking-wide">
        {item.name}
      </h3>
      
      {/* Speaker Icon Overlay */}
      <div className={`
        absolute top-2 right-2 bg-white/30 rounded-full p-1.5
        transition-opacity duration-200
        ${isPlaying ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}
      `}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      </div>
    </div>
  );
};
