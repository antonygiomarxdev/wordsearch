import { IsIn, IsNotEmpty } from 'class-validator';
import { Difficulty } from '@wordsearch/types';
import { ApiProperty } from '@nestjs/swagger';

export class GetWordsDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly topic!: string;

  @IsIn(['easy', 'medium', 'hard', 'expert', 'numbers'])
  @ApiProperty({ enum: ['easy', 'medium', 'hard', 'expert', 'numbers'] })
  readonly difficulty!: Difficulty;
}
