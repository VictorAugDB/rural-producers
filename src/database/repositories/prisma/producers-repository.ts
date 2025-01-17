import { Injectable } from '@nestjs/common';
import { ProducersRepository } from '../../../domain/repositories/producers-repository';
import { PrismaService } from '../prisma.service';
import { Producer } from '../../../domain/entities/producer';
import { PrismaProducerMapper } from './mappers/producer';

@Injectable()
export class PrismaProducersRepository implements ProducersRepository {
  constructor(private prisma: PrismaService) {}

  async create(producer: Producer): Promise<void> {
    await this.prisma.producer.create({
      data: PrismaProducerMapper.toPrisma(producer),
    });
  }
  async getById(id: string): Promise<Producer | null> {
    const producer = await this.prisma.producer.findFirst({
      where: {
        id,
      },
    });

    return producer ? PrismaProducerMapper.toDomain(producer) : null;
  }

  async getByCpfCnpj(value: string): Promise<Producer | null> {
    const producer = await this.prisma.producer.findFirst({
      where: {
        cpfCnpj: value,
      },
    });

    return producer ? PrismaProducerMapper.toDomain(producer) : null;
  }

  async findMany(): Promise<Producer[]> {
    const producers = await this.prisma.producer.findMany();

    return producers.map((p) => PrismaProducerMapper.toDomain(p));
  }
  async update(producer: Producer): Promise<void> {
    const { id: _, ...data } = PrismaProducerMapper.toPrisma(producer);

    await this.prisma.producer.update({
      data,
      where: {
        id: producer.id.toString(),
      },
    });
  }
}
