import { inject, injectable } from 'inversify';
import { IMuseumService } from './interfaces/IMuseumService';
import { Exposition } from '../domain/models/Exposition';
import { CreateExpositionDto } from '../dto/requests/CreateExpositionDto';
import { UpdateExpositionDto } from '../dto/requests/UpdateExpositionDto';
import { IUnitOfWork } from '../repositories/interfaces/IUnitOfWork';
import { TYPES } from '../infra/di/types';

@injectable()
export class MuseumService implements IMuseumService {
  constructor(@inject(TYPES.UnitOfWork) private readonly unitOfWork: IUnitOfWork) {}

  public async getAllExpositions(): Promise<Exposition[]> {
    await this.unitOfWork.begin();

    try {
      const result = await this.unitOfWork.expositions.getAll();
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  public async getExpositionById(id: string): Promise<Exposition | null> {
    await this.unitOfWork.begin();

    try {
      const result = await this.unitOfWork.expositions.getById(id);
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  public async createExposition(dto: CreateExpositionDto): Promise<Exposition> {
    this.validateExposition(dto.ticketPrice);
    await this.unitOfWork.begin();

    try {
      const exposition = new Exposition(
        '',
        dto.title,
        dto.theme,
        dto.audienceType,
        dto.hall,
        dto.ticketPrice,
        dto.description
      );

      const result = await this.unitOfWork.expositions.add(exposition);
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  public async updateExposition(id: string, dto: UpdateExpositionDto): Promise<Exposition> {
    this.validateExposition(dto.ticketPrice);
    await this.unitOfWork.begin();

    try {
      const existing = await this.unitOfWork.expositions.getById(id);

      if (!existing) {
        throw new Error('Exposition not found.');
      }

      const updated = new Exposition(
        id,
        dto.title,
        dto.theme,
        dto.audienceType,
        dto.hall,
        dto.ticketPrice,
        dto.description
      );

      const result = await this.unitOfWork.expositions.update(updated);
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  public async deleteExposition(id: string): Promise<void> {
    await this.unitOfWork.begin();

    try {
      const existing = await this.unitOfWork.expositions.getById(id);

      if (!existing) {
        throw new Error('Exposition not found.');
      }

      await this.unitOfWork.expositions.delete(id);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private validateExposition(ticketPrice: number): void {
    if (ticketPrice <= 0) {
      throw new Error('Ticket price must be greater than zero.');
    }
  }
}
