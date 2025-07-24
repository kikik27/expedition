import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceQueryDto } from './dto/query-service.dto';
import { DatabaseService, QueryResult, QueryService } from '@app/common';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: DatabaseService,
    private queryBuilder: QueryService
  ) { }

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto
    });
  }

  async findAll(queryDto: ServiceQueryDto): Promise<QueryResult<any>> {
    return this.queryBuilder.executePaginatedQuery(
      this.prisma.service,
      queryDto,
      {
        searchFields: ['name'],
        filterableFields: {
          category: 'category',
        },
        defaultSortField: 'name',
        relations: [],
      }
    );
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        category: true,
      },
    });
  }
}