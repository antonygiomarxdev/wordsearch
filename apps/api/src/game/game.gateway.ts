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
import { GameRoom, Player } from '@wordsearch/types';

@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:4200',
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
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; playerName: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    this.logger.log(
      `Jugador ${data.playerName} intenta unirse a la sala: ${data.roomId}`
    );

    const room = this.gameService.getRoom(data.roomId);

    if (!room) {
      this.logger.error(`Room not found: ${data.roomId}`);
      client.emit('join-error', 'Room not found');
      return;
    }

    if (room.players.length >= 4) {
      this.logger.error(`Room is full: ${data.roomId}`);
      client.emit('join-error', 'Room is full');
      return;
    }

    const newPlayer: Player = {
      id: client.id,
      name: data.playerName,
      score: 0,
      color: this.getPlayerColor(room.players.length),
    };

    room.players.push(newPlayer);

    await client.join(data.roomId);
    client.emit('join-success', { roomId: data.roomId, playerId: client.id });
    client.emit('room-update', { room });
    this.logger.log(
      `Jugador ${data.playerName} se unió a la sala: ${data.roomId}`,
      { room }
    );
  }

  @SubscribeMessage('room-update')
  handleRoomUpdate(
    @MessageBody() data: GameRoom,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.gameService.getRoom(data.id);
    client.to(data.id).emit('room-update', room);
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
