import { IUnitOfWork } from '../contracts/IUnitOfWork';
import { IVisitService } from '../contracts/IVisitService';
import { VisitPlan, VisitPriceBreakdown, VisitRecord } from '../models/VisitPlan';
import { AudienceType } from '../../shared/enums';

const AUDIENCE_COEFFICIENTS: Record<AudienceType, number> = {
    [AudienceType.Adult]: 1,
    [AudienceType.Child]: 0.5,
    [AudienceType.Student]: 0.8,
    [AudienceType.Senior]: 0.7,
    [AudienceType.Tourist]: 1.2
};

const GUIDE_FEE = 150;
const WEEKEND_MARKUP = 0.1;

export class VisitService implements IVisitService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    public async calculatePrice(plan: VisitPlan): Promise<VisitPriceBreakdown> {
        if (plan.expositionIds.length === 0) {
            throw new Error('At least one exposition must be selected.');
        }

        if (plan.visitorsCount <= 0) {
            throw new Error('Visitors count must be greater than zero.');
        }

        const expositions = await Promise.all(
            plan.expositionIds.map(id => this.unitOfWork.expositions.getById(id))
        );

        if (expositions.some(exposition => exposition === null)) {
            throw new Error('One of the selected expositions does not exist.');
        }

        const ticketSubtotal =
            expositions.reduce((sum, exposition) => sum + (exposition?.baseTicketPrice ?? 0), 0) *
            plan.visitorsCount;
        const discountedSubtotal = ticketSubtotal * AUDIENCE_COEFFICIENTS[plan.audienceType];
        const audienceDiscount = ticketSubtotal - discountedSubtotal;
        const isWeekend = plan.visitDate.getDay() === 0 || plan.visitDate.getDay() === 6;
        const weekendMarkup = isWeekend ? discountedSubtotal * WEEKEND_MARKUP : 0;
        const guideFee = plan.needsGuide ? GUIDE_FEE : 0;
        const total = discountedSubtotal + weekendMarkup + guideFee;

        return {
            ticketSubtotal,
            audienceDiscount,
            weekendMarkup,
            guideFee,
            total
        };
    }

    public async planVisit(plan: VisitPlan): Promise<VisitRecord> {
        await this.unitOfWork.begin();

        try {
            const breakdown = await this.calculatePrice(plan);
            const visitRecord = new VisitRecord(
                '',
                plan.visitDate,
                plan.audienceType,
                plan.visitorsCount,
                [...plan.expositionIds],
                plan.needsGuide,
                breakdown.total
            );

            const saved = await this.unitOfWork.visits.add(visitRecord);
            await this.unitOfWork.commit();

            return saved;
        } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
        }
    }
}
