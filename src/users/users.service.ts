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
    return await this.prisma.user.create({ data: dto });
  }

  async checkPaid(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

    const isPaid = user.plan === 'pro' || ('free' && user.requestsCount < 3);

    return {
      isPaid,
    };
  }

  async getGift(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

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
