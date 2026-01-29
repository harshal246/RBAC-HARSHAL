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
      console.log("User ID:", decoded.id);
      const [result] = (await this.db.query(
        `SELECT actions FROM permissions 
         WHERE role_id = ?`,
        [decoded.id]
      )) as any[];

      if (!result || result.length === 0) {
        throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
      }
      const allowedActions = result[0].actions.split(" ");
      console.log("Allowed Actions:", allowedActions);
      console.log("Required Permission:", requiredPermission);

      if (!allowedActions.includes(requiredPermission)) {
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
