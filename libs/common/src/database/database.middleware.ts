import { Prisma } from "@prisma/client";

export function auditMiddleware(getUserId: () => string | null): Prisma.Middleware {
  return async (params, next) => {
    const now = new Date();
    const userId = getUserId();

    console.log(`Prisma Middleware: $userId: ${userId}, action: ${params.action}, model: ${params.model}`);

    if (params.model && ['create', 'update', 'delete'].includes(params.action)) {
      if (params.action === 'create') {
        params.args.data = {
          ...params.args.data,
          created_at: now,
          updated_at: now,
          ...(userId && { created_by: userId, updated_by: userId }),
        };
      }

      if (params.action === 'update') {
        params.args.data = {
          ...params.args.data,
          updated_at: now,
          ...(userId && { updated_by: userId }),
        };
      }

      if (params.action === 'delete') {
        // optional: if you implement soft delete
        params.action = 'update';
        params.args.data = {
          deleted_at: now,
          ...(userId && { deleted_by: userId }),
        };
      }
    }

    return next(params);
  };
}
