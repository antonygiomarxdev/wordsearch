'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Cell } from '../../../../types/types';
import { useGameContext } from '../../../context/game-context';

interface GameCellProps {
  cell: Cell;
  isSelected: boolean;
  onSelectStart: (position: [number, number]) => void;
  onSelectEnd: () => void;
  onSelectEnter: (position: [number, number]) => void;
}

export default function GameCell({ cell, isSelected, onSelectStart, onSelectEnd, onSelectEnter }: GameCellProps) {
  const { state } = useGameContext();
  const player = state.players.find((p) => p.id === cell.foundBy);

  const backgroundStyle = isSelected
    ? { backgroundColor: '#bfdbfe' }
    : player
      ? { backgroundColor: player.color }
      : { backgroundColor: '#ffffff' };

  return (
    <motion.div
      className="flex items-center justify-center border border-gray-300 rounded cursor-pointer select-none relative"
      onMouseDown={() => onSelectStart([cell.x, cell.y])}
      onMouseUp={onSelectEnd}
      onMouseEnter={() => onSelectEnter([cell.x, cell.y])}
      onTouchStart={() => onSelectStart([cell.x, cell.y])}
      onTouchEnd={onSelectEnd}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.1 }}
      style={{ minHeight: '40px', minWidth: '40px', ...backgroundStyle }}
    >
      <span className="text-lg font-bold">{cell.letter}</span>
    </motion.div>
  );
}
