import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        login: dto.login,
      },
    });

    if (!admin) throw new BadRequestException('Credentials incorrect');

    const pwMatches = await argon.verify(admin.password, dto.password);

    if (!pwMatches) throw new BadRequestException('Password incorrect');

    return this.getToken(admin.id);
  }

  async register(dto: RegisterDto) {
    const isExist = await this.prisma.admin.findFirst({
      where: { login: dto.login },
    });

    if (isExist) {
      throw new BadRequestException('Email taken');
    }

    const hash = await argon.hash(dto.password);

    const admin = await this.prisma.admin.create({
      data: {
        login: dto.login,
        password: hash,
      },
    });

    return this.getToken(admin.id);
  }

  async getToken(userId: number): Promise<{ token: string }> {
    const payload = {
      userId,
    };

    const secret = this.config.get('SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
    });

    return {
      token,
    };
  }
}
