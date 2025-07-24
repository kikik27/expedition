import { Injectable } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { QueryShipmentDto } from './dto/query-shipment.dto';
import { DatabaseService, QueryResult, QueryService } from '@app/common';

@Injectable()
export class ShipmentService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly queryBuilder: QueryService
  ) { }
  create(createShipmentDto: CreateShipmentDto) {
    return this.prisma.shipment.create({
      data: createShipmentDto
    })
  }

  findAll(query: QueryShipmentDto): Promise<QueryResult<any>> {
    return this.queryBuilder.executePaginatedQuery(this.prisma.shipment, query, {
      searchFields: ['sender_name', 'receiver_name'],
      filterableFields: {
        status_shipment: 'status_shipment',
        origin_regency: 'origin_regency',
      },
      defaultSortField: 'created_at',
      relations: [
        'status_shipment',
        'origin_regency',
        'destination_regency',
        'driver_user',
        'cs_user',
        'primary_service',
        'payment_service',
        'shipment_service',
        'package_service',
      ],
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return `This action updates a #${id} shipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }
}
