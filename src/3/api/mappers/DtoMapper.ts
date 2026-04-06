import { Exposition } from '../../bll/models/Exposition';
import { ExhibitionSchedule } from '../../bll/models/ExhibitionSchedule';
import { Excursion, ExcursionBooking } from '../../bll/models/Excursion';
import { VisitPriceBreakdown, VisitRecord } from '../../bll/models/VisitPlan';
import { ExpositionDto } from '../dto/ExpositionDto';
import { ScheduleDto } from '../dto/ScheduleDto';
import { ExcursionBookingDto, ExcursionDto } from '../dto/ExcursionDto';
import { VisitPriceDto, VisitRecordDto } from '../dto/VisitDto';

export class DtoMapper {
    public static toExpositionDto(model: Exposition): ExpositionDto {
        return {
            id: model.id,
            title: model.title,
            theme: model.theme,
            audienceType: model.audienceType,
            hall: model.hall,
            baseTicketPrice: model.baseTicketPrice,
            description: model.description
        };
    }

    public static toScheduleDto(model: ExhibitionSchedule): ScheduleDto {
        return {
            id: model.id,
            expositionId: model.expositionId,
            startsAt: model.startsAt.toISOString(),
            endsAt: model.endsAt.toISOString(),
            openingHour: model.openingHour,
            closingHour: model.closingHour
        };
    }

    public static toVisitPriceDto(model: VisitPriceBreakdown): VisitPriceDto {
        return { ...model };
    }

    public static toVisitRecordDto(model: VisitRecord): VisitRecordDto {
        return {
            id: model.id,
            visitDate: model.visitDate.toISOString(),
            audienceType: model.audienceType,
            visitorsCount: model.visitorsCount,
            expositionIds: model.expositionIds,
            needsGuide: model.needsGuide,
            totalPrice: model.totalPrice
        };
    }

    public static toExcursionDto(model: Excursion): ExcursionDto {
        return {
            id: model.id,
            title: model.title,
            expositionId: model.expositionId,
            format: model.format,
            scheduledAt: model.scheduledAt?.toISOString() ?? null,
            durationMinutes: model.durationMinutes,
            maxParticipants: model.maxParticipants,
            bookedParticipants: model.bookedParticipants,
            pricePerPerson: model.pricePerPerson
        };
    }

    public static toExcursionBookingDto(model: ExcursionBooking): ExcursionBookingDto {
        return {
            id: model.id,
            excursionId: model.excursionId,
            visitorName: model.visitorName,
            participantsCount: model.participantsCount,
            requestedDate: model.requestedDate?.toISOString() ?? null,
            status: model.status,
            totalPrice: model.totalPrice
        };
    }
}
