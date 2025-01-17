import { Producer } from '../entities/Producer';

export abstract class ProducersRepository {
  abstract create(producer: Producer): Promise<void>;
  abstract getById(id: string): Promise<Producer | null>;
  abstract getByCpfCnpj(value: string): Promise<Producer | null>;
  abstract findMany(): Promise<Producer[]>;
  abstract update(producer: Partial<Omit<Producer, 'id'>>): Promise<void>;
}
