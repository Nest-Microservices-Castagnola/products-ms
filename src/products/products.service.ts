import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { ResponseMessage } from 'src/common/interface/response-message.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { GetPaginatedProduct } from './dto/get-paginated-product.dt';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }
  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<GetPaginatedProduct> {
    const { page = 1, limit = 10 } = paginationDto;

    const totalPages: number = await this.product.count({
      where: { status: true },
    });
    const lastPage: number = Math.ceil(totalPages / limit);
    this.logger.log(`Total pages: ${limit}`);

    const products: Product[] = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: { status: true },
    });

    return {
      data: products,
      total: totalPages,
      page,
      lastPage,
    };
  }

  async findOne(id: string): Promise<Product> {
    console.info('enter here', id);
    const product: Product = await this.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'The resource not found',
      });
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    console.log('🚀 ~ ProductsService ~ updateProductDto:', updateProductDto);
    await this.findOne(id);
    const { id: _, ...data } = updateProductDto;
    console.info(_);
    const product = await this.product.update({
      where: { id },
      data,
    });

    return product;
  }

  async remove(id: string): Promise<ResponseMessage> {
    await this.findOne(id);
    await this.product.update({
      where: { id },
      data: { status: false },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Resource deleted',
    };
  }
}
