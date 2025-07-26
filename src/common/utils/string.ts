import { randomBytes } from 'crypto';

export function generateRandomString(length = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const bytes = randomBytes(length);

  let result = '';

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % charactersLength;

    result += characters.charAt(index);
  }

  return result;
}
