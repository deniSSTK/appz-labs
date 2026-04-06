import { IGenericRepository } from './IGenericRepository';
import { Excursion } from '../../domain/models/Excursion';

export interface IExcursionRepository extends IGenericRepository<Excursion> {}
