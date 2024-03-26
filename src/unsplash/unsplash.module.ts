import { Module } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { UnsplashController } from './unsplash.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [UnsplashService, ConfigService],
    controllers: [UnsplashController],
    imports: [ConfigModule, HttpModule],
})
export class UnsplashModule {
}
