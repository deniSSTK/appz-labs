import { VisitPlan, VisitPriceBreakdown, VisitRecord } from '../models/VisitPlan';

export interface IVisitService {
    calculatePrice(plan: VisitPlan): Promise<VisitPriceBreakdown>;
    planVisit(plan: VisitPlan): Promise<VisitRecord>;
}
