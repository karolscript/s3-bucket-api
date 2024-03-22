import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  async validate(token: string): Promise<any> {
    // Validate the token with your OAuth server
    const user = await axios.get('https://your-auth-server.com/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
