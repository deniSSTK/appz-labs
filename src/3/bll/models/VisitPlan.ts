import { AudienceType } from '../../shared/enums';

export interface VisitPlan {
    visitDate: Date;
    audienceType: AudienceType;
    expositionIds: string[];
    visitorsCount: number;
    needsGuide: boolean;
}

export interface VisitPriceBreakdown {
    ticketSubtotal: number;
    audienceDiscount: number;
    weekendMarkup: number;
    guideFee: number;
    total: number;
}

export class VisitRecord {
    constructor(
        public readonly id: string,
        public readonly visitDate: Date,
        public readonly audienceType: AudienceType,
        public readonly visitorsCount: number,
        public readonly expositionIds: string[],
        public readonly needsGuide: boolean,
        public readonly totalPrice: number
    ) {}
}
