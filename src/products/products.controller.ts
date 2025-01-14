import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()// Thi is only Rest
  @MessagePattern({ cmd: 'create_product' }) // This is Microservice message pattern
  create(@Payload() createProductDto: CreateProductDto) {
    try {
      return this.productsService.create(createProductDto);
    } catch (error) {
      console.error('🚀 ~ ProductsController ~ create ~ error:', error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  //@Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDto: PaginationDto) {
    try {
      return this.productsService.findAll(paginationDto);
    } catch (error) {
      console.error('🚀 ~ ProductsController ~ findAll ~ error:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id') id: string) {
    console.info(id);
    try {
      return this.productsService.findOne(id);
    } catch (error) {
      console.error('🚀 ~ ProductsController ~ findOne ~ error:', error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    try {
      const { id } = updateProductDto;
      return this.productsService.update(id, updateProductDto);
    } catch (error) {
      console.error('🚀 ~ ProductsController ~ error:', error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id') id: string) {
    try {
      return this.productsService.remove(id);
    } catch (error) {
      console.error('🚀 ~ ProductsController ~ remove ~ error:', error);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
