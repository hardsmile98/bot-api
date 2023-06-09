import { IsNotEmpty } from 'class-validator';

export class ChangePayDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  isPaid: boolean;
}
