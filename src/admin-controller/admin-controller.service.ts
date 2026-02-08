import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminControllerDto } from "./dto/create-admin-controller.dto";
import { UpdateAdminControllerDto } from "./dto/update-admin-controller.dto";
import { QueryResult, RowDataPacket, type Pool } from "mysql2/promise";
import { Pmap } from "./entities/admin-controller.entity";
import { DeleteDto } from "./dto/delete-admin-controller";
import { PermissionsTransformation } from "src/auth/roles";
interface ActionRow extends RowDataPacket {
  action_name: string;
}
@Injectable()
export class AdminControllerService {
  constructor(
    @Inject("MYSQL_POOL")
    private readonly db: Pool
  ) {}
  async read(){
    try{
      // const [rows]=await this.db.query("select permissions.role_id,permissions.name,group_concat(concat(permissions.id, '-', actions.action_name)) as actions from permissions join actions on permissions.actions = actions.id group by permissions.role_id, permissions.name;")
      const [rows]=await this.db.query("SELECT u.role_id, u.name, COALESCE(GROUP_CONCAT(CONCAT(p.id, '-', a.action_name)), 'NONE') AS actions FROM users u LEFT JOIN permissions p ON u.role_id = p.role_id LEFT JOIN actions a ON p.actions = a.id GROUP BY u.role_id, u.name;")
      return rows
    }
    catch{
      throw new Error("Db error")
    }
  }
  async create(createAdminControllerDto: CreateAdminControllerDto) {
    const { role,permissions } = createAdminControllerDto;
    if (!role || !permissions) {
      throw new NotFoundException("Must provide name of the role");
    }
    let formatted_permissions=""
    for (let i of permissions){
      const p=PermissionsTransformation[i]
      if (!p){throw new Error("Couldn't assign the permission")}
      formatted_permissions+=PermissionsTransformation[i].toString()+","
    }
    const all=formatted_permissions.slice(0,-1)
    return await this.db.query("Insert into roles (name,Role_permission) values (?,?)", [role,all]);
  }
  async Addpermissions(updateAdminControllerDto: UpdateAdminControllerDto) {
    const {role_id, name, actions } = updateAdminControllerDto;
    console.log(role_id,name,actions)
    const values=actions.map(itm=>[role_id,name,Pmap[itm]])
    if (!name || !actions) {
      throw new NotFoundException("Must provide name and actions");
    }
    return  await this.db.query("Insert into permissions (role_id,name,actions) values ?",[values])
  }
  async deletepermissions(deleteDto:DeleteDto){
    const {id}=deleteDto
    console.log(id)
    try{
      return await this.db.query("delete from permissions where id=?",[id])
    } 
    catch{
      throw new NotFoundException("Error deleting the permission")
    }
  }

}
