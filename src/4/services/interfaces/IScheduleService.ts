import { ExhibitionSchedule } from '../../domain/models/ExhibitionSchedule';
import { CreateScheduleDto } from '../../dto/requests/CreateScheduleDto';

export interface IScheduleService {
  getAllSchedules(): Promise<ExhibitionSchedule[]>;
  createSchedule(dto: CreateScheduleDto): Promise<ExhibitionSchedule>;
}
