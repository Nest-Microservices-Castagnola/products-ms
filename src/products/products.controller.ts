import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { PaginationDto } from 'src/common';
import { ResponseMessage } from 'src/common/interface/response-message.interface';
import { CreateProductDto, GetPaginatedProduct, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()// Thi is only Rest
  @MessagePattern({ cmd: 'create_product' }) // This is Microservice message pattern
  create(@Payload() createProductDto: CreateProductDto): Promise<Product> {
    console.log(`Entra al controller`);
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(
    @Payload() paginationDto: PaginationDto,
  ): Promise<GetPaginatedProduct> {
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
  findOne(@Payload('id') id: string): Promise<Product> {
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
  remove(@Payload('id') id: string): Promise<ResponseMessage> {
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

  @MessagePattern({ cmd: 'validate_products' })
  validateProducts(@Payload() ids: string[]): Promise<Product[]> {
    return this.productsService.validateProducts(ids);
  }
}
