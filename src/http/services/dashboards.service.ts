import { PrismaService } from '../../database/repositories/prisma.service';
import { Injectable } from '@nestjs/common';

type GetAllRes = {
  totalProperties: number;
  totalRegisteredHectares: number;
  graphs: {
    state: any;
    crop: any;
  };
};

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<GetAllRes> {
    const totalProperties = await this.prisma.property.count();
    const totalRegisteredHectares = await this.prisma.property.aggregate({
      _sum: {
        totalArea: true,
      },
    });

    const cropsWithProperties = await this.prisma.crop.findMany({
      include: {
        property: true,
      },
    });

    const graphs = {
      state: (
        await this.prisma.property.groupBy({
          by: ['state'],
          _sum: {
            totalArea: true,
          },
          _count: {
            _all: true,
          },
        })
      ).map((s) => ({
        ...s,
        _sum: Number((s._sum.totalArea ?? 0).toFixed(2)),
        _count: Number((s._count._all ?? 0).toFixed(2)),
      })),
      crop: Object.entries(
        cropsWithProperties.reduce((acc, crop) => {
          if (!acc[crop.name]) {
            acc[crop.name] = {
              _sum: { totalArea: 0 },
              _count: { _all: 0 },
            };
          }
          acc[crop.name]._sum.totalArea += crop.property.totalArea;
          acc[crop.name]._count._all += 1;
          return acc;
        }, {}),
      ).map(([key, val]: [string, any]) => {
        return {
          name: key,
          _sum: Number(val._sum.totalArea.toFixed(2)),
          count: Number(val._count._all.toFixed(2)),
        };
      }),
    };

    return {
      totalProperties,
      totalRegisteredHectares: (totalRegisteredHectares._sum ??
        0) as unknown as number,
      graphs,
    };
  }
}
