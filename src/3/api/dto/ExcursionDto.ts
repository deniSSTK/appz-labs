export interface ExcursionDto {
    id: string;
    title: string;
    expositionId: string;
    format: string;
    scheduledAt: string | null;
    durationMinutes: number;
    maxParticipants: number;
    bookedParticipants: number;
    pricePerPerson: number;
}

export interface ExcursionBookingDto {
    id: string;
    excursionId: string;
    visitorName: string;
    participantsCount: number;
    requestedDate: string | null;
    status: string;
    totalPrice: number;
}
