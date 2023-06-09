import { Plan } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class ChangePayDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  plan: Plan;
}
