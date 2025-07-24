import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { Prisma } from '@prisma/client';
import { DatabaseModule, QueryModule } from '@app/common';

@Module({
  imports: [QueryModule, DatabaseModule],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService]
})
export class RbacModule { }
