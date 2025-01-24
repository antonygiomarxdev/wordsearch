'use client';
import {useState} from "react";
import {useGameContext} from "@/app/lib/context/game-context";
import GameCell from "@/app/game/play/[roomId]/components/GameCell";

export default function GameGrid() {
    const { state, actions } = useGameContext();
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPos, setStartPos] = useState<[number, number]>([0, 0]);

    const handleSelectStart = (position: [number, number]) => {
        setIsSelecting(true);
        setStartPos(position);
        actions.selectCells([position]);
    };

    const handleSelectEnd = () => {
        if (isSelecting && state.selectedCells.length > 0) {
            actions.submitSelection();
        }
        setIsSelecting(false);
    };

    const handleSelectEnter = (position: [number, number]) => {
        if (isSelecting) {
            const newSelection = getCellsBetween(startPos, position);
            actions.selectCells(newSelection);
        }
    };

    const getCellsBetween = (start: [number, number], end: [number, number]) => {

        let [x0, y0] = start;
        const [x1, y1] = end;
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        const selection: [number, number][] = [];

        while (true) {
            selection.push([x0, y0]);
            if (x0 === x1 && y0 === y1) {
                break;
            }
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

        return selection;
    };

    return (
        <div className="game-grid">
            {state.grid.map((row, y) => (
                <div key={y} className="grid-row">
                    {row.map((cell, x) => (
                        <GameCell
                            key={`${x}-${y}`}
                            cell={cell}
                            isSelected={state.selectedCells.some(
                                ([cx, cy]) => cx === x && cy === y
                            )}
                            onSelectStart={handleSelectStart}
                            onSelectEnd={handleSelectEnd}
                            onSelectEnter={handleSelectEnter}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}