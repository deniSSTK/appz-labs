import { Request, Response, Router } from 'express';
import { IExcursionService } from '../../bll/contracts/IExcursionService';
import { DtoMapper } from '../mappers/DtoMapper';

export class ExcursionController {
    public readonly router: Router;

    constructor(private readonly excursionService: IExcursionService) {
        this.router = Router();
        this.router.get('/', this.getAll);

        this.router.post('/', this.create);
        this.router.post('/book', this.book);
    }

    private getAll = async (_request: Request, response: Response): Promise<void> => {
        const excursions = await this.excursionService.getAll();
        response.json(excursions.map(DtoMapper.toExcursionDto));
    };

    private create = async (request: Request, response: Response): Promise<void> => {
        const excursion = await this.excursionService.create({
            ...request.body,
            scheduledAt: request.body.scheduledAt ? new Date(request.body.scheduledAt) : null
        });
        response.status(201).json(DtoMapper.toExcursionDto(excursion));
    };

    private book = async (request: Request, response: Response): Promise<void> => {
        const booking = await this.excursionService.book({
            ...request.body,
            requestedDate: request.body.requestedDate ? new Date(request.body.requestedDate) : null
        });
        response.status(201).json(DtoMapper.toExcursionBookingDto(booking));
    };
}
