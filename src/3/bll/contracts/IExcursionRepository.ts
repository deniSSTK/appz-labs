import { IRepository } from './IRepository';
import { Excursion } from '../models/Excursion';
import { ExcursionFormat } from '../../shared/enums';

export interface IExcursionRepository extends IRepository<Excursion> {
    findByFormat(format: ExcursionFormat): Promise<Excursion[]>;
}
