import { Request, Response, Router } from 'express';
import { IExpositionService } from '../../bll/contracts/IExpositionService';
import { DtoMapper } from '../mappers/DtoMapper';

export class ExpositionController {
    public readonly router: Router;

    constructor(private readonly expositionService: IExpositionService) {
        this.router = Router();
        this.router.get('/', this.getAll);
        this.router.post('/', this.create);
    }

    private getAll = async (_request: Request, response: Response): Promise<void> => {
        const expositions = await this.expositionService.getAll();
        response.json(expositions.map(DtoMapper.toExpositionDto));
    };

    private create = async (request: Request, response: Response): Promise<void> => {
        const exposition = await this.expositionService.create(request.body);
        response.status(201).json(DtoMapper.toExpositionDto(exposition));
    };
}
