import { inject, injectable } from 'inversify';
import { IUnitOfWork } from '../../dal/interfaces/IUnitOfWork';
import { CategoryDto } from '../dto/CategoryDto';
import { toCategoryDto } from '../mappers/BlogMapper';
import { TYPES } from '../../di/types';

@injectable()
export class CategoryService {
  public constructor(@inject(TYPES.UnitOfWork) private readonly unitOfWork: IUnitOfWork) {}

  public async listCategories(): Promise<CategoryDto[]> {
    const categories = await this.unitOfWork.categories.getAll();
    return categories.map(toCategoryDto);
  }
}
