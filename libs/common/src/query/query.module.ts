import { Global, Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { BaseQueryDto } from './dto/global-paginate.dto';

@Global()
@Module({
  providers: [QueryService, BaseQueryDto],
  exports: [QueryService, BaseQueryDto]
})
export class QueryModule {}
