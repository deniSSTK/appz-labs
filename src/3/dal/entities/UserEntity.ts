import { Identifiable } from '../interfaces/Identifiable';

export interface UserEntity extends Identifiable {
  username: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}
