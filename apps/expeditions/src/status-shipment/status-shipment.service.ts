import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusShipmentDto } from './dto/create-status-shipment.dto';
import { UpdateStatusShipmentDto } from './dto/update-status-shipment.dto';
import { BaseQueryDto, DatabaseService, QueryResult, QueryService } from '@app/common';
@Injectable()
export class StatusShipmentService {
  constructor(
    private prisma: DatabaseService,
    private queryBuilder: QueryService
  ) { }
  create(createStatusShipmentDto: CreateStatusShipmentDto) {
    return this.prisma.statusShipment.create({
      data: createStatusShipmentDto
    });
  }

  findAll(queryDto: BaseQueryDto): Promise<QueryResult<any>> {
    return this.queryBuilder.executePaginatedQuery
      (this.prisma.statusShipment,
        queryDto,
        {
          searchFields: ['name'],
          defaultSortField: 'name',
          relations: [],
        }
      );
  }

  findOne(id: string) {
    const statusShipment = this.prisma.statusShipment.findUnique({
      where: { id }
    });
    if (!statusShipment) {
      throw new NotFoundException(`StatusShipment with ID ${id} not found`);
    }
    return statusShipment;
  }

  async update(id: string, updateStatusShipmentDto: UpdateStatusShipmentDto) {
    await this.findOne(id);
    return this.prisma.statusShipment.update({
      where: { id },
      data: updateStatusShipmentDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.statusShipment.delete({
      where: { id }
    });
  }
}
