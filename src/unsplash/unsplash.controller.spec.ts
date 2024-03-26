import { Test, TestingModule } from '@nestjs/testing';
import { UnsplashController } from './unsplash.controller';
import { UnsplashService } from './unsplash.service';

describe('UnsplashController', () => {
  let controller: UnsplashController;
  let mockUnsplashService: UnsplashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnsplashController],
      providers: [
        {
          provide: UnsplashService,
          useValue: {
            searchPhotos: jest.fn().mockResolvedValueOnce(['photo1', 'photo2']),
          },
        },
      ],
    }).compile();

    controller = module.get<UnsplashController>(UnsplashController);
    mockUnsplashService = module.get<UnsplashService>(UnsplashService);
  });

  it('should return photos from UnsplashService', async () => {
    const searchQuery = 'test';
    const response = await controller.searchImages(searchQuery);

    expect(mockUnsplashService.searchPhotos).toHaveBeenCalledWith(searchQuery, 1, 10);
    expect(response).toEqual({ photos: ['photo1', 'photo2'] });
  });
});
