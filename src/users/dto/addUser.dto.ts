import { IsNotEmpty } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  chatId: string;

  @IsNotEmpty()
  userId: string;
}
