import { inject, injectable } from 'inversify';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { IUnitOfWork } from './interfaces/IUnitOfWork';
import { IExpositionRepository } from './interfaces/IExpositionRepository';
import { IScheduleRepository } from './interfaces/IScheduleRepository';
import { IExcursionRepository } from './interfaces/IExcursionRepository';
import { Exposition } from '../domain/models/Exposition';
import { ExhibitionSchedule } from '../domain/models/ExhibitionSchedule';
import { Excursion } from '../domain/models/Excursion';
import { ExpositionEntity } from './entities/ExpositionEntity';
import { ExhibitionScheduleEntity } from './entities/ExhibitionScheduleEntity';
import { ExcursionEntity } from './entities/ExcursionEntity';
import { TypeOrmGenericRepository } from './TypeOrmGenericRepository';
import { MuseumMapper } from '../infra/mappers/MuseumMapper';
import { TYPES } from '../infra/di/types';

@injectable()
export class TypeOrmUnitOfWork implements IUnitOfWork {
    private queryRunner: QueryRunner | null = null;

    constructor(@inject(TYPES.DataSource) private readonly dataSource: DataSource) {}

    public get expositions(): IExpositionRepository {
        return new TypeOrmExpositionRepository(this.manager.getRepository(ExpositionEntity));
    }

    public get schedules(): IScheduleRepository {
        return new TypeOrmScheduleRepository(this.manager.getRepository(ExhibitionScheduleEntity));
    }

    public get excursions(): IExcursionRepository {
        return new TypeOrmExcursionRepository(this.manager.getRepository(ExcursionEntity));
    }

    public async begin(): Promise<void> {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }

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

class TypeOrmExpositionRepository
    extends TypeOrmGenericRepository<Exposition, ExpositionEntity>
    implements IExpositionRepository
{
    constructor(repository: Repository<ExpositionEntity>) {
        super(repository, MuseumMapper.toExpositionDomain, MuseumMapper.toExpositionEntity);
    }
}

class TypeOrmScheduleRepository
    extends TypeOrmGenericRepository<ExhibitionSchedule, ExhibitionScheduleEntity>
    implements IScheduleRepository
{
    constructor(repository: Repository<ExhibitionScheduleEntity>) {
        super(repository, MuseumMapper.toScheduleDomain, MuseumMapper.toScheduleEntity);
    }

    public async getByExpositionId(expositionId: string): Promise<ExhibitionSchedule[]> {
        const entities = await this.repository.findBy({ expositionId });
        return entities.map(MuseumMapper.toScheduleDomain);
    }
}

class TypeOrmExcursionRepository
    extends TypeOrmGenericRepository<Excursion, ExcursionEntity>
    implements IExcursionRepository
{
    constructor(repository: Repository<ExcursionEntity>) {
        super(repository, MuseumMapper.toExcursionDomain, MuseumMapper.toExcursionEntity);
    }
}
