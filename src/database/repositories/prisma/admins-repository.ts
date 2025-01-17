import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Admin } from '../../../domain/entities/admin';
import { AdminsRepository } from '../../../domain/repositories/admins-repository';
import { PrismaAdminMapper } from './mappers/admin';

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    });
  }
  async getById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        id,
      },
    });

    return admin ? PrismaAdminMapper.toDomain(admin) : null;
  }

  async getByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        email,
      },
    });

    return admin ? PrismaAdminMapper.toDomain(admin) : null;
  }
}
