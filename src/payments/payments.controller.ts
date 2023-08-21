import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('/')
  checkPayment(@Query('userId') userId: string) {
    return this.paymentsService.checkPayment(userId);
  }

  @Post('/')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }
}
