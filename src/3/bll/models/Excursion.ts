import { BookingStatus, ExcursionFormat } from '../../shared/enums';

export class Excursion {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly expositionId: string,
        public readonly format: ExcursionFormat,
        public readonly scheduledAt: Date | null,
        public readonly durationMinutes: number,
        public readonly maxParticipants: number,
        public readonly bookedParticipants: number,
        public readonly pricePerPerson: number
    ) {}

    public hasCapacity(requestedParticipants: number): boolean {
        return this.bookedParticipants + requestedParticipants <= this.maxParticipants;
    }
}

export class ExcursionBooking {
    constructor(
        public readonly id: string,
        public readonly excursionId: string,
        public readonly visitorName: string,
        public readonly participantsCount: number,
        public readonly requestedDate: Date | null,
        public readonly status: BookingStatus,
        public readonly totalPrice: number
    ) {}
}
