export interface VisitPriceDto {
    ticketSubtotal: number;
    audienceDiscount: number;
    weekendMarkup: number;
    guideFee: number;
    total: number;
}

export interface VisitRecordDto {
    id: string;
    visitDate: string;
    audienceType: string;
    visitorsCount: number;
    expositionIds: string[];
    needsGuide: boolean;
    totalPrice: number;
}
