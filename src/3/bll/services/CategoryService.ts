import { IUnitOfWork } from '../../dal/interfaces/IUnitOfWork';
import { CategoryDto } from '../dto/CategoryDto';
import { toCategoryDto } from '../mappers/BlogMapper';

export class CategoryService {
  public constructor(private readonly unitOfWork: IUnitOfWork) {}

  public async listCategories(): Promise<CategoryDto[]> {
    const categories = await this.unitOfWork.categories.getAll();
    return categories.map(toCategoryDto);
  }
}
