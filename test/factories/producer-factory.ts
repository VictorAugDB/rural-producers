import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { Producer, ProducerProps } from '../../src/domain/entities/producer';
import { UniqueEntityID } from '../../src/domain/entities/utils/unique-entity-id';
import { PrismaService } from '../../src/database/repositories/prisma.service';
import { PrismaProducerMapper } from '../../src/database/repositories/prisma/mappers/producer';
import { generateFakeCPF } from '../utils/fake-cpf';

export function makeProducer(
  override: Partial<ProducerProps> = {},
  id?: UniqueEntityID,
) {
  const producer = Producer.create(
    {
      name: faker.person.fullName(),
      cpfCnpj: generateFakeCPF(),
      propertiesIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return producer;
}

@Injectable()
export class ProducerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProducer(
    data: Partial<ProducerProps> = {},
  ): Promise<Producer> {
    const producer = makeProducer(data);

    await this.prisma.producer.create({
      data: PrismaProducerMapper.toPrisma(producer),
    });

    return producer;
  }
}
