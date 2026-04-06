import { ExcursionType } from '../../domain/enums/ExcursionType';

export interface CreateExcursionDto {
  title: string;
  expositionId: string;
  type: ExcursionType;
  scheduledAt: string | null;
  durationMinutes: number;
  maxParticipants: number;
  pricePerPerson: number;
}
