import { Identifiable } from '../interfaces/Identifiable';

export interface CategoryEntity extends Identifiable {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
