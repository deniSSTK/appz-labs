import { museumDataSource } from './dal/data-source';
import { TypeOrmUnitOfWork } from './dal/unit-of-work/TypeOrmUnitOfWork';
import { ExpositionService } from './bll/services/ExpositionService';
import { ScheduleService } from './bll/services/ScheduleService';
import { VisitService } from './bll/services/VisitService';
import { ExcursionService } from './bll/services/ExcursionService';
import { createMuseumApi } from './api/createMuseumApi';
import { AudienceType, ExcursionFormat } from './shared/enums';

export async function bootstrapMuseumApplication() {
    if (!museumDataSource.isInitialized) {
        await museumDataSource.initialize();
    }

    const unitOfWork = new TypeOrmUnitOfWork(museumDataSource);
    const expositionService = new ExpositionService(unitOfWork);
    const scheduleService = new ScheduleService(unitOfWork);
    const visitService = new VisitService(unitOfWork);
    const excursionService = new ExcursionService(unitOfWork);

    const seededExpositions = await expositionService.getAll();

    if (seededExpositions.length === 0) {
        const ancientHistory = await expositionService.create({
            title: 'Ancient Civilizations',
            theme: 'History',
            audienceType: AudienceType.Adult,
            hall: 'Hall A',
            baseTicketPrice: 220,
            description: 'Artifacts and reconstructions from Egypt, Greece and Rome.'
        });

        const scienceForKids = await expositionService.create({
            title: 'Science For Kids',
            theme: 'Interactive Science',
            audienceType: AudienceType.Child,
            hall: 'Hall B',
            baseTicketPrice: 160,
            description: 'Hands-on demonstrations designed for younger visitors.'
        });

        await scheduleService.create({
            expositionId: ancientHistory.id,
            startsAt: new Date('2026-04-01T00:00:00.000Z'),
            endsAt: new Date('2026-12-31T23:59:59.000Z'),
            openingHour: '09:00',
            closingHour: '18:00'
        });

        await scheduleService.create({
            expositionId: scienceForKids.id,
            startsAt: new Date('2026-04-01T00:00:00.000Z'),
            endsAt: new Date('2026-10-31T23:59:59.000Z'),
            openingHour: '10:00',
            closingHour: '17:00'
        });

        await excursionService.create({
            title: 'Daily Museum Highlights',
            expositionId: ancientHistory.id,
            format: ExcursionFormat.Regular,
            scheduledAt: new Date('2026-04-10T11:00:00.000Z'),
            durationMinutes: 90,
            maxParticipants: 20,
            pricePerPerson: 300
        });

        await excursionService.create({
            title: 'Custom Family Tour',
            expositionId: scienceForKids.id,
            format: ExcursionFormat.Custom,
            scheduledAt: null,
            durationMinutes: 60,
            maxParticipants: 10,
            pricePerPerson: 260
        });
    }

    const app = createMuseumApi({
        expositionService,
        scheduleService,
        visitService,
        excursionService
    });

    return {
        app,
        services: {
            expositionService,
            scheduleService,
            visitService,
            excursionService
        }
    };
}
