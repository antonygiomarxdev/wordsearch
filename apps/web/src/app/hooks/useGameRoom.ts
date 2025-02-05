'use client';
import { useEffect } from 'react';
import { RoomID } from '../types/types';
import { GameRoom } from '@wordsearch/types';
import { useGameContext } from '../game/context/game-context';

export const useGameRoom = (roomId: RoomID) => {
  const { dispatch, webSocketService } = useGameContext();

  useEffect(() => {
    if (!roomId || !webSocketService?.socket) {
      return;
    }

    const roomUpdateListener = (updatedRoom: GameRoom) => {
      console.log('GameRoom updated (useGameRoom):', updatedRoom);
      dispatch({ type: 'INITIALIZE', payload: updatedRoom });
    };

    webSocketService.on('room-update', roomUpdateListener);

    return () => {
      webSocketService.off('room-update');
    };
  }, [roomId, dispatch, webSocketService]);
};
