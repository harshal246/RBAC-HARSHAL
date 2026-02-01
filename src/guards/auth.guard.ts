import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import type { Pool } from "mysql2/promise";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtservice: JwtService,
    @Inject("MYSQL_POOL")
    private readonly db: Pool
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const requiredPermission = this.reflector.get<string>(
        "requiredPermission",
        context.getHandler()
      );

      console.log("Required Permission:", requiredPermission);

      if (!requiredPermission) {
        return true;
      }

      const jwtToken = request.headers.authorization;

      if (!jwtToken || !jwtToken.startsWith("Bearer ")) {
        throw new UnauthorizedException("You are not authorized");
      }

      const token = jwtToken.split(" ")[1];
      const decoded = this.jwtservice.verify(token);
      console.log(decoded.id,decoded.name,"hey name got")
      console.log(decoded)
      console.log("User ID:", decoded.id);
      const [result] = (await this.db.query(
        `select l.action_name from permissions p join actions l on p.actions=l.id where role_id=? and name=?`,
        [decoded.id,decoded.name]
      )) as any[];
      console.log(result)
      if (!result || result.length === 0) {
        throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
      }
      const allactions=result.map((itm:any)=>itm.action_name)
      console.log("Required Permission:", requiredPermission);

      if (!allactions.includes(requiredPermission)) {
        throw new ForbiddenException(
          `Forbidden: You don't have ${requiredPermission} permission`
        );
      }

      return true;
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof ForbiddenException ||
        err instanceof HttpException
      ) {
        throw err;
      }
      throw new UnauthorizedException({
        message: "Invalid token",
        error: err instanceof Error ? err.message : err,
      });
    }
  }
}
