import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'exhibition_schedules' })
export class ExhibitionScheduleEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public expositionId!: string;

    @Column('datetime')
    public startsAt!: Date;

    @Column('datetime')
    public endsAt!: Date;

    @Column()
    public openingHour!: string;

    @Column()
    public closingHour!: string;
}
