import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { AddFileDto, GetFilesDto, GetNotFoundFilesDto } from './dto';
import { ServiceName } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('/')
  getFiles(@Query() query: GetFilesDto) {
    return this.filesService.getFiles(query);
  }

  @Post('/')
  addFile(@Body() dto: AddFileDto) {
    return this.filesService.addFile(dto);
  }

  @Delete('/')
  deleteFile(@Query('id') id: string) {
    return this.filesService.deleteFile(id);
  }

  @Get('/file')
  geFile(
    @Query('userId') userId: string,
    @Query('url') url: string,
    @Query('serviceName') serviceName: ServiceName,
  ) {
    return this.filesService.getFile({ userId, url, serviceName });
  }

  @Get('/')
  sendFile(@Query('id') id: string) {
    return this.filesService.sendFile(id);
  }

  @Get('/notFound')
  getNodFoundFiles(@Query() query: GetNotFoundFilesDto) {
    return this.filesService.getNodFoundFiles(query);
  }

  @Delete('notFound')
  deleteNotFoundFile(@Query('id') id: string) {
    return this.filesService.deleteNotFoundFile(id);
  }
}
