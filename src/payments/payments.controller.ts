import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, SavePaymentDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
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

  @Post('/save')
  savePayment(@Body() dto: SavePaymentDto) {
    return this.paymentsService.savePayment(dto);
  }
}
