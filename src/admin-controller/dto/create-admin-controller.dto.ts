import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminControllerDto {
    @IsString()
    @IsNotEmpty()
    role:string
}
