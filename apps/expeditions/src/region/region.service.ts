import { Injectable } from '@nestjs/common';
import { QueryProvinceDto } from './dto/query-province.dto';
import { QueryRegencyDto } from './dto/query-regency.dto';
import { DistrictQueryDto } from './dto/query-district.dto';
import { DatabaseService, QueryService } from '@app/common';

@Injectable()
export class RegionService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly queryBuilder: QueryService,
  ) { }

  async getProvinces(query: QueryProvinceDto) {
    return this.queryBuilder.executePaginatedQuery(
      this.prisma.province,
      query,
      {
        searchFields: ['name'],
        defaultSortField: 'name',
      },
    );
  }

  async getRegencies(query: QueryRegencyDto) {
    return this.queryBuilder.executePaginatedQuery(
      this.prisma.regency,
      query,
      {
        searchFields: ['name'],
        filterableFields: { provinceId: 'province_id' },
        defaultSortField: 'name',
        relations: ['province'],
      },
    );
  }

  async getDistricts(query: DistrictQueryDto) {
    return this.queryBuilder.executePaginatedQuery(
      this.prisma.district,
      query,
      {
        searchFields: ['name'],
        filterableFields: { regencyId: 'regency_id' },
        defaultSortField: 'name',
        relations: ['regency'],
      },
    );
  }
}
