import { Entity } from './entity';
import { Optional } from './utils/optional';
import { UniqueEntityID } from './utils/unique-entity-id';

export interface PropertyProps {
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  producerId: UniqueEntityID;
  crops: UniqueEntityID[];
  createdAt: Date;
  updatedAt: Date;
}

export class Property extends Entity<PropertyProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
  }

  get totalArea() {
    return this.props.totalArea;
  }

  set totalArea(totalArea: number) {
    this.props.totalArea = totalArea;
  }

  get arableArea() {
    return this.props.arableArea;
  }

  set arableArea(arableArea: number) {
    this.props.arableArea = arableArea;
  }

  get vegetationArea() {
    return this.props.vegetationArea;
  }

  set vegetationArea(vegetationArea: number) {
    this.props.vegetationArea = vegetationArea;
  }

  get producerId() {
    return this.props.producerId;
  }

  get crops() {
    return this.props.crops;
  }

  set crops(crops: UniqueEntityID[]) {
    this.props.crops = crops;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<PropertyProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    if (props.arableArea + props.vegetationArea > props.totalArea) {
      throw new Error(
        'The sum of arableArea and vegetationArea cannot exceed totalArea',
      );
    }

    return new Property(
      {
        ...props,
        crops: props.crops ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
