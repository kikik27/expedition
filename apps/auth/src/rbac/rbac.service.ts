import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRbacDto } from './dto/create-rbac.dto';
import { UpdateRbacDto } from './dto/update-rbac.dto';
import { RbacQueryDto } from './dto/rbac-query.dto';
import { DatabaseService } from '@app/common';
import { QueryService } from '@app/common/query';

@Injectable()
export class RbacService {
  constructor(
    private prisma: DatabaseService,
    private queryBuilder: QueryService
  ) { }
  create(createRbacDto: CreateRbacDto) {
    return this.prisma.permission.create({
      data: createRbacDto
    })
  }

  findAll(queryDto: RbacQueryDto) {
    return this.queryBuilder.executePaginatedQuery(
      this.prisma.permission,
      queryDto,
      {
        searchFields: ['subject', 'action'],
        defaultSortField: 'subject',
        filterableFields: {
          subject: 'subject',
          action: 'action',
          roleId: 'roleId',
        },
        relations: ['role'],
      }
    );
  }

  async findOne(id: string) {
    const rbac = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!rbac) {
      throw new NotFoundException(`RBAC Permission with ID ${id} not found`);
    }

    return rbac;
  }

  update(id: string, updateRbacDto: UpdateRbacDto) {
    this.findOne(id);
    return this.prisma.permission.update({
      where: { id },
      data: updateRbacDto
    });
  }

  remove(id: string) {
    this.findOne(id);
    return this.prisma.permission.delete({
      where: { id }
    });
  }
}
