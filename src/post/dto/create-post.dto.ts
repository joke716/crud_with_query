import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  image: string;
}
