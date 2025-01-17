import {
  Prisma,
  Producer as PrismaProducer,
  Property as PrismaProperty,
} from '@prisma/client';
import { Producer } from '../../../../domain/entities/producer';
import { UniqueEntityID } from '../../../../domain/entities/utils/unique-entity-id';

type ProducerWithProperties = PrismaProducer & {
  properties?: PrismaProperty[];
};

export class PrismaProducerMapper {
  static toDomain(raw: ProducerWithProperties): Producer {
    return Producer.create(
      {
        name: raw.name,
        cpfCnpj: raw.cpfCnpj,
        propertiesIds: raw.properties
          ? raw.properties.map((p) => new UniqueEntityID(p.id))
          : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(producer: Producer): Prisma.ProducerUncheckedCreateInput {
    return {
      id: producer.id.toString(),
      name: producer.name,
      cpfCnpj: producer.cpfCnpj,
      createdAt: producer.createdAt,
      updatedAt: producer.updatedAt,
      properties: producer.propertiesIds.length
        ? {
            connect: producer.propertiesIds.map((p) => ({
              id: p.toString(),
            })),
          }
        : undefined,
    };
  }
}
