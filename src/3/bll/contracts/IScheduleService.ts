import { ExhibitionSchedule } from '../models/ExhibitionSchedule';
import type { CreateScheduleCommand } from '../services/ScheduleService';

export interface IScheduleService {
    getAll(): Promise<ExhibitionSchedule[]>;
    create(command: CreateScheduleCommand): Promise<ExhibitionSchedule>;
}
