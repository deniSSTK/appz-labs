import { Exposition } from '../../domain/models/Exposition';
import { CreateExpositionDto } from '../../dto/requests/CreateExpositionDto';
import { UpdateExpositionDto } from '../../dto/requests/UpdateExpositionDto';

export interface IMuseumService {
    getAllExpositions(): Promise<Exposition[]>;
    getExpositionById(id: string): Promise<Exposition | null>;
    createExposition(dto: CreateExpositionDto): Promise<Exposition>;
    updateExposition(id: string, dto: UpdateExpositionDto): Promise<Exposition>;
    deleteExposition(id: string): Promise<void>;
}
