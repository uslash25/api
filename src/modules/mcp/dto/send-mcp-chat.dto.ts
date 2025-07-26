import { IsNotEmpty, IsString } from 'class-validator';

export class SendMCPChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
