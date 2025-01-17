import { Property } from '../entities/property';

export abstract class PropertiesRepository {
  abstract create(property: Property): Promise<void>;
  abstract getById(id: string): Promise<Property | null>;
  abstract findMany(): Promise<Property[]>;
  abstract update(property: Property): Promise<void>;
}
