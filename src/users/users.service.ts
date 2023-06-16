import { BadRequestException, Injectable } from '@nestjs/common';
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
    const user = await this.prisma.user.findFirst({
      where: {
        userId: dto.userId,
      },
    });

    if (user) {
      return {
        isNewUser: false,
        isPaid: user.plan === 'pro',
      };
    }

    await this.prisma.user.create({ data: dto });

    return {
      isNewUser: true,
      isPaid: false,
    };
  }

  async getProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is empty');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new BadRequestException('user is not found');
    }

    return user;
  }

  async getGift(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is empty');
    }

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
