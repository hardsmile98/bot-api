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

    if (!userId || !url || !serviceName) {
      throw new BadRequestException('userId or url or serviceName is empty');
    }

    const user = await this.prisma.user.findFirst({ where: { userId } });

    // Нет тарифа
    if (user.plan === 'none') {
      return {
        file: null,
        isFound: false,
        haveAccess: false,
      };
    }

    // Если закончился пробный план
    if (user.plan === 'free' && user.requestsCount >= 3) {
      return {
        file: null,
        isFound: false,
        haveAccess: false,
      };
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

      return {
        file: null,
        isFound: false,
        haveAccess: true,
      };
    }

    // Увеличивам счетчик запросов пользователя
    await this.prisma.user.update({
      data: {
        requestsCount: user.requestsCount + 1,
        savedMoney: user.savedMoney + file.price,
      },
      where: {
        id: user.id,
      },
    });

    return {
      file,
      isFound: true,
      haveAccess: true,
    };
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

  async deleteNotFoundFile(id: string) {
    const idFormatted = Number(id);

    if (!id) {
      throw new BadRequestException('Id is empty');
    }

    return await this.prisma.notFoundFile.delete({
      where: { id: idFormatted },
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
