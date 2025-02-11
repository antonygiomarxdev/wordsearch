import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly roomId!: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly playerName!: string;
}
