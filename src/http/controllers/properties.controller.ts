import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-error';
import { z } from 'zod';
import { PropertiesService } from '../services/properties.service';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

const createPropertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  totalArea: z.number().positive('Total area must be positive'),
  arableArea: z.number().positive('Arable area must be positive'),
  vegetationArea: z.number().positive('Vegetation area must be positive'),
  producerId: z.string().uuid('Producer ID must be a valid UUID'),
});

const createPropertyValidationPipe = new ZodValidationPipe(
  createPropertySchema,
);

type CreatePropertySchema = z.infer<typeof createPropertySchema>;
class CreatePropertyDto extends createZodDto(createPropertySchema) {}

const updatePropertySchema = z.object({
  id: z.string().uuid('Property ID must be a valid UUID'),
  name: z.string().min(1, 'Name is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().min(2, 'State is required').optional(),
  totalArea: z.number().positive('Total area must be positive').optional(),
  arableArea: z.number().positive('Arable area must be positive').optional(),
  vegetationArea: z
    .number()
    .positive('Vegetation area must be positive')
    .optional(),
  crops: z.array(z.string().uuid()).optional(),
});

const updatePropertyValidationPipe = new ZodValidationPipe(
  updatePropertySchema,
);

type UpdatePropertySchema = z.infer<typeof updatePropertySchema>;
class UpdatePropertyDto extends createZodDto(updatePropertySchema) {}

const getPropertySchema = z.object({
  id: z.string().uuid('Property ID must be a valid UUID'),
});

const getPropertyValidationPipe = new ZodValidationPipe(getPropertySchema);

type GetPropertySchema = z.infer<typeof getPropertySchema>;

@ApiBearerAuth()
@Controller()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('properties')
  @ApiBody({ type: CreatePropertyDto })
  async create(@Body(createPropertyValidationPipe) body: CreatePropertySchema) {
    const {
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      producerId,
    } = body;

    await this.propertiesService.create({
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      producerId,
    });
  }

  @Patch('properties')
  @ApiBody({ type: UpdatePropertyDto })
  async update(@Body(updatePropertyValidationPipe) body: UpdatePropertySchema) {
    const {
      id,
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      crops,
    } = body;

    await this.propertiesService.update({
      id,
      name,
      city,
      state,
      totalArea,
      arableArea,
      vegetationArea,
      crops,
    });
  }

  @Get('properties')
  async findMany() {
    const properties = await this.propertiesService.findMany();

    return properties;
  }

  @Get('properties/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the item to retrieve',
    required: true,
  })
  async getById(@Param(getPropertyValidationPipe) params: GetPropertySchema) {
    const { id } = params;

    const property = await this.propertiesService.getById(id);

    return property;
  }
}
