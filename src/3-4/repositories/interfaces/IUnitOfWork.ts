import { IExpositionRepository } from './IExpositionRepository';
import { IScheduleRepository } from './IScheduleRepository';
import { IExcursionRepository } from './IExcursionRepository';

export interface IUnitOfWork {
  readonly expositions: IExpositionRepository;
  readonly schedules: IScheduleRepository;
  readonly excursions: IExcursionRepository;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
