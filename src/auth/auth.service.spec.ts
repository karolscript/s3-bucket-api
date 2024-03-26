import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

const mockService = {
  validateUser: jest.fn(),
  validateUserToken: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  recoverPassword: jest.fn(),
}

const mockMailerService = jest.fn();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: mockService }, 
        { provide: MailerService, useValue: mockMailerService }, 
        JwtService
      ],
      imports: [ConfigModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
