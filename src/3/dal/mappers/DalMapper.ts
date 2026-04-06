import { Exposition } from '../../bll/models/Exposition';
import { ExhibitionSchedule } from '../../bll/models/ExhibitionSchedule';
import { Excursion, ExcursionBooking } from '../../bll/models/Excursion';
import { VisitRecord } from '../../bll/models/VisitPlan';
import { ExpositionEntity } from '../entities/ExpositionEntity';
import { ExhibitionScheduleEntity } from '../entities/ExhibitionScheduleEntity';
import { VisitRecordEntity } from '../entities/VisitRecordEntity';
import { ExcursionEntity } from '../entities/ExcursionEntity';
import { ExcursionBookingEntity } from '../entities/ExcursionBookingEntity';

export class DalMapper {
    public static toExpositionDomain(entity: ExpositionEntity): Exposition {
        return new Exposition(
            entity.id,
            entity.title,
            entity.theme,
            entity.audienceType,
            entity.hall,
            entity.baseTicketPrice,
            entity.description
        );
    }

    public static toExpositionEntity(model: Exposition): ExpositionEntity {
        const entity = new ExpositionEntity();
        entity.id = model.id;
        entity.title = model.title;
        entity.theme = model.theme;
        entity.audienceType = model.audienceType;
        entity.hall = model.hall;
        entity.baseTicketPrice = model.baseTicketPrice;
        entity.description = model.description;
        return entity;
    }

    public static toScheduleDomain(entity: ExhibitionScheduleEntity): ExhibitionSchedule {
        return new ExhibitionSchedule(
            entity.id,
            entity.expositionId,
            entity.startsAt,
            entity.endsAt,
            entity.openingHour,
            entity.closingHour
        );
    }

    public static toScheduleEntity(model: ExhibitionSchedule): ExhibitionScheduleEntity {
        const entity = new ExhibitionScheduleEntity();
        entity.id = model.id;
        entity.expositionId = model.expositionId;
        entity.startsAt = model.startsAt;
        entity.endsAt = model.endsAt;
        entity.openingHour = model.openingHour;
        entity.closingHour = model.closingHour;
        return entity;
    }

    public static toVisitDomain(entity: VisitRecordEntity): VisitRecord {
        return new VisitRecord(
            entity.id,
            entity.visitDate,
            entity.audienceType,
            entity.visitorsCount,
            entity.expositionIds,
            entity.needsGuide,
            entity.totalPrice
        );
    }

    public static toVisitEntity(model: VisitRecord): VisitRecordEntity {
        const entity = new VisitRecordEntity();
        entity.id = model.id;
        entity.visitDate = model.visitDate;
        entity.audienceType = model.audienceType;
        entity.visitorsCount = model.visitorsCount;
        entity.expositionIds = model.expositionIds;
        entity.needsGuide = model.needsGuide;
        entity.totalPrice = model.totalPrice;
        return entity;
    }

    public static toExcursionDomain(entity: ExcursionEntity): Excursion {
        return new Excursion(
            entity.id,
            entity.title,
            entity.expositionId,
            entity.format,
            entity.scheduledAt,
            entity.durationMinutes,
            entity.maxParticipants,
            entity.bookedParticipants,
            entity.pricePerPerson
        );
    }

    public static toExcursionEntity(model: Excursion): ExcursionEntity {
        const entity = new ExcursionEntity();
        entity.id = model.id;
        entity.title = model.title;
        entity.expositionId = model.expositionId;
        entity.format = model.format;
        entity.scheduledAt = model.scheduledAt;
        entity.durationMinutes = model.durationMinutes;
        entity.maxParticipants = model.maxParticipants;
        entity.bookedParticipants = model.bookedParticipants;
        entity.pricePerPerson = model.pricePerPerson;
        return entity;
    }

    public static toExcursionBookingDomain(entity: ExcursionBookingEntity): ExcursionBooking {
        return new ExcursionBooking(
            entity.id,
            entity.excursionId,
            entity.visitorName,
            entity.participantsCount,
            entity.requestedDate,
            entity.status,
            entity.totalPrice
        );
    }

    public static toExcursionBookingEntity(model: ExcursionBooking): ExcursionBookingEntity {
        const entity = new ExcursionBookingEntity();
        entity.id = model.id;
        entity.excursionId = model.excursionId;
        entity.visitorName = model.visitorName;
        entity.participantsCount = model.participantsCount;
        entity.requestedDate = model.requestedDate;
        entity.status = model.status;
        entity.totalPrice = model.totalPrice;
        return entity;
    }
}
