import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { RoleGuard } from "src/guards/auth.guard";
import { RequirePermission } from "src/guards/permissions.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageMulterOptions } from "./multer.config";
import { imageValidationPipe } from "./multerValidation";
@UseGuards(RoleGuard)
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image", imageMulterOptions))
  @RequirePermission("create_records")
  create(
    @UploadedFile(imageValidationPipe) image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto, image.filename);
  }
  @Get()
  @RequirePermission("read_records")
  findAll() {
    return this.productsService.findAll();
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("image", imageMulterOptions))
  @RequirePermission("update_records")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto,
  @UploadedFile() image: Express.Multer.File | undefined) {
    return this.productsService.update(+id, updateProductDto,image?.filename);
  }
  @Delete(":id")
  @RequirePermission("delete_records")
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
