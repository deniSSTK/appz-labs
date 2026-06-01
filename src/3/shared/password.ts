import crypto from 'crypto';

export function createPasswordHash(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  return createPasswordHash(password) === passwordHash;
}
