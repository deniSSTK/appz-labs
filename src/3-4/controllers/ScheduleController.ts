import { inject, injectable } from 'inversify';
import { Request, Response, Router } from 'express';
import { IScheduleService } from '../services/interfaces/IScheduleService';
import { TYPES } from '../infra/di/types';
import { MuseumMapper } from '../infra/mappers/MuseumMapper';

@injectable()
export class ScheduleController {
    public readonly router: Router;

    constructor(@inject(TYPES.ScheduleService) private readonly scheduleService: IScheduleService) {
        this.router = Router();
        this.router.get('/', this.getAllSchedules);
        this.router.post('/', this.createSchedule);
    }

    private getAllSchedules = async (_request: Request, response: Response): Promise<void> => {
        const schedules = await this.scheduleService.getAllSchedules();
        response.json({
            success: true,
            data: schedules.map(MuseumMapper.toScheduleDto)
        });
    };

    private createSchedule = async (request: Request, response: Response): Promise<void> => {
        const schedule = await this.scheduleService.createSchedule(request.body);
        response.status(201).json({
            success: true,
            data: MuseumMapper.toScheduleDto(schedule)
        });
    };
}
