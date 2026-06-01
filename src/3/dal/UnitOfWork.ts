import { inject, injectable } from 'inversify';
import { IUnitOfWork } from './interfaces/IUnitOfWork';
import { InMemoryDatabaseContext } from './inMemory/InMemoryDatabaseContext';
import { Repository } from './repositories/Repository';
import { UserEntity } from './entities/UserEntity';
import { CategoryEntity } from './entities/CategoryEntity';
import { PostEntity } from './entities/PostEntity';
import { CommentEntity } from './entities/CommentEntity';
import { TYPES } from '../di/types';

@injectable()
export class UnitOfWork implements IUnitOfWork {
  public readonly users: Repository<UserEntity>;
  public readonly categories: Repository<CategoryEntity>;
  public readonly posts: Repository<PostEntity>;
  public readonly comments: Repository<CommentEntity>;

  public constructor(@inject(TYPES.DatabaseContext) private readonly context: InMemoryDatabaseContext) {
    this.users = new Repository<UserEntity>(this.context, 'users');
    this.categories = new Repository<CategoryEntity>(this.context, 'categories');
    this.posts = new Repository<PostEntity>(this.context, 'posts');
    this.comments = new Repository<CommentEntity>(this.context, 'comments');
  }

  public async saveChanges(): Promise<void> {
    await Promise.resolve();
  }
}
