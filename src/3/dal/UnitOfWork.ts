import { IUnitOfWork } from './interfaces/IUnitOfWork';
import { InMemoryDatabaseContext } from './inMemory/InMemoryDatabaseContext';
import { Repository } from './repositories/Repository';
import { UserEntity } from './entities/UserEntity';
import { CategoryEntity } from './entities/CategoryEntity';
import { PostEntity } from './entities/PostEntity';
import { CommentEntity } from './entities/CommentEntity';

export class UnitOfWork implements IUnitOfWork {
  public readonly users: Repository<UserEntity>;
  public readonly categories: Repository<CategoryEntity>;
  public readonly posts: Repository<PostEntity>;
  public readonly comments: Repository<CommentEntity>;

  public constructor(private readonly context: InMemoryDatabaseContext) {
    this.users = new Repository<UserEntity>(context, 'users');
    this.categories = new Repository<CategoryEntity>(context, 'categories');
    this.posts = new Repository<PostEntity>(context, 'posts');
    this.comments = new Repository<CommentEntity>(context, 'comments');
  }

  public async saveChanges(): Promise<void> {
    await Promise.resolve();
  }
}
