import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RowDataPacket, type Pool } from 'mysql2/promise';
import { unlink ,unlinkSync} from 'fs';
@Injectable()
export class ProductsService {
  constructor(@Inject('MYSQL_POOL') private readonly db: Pool){}
  async create(createProductDto: CreateProductDto,filename:string) {
    
    try{
    
    const {name,description,price}=createProductDto
    const [rows]=await this.db.query("insert into products1 (name,description,price,images) values(?,?,?,?)",[name,description,price,filename])
    const image = `http://localhost:24/uploads/images/${filename}`;
    return {...rows,image:image}
    }
    catch (err) {
      unlinkSync(`./uploads/images/${filename}`);
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
    return rows.map((itms)=>({
      id: itms.id,
      name: itms.name,
      price: itms.price,
      description: itms.description,
      image: `http://localhost:24/uploads/images/${itms.images}`,
    }))
    }
    catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException("Unknown error occurred");
    }
  } 

  async update(id: number, updateProductDto: UpdateProductDto,image?:string) {
    try{
      const {name,description,price}=updateProductDto
      let query=`UPDATE products1
      SET name = ?, description = ?, price = ?`
      const params: any[] = [name, description, price];
      const image2 = `http://localhost:24/uploads/images/${image}`;
      if (image){
        query+=", images=?"
        params.push(image)
      }
      query+=` Where id=?`
      params.push(id)

      const [result]=await this.db.query(query,params)
      if (image){
        return {...result,image:image2}
      }
      return result
      // const [result]=await this.db.query(`UPDATE products1
      // SET name = ?, description = ?, price = ?
      // WHERE id = ?`,[name,description,price,id])
      // return result
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
      const [[product]]: any = await this.db.query(
        `SELECT images FROM products1 WHERE id=?`,
        [id],
      );
      const [result]=await this.db.query("DELETE FROM products1 WHERE id=?",[id])
      console.log(product)
      if (product?.images) {
        unlink(`./uploads/images/${product.images}`, () => {});
      } 
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
