import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Pool } from "mysql2/promise";
import type { Request } from "express";

@Injectable()
export class Adminguard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject("MYSQL_POOL")
    private readonly db: Pool
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader ||!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid authorization token");
    }
    try {
      const token = authHeader.split(" ")[1];
      const decoded = this.jwtService.verify(token);
      console.log(decoded)
      const user = await this.db.query(
        "SELECT name FROM roles WHERE id = ?",
        [decoded.id]
      );
      if (user[0][0].name!="admin"){
        throw new UnauthorizedException("You are not admin sorry")
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid token or user verification failed");
    }
    return true;
  }
}
