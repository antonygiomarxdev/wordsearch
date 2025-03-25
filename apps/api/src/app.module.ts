import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { WebsocketService } from './game/websocket.service';

@Module({
  imports: [GameModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, WebsocketService],
})
export class AppModule {}
