import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule, 
    S3Module, 
    UserModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env', 
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: configService.get('MAILER_PORT', 587),
          secure: configService.get('MAILER_SECURE') === 'true',
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
