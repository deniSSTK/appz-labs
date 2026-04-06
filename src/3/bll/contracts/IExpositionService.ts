import { Exposition } from '../models/Exposition';
import type { CreateExpositionCommand } from '../services/ExpositionService';

export interface IExpositionService {
    getAll(): Promise<Exposition[]>;
    create(command: CreateExpositionCommand): Promise<Exposition>;
}
