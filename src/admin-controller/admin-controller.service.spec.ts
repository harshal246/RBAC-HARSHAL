import { Test, TestingModule } from '@nestjs/testing';
import { AdminControllerService } from './admin-controller.service';

describe('AdminControllerService', () => {
  let service: AdminControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminControllerService],
    }).compile();

    service = module.get<AdminControllerService>(AdminControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
