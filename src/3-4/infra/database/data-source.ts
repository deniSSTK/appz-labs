import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ExpositionEntity } from '../../repositories/entities/ExpositionEntity';
import { ExhibitionScheduleEntity } from '../../repositories/entities/ExhibitionScheduleEntity';
import { ExcursionEntity } from '../../repositories/entities/ExcursionEntity';

export const museumDataSource = new DataSource({
    type: 'sqljs',
    synchronize: true,
    logging: false,
    entities: [ExpositionEntity, ExhibitionScheduleEntity, ExcursionEntity]
});
