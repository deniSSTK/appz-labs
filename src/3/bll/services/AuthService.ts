import { inject, injectable } from 'inversify';
import { IUnitOfWork } from '../../dal/interfaces/IUnitOfWork';
import { createPasswordHash, verifyPassword } from '../../shared/password';
import { RegisterUserInput } from '../inputs/RegisterUserInput';
import { LoginUserInput } from '../inputs/LoginUserInput';
import { AuthenticationError, ValidationError } from '../errors/ServiceErrors';
import { UserDto } from '../dto/UserDto';
import { toUserDto } from '../mappers/BlogMapper';
import { TYPES } from '../../di/types';

@injectable()
export class AuthService {
  private currentUserId: number | null = null;

  public constructor(@inject(TYPES.UnitOfWork) private readonly unitOfWork: IUnitOfWork) {}

  public async register(input: RegisterUserInput): Promise<UserDto> {
    this.validateUsername(input.username);
    this.validateDisplayName(input.displayName);
    this.validatePassword(input.password);

    const existing = await this.unitOfWork.users.find(
      (user) => user.username.toLowerCase() === input.username.toLowerCase()
    );
    if (existing.length > 0) {
      throw new ValidationError('Username is already taken');
    }

    const now = new Date().toISOString();
    const user = await this.unitOfWork.users.add({
      username: input.username.trim(),
      displayName: input.displayName.trim(),
      passwordHash: createPasswordHash(input.password),
      createdAt: now,
      updatedAt: now
    });
    await this.unitOfWork.saveChanges();
    this.currentUserId = user.id;
    return toUserDto(user);
  }

  public async login(input: LoginUserInput): Promise<UserDto> {
    this.validateUsername(input.username);
    this.validatePassword(input.password);

    const user = await this.findUserByUsername(input.username);
    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new AuthenticationError('Invalid username or password');
    }

    this.currentUserId = user.id;
    return toUserDto(user);
  }

  public logout(): void {
    this.currentUserId = null;
  }

  public async getCurrentUser(): Promise<UserDto | null> {
    if (this.currentUserId === null) {
      return null;
    }
    const user = await this.unitOfWork.users.getById(this.currentUserId);
    return user ? toUserDto(user) : null;
  }

  public async requireCurrentUserId(): Promise<number> {
    if (this.currentUserId === null) {
      throw new AuthenticationError('You must be signed in to perform this action');
    }
    return this.currentUserId;
  }

  public isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }

  private async findUserByUsername(username: string) {
    const users = await this.unitOfWork.users.find(
      (user) => user.username.toLowerCase() === username.trim().toLowerCase()
    );
    return users[0];
  }

  private validateUsername(username: string): void {
    if (username.trim().length < 3) {
      throw new ValidationError('Username must contain at least 3 characters');
    }
  }

  private validateDisplayName(displayName: string): void {
    if (displayName.trim().length < 2) {
      throw new ValidationError('Display name must contain at least 2 characters');
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 6) {
      throw new ValidationError('Password must contain at least 6 characters');
    }
  }
}
