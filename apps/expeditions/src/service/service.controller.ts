import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceQueryDto } from './dto/query-service.dto';
import { JwtAuthGuard } from '@app/common';

@ApiTags('Services')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  // @checkAbilites({ action: 'create', subject: 'service' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  create(@Body() createServiceDto: CreateServiceDto) {
    try {
      return this.serviceService.create(createServiceDto);
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  // @checkAbilites({ action: 'read', subject: 'service' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
    queryDto: ServiceQueryDto
  ) {
    return this.serviceService.findAll(queryDto);
  }

  // @checkAbilites({ action: 'read', subject: 'service' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  // @checkAbilites({ action: 'update', subject: 'service' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  // @checkAbilites({ action: 'delete', subject: 'service' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}