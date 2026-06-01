import { inject, injectable } from 'inversify';
import { Request, Response, Router } from 'express';
import { IMuseumService } from '../services/interfaces/IMuseumService';
import { TYPES } from '../infra/di/types';
import { MuseumMapper } from '../infra/mappers/MuseumMapper';

@injectable()
export class MuseumController {
  public readonly router: Router;

  constructor(@inject(TYPES.MuseumService) private readonly museumService: IMuseumService) {
    this.router = Router();
    this.router.get('/', this.getAllExpositions);
    this.router.get('/:id', this.getExpositionById);

    this.router.post('/', this.createExposition);

    this.router.put('/:id', this.updateExposition);

    this.router.delete('/:id', this.deleteExposition);
  }

  private getAllExpositions = async (_request: Request, response: Response): Promise<void> => {
    const expositions = await this.museumService.getAllExpositions();
    response.json({
      success: true,
      data: expositions.map(MuseumMapper.toExpositionDto)
    });
  };

  private getExpositionById = async (request: Request, response: Response): Promise<void> => {
    const id = this.getRouteId(request);
    const exposition = await this.museumService.getExpositionById(id);

    if (!exposition) {
      response.status(404).json({ success: false, message: 'Exposition not found.' });
      return;
    }

    response.json({
      success: true,
      data: MuseumMapper.toExpositionDto(exposition)
    });
  };

  private createExposition = async (request: Request, response: Response): Promise<void> => {
    const exposition = await this.museumService.createExposition(request.body);
    response.status(201).json({
      success: true,
      data: MuseumMapper.toExpositionDto(exposition)
    });
  };

  private updateExposition = async (request: Request, response: Response): Promise<void> => {
    const id = this.getRouteId(request);
    const exposition = await this.museumService.updateExposition(id, request.body);
    response.json({
      success: true,
      data: MuseumMapper.toExpositionDto(exposition)
    });
  };

  private deleteExposition = async (request: Request, response: Response): Promise<void> => {
    const id = this.getRouteId(request);
    await this.museumService.deleteExposition(id);
    response.json({
      success: true,
      message: 'Exposition deleted successfully.'
    });
  };

  private getRouteId(request: Request): string {
    const { id } = request.params;
    return Array.isArray(id) ? id[0] : id;
  }
}
