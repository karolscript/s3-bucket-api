import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService, 
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async recoverPassword(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      return 'El correo no está asociado a ninguna cuenta.';
    }

    const resetToken = this.jwtService.sign({ email: user.email });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restablecimiento de contraseña',
      text: `Aquí está tu token de restablecimiento de contraseña: ${resetToken}`,
    });
  }
}
