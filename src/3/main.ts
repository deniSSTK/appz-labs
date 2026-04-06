import { bootstrapMuseumApplication } from './bootstrap';
import { AudienceType } from './shared/enums';

async function main(): Promise<void> {
    const { app, services } = await bootstrapMuseumApplication();

    const port = 3003;
    app.listen(port, () => {
        console.log(`API is running on http://localhost:${port}`);
        console.log('Available endpoints:');
        console.log('GET  /api/expositions');
        console.log('POST /api/expositions');
        console.log('GET  /api/schedules');
        console.log('POST /api/schedules');
        console.log('POST /api/visits/calculate');
        console.log('POST /api/visits/plan');
        console.log('GET  /api/excursions');
        console.log('POST /api/excursions');
        console.log('POST /api/excursions/book');
    });

    const expositions = await services.expositionService.getAll();
    const calculation = await services.visitService.calculatePrice({
        visitDate: new Date('2026-04-11T12:00:00.000Z'),
        audienceType: AudienceType.Student,
        expositionIds: expositions.slice(0, 2).map(exposition => exposition.id),
        visitorsCount: 2,
        needsGuide: true
    });

    console.log('Demo price calculation for a student visit:', calculation);
}

main().catch(error => {
    console.error('Museum application failed to start:', error);
    process.exit(1);
});
