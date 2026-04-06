import { IRepository } from './IRepository';
import { Exposition } from '../models/Exposition';
import { AudienceType } from '../../shared/enums';

export interface IExpositionRepository extends IRepository<Exposition> {
    findByAudienceType(audienceType: AudienceType): Promise<Exposition[]>;
}
