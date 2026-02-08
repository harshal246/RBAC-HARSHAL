import { Injectable,Inject ,BadRequestException,ConflictException, InternalServerErrorException} from '@nestjs/common';
import { RowDataPacket, type Pool } from 'mysql2/promise';
import { signDto } from './dto/sign.dto';
import  bcrypt from 'bcrypt';
import { Permsisons, roles, rolesName } from './roles';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import { createSearchParams } from 'react-router-dom';
@Injectable()
export class AuthService {
    constructor(
        @Inject('MYSQL_POOL')
        private readonly db: Pool,
        private jwtService: JwtService
      ) {}
    async signupService(body: signDto) {
      const { name, email, password,role } = body;
      // console.log(name,email,password)
      if (!name || !email || !password || !role) {
        throw new BadRequestException('all fields are required');
      }
    
      const [rows] = await this.db.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email=?",
        [email]
      );
    
      if (rows.length > 0) {
        throw new ConflictException('Email already exists');
      }
      const hashedpassword = await bcrypt.hash(password, 10);
      // this all things will come from the data base from the roles table
      const [permissions]=await this.db.query<RowDataPacket[]>("select * from roles where name=?",[role])
      if (permissions.length<0){
        throw new Error("No permissions based on that role or that role doesn't exist")
      }
      // const roleId = roles[name] ?? roles["User"];
      
      const roleId=permissions[0].id
      const roleName=permissions[0].name
      const actions = permissions[0].Role_permission.split(",").map((at:string)=>parseInt(at))
      const values=actions.map((acts:number)=>[roleId,name,acts])
      const [newuser] = await this.db.query(
        "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
        [name, email, hashedpassword, roleId]
      ) as [{ affectedRows: number; insertId: number }, any];
      const [permission] = await this.db.query(
        "INSERT IGNORE INTO permissions (role_id, name, actions) VALUES ?",
        [values]
      ) as [{ affectedRows: number }, any];
      // console.log(permission,newuser)
      if (newuser.affectedRows >=1 && permission.affectedRows >= 1) {
        const token = {
          id: roleId,          
          name:name,
          email: email
        };
        return {
          "token": this.jwtService.sign(token),
          "name":name,
          "role":roleName,
          "id":roleId,
          "email":email
        };
      }
    
      throw new InternalServerErrorException('Failed to create user and permissions');
    }
    async loginService(body: loginDto) {
        const { email, password } = body;
      
        if (!email || !password) {
          throw new BadRequestException('All fields are required');
        }
      
        const [rows] = await this.db.query<RowDataPacket[]>(
          'select  users.role_id,roles.name as role,users.name,users.email,users.password from users join roles on users.role_id=roles.id where email=?;',
          [email],
        );
        if (!rows || rows.length === 0) {
          throw new BadRequestException('Email not valid');
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new BadRequestException('Wrong password');
        }
        const token={
          id: user.role_id,
          name:user.name,
          email: user.email, 
        }
        // return this.jwtService.sign({"token":token,"name":user.name,"id":user.role_id,"email":user.email});
        return {
          "token": this.jwtService.sign(token),
          "name":user.name,
          "id":user.roleId,
          "email":user.email,
          "role":user.role
        };
      }
      async readRoles(){
        try{
          const [rows]=await this.db.query("select name from roles")
          return rows
        }
        catch(err){
          throw new Error(err)
        }
      }

}
