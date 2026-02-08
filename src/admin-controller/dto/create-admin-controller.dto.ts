import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminControllerDto {
    @IsString()
    @IsNotEmpty()
    role:string

    @IsArray()
    @IsNotEmpty()
    @IsString({each:true})
    permissions:[]
}
