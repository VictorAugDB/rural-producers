import { Crop } from '../entities/Crop';

export type CheckExistsProps = {
  name: string;
  propertyId: string;
  season: string;
};

export abstract class CropsRepository {
  abstract create(crop: Crop): Promise<void>;
  abstract getById(id: string): Promise<Crop | null>;
  abstract checkExists(props: CheckExistsProps): Promise<boolean>;
  abstract findMany(): Promise<Crop[]>;
  abstract update(crop: Partial<Omit<Crop, 'id'>>): Promise<void>;
}
