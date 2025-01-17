import { Producer } from '../../domain/entities/producer';
import { UniqueEntityID } from '../../domain/entities/utils/unique-entity-id';
import { ProducersRepository } from '../../domain/repositories/producers-repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertiesRepository } from '../../domain/repositories/properties-repository';

type CreateInput = {
  name: string;
  cpfCnpj: string;
  propertiesIds?: string[];
};

type UpdateInput = {
  id: string;
  name?: string;
  propertiesIds: string[];
};

@Injectable()
export class ProducersService {
  constructor(
    private producersRepository: ProducersRepository,
    private propertiesRepository: PropertiesRepository,
  ) {}

  async create({ name, cpfCnpj, propertiesIds }: CreateInput): Promise<void> {
    const producerExists = await this.producersRepository.getByCpfCnpj(cpfCnpj);

    if (producerExists) {
      throw new ConflictException('Producer already exists!');
    }

    await this.checkPropertiesExists(propertiesIds);

    const producer = Producer.create({
      name,
      cpfCnpj,
      propertiesIds:
        propertiesIds && propertiesIds.length
          ? propertiesIds.map((id) => new UniqueEntityID(id))
          : [],
    });

    await this.producersRepository.create(producer);
  }

  async update({ id, name, propertiesIds }: UpdateInput): Promise<void> {
    const producer = await this.producersRepository.getById(id);

    if (!producer) {
      throw new NotFoundException('Producer does not exist!');
    }

    await this.checkPropertiesExists(propertiesIds);

    producer.name = name ?? producer.name;
    producer.propertiesIds =
      propertiesIds.map((id) => new UniqueEntityID(id)) ??
      producer.propertiesIds;

    await this.producersRepository.update(producer);
  }

  async getById(id: string): Promise<Producer> {
    const producer = await this.producersRepository.getById(id);

    if (!producer) {
      throw new NotFoundException('Producer does not exist!');
    }

    return producer;
  }

  async findMany(): Promise<Producer[]> {
    const producers = await this.producersRepository.findMany();

    if (!producers.length) {
      throw new NotFoundException('No producers found!');
    }

    return producers;
  }

  private async checkPropertiesExists(propertiesIds) {
    if (propertiesIds && propertiesIds.length) {
      const properties = await Promise.all(
        propertiesIds.map((id) => this.propertiesRepository.getById(id)),
      );

      const notFoundPropertiesIds = properties.flatMap((p, idx) =>
        !p ? propertiesIds[idx] : [],
      );

      if (notFoundPropertiesIds.length) {
        throw new NotFoundException(
          `Some of the properties ids you've passed were not found ${notFoundPropertiesIds.join(', ')}`,
        );
      }
    }
  }
}
