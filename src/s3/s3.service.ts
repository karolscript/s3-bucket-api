import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { String } from 'aws-sdk/clients/batch';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private readonly httpService: HttpService) {
    this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
  }

  async upload( bucket: string, filePath: string) {
    const fileStream = fs.createReadStream(filePath);
      const uploadParams = {
        Bucket: bucket,
        Key: path.basename(filePath),
        Body: fileStream,
      };
  
      const data = await this.s3.upload(uploadParams).promise();
      return 'Upload Success: ' + data.Location;
  }

  async download(bucket: string, fileName: string, downloadPath: string) {
    const downloadParams = {
      Bucket: bucket,
      Key: fileName,
    };

    const fullDownloadPath = path.join(downloadPath, fileName);

    const data = await this.s3.getObject(downloadParams).promise();
    fs.writeFileSync(fullDownloadPath, data.Body as Buffer);
    return 'Download Success';
  }

  async delete(bucket: string, fileName: string) {
    const deleteParams = {
      Bucket: bucket,
      Key: fileName,
    };

    await this.s3.deleteObject(deleteParams).promise();
    return 'Delete Success';
  }

  async renameFile(bucketName: string, oldFilename: string, newFilename: string): Promise<String> {
    try {
      await this.s3.copyObject({
        Bucket: bucketName,
        CopySource: `/${bucketName}/${oldFilename}`,
        Key: newFilename,
      }).promise();

      await this.s3.deleteObject({
        Bucket: bucketName,
        Key: oldFilename,
      }).promise();

      return 'Rename Success';
    } catch (error) {
      return error.message;
    }
  }

  async list(bucket: string) {
    const listParams = {
      Bucket: bucket,
    };

    const data = await this.s3.listObjectsV2(listParams).promise();
    return 'Files: ' + data.Contents?.map(file => file.Key).join(', ');
  }

  async uploadFileFromServer(url: string, bucket: string): Promise<string> {
    try{
      const response: AxiosResponse<any> = await lastValueFrom(this.httpService.get(url, {
        responseType: 'stream',
      }));
  
      const params = {
        Bucket: bucket,
        Key: this.getFileNameFromUrl(url),
        Body: response.data,
      };
  
      await this.s3.upload(params).promise();

      return "Upload Success";

    } catch(err){
       return err.message;
    }
  }

  getFileNameFromUrl = (url: String) => {
    let urlObj = new URL(url);
    let pathComponents = urlObj.pathname.split('/');
    let fileName = pathComponents[pathComponents.length - 1];
    return fileName;
  }
}
