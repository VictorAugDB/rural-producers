import { Entity } from './entity';
import { Optional } from './utils/optional';
import { UniqueEntityID } from './utils/unique-entity-id';

export interface AdminProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<AdminProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new Admin(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
