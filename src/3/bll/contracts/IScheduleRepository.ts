import { IRepository } from './IRepository';
import { ExhibitionSchedule } from '../models/ExhibitionSchedule';

export interface IScheduleRepository extends IRepository<ExhibitionSchedule> {
    findByExpositionId(expositionId: string): Promise<ExhibitionSchedule[]>;
}
