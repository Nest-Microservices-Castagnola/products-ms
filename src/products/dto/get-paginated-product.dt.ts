import { Product } from '../entities/product.entity';

export class GetPaginatedProduct {
  public data: Product[];
  public total: number;
  public page: number;
  public lastPage: number;
}
