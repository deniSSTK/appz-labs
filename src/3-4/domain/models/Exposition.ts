import { AudienceType } from '../enums/AudienceType';

export class Exposition {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly theme: string,
        public readonly audienceType: AudienceType,
        public readonly hall: string,
        public readonly ticketPrice: number,
        public readonly description: string
    ) {}
}
