'use client';
import {motion} from 'framer-motion';
import type {Difficulty} from '@/app/game/shared/domain/types';
import {useGameContext} from "@/app/lib/context/game-context";

interface WordListProps {
    difficulty: Difficulty;
}

export default function WordList({ difficulty }: WordListProps) {
    const { state } = useGameContext();

    const getRemainingWords = () => {
        const allWords = {
            Easy: ['HTML', 'CSS', 'JS'],
            Medium: ['REACT', 'NEXTJS', 'NODE'],
            Hard: ['TYPESCRIPT', 'WEBPACK', 'BUNDLER'],
            Expert: ['MICROSERVICES', 'GRAPHQL', 'WEBSOCKETS'],
            Numbers: ['314', '2718', '1618']
        }[difficulty];

        return allWords.filter(word => !state.foundWords.includes(word));
    };

    const getPlayerName = (word: string) => {
        const player = state.players.find(p =>
            state.grid.some(row =>
                row.some(cell =>
                    cell.foundBy === p.id &&
                    state.foundWords.includes(word)
                )
            )
        );
        return player?.name.split(' ')[0] || '';
    };

    return (
        <div className="w-full md:w-80 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
                Palabras Encontradas ({state.foundWords.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {state.foundWords.map((word, index) => (
                    <motion.div
                        key={word}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center bg-green-50 p-2 rounded"
                    >
                        <span className="flex-1 text-gray-700 font-medium">{word}</span>
                        <span className="text-sm text-green-600 ml-2">
              {getPlayerName(word)}
            </span>
                    </motion.div>
                ))}

                {getRemainingWords().map((word) => (
                    <div
                        key={word}
                        className="flex items-center p-2 rounded bg-gray-50 opacity-50"
                    >
                        <span className="flex-1 text-gray-400 font-medium">{word}</span>
                        <span className="text-xs text-gray-400 ml-2">Por encontrar</span>
                    </div>
                ))}
            </div>
        </div>
    );
}