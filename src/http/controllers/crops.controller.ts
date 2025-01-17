import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-error';
import { z } from 'zod';
import { CropsService } from '../services/crops.service';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

const createCropSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  season: z.string().min(1, 'Season is required'),
  propertyId: z.string().uuid('Property ID must be a valid UUID'),
});

const createCropValidationPipe = new ZodValidationPipe(createCropSchema);

type CreateCropSchema = z.infer<typeof createCropSchema>;
class CreateCropDto extends createZodDto(createCropSchema) {}

const updateCropSchema = z.object({
  id: z.string().uuid('Crop ID must be a valid UUID'),
  name: z.string().min(1, 'Name is required').optional(),
  season: z.string().min(1, 'Season is required').optional(),
});

const updateCropValidationPipe = new ZodValidationPipe(updateCropSchema);

type UpdateCropSchema = z.infer<typeof updateCropSchema>;
class UpdateCropDto extends createZodDto(updateCropSchema) {}

const getCropSchema = z.object({
  id: z.string().uuid('Crop ID must be a valid UUID'),
});

const getCropValidationPipe = new ZodValidationPipe(getCropSchema);

type GetCropSchema = z.infer<typeof getCropSchema>;

@ApiBearerAuth()
@Controller()
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post('crops')
  @ApiBody({ type: CreateCropDto })
  async create(@Body(createCropValidationPipe) body: CreateCropSchema) {
    const { name, season, propertyId } = body;

    await this.cropsService.create({
      name,
      season,
      propertyId,
    });
  }

  @Patch('crops')
  @ApiBody({ type: UpdateCropDto })
  async update(@Body(updateCropValidationPipe) body: UpdateCropSchema) {
    const { id, name, season } = body;

    await this.cropsService.update({
      id,
      name,
      season,
    });
  }

  @Get('crops')
  async findMany() {
    const crops = await this.cropsService.findMany();

    return crops;
  }

  @Get('crops/:id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the item to retrieve',
    required: true,
  })
  async getById(@Param(getCropValidationPipe) params: GetCropSchema) {
    const { id } = params;

    const crop = await this.cropsService.getById(id);

    return crop;
  }
}
