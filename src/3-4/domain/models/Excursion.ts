import { ExcursionType } from '../enums/ExcursionType';

export class Excursion {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly expositionId: string,
    public readonly type: ExcursionType,
    public readonly scheduledAt: Date | null,
    public readonly durationMinutes: number,
    public readonly maxParticipants: number,
    public readonly pricePerPerson: number
  ) {}
}
