import { Type } from "class-transformer"
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class DeleteDto {
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    id:number
}
