import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcrypt';
import { CreateUserDTO } from './dto/create.user.dto';
import { DatabaseService } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) { }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        first_name: true,
        last_name: true,
        password: true
      }
    });
  }

  async getAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        first_name: true,
        last_name: true,
      }
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        first_name: true,
        last_name: true,
      }
    });
  }

  async create(createUserDto: CreateUserDTO) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: bcryptjs.hashSync(createUserDto.password, 10),
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async verifyUser(username: string, password: string) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const passwordIsValid = await bcryptjs.compare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

  }

}
