import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Inject,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ClientProxy } from '@nestjs/microservices';
//import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  async all() {
    this.client.emit('hello', 'hello from admin');
    return this.productService.all();
  }

  @Post()
  async create(@Body('title') title: string, @Body('image') image: string) {
    const product = await this.productService.create({ title, image });
    this.client.emit('product_created', product);
    return product;
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.productService.get(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('image') image: string,
  ) {
    const updatedProduct = await this.productService.update(id, {
      title,
      image,
    });
    this.client.emit('product_updated', updatedProduct);
    return updatedProduct;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productService.delete(id);
    this.client.emit('product_deleted', id);
  }
}
