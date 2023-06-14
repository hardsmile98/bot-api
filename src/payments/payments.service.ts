import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto, SavePaymentDto } from './dto';
import * as Yookassa from 'yookassa';
import { PrismaService } from 'src/prisma/prisma.service';

const yooKassa = new Yookassa({
  shopId: process.env['SHOP_ID'],
  secretKey: process.env['PAYMENT_TOKEN'],
});

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  options = {
    amount: '1.00',
    currency: 'RUB',
    paymentType: 'bank_card',
    backUrl: process.env['BACK_URL'],
  };

  async checkPayment(userId: string, messageId: string) {
    if (!userId || !messageId) {
      throw new BadRequestException('userId or messageId is empty');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User is not found');
    }

    const payment = await this.prisma.payments.findFirst({
      where: {
        messageId,
        userId: user.id,
      },
    });

    if (!payment) {
      throw new BadRequestException('Payment is not found');
    }

    const order = await yooKassa.getPayment(payment.uuid);

    const isPaid = order.paid;

    if (isPaid) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'pro',
        },
      });
    }

    return { isPaid };
  }

  async createPayment(dto: CreatePaymentDto) {
    const { currency, amount, paymentType, backUrl } = this.options;

    const { userId } = dto;

    try {
      const payment = await yooKassa.createPayment({
        amount: {
          value: amount,
          currency: currency,
        },
        payment_method_data: {
          type: paymentType,
        },
        confirmation: {
          type: 'redirect',
          return_url: backUrl,
        },
        description: `Оплата подписки пользователем: ${userId}`,
      });

      return payment;
    } catch (e) {
      throw new BadRequestException('Error in create payment');
    }
  }

  async savePayment(dto: SavePaymentDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId: dto.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User is not found');
    }

    await this.prisma.payments.create({
      data: {
        uuid: dto.uuid,
        messageId: dto.messageId,
        userId: user.id,
      },
    });
  }
}
