// s3.service.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
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
}
