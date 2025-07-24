import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusShipmentService } from './status-shipment.service';
import { CreateStatusShipmentDto } from './dto/create-status-shipment.dto';
import { UpdateStatusShipmentDto } from './dto/update-status-shipment.dto';
import { BaseQueryDto, JwtAuthGuard } from '@app/common';

@Controller('status-shipment')
export class StatusShipmentController {
  constructor(
    private readonly statusShipmentService: StatusShipmentService
  ) { }

  // @checkAbilites({ action: 'create', subject: 'statusShipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createStatusShipmentDto: CreateStatusShipmentDto) {
    return this.statusShipmentService.create(createStatusShipmentDto);
  }

  // @checkAbilites({ action: 'read', subject: 'statusShipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query(new ValidationPipe({ transform: true, forbidNonWhitelisted: true })) queryDto: BaseQueryDto) {
    return this.statusShipmentService.findAll(queryDto);
  }

  // @checkAbilites({ action: 'read', subject: 'statusShipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusShipmentService.findOne(id);
  }

  // @checkAbilites({ action: 'update', subject: 'statusShipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusShipmentDto: UpdateStatusShipmentDto) {
    return this.statusShipmentService.update(id, updateStatusShipmentDto);
  }

  // @checkAbilites({ action: 'delete', subject: 'statusShipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusShipmentService.remove(id);
  }
}
