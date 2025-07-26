import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username', example: 'testuser',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password', example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
}
