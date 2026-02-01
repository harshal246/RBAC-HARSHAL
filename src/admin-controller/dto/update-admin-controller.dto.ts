import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminControllerDto } from './create-admin-controller.dto';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateAdminControllerDto extends PartialType(CreateAdminControllerDto) {
    @IsString()
    name:string

    @IsNumber()
    role_id:number
    @IsArray()
    @IsString({each:true})
    actions:string[]
}
