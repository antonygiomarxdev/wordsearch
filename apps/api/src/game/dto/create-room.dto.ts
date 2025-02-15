import { Difficulty, GameRoom } from '@wordsearch/types';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto implements Pick<GameRoom, 'topic' | 'difficulty'> {
  @IsIn(['easy', 'medium', 'hard', 'expert', 'numbers'])
  @ApiProperty({ enum: ['easy', 'medium', 'hard', 'expert', 'numbers'] })
  difficulty!: Difficulty;

  @IsNotEmpty()
  @ApiProperty()
  readonly topic!: string;
}
