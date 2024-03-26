import { Test, TestingModule } from '@nestjs/testing';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

describe('S3Controller', () => {
  let controller: S3Controller;

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
      controllers: [S3Controller],
      providers: [{ provide: S3Service, useValue: mockS3Service }],
    }).compile();

    controller = module.get<S3Controller>(S3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
