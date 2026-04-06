import { Repository } from 'typeorm';
import { IExcursionRepository } from '../../bll/contracts/IExcursionRepository';
import { Excursion } from '../../bll/models/Excursion';
import { ExcursionFormat } from '../../shared/enums';
import { ExcursionEntity } from '../entities/ExcursionEntity';
import { DalMapper } from '../mappers/DalMapper';
import { TypeOrmGenericRepository } from './TypeOrmGenericRepository';

export class TypeOrmExcursionRepository
    extends TypeOrmGenericRepository<Excursion, ExcursionEntity>
    implements IExcursionRepository
{
    constructor(repository: Repository<ExcursionEntity>) {
        super(repository, DalMapper.toExcursionDomain, DalMapper.toExcursionEntity);
    }

    public async findByFormat(format: ExcursionFormat): Promise<Excursion[]> {
        const entities = await this.repository.findBy({ format });
        return entities.map(DalMapper.toExcursionDomain);
    }
}
