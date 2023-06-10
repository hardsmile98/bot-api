import { ServiceName } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddFileDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  downloadUrl: string;

  @IsOptional()
  title: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  serviceName: ServiceName;
}
