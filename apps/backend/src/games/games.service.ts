import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

interface Game {
  id: string;
  mode: 'competitivo' | 'cooperativo';
  themeId: string;
  players: string[];
  words: string[];
}

@Injectable()
export class GamesService {
  logger = new Logger('GamesService', { timestamp: true });

  private games: Record<string, Game> = {};

  async createOrJoinGame(
    data: { mode: string; themeId: string },
    client: Socket,
  ) {
    const roomId = `${data.themeId}-${data.mode}`;
    await client.join(roomId);

    this.logger.log(
      `GamesService.createOrJoinGame - Client ${client.id} joined room ${roomId}`,
    );

    if (!this.games[roomId]) {
      this.games[roomId] = {
        id: roomId,
        mode: data.mode as 'competitivo' | 'cooperativo',
        themeId: data.themeId,
        players: [client.id],
        words: ['ejemplo', 'palabra'], // Aquí irían las palabras del tema
      };

      this.logger.log(
        `GamesService.createOrJoinGame - Created game with id ${roomId}`,
      );
    } else {
      this.games[roomId].players.push(client.id);
      this.logger.log(
        `GamesService.createOrJoinGame - Added client ${client.id} to game with id ${roomId}`,
      );
    }

    client.emit('joinedGame', this.games[roomId]);
  }

  handleDisconnect(client: Socket) {
    Object.values(this.games).forEach((game) => {
      game.players = game.players.filter((id) => id !== client.id);
    });

    this.logger.log(
      `GamesService.handleDisconnect - Client ${client.id} disconnected
    `,
    );
  }
}
