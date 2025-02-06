// apps/web/src/app/game/create/components/DifficultySelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Difficulty } from '@wordsearch/types';

const difficulties: {
  name: Difficulty;
  color: string;
  description: string;
}[] = [
  {
    name: 'easy',
    color: 'bg-green-500 hover:bg-green-600',
    description: '10x10 grid - Palabras simples',
  },
  {
    name: 'medium',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    description: '12x12 grid - Términos técnicos',
  },
  {
    name: 'hard',
    color: 'bg-red-500 hover:bg-red-600',
    description: '15x15 grid - Vocabulario avanzado',
  },
  {
    name: 'expert',
    color: 'bg-purple-500 hover:bg-purple-600',
    description: '18x18 grid - Desafío extremo',
  },
  {
    name: 'numbers',
    color: 'bg-blue-500 hover:bg-blue-600',
    description: '10x10 grid - Combinaciones numéricas',
  },
];

interface DifficultySelectorProps {
  onCreate: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ onCreate }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {difficulties.map((difficulty, index) => (
        <motion.div
          key={difficulty.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <button
            onClick={() => onCreate(difficulty.name)} // ✅ Just pass difficulty to onCreate
            className={`${difficulty.color} text-white p-6 rounded-lg shadow-md
              transition-all duration-300 w-full text-left flex flex-col
              justify-between h-32`}
          >
            <h3 className="text-xl font-bold">{difficulty.name}</h3>
            <p className="text-sm opacity-90">{difficulty.description}</p>
            <div className="flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
