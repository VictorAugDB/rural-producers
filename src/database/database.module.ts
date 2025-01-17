import { Module } from '@nestjs/common';
import { PrismaService } from './repositories/prisma.service';
import { PropertiesRepository } from '../domain/repositories/properties-repository';
import { PrismaPropertiesRepository } from './repositories/prisma/properties-repository';
import { ProducersRepository } from '../domain/repositories/producers-repository';
import { PrismaProducersRepository } from './repositories/prisma/producers-repository';
import { CropsRepository } from '../domain/repositories/crops-repository';
import { PrismaCropsRepository } from './repositories/prisma/crops-repository';
import { AdminsRepository } from '../domain/repositories/admins-repository';
import { PrismaAdminsRepository } from './repositories/prisma/admins-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PropertiesRepository,
      useClass: PrismaPropertiesRepository,
    },
    {
      provide: ProducersRepository,
      useClass: PrismaProducersRepository,
    },
    {
      provide: CropsRepository,
      useClass: PrismaCropsRepository,
    },
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
  ],
  exports: [
    PrismaService,
    ProducersRepository,
    PropertiesRepository,
    CropsRepository,
    AdminsRepository,
  ],
})
export class DatabaseModule {}
