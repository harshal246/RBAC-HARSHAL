import { IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateTaskDto {
  @IsInt()  
  id: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  salary: number;

  @ValidateNested({ each: true })
  subordinates: CreateTaskDto[];
}
