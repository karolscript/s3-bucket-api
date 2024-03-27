import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: 'UserModel', useValue: mockUserModel },],
      imports: [ConfigModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
