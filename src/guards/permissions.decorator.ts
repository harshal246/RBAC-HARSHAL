import { SetMetadata } from "@nestjs/common";
export const RequirePermission = (permission: string) => {
    return SetMetadata('requiredPermission', permission);
  }