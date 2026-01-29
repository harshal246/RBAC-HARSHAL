import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RowDataPacket, type Pool } from 'mysql2/promise';

@Injectable()
export class ProductsService {
  constructor(@Inject('MYSQL_POOL') private readonly db: Pool){}
  async create(createProductDto: CreateProductDto) {
    try{
    const {name,description,price}=createProductDto
    const [rows]=await this.db.query("insert into products1 (name,description,price) values(?,?,?)",[name,description,price])
    return rows
    }
    catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException("Unknown error occurred");
    }
  }

  async findAll() {
    try{
    const [rows] = await this.db.query<RowDataPacket[]>(
      'SELECT * FROM products1',
    );
    return rows;
    }
    catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException("Unknown error occurred");
    }
  } 

  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      const {name,description,price}=updateProductDto
      const [result]=await this.db.query(`UPDATE products1
      SET name = ?, description = ?, price = ?
      WHERE id = ?`,[name,description,price,id])
      return result
    }
    catch(err){
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException("Unknown error occurred");
    }
  }

  async remove(id: number) {
    try{
      const [result]=await this.db.query("DELETE FROM products1 WHERE id=?",[id]) 
      return result
    }
    catch(err){
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException("Unknown error occurred");
    }
  }
}
