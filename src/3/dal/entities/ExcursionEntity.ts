import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExcursionFormat } from '../../shared/enums';

@Entity({ name: 'excursions' })
export class ExcursionEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public title!: string;

    @Column()
    public expositionId!: string;

    @Column({ type: 'varchar' })
    public format!: ExcursionFormat;

    @Column('datetime', { nullable: true })
    public scheduledAt!: Date | null;

    @Column('int')
    public durationMinutes!: number;

    @Column('int')
    public maxParticipants!: number;

    @Column('int')
    public bookedParticipants!: number;

    @Column('float')
    public pricePerPerson!: number;
}
