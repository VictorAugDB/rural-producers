import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { Property, PropertyProps } from '../../src/domain/entities/property';
import { UniqueEntityID } from '../../src/domain/entities/utils/unique-entity-id';
import { PrismaService } from '../../src/database/repositories/prisma.service';
import { PrismaPropertyMapper } from '../../src/database/repositories/prisma/mappers/property';

export function makeProperty(
  override: Partial<PropertyProps> = {},
  id?: UniqueEntityID,
) {
  const property = Property.create(
    {
      name: faker.company.name(),
      city: faker.address.city(),
      state: faker.location.state(),
      totalArea: faker.number.float({ min: 800, max: 1000 }),
      arableArea: faker.number.float({ min: 20, max: 500 }),
      vegetationArea: faker.number.float({
        min: 10,
        max: 300,
      }),
      producerId: new UniqueEntityID(),
      crops: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return property;
}

@Injectable()
export class PropertyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProperty(
    data: Partial<PropertyProps> = {},
  ): Promise<Property> {
    const property = makeProperty(data);

    await this.prisma.property.create({
      data: PrismaPropertyMapper.toPrisma(property),
    });

    return property;
  }
}
