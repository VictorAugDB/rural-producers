import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { Crop, CropProps } from '../../src/domain/entities/crop';
import { UniqueEntityID } from '../../src/domain/entities/utils/unique-entity-id';
import { PrismaService } from '../../src/database/repositories/prisma.service';
import { PrismaCropMapper } from '../../src/database/repositories/prisma/mappers/crop';

export function makeCrop(
  override: Partial<CropProps> = {},
  id?: UniqueEntityID,
) {
  const crop = Crop.create(
    {
      name: faker.lorem.word(),
      season: faker.date.past().getFullYear().toString(),
      propertyId: new UniqueEntityID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return crop;
}

@Injectable()
export class CropFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCrop(data: Partial<CropProps> = {}): Promise<Crop> {
    const crop = makeCrop(data);

    await this.prisma.crop.create({
      data: PrismaCropMapper.toPrisma(crop),
    });

    return crop;
  }
}
