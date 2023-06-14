import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto';
import Yookassa from 'yookassa';

const yooKassa = new Yookassa({
  shopId: process.env['SHOP_ID'],
  secretKey: process.env['PAYMENT_TOKEN'],
});

@Injectable()
export class PaymentsService {
  async checkPayment(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is empty');
    }

    return {};
  }

  async createPayment(dto: CreatePaymentDto) {
    return {};
  }
}
