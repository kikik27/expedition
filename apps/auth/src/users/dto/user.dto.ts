// user.dto.ts
import { Role } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  first_name: string;
  @Expose()
  last_name: string;
  @Expose()
  email: string
  @Expose()
  role: Role
}
