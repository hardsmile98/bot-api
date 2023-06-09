import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
