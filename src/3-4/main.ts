import { createApp } from './create-app';
import { museumDataSource } from './infra/database/data-source';
import { container } from './infra/di/inversify.config';
import { TYPES } from './infra/di/types';
import { IMuseumService } from './services/interfaces/IMuseumService';
import { IExcursionService } from './services/interfaces/IExcursionService';
import { IScheduleService } from './services/interfaces/IScheduleService';
import { AudienceType } from './domain/enums/AudienceType';
import { ExcursionType } from './domain/enums/ExcursionType';

async function seedData(): Promise<void> {
    if (!museumDataSource.isInitialized) {
        await museumDataSource.initialize();
    }

    const museumService = container.get<IMuseumService>(TYPES.MuseumService);
    const scheduleService = container.get<IScheduleService>(TYPES.ScheduleService);
    const excursionService = container.get<IExcursionService>(TYPES.ExcursionService);
    const existing = await museumService.getAllExpositions();

    if (existing.length > 0) {
        return;
    }

    const ancientExpo = await museumService.createExposition({
        title: 'Ancient Civilizations',
        theme: 'History',
        audienceType: AudienceType.Adult,
        hall: 'Hall A',
        ticketPrice: 220,
        description: 'Artifacts and reconstructions from ancient empires.'
    });

    const familyExpo = await museumService.createExposition({
        title: 'Family Discovery Zone',
        theme: 'Interactive Science',
        audienceType: AudienceType.Child,
        hall: 'Hall B',
        ticketPrice: 160,
        description: 'Interactive exhibits for children and school groups.'
    });

    await scheduleService.createSchedule({
        expositionId: ancientExpo.id,
        startsAt: '2026-04-01T09:00:00.000Z',
        endsAt: '2026-12-31T18:00:00.000Z',
        openingHour: '09:00',
        closingHour: '18:00'
    });

    await scheduleService.createSchedule({
        expositionId: familyExpo.id,
        startsAt: '2026-04-01T10:00:00.000Z',
        endsAt: '2026-10-31T17:00:00.000Z',
        openingHour: '10:00',
        closingHour: '17:00'
    });

    await excursionService.createExcursion({
        title: 'Daily Highlights Tour',
        expositionId: ancientExpo.id,
        type: ExcursionType.Regular,
        scheduledAt: '2026-04-10T11:00:00.000Z',
        durationMinutes: 90,
        maxParticipants: 20,
        pricePerPerson: 300
    });

    await excursionService.createExcursion({
        title: 'Custom Family Tour',
        expositionId: familyExpo.id,
        type: ExcursionType.Custom,
        scheduledAt: null,
        durationMinutes: 60,
        maxParticipants: 12,
        pricePerPerson: 250
    });
}

async function main(): Promise<void> {
    await seedData();
    const app = createApp();
    const port = 3004;
    const endpoints = [
        'GET    /health',
        'GET    /api/expositions',
        'GET    /api/expositions/:id',
        'POST   /api/expositions',
        'PUT    /api/expositions/:id',
        'DELETE /api/expositions/:id',
        'GET    /api/schedules',
        'POST   /api/schedules',
        'GET    /api/excursions',
        'POST   /api/excursions'
    ];

    app.listen(port, () => {
        console.log(`Museum API is running on http://localhost:${port}`);
        console.log('Available endpoints:');
        endpoints.forEach(endpoint => console.log(`  ${endpoint}`));
    });
}

main().catch(error => {
    console.error('Failed to start museum application:', error);
    process.exit(1);
});
