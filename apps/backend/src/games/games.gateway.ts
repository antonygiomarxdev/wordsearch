import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GamesService } from './games.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  logger = new Logger('GamesGateway', { timestamp: true });
  constructor(private readonly gamesService: GamesService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
    this.logger.log(
      'GamesGateway.handleConnection - Client connected with id: ' + client.id,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      'GamesGateway.handleDisconnect - Client disconnected with id: ' +
        client.id,
    );
    this.gamesService.handleDisconnect(client);
  }

  @SubscribeMessage('createOrJoinGame')
  handleCreateOrJoinGame(
    @MessageBody() data: { mode: string; themeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    let message = `GamesGateway.handleCreateOrJoinGame - Client ${client.id} `;
    message += `wants to create or join a game with mode ${data.mode} `;
    message += `and themeId ${data.themeId}`;
    this.logger.log(message);
    return this.gamesService.createOrJoinGame(data, client);
  }
}
