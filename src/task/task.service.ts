import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
interface arrivename{
  name:string
  salary:number
}
interface final{
  name:string
}
@Injectable()
export class TaskService {
  create(createTaskDto: CreateTaskDto) {
    let total_emp = 0;
    let max_salary = 0; 
    let depth = 0;
    let arrived_names:arrivename[] = [];
    function depthcheck(arr:CreateTaskDto) {
      try {
        if (depth === 0) {
          arrived_names.push({ name: arr.name, salary: arr.salary });
          total_emp = 1;
          max_salary = arr.salary;
        }

        depth += 1;

        for (let i of arr.subordinates) {
          const exists = arrived_names.some(
            (e) => e.name === i.name && e.salary === i.salary
          );

          if (!exists) {
            arrived_names.push({ name: i.name, salary: i.salary });
            total_emp += 1;
            max_salary += i.salary;
          }

          depthcheck(i);
        }
      } catch {
        console.log("error arrived")
      }
    }
    depthcheck(createTaskDto);
    let final:string[] = [];
    let sum = 0;
    let total = 0;

    for (let i of arrived_names) {
      if (!final.includes(i.name)) {
        sum += i.salary;
        final.push(i.name);
        total += 1;
      }
    }
    return {
      "total": total,
      "Salary": sum,
      "depth":depth,
    };
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
