import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { GameRoom } from '@wordsearch/types';

export class UpdateRoomDto implements Partial<GameRoom> {
  @IsNotEmpty()
  @ApiProperty()
  readonly id!: string;
}
