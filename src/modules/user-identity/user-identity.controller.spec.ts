import { Test, TestingModule } from '@nestjs/testing';
import { UserIdentityController } from './user-identity.controller';
import { UserIdentityService } from './user-identity.service';

describe('UserIdentityController', () => {
  let controller: UserIdentityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserIdentityController],
      providers: [UserIdentityService],
    }).compile();

    controller = module.get<UserIdentityController>(UserIdentityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
