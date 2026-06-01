import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AudienceType } from '../../domain/enums/AudienceType';

@Entity({ name: 'expositions' })
export class ExpositionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public title!: string;

  @Column()
  public theme!: string;

  @Column({ type: 'varchar' })
  public audienceType!: AudienceType;

  @Column()
  public hall!: string;

  @Column('float')
  public ticketPrice!: number;

  @Column()
  public description!: string;
}
