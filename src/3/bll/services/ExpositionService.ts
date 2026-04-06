import { IUnitOfWork } from '../contracts/IUnitOfWork';
import { IExpositionService } from '../contracts/IExpositionService';
import { Exposition } from '../models/Exposition';
import { AudienceType } from '../../shared/enums';

export interface CreateExpositionCommand {
    title: string;
    theme: string;
    audienceType: AudienceType;
    hall: string;
    baseTicketPrice: number;
    description: string;
}

export class ExpositionService implements IExpositionService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    public async getAll(): Promise<Exposition[]> {
        return this.unitOfWork.expositions.getAll();
    }

    public async create(command: CreateExpositionCommand): Promise<Exposition> {
        if (command.baseTicketPrice <= 0) {
            throw new Error('Base ticket price must be greater than zero.');
        }

        const exposition = new Exposition(
            '',
            command.title,
            command.theme,
            command.audienceType,
            command.hall,
            command.baseTicketPrice,
            command.description
        );

        return this.unitOfWork.expositions.add(exposition);
    }
}
