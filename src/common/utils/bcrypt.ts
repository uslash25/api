import bcrypt from 'bcryptjs';

export async  function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, 10);
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
