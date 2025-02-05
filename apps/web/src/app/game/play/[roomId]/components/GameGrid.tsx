'use client';

import React, { useState } from 'react';
import GameCell from './GameCell';
import { useGameContext } from '../../../context/game-context';

export default function GameGrid() {
  const { state, actions } = useGameContext();
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<[number, number] | null>(null);

  if (state.grid.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <p>Cargando grid...</p>
      </div>
    );
  }

  const getCellsBetween = (start: [number, number], end: [number, number]): [number, number][] => {
    let [x0, y0] = start;
    const [x1, y1] = end;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    const cells: [number, number][] = [];
    while (true) {
      cells.push([x0, y0]);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    return cells;
  };

  const handleSelectStart = (position: [number, number]) => {
    console.log('handleSelectStart:', position);
    setIsSelecting(true);
    setStartPos(position);
    actions.selectCells([position]);
  };

  const handleSelectEnter = (position: [number, number]) => {
    if (isSelecting && startPos) {
      const selection = getCellsBetween(startPos, position);
      console.log('handleSelectEnter:', selection);
      actions.selectCells(selection);
    }
  };

  const handleSelectEnd = () => {
    console.log('handleSelectEnd');
    if (isSelecting) {
      actions.submitSelection();
    }
    setIsSelecting(false);
    setStartPos(null);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      {state.grid.map((row, y) => (
        <div
          key={y}
          className="grid gap-1 mb-1"
          style={{
            gridTemplateColumns: `repeat(${row.length}, minmax(40px, 1fr))`,
          }}
        >
          {row.map((cell, x) => (
            <GameCell
              key={`${x}-${y}`}
              cell={cell}
              isSelected={state.selectedCells.some(([cx, cy]) => cx === x && cy === y)}
              onSelectStart={() => handleSelectStart([x, y])}
              onSelectEnter={() => handleSelectEnter([x, y])}
              onSelectEnd={handleSelectEnd}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
