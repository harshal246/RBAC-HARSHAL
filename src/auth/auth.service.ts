import { Injectable,Inject ,BadRequestException,ConflictException, InternalServerErrorException} from '@nestjs/common';
import { RowDataPacket, type Pool } from 'mysql2/promise';
import { signDto } from './dto/sign.dto';
import  bcrypt from 'bcrypt';
import { Permsisons, roles } from './roles';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        @Inject('MYSQL_POOL')
        private readonly db: Pool,
        private jwtService: JwtService
      ) {}
    async signupService(body: signDto) {
      const { name, email, password } = body;
    
      if (!name || !email || !password) {
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
      const roleId = roles[name] ?? roles["User"];

      const actions = Permsisons[roleId] || Permsisons[2]; 
    
      const [newuser] = await this.db.query(
        "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
        [name, email, hashedpassword, roleId]
      ) as [{ affectedRows: number; insertId: number }, any];
    
      const [permission] = await this.db.query(
        "INSERT INTO permissions (role_id, name, actions) VALUES (?, ?, ?)",
        [roleId, name, actions]
      ) as [{ affectedRows: number }, any];
    
      if (newuser.affectedRows == 1 && permission.affectedRows == 1) {
        const token = {
          id: roleId,
          email: email
        };
        return {
          "token": this.jwtService.sign(token)
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
          'SELECT * FROM users WHERE email = ?',
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
        return this.jwtService.sign({
          id: user.role_id,
          email: user.email,
        });
      }

}
