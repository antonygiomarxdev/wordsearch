import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGridDto } from './dto/create-grid.dto';
import { GetWordsDto } from './dto/get-words.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('rooms')
  getWaitingRooms() {
    return this.gameService.getWaitingRooms();
  }

  @Get('rooms/:id')
  getRoom(@Param('id') id: string) {
    const room = this.gameService.getRoom(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  @Post('generate-grid')
  generateGrid(@Body() createGridDto: CreateGridDto) {
    const { difficulty, topic } = createGridDto;
    try {
      const grid = this.gameService.generateGrid(difficulty, topic);
      return grid;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : error
      );
    }
  }

  @Post('words')
  getWords(@Body() getWordsDto: GetWordsDto) {
    const { topic, difficulty } = getWordsDto;
    try {
      const words = this.gameService.getWords(topic, difficulty);
      return { words };
    } catch (error) {
      throw new NotFoundException(
        error instanceof Error ? error.message : error
      );
    }
  }

  @Get('topics')
  getTopics() {
    return { topics: this.gameService.getTopics() };
  }
}
