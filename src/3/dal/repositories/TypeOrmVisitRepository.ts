import { Repository } from 'typeorm';
import { IVisitRepository } from '../../bll/contracts/IVisitRepository';
import { VisitRecord } from '../../bll/models/VisitPlan';
import { VisitRecordEntity } from '../entities/VisitRecordEntity';
import { DalMapper } from '../mappers/DalMapper';
import { TypeOrmGenericRepository } from './TypeOrmGenericRepository';

export class TypeOrmVisitRepository
    extends TypeOrmGenericRepository<VisitRecord, VisitRecordEntity>
    implements IVisitRepository
{
    constructor(repository: Repository<VisitRecordEntity>) {
        super(repository, DalMapper.toVisitDomain, DalMapper.toVisitEntity);
    }
}
