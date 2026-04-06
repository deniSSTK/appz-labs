import { Excursion } from '../../domain/models/Excursion';
import { CreateExcursionDto } from '../../dto/requests/CreateExcursionDto';

export interface IExcursionService {
    getAllExcursions(): Promise<Excursion[]>;
    createExcursion(dto: CreateExcursionDto): Promise<Excursion>;
}
