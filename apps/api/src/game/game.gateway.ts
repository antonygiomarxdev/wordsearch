import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';
import { Difficulty, GameRoom, Player } from '@wordsearch/types';

@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  path: '/api/socket',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    // Lógica para remover jugador de la sala y limpiar salas vacías
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(
    @MessageBody()
    data: {
      difficulty: Difficulty;
      grid?: string[][];
      roomId?: string;
      topic: string;
      words: string[];
      creatorName?: string;
    },
    @ConnectedSocket() client: Socket
  ): void {
    // Si no se recibe roomId, genera uno
    const roomId = data.roomId || this.generateRoomId();
    // Si no se recibe grid, genera uno (puedes llamar a gameService.generateGrid)
    const grid =
      data.grid || this.gameService.generateGrid(data.difficulty, data.topic);
    // Cargar la lista de palabras usando gameService.getWords
    let wordsForRoom: string[] = [];
    try {
      wordsForRoom = this.gameService.getWords(data.topic, data.difficulty);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn(error.message);
      } else {
        this.logger.warn('Error al cargar las palabras');
      }
    }
    const newRoom: GameRoom = {
      id: roomId,
      players: [],
      difficulty: data.difficulty,
      grid,
      words: wordsForRoom,
      topic: data.topic,
      status: 'waiting',
    };

    // Agregar automáticamente al creador como jugador
    const newPlayer: Player = {
      id: client.id,
      name: data.creatorName || 'Host',
      score: 0,
      color: this.getPlayerColor(0),
    };
    newRoom.players.push(newPlayer);
    client.join(roomId);
    // Aquí deberías guardar la sala en tu servicio (por ejemplo, gameService.addRoom(newRoom))
    // y emitir un callback o emitir un evento de confirmación
    client.emit('room-created', newRoom);
    this.logger.log(`Sala creada: ${roomId}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; playerName: string },
    @ConnectedSocket() client: Socket
  ): void {
    // Lógica para que un jugador se una a la sala
    // Por ejemplo:
    const room = this.gameService.getRoom(data.roomId);
    if (!room) {
      client.emit('join-error', 'Room not found');
      return;
    }
    if (room.players.length >= 4) {
      client.emit('join-error', 'Room full');
      return;
    }
    const newPlayer: Player = {
      id: client.id,
      name: data.playerName,
      score: 0,
      color: this.getPlayerColor(room.players.length),
    };
    room.players.push(newPlayer);
    client.join(data.roomId);
    // Notificar a los demás jugadores de la sala
    client.to(data.roomId).emit('room-update', room);
    client.emit('room-update', room);
    this.logger.log(
      `Jugador ${data.playerName} se unió a la sala: ${data.roomId}`
    );
  }

  @SubscribeMessage('cell-selection-update')
  handleCellSelectionUpdate(
    @MessageBody()
    data: { roomId: string; playerId: string; cells: [number, number][] },
    @ConnectedSocket() client: Socket
  ): void {
    // Reenviar el evento a todos en la sala
    client.to(data.roomId).emit('cell-selection-update', data);
    this.logger.log(
      `Cell selection update in room ${data.roomId} from ${client.id}`
    );
  }

  // Métodos auxiliares:
  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  private getPlayerColor(index: number): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    return colors[index % colors.length];
  }
}
