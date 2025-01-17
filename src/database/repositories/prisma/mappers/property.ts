import {
  Prisma,
  Property as PrismaProperty,
  Crop as PrismaCrop,
} from '@prisma/client';
import { Property } from '../../../../domain/entities/property';
import { UniqueEntityID } from '../../../../domain/entities/utils/unique-entity-id';

type PropertyWithCrops = PrismaProperty & {
  crops?: Pick<PrismaCrop, 'id'>[];
};

export class PrismaPropertyMapper {
  static toDomain(raw: PropertyWithCrops): Property {
    return Property.create(
      {
        name: raw.name,
        city: raw.city,
        state: raw.state,
        totalArea: raw.totalArea,
        arableArea: raw.arableArea,
        vegetationArea: raw.vegetationArea,
        producerId: new UniqueEntityID(raw.producerId),
        crops: raw.crops ? raw.crops.map((c) => new UniqueEntityID(c.id)) : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(property: Property): Prisma.PropertyUncheckedCreateInput {
    return {
      id: property.id.toString(),
      name: property.name,
      city: property.city,
      state: property.state,
      totalArea: property.totalArea,
      arableArea: property.arableArea,
      vegetationArea: property.vegetationArea,
      producerId: property.producerId.toString(),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      crops: property.crops.length
        ? {
            connect: property.crops.map((c) => ({
              id: c.toString(),
            })),
          }
        : undefined,
    };
  }
}
