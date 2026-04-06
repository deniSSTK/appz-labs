import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { TYPES } from './types';
import { IMuseumService } from '../../services/interfaces/IMuseumService';
import { IScheduleService } from '../../services/interfaces/IScheduleService';
import { IExcursionService } from '../../services/interfaces/IExcursionService';
import { IUnitOfWork } from '../../repositories/interfaces/IUnitOfWork';
import { MuseumService } from '../../services/MuseumService';
import { ScheduleService } from '../../services/ScheduleService';
import { ExcursionService } from '../../services/ExcursionService';
import { TypeOrmUnitOfWork } from '../../repositories/TypeOrmUnitOfWork';
import { MuseumController } from '../../controllers/MuseumController';
import { ScheduleController } from '../../controllers/ScheduleController';
import { ExcursionController } from '../../controllers/ExcursionController';
import { museumDataSource } from '../database/data-source';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<DataSource>(TYPES.DataSource).toConstantValue(museumDataSource);
container.bind<IUnitOfWork>(TYPES.UnitOfWork).to(TypeOrmUnitOfWork);

container.bind<IMuseumService>(TYPES.MuseumService).to(MuseumService);
container.bind<IScheduleService>(TYPES.ScheduleService).to(ScheduleService);
container.bind<IExcursionService>(TYPES.ExcursionService).to(ExcursionService);

container.bind<MuseumController>(TYPES.MuseumController).to(MuseumController);
container.bind<ScheduleController>(TYPES.ScheduleController).to(ScheduleController);
container.bind<ExcursionController>(TYPES.ExcursionController).to(ExcursionController);

export { container };
