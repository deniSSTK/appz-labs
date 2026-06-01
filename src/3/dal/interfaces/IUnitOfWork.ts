import { IRepository } from './IRepository';
import { UserEntity } from '../entities/UserEntity';
import { CategoryEntity } from '../entities/CategoryEntity';
import { PostEntity } from '../entities/PostEntity';
import { CommentEntity } from '../entities/CommentEntity';

export interface IUnitOfWork {
  readonly users: IRepository<UserEntity>;
  readonly categories: IRepository<CategoryEntity>;
  readonly posts: IRepository<PostEntity>;
  readonly comments: IRepository<CommentEntity>;
  saveChanges(): Promise<void>;
}
