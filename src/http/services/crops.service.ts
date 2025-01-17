import { Crop } from '../../domain/entities/Crop';
import { UniqueEntityID } from '../../domain/entities/utils/unique-entity-id';
import { CropsRepository } from '../../domain/repositories/crops-repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

type CreateInput = {
  name: string;
  season: string;
  propertyId: string;
};

type UpdateInput = {
  id: string;
  name?: string;
  season?: string;
};

@Injectable()
export class CropsService {
  constructor(private cropsRepository: CropsRepository) {}

  async create({ name, propertyId, season }: CreateInput): Promise<void> {
    const cropExists = await this.cropsRepository.checkExists({
      name,
      propertyId,
      season,
    });

    if (cropExists) {
      throw new ConflictException('Crop already exists!');
    }

    const crop = Crop.create({
      name,
      propertyId: new UniqueEntityID(propertyId),
      season,
    });

    await this.cropsRepository.create(crop);
  }

  async update({ id, name, season }: UpdateInput): Promise<void> {
    const crop = await this.cropsRepository.getById(id);

    if (!crop) {
      throw new NotFoundException('Crop does not exists!');
    }

    crop.name = name ?? crop.name;
    crop.season = season ?? crop.season;

    await this.cropsRepository.update(crop);
  }

  async getById(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.getById(id);

    if (!crop) {
      throw new NotFoundException('Crop does not exists!');
    }

    return crop;
  }

  async findMany(): Promise<Crop[]> {
    const crops = await this.cropsRepository.findMany();

    if (!crops.length) {
      throw new NotFoundException('No crops found!');
    }

    return crops;
  }
}
