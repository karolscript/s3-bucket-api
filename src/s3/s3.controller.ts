import { Controller, Get, Query, Post , HttpCode} from '@nestjs/common';
import { S3Service } from './s3.service';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

    @Get('upload')
    async upload(@Query('bucket') bucket: string, @Query('filePath') filePath: string) {
      return this.s3Service.upload(bucket, filePath);
    }
  
    @Get('download')
    async download(@Query('bucket') bucket: string, @Query('fileName') fileName: string, @Query('downloadPath') downloadPath: string) {
      this.s3Service.download(bucket, fileName, downloadPath);
    }
  
    @Get('list')
    async list(@Query('bucket') bucket: string) {
      const listParams = {
        Bucket: bucket,
      };
  
      const data = await s3.listObjectsV2(listParams).promise();
      return 'Files: ' + data.Contents?.map(file => file.Key).join(', ');
    }
  
    @Get('delete')
    async delete(@Query('bucket') bucket: string, @Query('fileName') fileName: string) {
      this.s3Service.delete(bucket, fileName);
    }

    @Post('rename')
    @HttpCode(200)
    async rename(@Query('bucket') bucket: string, @Query('oldname') oldFilename: string, @Query('newname') newFilename: string) {
      this.s3Service.renameFile(bucket, oldFilename, newFilename);
    } 
}