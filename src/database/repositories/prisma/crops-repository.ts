import { Injectable } from '@nestjs/common';
import {
  CheckExistsProps,
  CropsRepository,
} from '../../../domain/repositories/crops-repository';
import { PrismaService } from '../prisma.service';
import { Crop } from '../../../domain/entities/crop';
import { PrismaCropMapper } from './mappers/crop';

@Injectable()
export class PrismaCropsRepository implements CropsRepository {
  constructor(private prisma: PrismaService) {}

  async create(crop: Crop): Promise<void> {
    await this.prisma.crop.create({
      data: PrismaCropMapper.toPrisma(crop),
    });
  }
  async getById(id: string): Promise<Crop | null> {
    const crop = await this.prisma.crop.findFirst({
      where: {
        id,
      },
    });

    return crop ? PrismaCropMapper.toDomain(crop) : null;
  }

  async checkExists({
    name,
    propertyId,
    season,
  }: CheckExistsProps): Promise<boolean> {
    const crop = await this.prisma.crop.findFirst({
      where: {
        name,
        propertyId,
        season,
      },
    });

    return !!crop;
  }

  async findMany(): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany();

    return crops.map((p) => PrismaCropMapper.toDomain(p));
  }
  async update(crop: Crop): Promise<void> {
    const { id: _, ...data } = PrismaCropMapper.toPrisma(crop);

    await this.prisma.crop.update({
      data,
      where: {
        id: crop.id.toString(),
      },
    });
  }
}
