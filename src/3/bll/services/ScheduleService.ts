import { IUnitOfWork } from '../contracts/IUnitOfWork';
import { IScheduleService } from '../contracts/IScheduleService';
import { ExhibitionSchedule } from '../models/ExhibitionSchedule';

export interface CreateScheduleCommand {
    expositionId: string;
    startsAt: Date;
    endsAt: Date;
    openingHour: string;
    closingHour: string;
}

export class ScheduleService implements IScheduleService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    public async getAll(): Promise<ExhibitionSchedule[]> {
        return this.unitOfWork.schedules.getAll();
    }

    public async create(command: CreateScheduleCommand): Promise<ExhibitionSchedule> {
        const exposition = await this.unitOfWork.expositions.getById(command.expositionId);

        if (!exposition) {
            throw new Error('Cannot create a schedule for a missing exposition.');
        }

        if (command.startsAt >= command.endsAt) {
            throw new Error('Schedule start must be earlier than schedule end.');
        }

        if (command.openingHour >= command.closingHour) {
            throw new Error('Opening hour must be earlier than closing hour.');
        }

        const schedule = new ExhibitionSchedule(
            '',
            command.expositionId,
            command.startsAt,
            command.endsAt,
            command.openingHour,
            command.closingHour
        );

        return this.unitOfWork.schedules.add(schedule);
    }
}
