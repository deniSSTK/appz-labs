import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AudienceType } from '../../shared/enums';

@Entity({ name: 'visit_records' })
export class VisitRecordEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column('datetime')
    public visitDate!: Date;

    @Column({ type: 'varchar' })
    public audienceType!: AudienceType;

    @Column('int')
    public visitorsCount!: number;

    @Column('simple-json')
    public expositionIds!: string[];

    @Column('boolean')
    public needsGuide!: boolean;

    @Column('float')
    public totalPrice!: number;
}
