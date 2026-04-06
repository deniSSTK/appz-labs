import { AudienceType } from '../../domain/enums/AudienceType';

export interface CreateExpositionDto {
  title: string;
  theme: string;
  audienceType: AudienceType;
  hall: string;
  ticketPrice: number;
  description: string;
}
