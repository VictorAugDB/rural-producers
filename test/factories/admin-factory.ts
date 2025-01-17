import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { Admin, AdminProps } from '../../src/domain/entities/admin';
import { UniqueEntityID } from '../../src/domain/entities/utils/unique-entity-id';
import { PrismaService } from '../../src/database/repositories/prisma.service';
import { PrismaAdminMapper } from '../../src/database/repositories/prisma/mappers/admin';

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.lorem.word(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return admin;
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data);

    console.log(process.env.DATABASE_URL);

    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    });

    return admin;
  }
}
