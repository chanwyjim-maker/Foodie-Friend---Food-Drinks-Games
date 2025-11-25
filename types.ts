export type Category = 'staple' | 'vegetable' | 'fruit' | 'meat' | 'drink';

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  color: string; // Tailwind bg color class
}

export interface StoryState {
  content: string;
  isLoading: boolean;
  currentFoodId: string | null;
  isPlayingAudio: boolean;
}

export interface RiddleState {
  question: string;
  answerId: string;
  options: FoodItem[];
  isLoading: boolean;
  feedback: 'idle' | 'correct' | 'incorrect';
}

export interface MysteryState {
  clue: string;
  targetItem: FoodItem | null;
  options: FoodItem[];
  isLoading: boolean;
  hasGuessedCorrectly: boolean;
  wrongGuessId: string | null;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export interface MatchingCard {
  uniqueId: string;
  foodId: string;
  content: string; // Emoji or Text
  type: 'emoji' | 'text';
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}