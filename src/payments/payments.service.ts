import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto';
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
    amount: '3500.00',
    currency: 'RUB',
    paymentType: 'bank_card',
    backUrl: process.env['BACK_URL'],
  };

  async createNewPayment({ userId }) {
    const { currency, amount, paymentType, backUrl } = this.options;

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

      if (!payment) {
        throw new BadRequestException('Error in create payment');
      }

      await this.prisma.payments.create({
        data: {
          uuid: payment.id,
          userId,
        },
      });

      return payment;
    } catch (e) {
      throw new BadRequestException('Error in create payment');
    }
  }

  async checkPayment(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is empty');
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
        userId: user.id,
        paid: false,
      },
    });

    if (!payment) {
      throw new BadRequestException('Payment is not found');
    }

    const order = await yooKassa.getPayment(payment.uuid);

    const isPaid = order?.paid;
    const confirmationUrl = order?.confirmation?.confirmation_url;

    if (isPaid) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'pro',
          planDate: new Date(),
        },
      });

      await this.prisma.payments.update({
        where: { uuid: payment.uuid },
        data: {
          paid: true,
        },
      });
    }

    return {
      isPaid,
      confirmationUrl,
    };
  }

  async createPayment(dto: CreatePaymentDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        userId: dto.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User is not found');
    }

    const payment = await this.prisma.payments.findFirst({
      where: {
        userId: user.id,
        paid: false,
      },
    });

    if (payment) {
      try {
        const order = await yooKassa.getPayment(payment.uuid);

        if (order.status === 'canceled') {
          await this.prisma.payments.delete({ where: { uuid: payment.uuid } });

          const newPayment = this.createNewPayment({ userId: user.id });

          return newPayment;
        }

        return order;
      } catch (e) {
        throw new BadRequestException(`Error in get payment ${payment.uuid}`);
      }
    }

    const newPayment = this.createNewPayment({ userId: user.id });

    return newPayment;
  }
}
