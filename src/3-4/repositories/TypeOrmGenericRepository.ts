import { DeepPartial, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { IGenericRepository } from './interfaces/IGenericRepository';

export class TypeOrmGenericRepository<
  TDomain,
  TEntity extends ObjectLiteral & { id: string }
> implements IGenericRepository<TDomain> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly toDomain: (entity: TEntity) => TDomain,
    protected readonly toEntity: (domain: TDomain) => TEntity
  ) {}

  public async getAll(): Promise<TDomain[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  public async getById(id: string): Promise<TDomain | null> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<TEntity>
    });
    return entity ? this.toDomain(entity) : null;
  }

  public async add(entity: TDomain): Promise<TDomain> {
    const dalEntity = this.toEntity(entity);
    const { id, ...rest } = dalEntity as TEntity;
    const saved = await this.repository.save(this.repository.create(rest as DeepPartial<TEntity>));
    return this.toDomain(saved);
  }

  public async update(entity: TDomain): Promise<TDomain> {
    const saved = await this.repository.save(this.toEntity(entity));
    return this.toDomain(saved);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
