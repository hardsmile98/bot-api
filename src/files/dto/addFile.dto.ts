import { ServiceName } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class AddFileDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  downloadUrl: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  serviceName: ServiceName;
}
