import { Module } from '@nestjs/common';
import { AdminControllerService } from './admin-controller.service';
import { AdminControllerController } from './admin-controller.controller';
import { Adminguard } from 'src/guards/admin.guard';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [AdminControllerController],
  providers: [AdminControllerService],
})
export class AdminControllerModule {}
