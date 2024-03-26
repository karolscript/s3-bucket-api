import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class UnsplashService {
    private readonly baseUrl = 'https://api.unsplash.com';
    private readonly accessKey: string;

    constructor(private configService: ConfigService, private readonly httpService: HttpService) {
        this.accessKey = this.configService.get('UNSPLASH_ACCESS_KEY') ?? '';
    }

    async searchPhotos(query: string, page: number = 1, perPage: number = 10): Promise<any[]> {
      try {
        const params = {
            query,
            page,
            per_page: perPage,
            client_id: this.accessKey,
          };

        const response: AxiosResponse<any> = await lastValueFrom(this.httpService.get(`${this.baseUrl}/search/photos`, { params }));
        return response.data;
      } catch(err){
         return err.message;
      }
    }
}
