import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 :
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  @ApiProperty()
  password: string;
}
