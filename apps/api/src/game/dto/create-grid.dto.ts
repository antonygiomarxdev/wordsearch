import { IsIn, IsNotEmpty } from 'class-validator';
import { Difficulty } from '@wordsearch/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGridDto {
  @IsIn(['easy', 'medium', 'hard', 'expert', 'numbers'])
  @ApiProperty({ enum: ['easy', 'medium', 'hard', 'expert', 'numbers'] })
  difficulty!: Difficulty;

  @IsNotEmpty()
  @ApiProperty()
  readonly topic!: string;
}
