import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username', example: 'johndoe', minLength: 2, maxLength: 50,
  })
  @IsNotEmpty()
  @Length(2, 50)
  username: string;

  @ApiProperty({
    description: 'Email address', example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password', example: 'password123', minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email address' })
  email: string;
}
