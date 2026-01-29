import { IsEmail, IsString } from "class-validator";



export class signDto{
    @IsEmail()
    email:string

    @IsString()
    name:string

    @IsString()
    password:string
}