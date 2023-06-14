import { IsNotEmpty } from 'class-validator';

export class SavePaymentDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  messageId: string;
}
