import { Entity } from './entity';
import { Optional } from './utils/optional';
import { UniqueEntityID } from './utils/unique-entity-id';

export interface CropProps {
  name: string;
  season: string;
  propertyId: UniqueEntityID;
  createdAt: Date;
  updatedAt: Date;
}

export class Crop extends Entity<CropProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get season() {
    return this.props.season;
  }

  set season(season: string) {
    this.props.season = season;
  }

  get propertyId() {
    return this.props.propertyId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<CropProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new Crop(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
