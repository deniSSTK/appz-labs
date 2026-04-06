import { IUnitOfWork } from '../contracts/IUnitOfWork';
import { IExcursionService } from '../contracts/IExcursionService';
import { Excursion, ExcursionBooking } from '../models/Excursion';
import { BookingStatus, ExcursionFormat } from '../../shared/enums';

export interface CreateExcursionCommand {
    title: string;
    expositionId: string;
    format: ExcursionFormat;
    scheduledAt: Date | null;
    durationMinutes: number;
    maxParticipants: number;
    pricePerPerson: number;
}

export interface BookExcursionCommand {
    excursionId: string;
    visitorName: string;
    participantsCount: number;
    requestedDate: Date | null;
}

export class ExcursionService implements IExcursionService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    public async getAll(): Promise<Excursion[]> {
        return this.unitOfWork.excursions.getAll();
    }

    public async create(command: CreateExcursionCommand): Promise<Excursion> {
        const exposition = await this.unitOfWork.expositions.getById(command.expositionId);

        if (!exposition) {
            throw new Error('Cannot create an excursion for a missing exposition.');
        }

        if (command.durationMinutes <= 0 || command.maxParticipants <= 0 || command.pricePerPerson <= 0) {
            throw new Error('Excursion duration, capacity and price must be greater than zero.');
        }

        if (command.format === ExcursionFormat.Regular && !command.scheduledAt) {
            throw new Error('Regular excursions must have a scheduled date and time.');
        }

        const excursion = new Excursion(
            '',
            command.title,
            command.expositionId,
            command.format,
            command.scheduledAt,
            command.durationMinutes,
            command.maxParticipants,
            0,
            command.pricePerPerson
        );

        return this.unitOfWork.excursions.add(excursion);
    }

    public async book(command: BookExcursionCommand): Promise<ExcursionBooking> {
        await this.unitOfWork.begin();

        try {
            const excursion = await this.unitOfWork.excursions.getById(command.excursionId);

            if (!excursion) {
                throw new Error('Excursion not found.');
            }

            if (command.participantsCount <= 0) {
                throw new Error('Participants count must be greater than zero.');
            }

            if (!excursion.hasCapacity(command.participantsCount)) {
                throw new Error('Excursion has no free capacity for the requested number of participants.');
            }

            const updatedExcursion = new Excursion(
                excursion.id,
                excursion.title,
                excursion.expositionId,
                excursion.format,
                excursion.scheduledAt,
                excursion.durationMinutes,
                excursion.maxParticipants,
                excursion.bookedParticipants + command.participantsCount,
                excursion.pricePerPerson
            );

            await this.unitOfWork.excursions.update(updatedExcursion);

            const totalPrice = command.participantsCount * excursion.pricePerPerson;
            const bookingStatus =
                excursion.format === ExcursionFormat.Regular ? BookingStatus.Confirmed : BookingStatus.Requested;

            const booking = new ExcursionBooking(
                '',
                excursion.id,
                command.visitorName,
                command.participantsCount,
                command.requestedDate,
                bookingStatus,
                totalPrice
            );

            const savedBooking = await this.unitOfWork.excursionBookings.add(booking);
            await this.unitOfWork.commit();

            return savedBooking;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}
