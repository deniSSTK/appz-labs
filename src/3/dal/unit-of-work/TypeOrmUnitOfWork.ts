import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '../../bll/contracts/IUnitOfWork';
import { IExpositionRepository } from '../../bll/contracts/IExpositionRepository';
import { IScheduleRepository } from '../../bll/contracts/IScheduleRepository';
import { IVisitRepository } from '../../bll/contracts/IVisitRepository';
import { IExcursionRepository } from '../../bll/contracts/IExcursionRepository';
import { IExcursionBookingRepository } from '../../bll/contracts/IExcursionBookingRepository';
import { ExpositionEntity } from '../entities/ExpositionEntity';
import { ExhibitionScheduleEntity } from '../entities/ExhibitionScheduleEntity';
import { VisitRecordEntity } from '../entities/VisitRecordEntity';
import { ExcursionEntity } from '../entities/ExcursionEntity';
import { ExcursionBookingEntity } from '../entities/ExcursionBookingEntity';
import { TypeOrmExpositionRepository } from '../repositories/TypeOrmExpositionRepository';
import { TypeOrmScheduleRepository } from '../repositories/TypeOrmScheduleRepository';
import { TypeOrmVisitRepository } from '../repositories/TypeOrmVisitRepository';
import { TypeOrmExcursionRepository } from '../repositories/TypeOrmExcursionRepository';
import { TypeOrmExcursionBookingRepository } from '../repositories/TypeOrmExcursionBookingRepository';

export class TypeOrmUnitOfWork implements IUnitOfWork {
    private queryRunner: QueryRunner | null = null;

    constructor(private readonly dataSource: DataSource) {}

    public get expositions(): IExpositionRepository {
        return new TypeOrmExpositionRepository(this.manager.getRepository(ExpositionEntity));
    }

    public get schedules(): IScheduleRepository {
        return new TypeOrmScheduleRepository(this.manager.getRepository(ExhibitionScheduleEntity));
    }

    public get visits(): IVisitRepository {
        return new TypeOrmVisitRepository(this.manager.getRepository(VisitRecordEntity));
    }

    public get excursions(): IExcursionRepository {
        return new TypeOrmExcursionRepository(this.manager.getRepository(ExcursionEntity));
    }

    public get excursionBookings(): IExcursionBookingRepository {
        return new TypeOrmExcursionBookingRepository(this.manager.getRepository(ExcursionBookingEntity));
    }

    public async begin(): Promise<void> {
        if (this.queryRunner) {
            return;
        }

        this.queryRunner = this.dataSource.createQueryRunner();
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
    }

    public async commit(): Promise<void> {
        if (!this.queryRunner) {
            return;
        }

        await this.queryRunner.commitTransaction();
        await this.queryRunner.release();
        this.queryRunner = null;
    }

    public async rollback(): Promise<void> {
        if (!this.queryRunner) {
            return;
        }

        await this.queryRunner.rollbackTransaction();
        await this.queryRunner.release();
        this.queryRunner = null;
    }

    private get manager(): EntityManager {
        return this.queryRunner?.manager ?? this.dataSource.manager;
    }
}
