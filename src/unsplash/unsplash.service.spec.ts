import { Test, TestingModule } from '@nestjs/testing';
import { UnsplashService } from './unsplash.service';
import { ConfigModule } from '@nestjs/config';

describe('UnsplashService', () => {
  let service: UnsplashService;

  const mockService = {
    searchPhotos: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{provide: UnsplashService, useValue: mockService}],
      imports: [ConfigModule],
    }).compile();

    service = module.get<UnsplashService>(UnsplashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
