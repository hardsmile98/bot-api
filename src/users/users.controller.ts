import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDto, ChangePayDto } from './dto';

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
  checkPaid(@Param('userId') userId: string) {
    return this.usersService.checkPaid(userId);
  }

  @Get('/getGift')
  getGift(@Param('userId') userId: string) {
    return this.usersService.getGift(userId);
  }

  @Post('/changePay')
  changePay(@Body() dto: ChangePayDto) {
    return this.usersService.changePay(dto);
  }
}
