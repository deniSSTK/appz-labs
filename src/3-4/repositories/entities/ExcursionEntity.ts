import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExcursionType } from '../../domain/enums/ExcursionType';

@Entity({ name: 'excursions' })
export class ExcursionEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public title!: string;

    @Column()
    public expositionId!: string;

    @Column({ type: 'varchar' })
    public type!: ExcursionType;

    @Column('datetime', { nullable: true })
    public scheduledAt!: Date | null;

    @Column('int')
    public durationMinutes!: number;

    @Column('int')
    public maxParticipants!: number;

    @Column('float')
    public pricePerPerson!: number;
}
