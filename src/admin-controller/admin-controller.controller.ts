import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { AdminControllerService } from './admin-controller.service';
import { CreateAdminControllerDto } from './dto/create-admin-controller.dto';
import { UpdateAdminControllerDto } from './dto/update-admin-controller.dto';
import { Adminguard } from 'src/guards/admin.guard';

@Controller('admin')
@UseGuards(Adminguard)
export class AdminControllerController {
  constructor(private readonly adminControllerService: AdminControllerService) {}

  @Post()
  create(@Body() createAdminControllerDto: CreateAdminControllerDto) {
    return this.adminControllerService.create(createAdminControllerDto);
  }

  @Post("add")
  update(@Body() updateAdminControllerDto: UpdateAdminControllerDto) {
    return this.adminControllerService.Addpermissions(updateAdminControllerDto);
  }

}
