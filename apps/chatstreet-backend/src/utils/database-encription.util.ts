import bcrypt from 'bcryptjs';

export default class DatabaseEncriptionUtil {
  private static readonly saltRounts: number = 10;

  public static async encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounts).then((hash: string) => hash);
  }
  public static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash).then((isSame: boolean) => isSame);
  }
}
