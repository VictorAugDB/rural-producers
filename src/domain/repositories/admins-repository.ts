import { Admin } from '../entities/Admin';

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract getById(id: string): Promise<Admin | null>;
  abstract getByEmail(email: string): Promise<Admin | null>;
}
