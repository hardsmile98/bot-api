import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDto, ChangePayDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post('/')
  addUser(@Body() dto: AddUserDto) {
    return this.usersService.addUser(dto);
  }

  @Get('/checkPaid')
  checkPaid(@Query('userId') userId: string) {
    return this.usersService.checkPaid(userId);
  }

  @Get('/getGift')
  getGift(@Query('userId') userId: string) {
    return this.usersService.getGift(userId);
  }

  @Post('/changePay')
  changePay(@Body() dto: ChangePayDto) {
    return this.usersService.changePay(dto);
  }
}
