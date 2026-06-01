import { Identifiable } from '../interfaces/Identifiable';

export interface PostEntity extends Identifiable {
  title: string;
  content: string;
  categoryId: number;
  authorUserId: number;
  createdAt: string;
  updatedAt: string;
}
