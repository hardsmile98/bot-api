import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('/')
  checkPayment(
    @Query('userId') userId: string,
    @Query('messageId') messageId: string,
  ) {
    return this.paymentsService.checkPayment(userId, messageId);
  }

  @Post('/')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }
}
