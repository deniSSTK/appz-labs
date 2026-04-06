import { Repository } from 'typeorm';
import { IExpositionRepository } from '../../bll/contracts/IExpositionRepository';
import { Exposition } from '../../bll/models/Exposition';
import { AudienceType } from '../../shared/enums';
import { ExpositionEntity } from '../entities/ExpositionEntity';
import { DalMapper } from '../mappers/DalMapper';
import { TypeOrmGenericRepository } from './TypeOrmGenericRepository';

export class TypeOrmExpositionRepository
    extends TypeOrmGenericRepository<Exposition, ExpositionEntity>
    implements IExpositionRepository
{
    constructor(repository: Repository<ExpositionEntity>) {
        super(repository, DalMapper.toExpositionDomain, DalMapper.toExpositionEntity);
    }

    public async findByAudienceType(audienceType: AudienceType): Promise<Exposition[]> {
        const entities = await this.repository.findBy({ audienceType });
        return entities.map(DalMapper.toExpositionDomain);
    }
}
