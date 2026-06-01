import { CategoryEntity } from '../entities/CategoryEntity';
import { CommentEntity } from '../entities/CommentEntity';
import { PostEntity } from '../entities/PostEntity';
import { UserEntity } from '../entities/UserEntity';

export interface InMemoryTables {
  users: UserEntity[];
  categories: CategoryEntity[];
  posts: PostEntity[];
  comments: CommentEntity[];
}

export type TableName = keyof InMemoryTables;

export class InMemoryDatabaseContext {
  private readonly tables: InMemoryTables;
  private readonly counters: Record<TableName, number>;

  public constructor(initialData?: Partial<InMemoryTables>) {
    this.tables = {
      users: [...(initialData?.users ?? [])],
      categories: [...(initialData?.categories ?? [])],
      posts: [...(initialData?.posts ?? [])],
      comments: [...(initialData?.comments ?? [])]
    };
    this.counters = {
      users: this.getMaxId(this.tables.users),
      categories: this.getMaxId(this.tables.categories),
      posts: this.getMaxId(this.tables.posts),
      comments: this.getMaxId(this.tables.comments)
    };
  }

  public getTable<T>(name: TableName): T[] {
    return this.tables[name] as T[];
  }

  public nextId(name: TableName): number {
    this.counters[name] += 1;
    return this.counters[name];
  }

  private getMaxId<T extends { id: number }>(items: readonly T[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0);
  }
}
