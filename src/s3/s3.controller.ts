import { Controller, Get, Query } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

@Controller('s3')
export class S3Controller {
    @Get('upload')
    async upload(@Query('bucket') bucket: string, @Query('filePath') filePath: string) {
      const fileStream = fs.createReadStream(filePath);
      const uploadParams = {
        Bucket: bucket,
        Key: path.basename(filePath),
        Body: fileStream,
      };
  
      const data = await s3.upload(uploadParams).promise();
      return 'Upload Success: ' + data.Location;
    }
  
    @Get('download')
    async download(@Query('bucket') bucket: string, @Query('fileName') fileName: string, @Query('downloadPath') downloadPath: string) {
      const downloadParams = {
        Bucket: bucket,
        Key: fileName,
      };

      const fullDownloadPath = path.join(downloadPath, fileName);

      const data = await s3.getObject(downloadParams).promise();
      fs.writeFileSync(fullDownloadPath, data.Body as Buffer);
      return 'Download Success';
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
      const deleteParams = {
        Bucket: bucket,
        Key: fileName,
      };
  
      await s3.deleteObject(deleteParams).promise();
      return 'Delete Success';
    }
  }