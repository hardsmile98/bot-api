import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { AddFileDto } from './dto';
import { ServiceName } from '@prisma/client';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('/')
  geFiles() {
    return this.filesService.getFiles();
  }

  @Post('/')
  addFile(@Body() dto: AddFileDto) {
    return this.filesService.addFile(dto);
  }

  @Get('/file')
  geFile(
    @Param('userId') userId: string,
    @Param('url') url: string,
    @Param('serviceName') serviceName: ServiceName,
  ) {
    return this.filesService.getFile({ userId, url, serviceName });
  }

  @Get('/')
  sendFile(@Param('id') id: string) {
    return this.filesService.sendFile(id);
  }
}
