export interface ExcursionResponseDto {
  id: string;
  title: string;
  expositionId: string;
  type: string;
  scheduledAt: string | null;
  durationMinutes: number;
  maxParticipants: number;
  pricePerPerson: number;
}
