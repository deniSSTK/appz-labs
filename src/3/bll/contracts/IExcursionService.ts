import { Excursion, ExcursionBooking } from '../models/Excursion';
import type { BookExcursionCommand, CreateExcursionCommand } from '../services/ExcursionService';

export interface IExcursionService {
    getAll(): Promise<Excursion[]>;
    create(command: CreateExcursionCommand): Promise<Excursion>;
    book(command: BookExcursionCommand): Promise<ExcursionBooking>;
}
