import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function seedRooms(owners: {
  owner1: { id: bigint };
  owner2: { id: bigint };
}) {
  console.log('Seeding Rooms');

  const room1 = await prisma.room.create({
    data: {
      name: 'Deluxe Ocean View Suite',
      description: 'Spacious suite with stunning ocean views',
      pricePerNight: 250,
      ownerId: owners.owner1.id,
      location: 'Beachfront',
      maxGuests: 4,
    },
  });

  const room2 = await prisma.room.create({
    data: {
      name: 'Cozy Mountain Cabin',
      description: 'Intimate cabin nestled in the mountains',
      pricePerNight: 150,
      ownerId: owners.owner1.id,
      location: 'Mountain',
      maxGuests: 3,
    },
  });

  const room3 = await prisma.room.create({
    data: {
      name: 'Modern City Apartment',
      description: 'Contemporary apartment in the heart of the city',
      pricePerNight: 180,
      ownerId: owners.owner2.id,
      location: 'City Center',
      maxGuests: 2,
    },
  });

  const room4 = await prisma.room.create({
    data: {
      name: 'Luxury Penthouse',
      description: 'Premium penthouse with panoramic views',
      pricePerNight: 350,
      ownerId: owners.owner2.id,
      location: 'Skyline',
      maxGuests: 6,
    },
  });

  return { room1, room2, room3, room4 };
}
