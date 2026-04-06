import { IRepository } from './IRepository';
import { VisitRecord } from '../models/VisitPlan';

export interface IVisitRepository extends IRepository<VisitRecord> {}
