import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminRoleId = uuidv4();
const userRoleId = uuidv4();
const courierRoleId = uuidv4();

export const roles = [
  {
    id: adminRoleId,
    name: 'Admin'
  },
  {
    id: userRoleId,
    name: 'User'
  },
  {
    id: courierRoleId,
    name: 'Courier'
  }
];

export const permissions = [
  {
    id: uuidv4(),
    role_id: adminRoleId,
    action: 'manage',
    subject: 'all'
  },
  {
    id: uuidv4(),
    role_id: userRoleId,
    action: 'read',
    subject: 'User'
  },
  {
    id: uuidv4(),
    role_id: userRoleId,
    action: 'manage',
    subject: 'User',
    conditions: { id: '{{ id }}' }
  },
  {
    id: uuidv4(),
    role_id: courierRoleId,
    action: 'read',
    subject: 'User',
    conditions: { id: '{{ id }}' }
  }
];

export const users = [
  {
    id: uuidv4(),
    first_name: 'Lasta',
    last_name: 'Admin',
    role_id: adminRoleId,
    email: 'adminLasta@yopmail.com',
    username: 'AdminLasta',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: uuidv4(),
    first_name: 'Dono',
    last_name: 'User',
    role_id: userRoleId,
    email: 'userDono@yopmail.com',
    username: 'UserDono',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: uuidv4(),
    first_name: 'Sam',
    last_name: 'Kurir',
    role_id: courierRoleId,
    email: 'samKurir@yopmail.com',
    username: 'SamKurir',
    password: bcrypt.hashSync('password123', 10),
  },
];

async function main() {
  for await (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      create: role,
      update: role,
    });
  }

  for await (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      create: permission,
      update: permission,
    });
  }

  for await (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      create: user,
      update: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
  });
