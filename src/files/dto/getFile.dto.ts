import { ServiceName } from '@prisma/client';

export interface GetFileDto {
  userId: string;
  url: string;
  serviceName: ServiceName;
}
