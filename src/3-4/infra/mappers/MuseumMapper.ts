import { Exposition } from '../../domain/models/Exposition';
import { ExhibitionSchedule } from '../../domain/models/ExhibitionSchedule';
import { Excursion } from '../../domain/models/Excursion';
import { ExpositionEntity } from '../../repositories/entities/ExpositionEntity';
import { ExhibitionScheduleEntity } from '../../repositories/entities/ExhibitionScheduleEntity';
import { ExcursionEntity } from '../../repositories/entities/ExcursionEntity';
import { ExpositionResponseDto } from '../../dto/responses/ExpositionResponseDto';
import { ScheduleResponseDto } from '../../dto/responses/ScheduleResponseDto';
import { ExcursionResponseDto } from '../../dto/responses/ExcursionResponseDto';

export class MuseumMapper {
  public static toExpositionDomain(entity: ExpositionEntity): Exposition {
    return new Exposition(
      entity.id,
      entity.title,
      entity.theme,
      entity.audienceType,
      entity.hall,
      entity.ticketPrice,
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
    entity.ticketPrice = model.ticketPrice;
    entity.description = model.description;
    return entity;
  }

  public static toExpositionDto(model: Exposition): ExpositionResponseDto {
    return {
      id: model.id,
      title: model.title,
      theme: model.theme,
      audienceType: model.audienceType,
      hall: model.hall,
      ticketPrice: model.ticketPrice,
      description: model.description
    };
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

  public static toScheduleDto(model: ExhibitionSchedule): ScheduleResponseDto {
    return {
      id: model.id,
      expositionId: model.expositionId,
      startsAt: model.startsAt.toISOString(),
      endsAt: model.endsAt.toISOString(),
      openingHour: model.openingHour,
      closingHour: model.closingHour
    };
  }

  public static toExcursionDomain(entity: ExcursionEntity): Excursion {
    return new Excursion(
      entity.id,
      entity.title,
      entity.expositionId,
      entity.type,
      entity.scheduledAt,
      entity.durationMinutes,
      entity.maxParticipants,
      entity.pricePerPerson
    );
  }

  public static toExcursionEntity(model: Excursion): ExcursionEntity {
    const entity = new ExcursionEntity();
    entity.id = model.id;
    entity.title = model.title;
    entity.expositionId = model.expositionId;
    entity.type = model.type;
    entity.scheduledAt = model.scheduledAt;
    entity.durationMinutes = model.durationMinutes;
    entity.maxParticipants = model.maxParticipants;
    entity.pricePerPerson = model.pricePerPerson;
    return entity;
  }

  public static toExcursionDto(model: Excursion): ExcursionResponseDto {
    return {
      id: model.id,
      title: model.title,
      expositionId: model.expositionId,
      type: model.type,
      scheduledAt: model.scheduledAt?.toISOString() ?? null,
      durationMinutes: model.durationMinutes,
      maxParticipants: model.maxParticipants,
      pricePerPerson: model.pricePerPerson
    };
  }
}
