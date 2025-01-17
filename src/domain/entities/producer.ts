import { isValidCpfCnpj } from '../../utils/isValidCpfCnpj';
import { Entity } from './entity';
import { Optional } from './utils/optional';
import { UniqueEntityID } from './utils/unique-entity-id';

export interface ProducerProps {
  name: string;
  cpfCnpj: string;
  propertiesIds: UniqueEntityID[]; // List of Property IDs as UniqueEntityID
  createdAt: Date;
  updatedAt: Date;
}

export class Producer extends Entity<ProducerProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get cpfCnpj() {
    return this.props.cpfCnpj;
  }

  get propertiesIds() {
    return this.props.propertiesIds;
  }

  set propertiesIds(propertiesIds: UniqueEntityID[]) {
    this.props.propertiesIds = propertiesIds;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<ProducerProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    if (!isValidCpfCnpj(props.cpfCnpj)) {
      throw new Error('Invalid CPF or CNPJ');
    }

    return new Producer(
      {
        ...props,
        propertiesIds: props.propertiesIds ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
