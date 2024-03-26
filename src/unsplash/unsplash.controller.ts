import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UnsplashService } from './unsplash.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('unsplash')
export class UnsplashController {
    constructor(private readonly unsplashService: UnsplashService) {}

    @UseGuards(AuthGuard('bearer'))
    @Get('images')
    async searchImages(
      @Query('query') query: string,
      @Query('page') page: number = 1,
      @Query('per_page') perPage: number = 10,
    ): Promise<any> {
      const photos = await this.unsplashService.searchPhotos(query, page, perPage);
      return { photos }; 
    }
}
