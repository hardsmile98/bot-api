import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetFilesDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;
}
