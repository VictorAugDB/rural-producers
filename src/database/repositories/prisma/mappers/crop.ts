import {
  Prisma,
  Crop as PrismaCrop,
  Property as PrismaProperty,
} from '@prisma/client';
import { Crop } from '../../../../domain/entities/crop';
import { UniqueEntityID } from '../../../../domain/entities/utils/unique-entity-id';

type CropWithProperty = PrismaCrop & {
  property?: PrismaProperty;
};

export class PrismaCropMapper {
  static toDomain(raw: CropWithProperty): Crop {
    return Crop.create(
      {
        name: raw.name,
        season: raw.season,
        propertyId: new UniqueEntityID(raw.propertyId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(crop: Crop): Prisma.CropUncheckedCreateInput {
    return {
      id: crop.id.toString(),
      name: crop.name,
      season: crop.season,
      propertyId: crop.propertyId.toString(),
      createdAt: crop.createdAt,
      updatedAt: crop.updatedAt,
    };
  }
}
