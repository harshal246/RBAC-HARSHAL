import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminControllerDto } from "./dto/create-admin-controller.dto";
import { UpdateAdminControllerDto } from "./dto/update-admin-controller.dto";
import { QueryResult, RowDataPacket, type Pool } from "mysql2/promise";
import { Pmap } from "./entities/admin-controller.entity";
interface ActionRow extends RowDataPacket {
  action_name: string;
}
@Injectable()
export class AdminControllerService {
  constructor(
    @Inject("MYSQL_POOL")
    private readonly db: Pool
  ) {}
  async create(createAdminControllerDto: CreateAdminControllerDto) {
    const { role } = createAdminControllerDto;
    if (!role) {
      throw new NotFoundException("Must provide name of the role");
    }
    return await this.db.query("Insert into roles (name) values (?)", [role]);
  }

  async Addpermissions(updateAdminControllerDto: UpdateAdminControllerDto) {
    const {role_id, name, actions } = updateAdminControllerDto;
    const values=actions.map(itm=>[role_id,name,Pmap[itm]])
    if (!name || !actions) {
      throw new NotFoundException("Must provide name and actions");
    }
    return  await this.db.query("Insert ignore into permissions (role_id,name,actions) values ?",[values])
  }

}
