import { Controller, Post, Body, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.validateUser(email, password);
  }

  @Post('logout')
  async logout(@Body('email') email: string) {
    return this.authService.logout(email);
  }

  @Put('password-recovery')
  async passwordRecovery(@Body('email') email: string) {
    return this.authService.recoverPassword(email);
  }
}
