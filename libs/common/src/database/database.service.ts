import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { auditMiddleware } from './database.middleware';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(auditMiddleware(() => {
      // Ganti ini dengan cara ambil userId dari context/request
      return DatabaseService.requestUserId ?? null;
    }));
  }

  // Static untuk simpan userId dari interceptor atau middleware NestJS
  static requestUserId: string | null = null;

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
