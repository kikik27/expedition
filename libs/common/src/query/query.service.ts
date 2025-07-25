import { Injectable } from '@nestjs/common';
import { BaseQueryDto } from './dto';

export interface QueryBuilderOptions {
  searchFields?: string[];
  filterableFields?: Record<string, string>; // lebih tepat pakai string mapping
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
   * Build Prisma where clause with search and filter support
   */
  buildWhereClause<T extends Record<string, any>>(
    queryDto: BaseQueryDto & T,
    searchFields: string[] = ['name'],
    filterableFields: Record<string, string> = {}
  ): any {
    const where: any = {};

    // Handle search
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
          },
        }));
      }
    }

    // Handle filters
    for (const [queryKey, modelField] of Object.entries(filterableFields)) {
      const value = queryDto[queryKey as keyof typeof queryDto];
      if (value !== undefined && value !== '') {
        where[modelField] = value;
      }
    }

    return where;
  }

  /**
   * Build Prisma orderBy clause safely
   */
  buildOrderByClause(
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Record<string, 'asc' | 'desc'> | undefined {
    if (!sortBy) return undefined;
    return { [sortBy]: sortOrder };
  }

  /**
   * Build metadata for pagination
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
   * Execute paginated query for Prisma model
   */
  async executePaginatedQuery<T, U extends BaseQueryDto>(
    prismaModel: any,
    queryDto: U,
    options: QueryBuilderOptions = {}
  ): Promise<QueryResult<T>> {
    const {
      searchFields = ['name'],
      filterableFields = {},
      defaultSortField = '',
      relations = [],
    } = options;

    const {
      page = 1,
      limit = 10,
      sortBy = defaultSortField,
      sortOrder = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(queryDto, searchFields, filterableFields);
    const orderBy = this.buildOrderByClause(sortBy, sortOrder);
    const include = relations.length
      ? relations.reduce((acc, rel) => ({ ...acc, [rel]: true }), {})
      : undefined;

    const [total, data] = await Promise.all([
      prismaModel.count({ where }),
      prismaModel.findMany({
        where,
        skip,
        take: limit,
        ...(orderBy && { orderBy }),
        ...(include && { include }),
      }),
    ]);

    return {
      data,
      meta_data: this.buildPaginationMeta(total, page, limit),
    };
  }
}
