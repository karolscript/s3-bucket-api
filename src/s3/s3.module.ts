import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [S3Service],
  controllers: [S3Controller],
  imports: [HttpModule],
})
export class S3Module {}
