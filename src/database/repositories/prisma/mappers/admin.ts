import {
  Prisma,
  Admin as PrismaAdmin,
  Property as PrismaProperty,
} from '@prisma/client';
import { Admin } from '../../../../domain/entities/admin';
import { UniqueEntityID } from '../../../../domain/entities/utils/unique-entity-id';

type AdminWithProperty = PrismaAdmin & {
  property?: PrismaProperty;
};

export class PrismaAdminMapper {
  static toDomain(raw: AdminWithProperty): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(admin: Admin): Prisma.AdminUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
