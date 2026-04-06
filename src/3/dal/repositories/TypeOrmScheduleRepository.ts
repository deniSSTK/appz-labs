import { Repository } from 'typeorm';
import { IScheduleRepository } from '../../bll/contracts/IScheduleRepository';
import { ExhibitionSchedule } from '../../bll/models/ExhibitionSchedule';
import { ExhibitionScheduleEntity } from '../entities/ExhibitionScheduleEntity';
import { DalMapper } from '../mappers/DalMapper';
import { TypeOrmGenericRepository } from './TypeOrmGenericRepository';

export class TypeOrmScheduleRepository
    extends TypeOrmGenericRepository<ExhibitionSchedule, ExhibitionScheduleEntity>
    implements IScheduleRepository
{
    constructor(repository: Repository<ExhibitionScheduleEntity>) {
        super(repository, DalMapper.toScheduleDomain, DalMapper.toScheduleEntity);
    }

    public async findByExpositionId(expositionId: string): Promise<ExhibitionSchedule[]> {
        const entities = await this.repository.findBy({ expositionId });
        return entities.map(DalMapper.toScheduleDomain);
    }
}
