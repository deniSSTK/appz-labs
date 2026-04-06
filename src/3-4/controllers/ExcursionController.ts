import { inject, injectable } from 'inversify';
import { Request, Response, Router } from 'express';
import { IExcursionService } from '../services/interfaces/IExcursionService';
import { TYPES } from '../infra/di/types';
import { MuseumMapper } from '../infra/mappers/MuseumMapper';

@injectable()
export class ExcursionController {
  public readonly router: Router;

  constructor(
    @inject(TYPES.ExcursionService) private readonly excursionService: IExcursionService
  ) {
    this.router = Router();
    this.router.get('/', this.getAllExcursions);
    this.router.post('/', this.createExcursion);
  }

  private getAllExcursions = async (_request: Request, response: Response): Promise<void> => {
    const excursions = await this.excursionService.getAllExcursions();
    response.json({
      success: true,
      data: excursions.map(MuseumMapper.toExcursionDto)
    });
  };

  private createExcursion = async (request: Request, response: Response): Promise<void> => {
    const excursion = await this.excursionService.createExcursion(request.body);
    response.status(201).json({
      success: true,
      data: MuseumMapper.toExcursionDto(excursion)
    });
  };
}
