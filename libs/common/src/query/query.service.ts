import { Injectable } from '@nestjs/common';
import { BaseQueryDto } from './dto/global-paginate.dto';

export interface QueryBuilderOptions {
  searchFields?: string[];
  filterableFields?: Record<string, any>;
  defaultSortField?: string;
  relations?: string[];
}

export interface QueryResult<T> {
  data: T[];
  meta_data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

@Injectable()
export class QueryService {
  /**
   * Build Prisma where clause with dynamic search and filters
   */
  buildWhereClause<T extends Record<string, any>>(
    queryDto: BaseQueryDto & T,
    searchFields: string[] = ['name'],
    filterableFields: Record<string, any> = {}
  ): any {
    const where: any = {};

    // Handle search across multiple fields
    if (queryDto.search && searchFields.length > 0) {
      if (searchFields.length === 1) {
        where[searchFields[0]] = {
          contains: queryDto.search,
          mode: 'insensitive',
        };
      } else {
        where.OR = searchFields.map(field => ({
          [field]: {
            contains: queryDto.search,
            mode: 'insensitive',
          }
        }));
      }
    }

    // Handle dynamic filters
    Object.entries(filterableFields).forEach(([key, value]) => {
      if (queryDto[key as keyof typeof queryDto] !== undefined && queryDto[key as keyof typeof queryDto] !== '') {
        where[value || key] = queryDto[key as keyof typeof queryDto];
      }
    });

    return where;
  }

  /**
   * Build Prisma orderBy clause
   */
  buildOrderByClause(sortBy: string = 'created_at', sortOrder: 'asc' | 'desc' = 'desc'): any {
    return {
      [sortBy]: sortOrder,
    };
  }

  /**
   * Calculate pagination metadata
   */
  buildPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Execute paginated query with all optimizations
   */
  async executePaginatedQuery<T, U extends BaseQueryDto>(
    prismaModel: any,
    queryDto: U,
    options: QueryBuilderOptions = {}
  ): Promise<QueryResult<T>> {
    const {
      searchFields = ['name'],
      filterableFields = {},
      defaultSortField = 'created_at',
      relations = []
    } = options;

    const { page = 1, limit = 10, sortBy = defaultSortField, sortOrder = 'desc' } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = this.buildWhereClause(queryDto, searchFields, filterableFields);

    // Build orderBy clause
    const orderBy = this.buildOrderByClause(sortBy, sortOrder);

    // Build include/select clause for relations
    const includeClause = relations.length > 0
      ? { include: relations.reduce((acc, rel) => ({ ...acc, [rel]: true }), {}) }
      : {};

    // Execute count and find queries in parallel
    const [total, data] = await Promise.all([
      prismaModel.count({ where }),
      prismaModel.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        ...includeClause,
      }),
    ]);

    return {
      data,
      meta_data: this.buildPaginationMeta(total, page, limit),
    };
  }
}