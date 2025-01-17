import { Module } from '@nestjs/common';
import { ProducersService } from './services/producers.service';
import { DatabaseModule } from '../database/database.module';
import { ProducersController } from './controllers/producers.controller';
import { PropertiesController } from './controllers/properties.controller';
import { CropsController } from './controllers/crops.controller';
import { PropertiesService } from './services/properties.service';
import { CropsService } from './services/crops.service';
import { AdminsService } from './services/admins.service';
import { AdminsController } from './controllers/admins.controller';
import { DashboardsController } from './controllers/dashboards.controller';
import { DashboardsService } from './services/dashboards.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ProducersController,
    PropertiesController,
    CropsController,
    AdminsController,
    DashboardsController,
  ],
  providers: [
    ProducersService,
    PropertiesService,
    CropsService,
    AdminsService,
    DashboardsService,
  ],
})
export class HttpModule {}
