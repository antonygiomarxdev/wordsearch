'use client';

import { useGameContext } from '../game/context/game-context';
import { useCallback } from 'react';

import { GameRoom } from '@wordsearch/types';

export function useGameActions() {
  const { dispatch } = useGameContext();

  const initializeGame = useCallback(
    (room: GameRoom) => {
      dispatch({ type: 'INITIALIZE', payload: room });
    },
    [dispatch]
  );

  const updateState = useCallback(
    (partialState: Partial<GameRoom>) => {
      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          ...partialState,
          grid: partialState.grid?.map((row, y) =>
            row.map((letter, x) => ({
              letter,
              x,
              y,
              foundBy: null,
            }))
          ),
        },
      });
    },
    [dispatch]
  );

  const selectCells = useCallback(
    (cells: [number, number][]) => {
      dispatch({ type: 'SELECT_CELLS', payload: cells });
    },
    [dispatch]
  );

  const resetSelection = useCallback(() => {
    dispatch({ type: 'RESET_SELECTION' });
  }, [dispatch]);

  const addFoundWord = useCallback(
    (word: string) => {
      dispatch({ type: 'ADD_FOUND_WORD', payload: word });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    [dispatch]
  );

  return {
    initializeGame,
    updateState,
    selectCells,
    resetSelection,
    addFoundWord,
    setError,
  };
}
