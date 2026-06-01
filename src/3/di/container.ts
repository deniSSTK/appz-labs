import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { createSeededDatabaseContext } from '../dal/bootstrap';
import { InMemoryDatabaseContext } from '../dal/inMemory/InMemoryDatabaseContext';
import { IUnitOfWork } from '../dal/interfaces/IUnitOfWork';
import { UnitOfWork } from '../dal/UnitOfWork';
import { AuthService } from '../bll/services/AuthService';
import { CategoryService } from '../bll/services/CategoryService';
import { CommentService } from '../bll/services/CommentService';
import { PostService } from '../bll/services/PostService';
import { BlogCli } from '../ui/BlogCli';

export function createContainer(): Container {
  const container = new Container({ defaultScope: 'Singleton' });
  const databaseContext = createSeededDatabaseContext();

  container.bind<InMemoryDatabaseContext>(TYPES.DatabaseContext).toConstantValue(databaseContext);
  container.bind<IUnitOfWork>(TYPES.UnitOfWork).to(UnitOfWork);
  container.bind<AuthService>(TYPES.AuthService).to(AuthService);
  container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
  container.bind<CommentService>(TYPES.CommentService).to(CommentService);
  container.bind<PostService>(TYPES.PostService).to(PostService);
  container.bind<BlogCli>(TYPES.BlogCli).to(BlogCli);

  return container;
}

