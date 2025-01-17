import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-error';
import { z } from 'zod';
import { isValidCpfCnpj } from '../../utils/isValidCpfCnpj';
import { ProducersService } from '../services/producers.service';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

const createProducerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cpfCnpj: z.string().refine((value) => isValidCpfCnpj(value), {
    message: 'Invalid CPF or CNPJ',
  }),
  propertiesIds: z.array(z.string().uuid()).optional(),
});

const createProducerValidationPipe = new ZodValidationPipe(
  createProducerSchema,
);

type CreateProducerSchema = z.infer<typeof createProducerSchema>;
class CreateProducerDto extends createZodDto(createProducerSchema) {}

const updateProducerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').optional(),
  propertiesIds: z.array(z.string().uuid()).optional(),
});

const updateProducerValidationPipe = new ZodValidationPipe(
  updateProducerSchema,
);

type UpdateProducerSchema = z.infer<typeof updateProducerSchema>;
class UpdateProducerDto extends createZodDto(updateProducerSchema) {}

const getProducerSchema = z.object({
  id: z.string().uuid(),
});

const getProducerValidationPipe = new ZodValidationPipe(getProducerSchema);

type GetProducerSchema = z.infer<typeof getProducerSchema>;

@ApiBearerAuth()
@Controller()
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post('producers')
  @ApiBody({ type: CreateProducerDto })
  async create(@Body(createProducerValidationPipe) body: CreateProducerSchema) {
    const { cpfCnpj, name, propertiesIds } = body;

    await this.producersService.create({
      cpfCnpj,
      name,
      propertiesIds,
    });
  }

  @Patch('producers')
  @ApiBody({ type: UpdateProducerDto })
  async update(@Body(updateProducerValidationPipe) body: UpdateProducerSchema) {
    const { id, name, propertiesIds } = body;

    await this.producersService.update({
      id,
      name,
      propertiesIds: propertiesIds ?? [],
    });
  }

  @Get('producers')
  async findMany() {
    const producers = await this.producersService.findMany();

    return producers;
  }

  @Get('producers/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the item to retrieve',
    required: true,
  })
  async getById(@Param(getProducerValidationPipe) params: GetProducerSchema) {
    const { id } = params;

    const producer = await this.producersService.getById(id);

    return producer;
  }
}
