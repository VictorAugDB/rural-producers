import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DashboardsService } from '../services/dashboards.service';

@ApiBearerAuth()
@Controller()
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post('dashboards')
  async getAll() {
    const res = await this.dashboardsService.getAll();

    return res;
  }
}
