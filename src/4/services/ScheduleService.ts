import { inject, injectable } from 'inversify';
import { IScheduleService } from './interfaces/IScheduleService';
import { ExhibitionSchedule } from '../domain/models/ExhibitionSchedule';
import { CreateScheduleDto } from '../dto/requests/CreateScheduleDto';
import { IUnitOfWork } from '../repositories/interfaces/IUnitOfWork';
import { TYPES } from '../infra/di/types';

@injectable()
export class ScheduleService implements IScheduleService {
  constructor(@inject(TYPES.UnitOfWork) private readonly unitOfWork: IUnitOfWork) {}

  public async getAllSchedules(): Promise<ExhibitionSchedule[]> {
    await this.unitOfWork.begin();

    try {
      const result = await this.unitOfWork.schedules.getAll();
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  public async createSchedule(dto: CreateScheduleDto): Promise<ExhibitionSchedule> {
    await this.unitOfWork.begin();

    try {
      const exposition = await this.unitOfWork.expositions.getById(dto.expositionId);

      if (!exposition) {
        throw new Error('Cannot create a schedule for a missing exposition.');
      }

      const startsAt = new Date(dto.startsAt);
      const endsAt = new Date(dto.endsAt);

      if (startsAt >= endsAt) {
        throw new Error('Schedule start must be earlier than schedule end.');
      }

      const schedule = new ExhibitionSchedule(
        '',
        dto.expositionId,
        startsAt,
        endsAt,
        dto.openingHour,
        dto.closingHour
      );

      const result = await this.unitOfWork.schedules.add(schedule);
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}
