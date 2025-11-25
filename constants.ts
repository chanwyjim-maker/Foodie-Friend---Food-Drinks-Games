import { FoodItem } from './types';

export const FOOD_ITEMS: FoodItem[] = [
  // Staple Food
  { id: 'rice', name: 'Rice', emoji: '🍚', category: 'staple', color: 'bg-amber-100' },
  { id: 'bread', name: 'Bread', emoji: '🍞', category: 'staple', color: 'bg-amber-200' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'staple', color: 'bg-yellow-200' },
  { id: 'potato', name: 'Potato', emoji: '🥔', category: 'staple', color: 'bg-yellow-100' },
  
  // Vegetables
  { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'vegetable', color: 'bg-orange-300' },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'vegetable', color: 'bg-green-400' },
  { id: 'corn', name: 'Corn', emoji: '🌽', category: 'vegetable', color: 'bg-yellow-300' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'vegetable', color: 'bg-red-400' },
  { id: 'eggplant', name: 'Eggplant', emoji: '🍆', category: 'vegetable', color: 'bg-purple-300' },

  // Fruits
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'fruit', color: 'bg-red-300' },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'fruit', color: 'bg-yellow-300' },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'fruit', color: 'bg-purple-300' },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'fruit', color: 'bg-green-300' },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'fruit', color: 'bg-rose-300' },

  // Meats
  { id: 'chicken', name: 'Chicken', emoji: '🍗', category: 'meat', color: 'bg-orange-200' },
  { id: 'steak', name: 'Steak', emoji: '🥩', category: 'meat', color: 'bg-red-200' },
  { id: 'bacon', name: 'Bacon', emoji: '🥓', category: 'meat', color: 'bg-rose-400' },
  { id: 'shrimp', name: 'Shrimp', emoji: '🍤', category: 'meat', color: 'bg-pink-200' },

  // Drinks
  { id: 'milk', name: 'Milk', emoji: '🥛', category: 'drink', color: 'bg-blue-100' },
  { id: 'juice', name: 'Juice', emoji: '🧃', category: 'drink', color: 'bg-orange-300' },
  { id: 'water', name: 'Water', emoji: '💧', category: 'drink', color: 'bg-cyan-200' },
  { id: 'tea', name: 'Tea', emoji: '🍵', category: 'drink', color: 'bg-green-200' },
];