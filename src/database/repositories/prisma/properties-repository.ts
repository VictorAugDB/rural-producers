import { Injectable } from '@nestjs/common';
import { PropertiesRepository } from '../../../domain/repositories/properties-repository';
import { PrismaService } from '../prisma.service';
import { Property } from '../../../domain/entities/property';
import { PrismaPropertyMapper } from './mappers/property';

@Injectable()
export class PrismaPropertiesRepository implements PropertiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(property: Property): Promise<void> {
    await this.prisma.property.create({
      data: PrismaPropertyMapper.toPrisma(property),
    });
  }
  async getById(id: string): Promise<Property | null> {
    const property = await this.prisma.property.findFirst({
      where: {
        id,
      },
    });

    return property ? PrismaPropertyMapper.toDomain(property) : null;
  }
  async findMany(): Promise<Property[]> {
    const properties = await this.prisma.property.findMany();

    return properties.map((p) => PrismaPropertyMapper.toDomain(p));
  }
  async update(property: Property): Promise<void> {
    const { id: _, ...data } = PrismaPropertyMapper.toPrisma(property);

    await this.prisma.property.update({
      data,
      where: {
        id: property.id.toString(),
      },
    });
  }
}
