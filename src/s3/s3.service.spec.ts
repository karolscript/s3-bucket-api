import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';

describe('S3Service', () => {
  let service: S3Service;

  const mockS3Service = {
    upload: jest.fn(),
    uploadFileFromServer: jest.fn(),
    download: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
    renameFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{provide: S3Service, useValue: mockS3Service}],
      imports: [ConfigModule],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
