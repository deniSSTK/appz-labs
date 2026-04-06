import { AudienceType } from '../../shared/enums';

export class Exposition {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly theme: string,
        public readonly audienceType: AudienceType,
        public readonly hall: string,
        public readonly baseTicketPrice: number,
        public readonly description: string
    ) {}
}
