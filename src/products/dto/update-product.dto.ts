import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsUUID } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsUUID()
  public id: string;
}
