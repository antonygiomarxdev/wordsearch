import { ConfigModule } from '@nestjs/config';
import { ThemesModule } from './themes/themes.module';
import { GamesModule } from './games/games.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    ThemesModule,
    GamesModule,
  ],
})
export class AppModule {}
