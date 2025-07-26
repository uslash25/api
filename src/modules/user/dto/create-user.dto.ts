import {
  IsEmail,
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 50)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class CreateUserResponseDto {
  id:       string;
  username: string;
  email:    string;
}
