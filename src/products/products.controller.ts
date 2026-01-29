import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from 'src/guards/auth.guard';
import { RequirePermission } from 'src/guards/permissions.decorator';
@UseGuards(RoleGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermission('create_records')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  @Get()
  @RequirePermission('read_records')
  findAll() {
    return this.productsService.findAll();
  }


  @Patch(':id')
  @RequirePermission("update_records")
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
  @Delete(':id')
  @RequirePermission("delete_records")
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
