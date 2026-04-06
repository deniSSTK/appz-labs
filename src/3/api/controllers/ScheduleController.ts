import { Request, Response, Router } from 'express';
import { IScheduleService } from '../../bll/contracts/IScheduleService';
import { DtoMapper } from '../mappers/DtoMapper';

export class ScheduleController {
    public readonly router: Router;

    constructor(private readonly scheduleService: IScheduleService) {
        this.router = Router();
        this.router.get('/', this.getAll);

        this.router.post('/', this.create);
    }

    private getAll = async (_request: Request, response: Response): Promise<void> => {
        const schedules = await this.scheduleService.getAll();
        response.json(schedules.map(DtoMapper.toScheduleDto));
    };

    private create = async (request: Request, response: Response): Promise<void> => {
        const schedule = await this.scheduleService.create({
            ...request.body,
            startsAt: new Date(request.body.startsAt),
            endsAt: new Date(request.body.endsAt)
        });
        response.status(201).json(DtoMapper.toScheduleDto(schedule));
    };
}
