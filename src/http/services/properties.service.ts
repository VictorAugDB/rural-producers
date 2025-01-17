import { Property } from '../../domain/entities/property';
import { UniqueEntityID } from '../../domain/entities/utils/unique-entity-id';
import { PropertiesRepository } from '../../domain/repositories/properties-repository';
import { Injectable, NotFoundException } from '@nestjs/common';

type CreateInput = {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  producerId: string;
  crops?: string[];
};

type UpdateInput = {
  id: string;
  name?: string;
  city?: string;
  state?: string;
  totalArea?: number;
  arableArea?: number;
  vegetationArea?: number;
  crops?: string[];
};

@Injectable()
export class PropertiesService {
  constructor(private propertiesRepository: PropertiesRepository) {}

  async create({
    name,
    city,
    state,
    totalArea,
    arableArea,
    vegetationArea,
    producerId,
    crops,
  }: CreateInput): Promise<void> {
    const property = Property.create({
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      producerId: new UniqueEntityID(producerId),
      crops:
        crops && crops.length ? crops.map((id) => new UniqueEntityID(id)) : [],
    });

    await this.propertiesRepository.create(property);
  }

  async update({
    id,
    name,
    city,
    state,
    totalArea,
    arableArea,
    vegetationArea,
    crops,
  }: UpdateInput): Promise<void> {
    const property = await this.propertiesRepository.getById(id);

    if (!property) {
      throw new NotFoundException('Property does not exist!');
    }

    property.name = name ?? property.name;
    property.city = city ?? property.city;
    property.state = state ?? property.state;
    property.totalArea = totalArea ?? property.totalArea;
    property.arableArea = arableArea ?? property.arableArea;
    property.vegetationArea = vegetationArea ?? property.vegetationArea;
    property.crops =
      crops && crops.length
        ? crops.map((id) => new UniqueEntityID(id))
        : property.crops;

    await this.propertiesRepository.update(property);
  }

  async getById(id: string): Promise<Property> {
    const property = await this.propertiesRepository.getById(id);

    if (!property) {
      throw new NotFoundException('Property does not exist!');
    }

    return property;
  }

  async findMany(): Promise<Property[]> {
    const properties = await this.propertiesRepository.findMany();

    if (!properties.length) {
      throw new NotFoundException('No properties found!');
    }

    return properties;
  }
}
