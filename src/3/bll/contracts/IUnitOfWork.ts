import { IExpositionRepository } from './IExpositionRepository';
import { IScheduleRepository } from './IScheduleRepository';
import { IVisitRepository } from './IVisitRepository';
import { IExcursionRepository } from './IExcursionRepository';
import { IExcursionBookingRepository } from './IExcursionBookingRepository';

export interface IUnitOfWork {
    readonly expositions: IExpositionRepository;
    readonly schedules: IScheduleRepository;
    readonly visits: IVisitRepository;
    readonly excursions: IExcursionRepository;
    readonly excursionBookings: IExcursionBookingRepository;
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
