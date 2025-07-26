import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMcpRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;
}
