'use client';
import {motion} from 'framer-motion';
import type {Cell} from '@/app/game/shared/domain/types';

interface GameCellProps {
    cell: Cell;
    isSelected: boolean;
    onSelectStart: (position: [number, number]) => void;
    onSelectEnd: () => void;
    onSelectEnter: (position: [number, number]) => void;
}

export default function GameCell({
                                     cell,
                                     isSelected,
                                     onSelectStart,
                                     onSelectEnd,
                                     onSelectEnter
                                 }: GameCellProps) {
    return (
        <motion.div
            className={`cell ${cell.foundBy ? 'bg-green-200' : 'bg-white'} ${
                isSelected ? '!bg-blue-200' : ''
            }`}
            onMouseDown={() => onSelectStart([cell.x, cell.y])}
            onMouseUp={onSelectEnd}
            onMouseEnter={() => onSelectEnter([cell.x, cell.y])}
            onTouchStart={() => onSelectStart([cell.x, cell.y])}
            onTouchEnd={onSelectEnd}
            animate={{
                scale: isSelected ? 1.1 : 1,
                transition: { duration: 0.1 }
            }}
        >
            <span className="text-lg font-bold">{cell.letter}</span>
            {cell.foundBy && (
                <div
                    className="found-indicator"
                    style={{ backgroundColor: getPlayerColor(cell.foundBy) }}
                />
            )}
        </motion.div>
    );
}

// Función auxiliar para obtener colores de jugadores
const getPlayerColor = (playerId: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
};