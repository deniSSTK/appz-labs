import { IGenericRepository } from './IGenericRepository';
import { ExhibitionSchedule } from '../../domain/models/ExhibitionSchedule';

export interface IScheduleRepository extends IGenericRepository<ExhibitionSchedule> {
  getByExpositionId(expositionId: string): Promise<ExhibitionSchedule[]>;
}
