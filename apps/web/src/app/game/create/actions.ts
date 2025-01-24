'use server';


import {Difficulty, RoomID} from "@/app/game/shared/domain/types";
import {connectWebSocket, generateRoomId} from "@/app/game/shared/infrastructure/websocket";

export async function createRoom(difficulty: Difficulty): Promise<RoomID> {
    const roomId = generateRoomId();

    console.log('Creating room', roomId);

    const ws = await connectWebSocket();

    ws.emit('createRoom', { difficulty, roomId });
    return roomId;
}