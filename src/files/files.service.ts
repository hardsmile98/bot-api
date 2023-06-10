import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFileDto, GetFileDto } from './dto';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async getFiles() {
    return await this.prisma.file.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  async addFile(dto: AddFileDto) {
    return await this.prisma.file.create({ data: dto });
  }

  async getFile(dto: GetFileDto) {
    const { userId, url, serviceName } = dto;

    const user = await this.prisma.user.findFirst({ where: { userId } });

    // Нет тарифа
    if (user.plan === 'none') {
      throw new BadRequestException('User tariff is none');
    }

    // Если закончился пробный план
    if (user.plan === 'free' && user.requestsCount >= 3) {
      throw new BadRequestException('End test access');
    }

    const file = await this.prisma.file.findFirst({
      where: {
        serviceName,
        url,
      },
    });

    if (!file) {
      // Не найденные файлы записываем в отдельную таблицу
      await this.prisma.notFoundFile.create({
        data: {
          serviceName,
          url,
          userId: user.id,
        },
      });

      throw new BadRequestException('File not found');
    }

    // Увеличивам счетчик запросов пользователя
    await this.prisma.user.update({
      data: {
        requestsCount: user.requestsCount + 1,
      },
      where: {
        id: user.id,
      },
    });

    return file;
  }

  async sendFile(id: string) {
    const idFormatted = Number(id);

    if (!id) {
      throw new BadRequestException('Id is empty');
    }

    return await this.prisma.notFoundFile.delete({
      where: { id: idFormatted },
    });
  }

  async getNodFoundFiles() {
    return await this.prisma.notFoundFile.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  async deleteFile(id: string) {
    const idFormatted = Number(id);

    if (!id) {
      throw new BadRequestException('Id is empty');
    }

    return await this.prisma.file.delete({
      where: { id: idFormatted },
    });
  }
}
