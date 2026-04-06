export interface IRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    add(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    remove(id: string): Promise<void>;
}
