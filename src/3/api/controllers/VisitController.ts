import { Request, Response, Router } from 'express';
import { IVisitService } from '../../bll/contracts/IVisitService';
import { DtoMapper } from '../mappers/DtoMapper';

export class VisitController {
    public readonly router: Router;

    constructor(private readonly visitService: IVisitService) {
        this.router = Router();

        this.router.post('/calculate', this.calculatePrice);
        this.router.post('/plan', this.planVisit);
    }

    private calculatePrice = async (request: Request, response: Response): Promise<void> => {
        const price = await this.visitService.calculatePrice({
            ...request.body,
            visitDate: new Date(request.body.visitDate)
        });
        response.json(DtoMapper.toVisitPriceDto(price));
    };

    private planVisit = async (request: Request, response: Response): Promise<void> => {
        const visit = await this.visitService.planVisit({
            ...request.body,
            visitDate: new Date(request.body.visitDate)
        });
        response.status(201).json(DtoMapper.toVisitRecordDto(visit));
    };
}
