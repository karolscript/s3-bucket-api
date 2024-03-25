import { Controller, Get, Query, Post , HttpCode, UseGuards} from '@nestjs/common';
import { S3Service } from './s3.service';
import * as AWS from 'aws-sdk';
import { AuthGuard } from '@nestjs/passport';

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

    @UseGuards(AuthGuard('bearer'))
    @Get('upload')
    async upload(@Query('bucket') bucket: string, @Query('filePath') filePath: string) {
      return this.s3Service.upload(bucket, filePath);
    }
  
    @UseGuards(AuthGuard('bearer'))
    @Post('upload-from-server')
    async uploadFileFromServer(@Query('bucket') bucket: string, @Query('url') url: string) {
      return this.s3Service.uploadFileFromServer(url, bucket);
    }

    @UseGuards(AuthGuard('bearer'))
    @Get('download')
    async download(@Query('bucket') bucket: string, @Query('fileName') fileName: string, @Query('downloadPath') downloadPath: string) {
      return this.s3Service.download(bucket, fileName, downloadPath);
    }
  
    @UseGuards(AuthGuard('bearer'))
    @Get('list')
    async list(@Query('bucket') bucket: string) {
      return this.s3Service.list(bucket);
    }
  
    @UseGuards(AuthGuard('bearer'))
    @Get('delete')
    async delete(@Query('bucket') bucket: string, @Query('fileName') fileName: string) {
      return this.s3Service.delete(bucket, fileName);
    }

    @UseGuards(AuthGuard('bearer'))
    @Post('rename')
    @HttpCode(200)
    async rename(@Query('bucket') bucket: string, @Query('oldname') oldFilename: string, @Query('newname') newFilename: string) {
      return this.s3Service.renameFile(bucket, oldFilename, newFilename);
    }
    
}