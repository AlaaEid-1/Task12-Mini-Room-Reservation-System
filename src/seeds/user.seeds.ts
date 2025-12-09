import { PrismaClient, UserRole } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('Seeding Users');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: '$2a$10$Z5Zc.7Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: {
      email: 'owner1@example.com',
      password: '$2a$10$Z5Zc.7Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z',
      name: 'John Owner',
      role: UserRole.OWNER,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: {
      email: 'owner2@example.com',
      password: '$2a$10$Z5Zc.7Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z',
      name: 'Jane Owner',
      role: UserRole.OWNER,
    },
  });

  const guest1 = await prisma.user.upsert({
    where: { email: 'guest1@example.com' },
    update: {},
    create: {
      email: 'guest1@example.com',
      password: '$2a$10$Z5Zc.7Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z',
      name: 'Alice Guest',
      role: UserRole.GUEST,
    },
  });

  const guest2 = await prisma.user.upsert({
    where: { email: 'guest2@example.com' },
    update: {},
    create: {
      email: 'guest2@example.com',
      password: '$2a$10$Z5Zc.7Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z',
      name: 'Bob Guest',
      role: UserRole.GUEST,
    },
  });

  return { adminUser, owner1, owner2, guest1, guest2 };
}
