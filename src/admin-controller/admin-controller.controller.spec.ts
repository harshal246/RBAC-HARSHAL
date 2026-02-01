import { Test, TestingModule } from '@nestjs/testing';
import { AdminControllerController } from './admin-controller.controller';
import { AdminControllerService } from './admin-controller.service';

describe('AdminControllerController', () => {
  let controller: AdminControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminControllerController],
      providers: [AdminControllerService],
    }).compile();

    controller = module.get<AdminControllerController>(AdminControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
