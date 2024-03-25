import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/schemas/user.schema';

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
      return this.login(user);
    }
    return "No se encontró o la contraseña es inválida";
  }

  async validateUserToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const user = await this.userService.findOne(decodedToken.email);
      if (user && user.access_token === token) {
        return user;
      }
      return null;
      
    } catch (error) {
      return error;
    }
  }

  async login(user: User) {
    const payload = { email: user.email, password: user.password };
    user.access_token = this.jwtService.sign(payload);
    const userWithToken = { email: user.email, access_token: user.access_token, password: user.password };
    this.userService.update(userWithToken);
    const userWithoutPassword = { email: user.email, access_token: user.access_token};
    return {
      user: userWithoutPassword
    };
  }

  async logout(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      return 'No se encontró el usuario';
    } else{
        user.access_token = "";
        const userWithToken = { email: user.email, access_token: user.access_token, password: user.password };
        this.userService.update(userWithToken);
        const userWithoutPassword = { email: user.email, access_token: user.access_token};
        return {
          user: userWithoutPassword
        };
    }
  }

  async recoverPassword(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      return 'El correo no está asociado a ninguna cuenta.';
    }

    const resetToken = this.jwtService.sign({ email: user.email });
    user.access_token = resetToken;
    this.userService.update(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restablecimiento de contraseña',
      text: `Aquí está tu token de restablecimiento de contraseña: ${resetToken}`,
    });
  }
}
