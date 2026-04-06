import express, { Express, NextFunction, Request, Response } from 'express';
import { IExpositionService } from '../bll/contracts/IExpositionService';
import { IScheduleService } from '../bll/contracts/IScheduleService';
import { IVisitService } from '../bll/contracts/IVisitService';
import { IExcursionService } from '../bll/contracts/IExcursionService';
import { ExpositionController } from './controllers/ExpositionController';
import { ScheduleController } from './controllers/ScheduleController';
import { VisitController } from './controllers/VisitController';
import { ExcursionController } from './controllers/ExcursionController';

export interface MuseumApiDependencies {
    expositionService: IExpositionService;
    scheduleService: IScheduleService;
    visitService: IVisitService;
    excursionService: IExcursionService;
}

export function createMuseumApi(dependencies: MuseumApiDependencies): Express {
    const app = express();
    app.use(express.json());

    const expositionController = new ExpositionController(dependencies.expositionService);
    const scheduleController = new ScheduleController(dependencies.scheduleService);
    const visitController = new VisitController(dependencies.visitService);
    const excursionController = new ExcursionController(dependencies.excursionService);

    app.get('/health', (_request, response) => {
        response.json({ status: 'ok', module: 'lab-3' });
    });

    app.use('/api/expositions', expositionController.router);
    app.use('/api/schedules', scheduleController.router);
    app.use('/api/visits', visitController.router);
    app.use('/api/excursions', excursionController.router);

    app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
        response.status(400).json({ message: error.message });
    });

    return app;
}
