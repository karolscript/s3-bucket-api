import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { HttpStrategy } from './http.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' }, 
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [AuthService, UserService, HttpStrategy],
  exports: [AuthService, HttpStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
