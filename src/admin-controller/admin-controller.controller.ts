import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from "@nestjs/common";
import { AdminControllerService } from "./admin-controller.service";
import { CreateAdminControllerDto } from "./dto/create-admin-controller.dto";
import { UpdateAdminControllerDto } from "./dto/update-admin-controller.dto";
import { Adminguard } from "src/guards/admin.guard";
import { DeleteDto} from "./dto/delete-admin-controller";

@Controller("admin")
@UseGuards(Adminguard)
export class AdminControllerController {
  constructor(
    private readonly adminControllerService: AdminControllerService
  ) {}
  @Get()
  find() {
    return this.adminControllerService.read();
  }

  @Post("addrole")
  create(@Body() createAdminControllerDto: CreateAdminControllerDto) {
    return this.adminControllerService.create(createAdminControllerDto);
  }

  @Post("assign")
  update(@Body() updateAdminControllerDto: UpdateAdminControllerDto) {
    return this.adminControllerService.Addpermissions(updateAdminControllerDto);
  }
  @Delete(":id")
  delete(@Param() params: DeleteDto) {
    return this.adminControllerService.deletepermissions(params);
  }
}
