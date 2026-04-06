import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ExpositionEntity } from './entities/ExpositionEntity';
import { ExhibitionScheduleEntity } from './entities/ExhibitionScheduleEntity';
import { VisitRecordEntity } from './entities/VisitRecordEntity';
import { ExcursionEntity } from './entities/ExcursionEntity';
import { ExcursionBookingEntity } from './entities/ExcursionBookingEntity';

export const museumDataSource = new DataSource({
    type: 'sqljs',
    synchronize: true,
    logging: false,
    entities: [
        ExpositionEntity,
        ExhibitionScheduleEntity,
        VisitRecordEntity,
        ExcursionEntity,
        ExcursionBookingEntity
    ]
});
