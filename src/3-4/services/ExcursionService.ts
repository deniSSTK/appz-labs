import { inject, injectable } from 'inversify';
import { IExcursionService } from './interfaces/IExcursionService';
import { Excursion } from '../domain/models/Excursion';
import { CreateExcursionDto } from '../dto/requests/CreateExcursionDto';
import { IUnitOfWork } from '../repositories/interfaces/IUnitOfWork';
import { TYPES } from '../infra/di/types';
import { ExcursionType } from '../domain/enums/ExcursionType';

@injectable()
export class ExcursionService implements IExcursionService {
    constructor(@inject(TYPES.UnitOfWork) private readonly unitOfWork: IUnitOfWork) {}

    public async getAllExcursions(): Promise<Excursion[]> {
        await this.unitOfWork.begin();

        try {
            const result = await this.unitOfWork.excursions.getAll();
            await this.unitOfWork.commit();
            return result;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }

    public async createExcursion(dto: CreateExcursionDto): Promise<Excursion> {
        await this.unitOfWork.begin();

        try {
            const exposition = await this.unitOfWork.expositions.getById(dto.expositionId);

            if (!exposition) {
                throw new Error('Cannot create an excursion for a missing exposition.');
            }

            if (dto.type === ExcursionType.Regular && !dto.scheduledAt) {
                throw new Error('Regular excursions must have a fixed date.');
            }

            if (dto.durationMinutes <= 0 || dto.maxParticipants <= 0 || dto.pricePerPerson <= 0) {
                throw new Error('Duration, capacity and price must be greater than zero.');
            }

            const excursion = new Excursion(
                '',
                dto.title,
                dto.expositionId,
                dto.type,
                dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                dto.durationMinutes,
                dto.maxParticipants,
                dto.pricePerPerson
            );

            const result = await this.unitOfWork.excursions.add(excursion);
            await this.unitOfWork.commit();
            return result;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}
