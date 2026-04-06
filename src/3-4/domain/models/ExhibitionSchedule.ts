export class ExhibitionSchedule {
    constructor(
        public readonly id: string,
        public readonly expositionId: string,
        public readonly startsAt: Date,
        public readonly endsAt: Date,
        public readonly openingHour: string,
        public readonly closingHour: string
    ) {}
}
