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

export default function GameCell({
  cell,
  isSelected,
  onSelectStart,
  onSelectEnd,
  onSelectEnter,
}: GameCellProps) {
  console.log(
    `🔄 GameCell re-rendering for cell x:${cell.x}, y:${cell.y}, selectedBy:`,
    cell.selectedBy
  ); // Log re-render and selectedBy
  const { state, webSocketService } = useGameContext();
  const player = state.players.find((p) => p.id === cell.foundBy);
  const isSelectedByOther =
    cell.selectedBy &&
    cell.selectedBy.length > 0 &&
    !cell.selectedBy.includes(webSocketService.socket?.id || '');

  console.log(
    `   isSelectedByOther for cell x:${cell.x}, y:${cell.y}:`,
    isSelectedByOther
  ); // Log isSelectedByOther

  const backgroundStyle = isSelected
    ? { backgroundColor: '#bfdbfe' }
    : isSelectedByOther
      ? { backgroundColor: 'rgba(200, 200, 200, 0.5)' }
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
