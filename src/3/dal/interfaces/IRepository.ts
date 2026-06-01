import { Identifiable } from './Identifiable';

export type NewEntity<T extends Identifiable> = Omit<T, 'id'>;

export interface IRepository<T extends Identifiable> {
  getAll(): Promise<readonly T[]>;
  getById(id: number): Promise<T | undefined>;
  find(predicate: (item: T) => boolean): Promise<readonly T[]>;
  add(entity: NewEntity<T>): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: number): Promise<boolean>;
}
