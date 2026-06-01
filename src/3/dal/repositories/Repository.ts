import { InMemoryDatabaseContext, TableName } from '../inMemory/InMemoryDatabaseContext';
import { Identifiable } from '../interfaces/Identifiable';
import { IRepository, NewEntity } from '../interfaces/IRepository';

export class Repository<T extends Identifiable> implements IRepository<T> {
  public constructor(
    private readonly context: InMemoryDatabaseContext,
    private readonly tableName: TableName
  ) {}

  public async getAll(): Promise<readonly T[]> {
    return [...this.context.getTable<T>(this.tableName)];
  }

  public async getById(id: number): Promise<T | undefined> {
    return this.context.getTable<T>(this.tableName).find((item) => item.id === id);
  }

  public async find(predicate: (item: T) => boolean): Promise<readonly T[]> {
    return this.context.getTable<T>(this.tableName).filter(predicate);
  }

  public async add(entity: NewEntity<T>): Promise<T> {
    const created = {
      ...entity,
      id: this.context.nextId(this.tableName)
    } as T;
    this.context.getTable<T>(this.tableName).push(created);
    return created;
  }

  public async update(entity: T): Promise<T> {
    const items = this.context.getTable<T>(this.tableName);
    const index = items.findIndex((item) => item.id === entity.id);
    if (index < 0) {
      throw new Error(`Entity with id ${entity.id} was not found`);
    }
    items[index] = { ...entity };
    return items[index];
  }

  public async delete(id: number): Promise<boolean> {
    const items = this.context.getTable<T>(this.tableName);
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) {
      return false;
    }
    items.splice(index, 1);
    return true;
  }
}
