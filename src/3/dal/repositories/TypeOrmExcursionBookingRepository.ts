import { Repository } from 'typeorm';
import { IExcursionBookingRepository } from '../../bll/contracts/IExcursionBookingRepository';
import { ExcursionBooking } from '../../bll/models/Excursion';
import { ExcursionBookingEntity } from '../entities/ExcursionBookingEntity';
import { DalMapper } from '../mappers/DalMapper';
import { TypeOrmGenericRepository } from './TypeOrmGenericRepository';

export class TypeOrmExcursionBookingRepository
    extends TypeOrmGenericRepository<ExcursionBooking, ExcursionBookingEntity>
    implements IExcursionBookingRepository
{
    constructor(repository: Repository<ExcursionBookingEntity>) {
        super(repository, DalMapper.toExcursionBookingDomain, DalMapper.toExcursionBookingEntity);
    }
}
