import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BookingStatus } from '../../shared/enums';

@Entity({ name: 'excursion_bookings' })
export class ExcursionBookingEntity {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public excursionId!: string;

    @Column()
    public visitorName!: string;

    @Column('int')
    public participantsCount!: number;

    @Column('datetime', { nullable: true })
    public requestedDate!: Date | null;

    @Column({ type: 'varchar' })
    public status!: BookingStatus;

    @Column('float')
    public totalPrice!: number;
}
