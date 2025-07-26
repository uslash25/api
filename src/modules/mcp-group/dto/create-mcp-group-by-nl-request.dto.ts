import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMcpGroupByNlRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;
}
