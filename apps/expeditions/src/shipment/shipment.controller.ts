import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { QueryShipmentDto } from './dto/query-shipment.dto';
import { ApiOAuth2 } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) { }

  // @checkAbilites({ action: 'create', subject: 'shipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createShipmentDto: CreateShipmentDto) {
    return this.shipmentService.create(createShipmentDto);
  }

  // @checkAbilites({ action: 'read', subject: 'shipment' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
    query: QueryShipmentDto) {
    return this.shipmentService.findAll(query);
  }

  // @checkAbilites({ action: 'read', subject: 'shipment', conditions: true })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipmentService.findOne(+id);
  }

  // @checkAbilites({ action: 'update', subject: 'shipment', conditions: true })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentService.update(+id, updateShipmentDto);
  }

  // @checkAbilites({
  //   action: 'delete',
  //   subject: 'shipment',
  //   conditions: true
  // })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipmentService.remove(+id);
  }
}
