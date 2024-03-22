import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  //TODO: handle response codes
  @Post('register')
  async register(@Body() user: User) {
    return this.userService.create(user);
  }
}
