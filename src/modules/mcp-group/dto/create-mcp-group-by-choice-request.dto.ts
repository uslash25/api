import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMcpGroupByChoiceRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsNotEmpty()
  mcpIds: string[];

  @IsString()
  @IsNotEmpty()
  description: string;
}
