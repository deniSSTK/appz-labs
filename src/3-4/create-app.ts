import express, { Express, NextFunction, Request, Response } from 'express';
import { container } from './infra/di/inversify.config';
import { TYPES } from './infra/di/types';
import { MuseumController } from './controllers/MuseumController';
import { ScheduleController } from './controllers/ScheduleController';
import { ExcursionController } from './controllers/ExcursionController';

export function createApp(): Express {
    const app = express();
    const museumController = container.get<MuseumController>(TYPES.MuseumController);
    const scheduleController = container.get<ScheduleController>(TYPES.ScheduleController);
    const excursionController = container.get<ExcursionController>(TYPES.ExcursionController);

    app.use(express.json());

    app.get('/health', (_request: Request, response: Response) => {
        response.json({
            success: true,
            message: 'Museum service is running.'
        });
    });

    app.use('/api/expositions', museumController.router);
    app.use('/api/schedules', scheduleController.router);
    app.use('/api/excursions', excursionController.router);

    app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
        response.status(400).json({
            success: false,
            message: error.message
        });
    });

    return app;
}
