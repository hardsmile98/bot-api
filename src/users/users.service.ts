import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddUserDto, ChangePayDto } from './dto';

@Injectable()
export class UsersService {
  public pageSize = 20;

  constructor(private prisma: PrismaService) {}

  async getUsers({ search, page, limit = this.pageSize }) {
    const pagination = page
      ? {
          skip: page * limit - limit,
          take: limit,
        }
      : undefined;

    const count = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      ...(pagination && pagination),
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: {
        userName: search
          ? {
              contains: search,
            }
          : undefined,
      },
    });

    return {
      users,
      pagination: {
        count,
        ...(pagination && {
          page,
          pageCount: Math.ceil(count / limit),
          limit: limit,
        }),
      },
    };
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
        planDate: plan === 'none' ? null : new Date(),
      },
      where: {
        id: user.id,
      },
    });
  }
}
