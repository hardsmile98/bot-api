import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddUserDto, ChangePayDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  async addUser(dto: AddUserDto) {
    const isExist = await this.prisma.user.findFirst({
      where: {
        userId: dto.userId,
      },
    });

    if (isExist) {
      return {
        isNewUser: false,
      };
    }

    await this.prisma.user.create({ data: dto });

    return {
      isNewUser: true,
    };
  }

  async checkPlan(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

    return {
      plan: user.plan,
      requestsCount: user.requestsCount,
    };
  }

  async getGift(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

    if (user.plan !== 'none') {
      return {};
    }

    return await this.prisma.user.update({
      data: {
        plan: 'free',
      },
      where: {
        id: user.id,
      },
    });
  }

  async changePay(dto: ChangePayDto) {
    const { userId, plan } = dto;

    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

    return await this.prisma.user.update({
      data: {
        plan,
      },
      where: {
        id: user.id,
      },
    });
  }
}
